import { GoogleGenAI } from '@google/genai';
import { TollCalculationResult, VehicleClass } from '../types';
import { TOLL_DATABASE, generateDatabaseResponse } from '../data/tollDatabase';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Simple keyword matching for local database
const findInDatabase = (origin: string, dest: string) => {
  const o = origin.toLowerCase();
  const d = dest.toLowerCase();

  // Only use database if the input looks like a generic city name
  // If input contains "jalan", "gedung", "no", it's likely an address -> skip DB to use AI Logic
  const isSpecificAddress = (text: string) =>
    text.includes('jalan') ||
    text.includes('jl') ||
    text.includes('no.') ||
    text.includes('gedung');

  if (isSpecificAddress(o) || isSpecificAddress(d)) {
    return null; // Force AI for specific addresses
  }

  return TOLL_DATABASE.find((route) => {
    const originMatch = route.originKeywords.some((k) => o.includes(k));
    const destMatch = route.destKeywords.some((k) => d.includes(k));
    return originMatch && destMatch;
  });
};

export const calculateTollRoute = async (
  origin: string,
  destination: string,
  vehicleClass: VehicleClass
): Promise<TollCalculationResult> => {
  // 1. Check Local Database First (Only for generic city-to-city)
  const dbResult = findInDatabase(origin, destination);
  if (dbResult) {
    console.log('Found in local database:', dbResult.id);
    return {
      text: generateDatabaseResponse(dbResult, vehicleClass),
      sources: [],
      sourceType: 'database',
    };
  }

  // 2. Fallback to Gemini AI for addresses and specific routing
  try {
    const prompt = `
      Bertindaklah sebagai asisten navigasi GPS pintar.
      Pengguna ingin melakukan perjalanan dari: "${origin}" ke "${destination}" menggunakan ${vehicleClass}.

      TUGAS UTAMA:
      1. Tentukan **Gerbang Tol Masuk (Entry Gate)** terdekat dari lokasi "${origin}".
      2. Tentukan **Gerbang Tol Keluar (Exit Gate)** terdekat menuju lokasi "${destination}".
      3. Hitung total tarif tol antara kedua gerbang tersebut (Data Terbaru 2024/2025).

      FORMAT RESPON (MARKDOWN):
      
      ### 📍 Rute Tol Rekomendasi
      *   **Masuk**: [Nama Gerbang Tol Masuk]
      *   **Keluar**: [Nama Gerbang Tol Keluar]
      *   **Total Tarif**: Rp [Angka]

      ### 📋 Rincian Tarif
      | Ruas Tol | Tarif |
      | :--- | :--- |
      | [Nama Ruas] | [Harga] |
      | ... | ... |
      
      ### ⏱️ Estimasi Perjalanan
      *   **Jarak Total**: [km]
      *   **Waktu Tempuh**: [jam/menit]
      *   **Info**: [Saran singkat, misal: "Waspada macet di area X"]

      INSTRUKSI:
      - Jawab SINGKAT dan PADAT.
      - Jika lokasi bukan di dekat tol, informasikan rute non-tol utama.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text =
      response.text ||
      'Maaf, rute spesifik tidak ditemukan atau data tol tidak tersedia.';

    // Extract grounding sources
    const sources: any[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title,
            uri: chunk.web.uri,
          });
        }
      });
    }

    const uniqueSources = sources.filter(
      (v, i, a) => a.findIndex((t) => t.uri === v.uri) === i
    );

    return {
      text,
      sources: uniqueSources,
      sourceType: 'ai',
    };
  } catch (error) {
    console.error('Error calculating toll:', error);
    throw new Error('Gagal menganalisis rute. Pastikan nama lokasi jelas.');
  }
};
