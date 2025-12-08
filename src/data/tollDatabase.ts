import { VehicleClass } from "../types";

interface TollRouteDB {
  id: string;
  originKeywords: string[];
  destKeywords: string[];
  displayName: string;
  distance: string;
  duration: string;
  segments: {
    name: string;
    rates: Record<VehicleClass, number>;
  }[];
}

// Helper to format currency
const fmt = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

// Database of popular routes (Sample data for Trans Java & Jabodetabek)
export const TOLL_DATABASE: TollRouteDB[] = [
  {
    id: "jkt-bdg",
    originKeywords: ["jakarta", "jkt", "halim", "cawang"],
    destKeywords: ["bandung", "bdg", "pasteur", "cileunyi"],
    displayName: "Jakarta → Bandung",
    distance: "± 150 km",
    duration: "± 2 - 3 jam",
    segments: [
      { name: "Tol Jakarta-Cikampek", rates: { [VehicleClass.I]: 27000, [VehicleClass.II]: 40500, [VehicleClass.III]: 40500, [VehicleClass.IV]: 54000, [VehicleClass.V]: 54000 } },
      { name: "Tol Cipularang (SS Dawuan - SS Padalarang)", rates: { [VehicleClass.I]: 45000, [VehicleClass.II]: 76500, [VehicleClass.III]: 76500, [VehicleClass.IV]: 103500, [VehicleClass.V]: 103500 } },
      { name: "Tol Padaleunyi (Padalarang - Cileunyi)", rates: { [VehicleClass.I]: 10500, [VehicleClass.II]: 18500, [VehicleClass.III]: 18500, [VehicleClass.IV]: 25000, [VehicleClass.V]: 25000 } },
    ]
  },
  {
    id: "jkt-sby",
    originKeywords: ["jakarta", "jkt"],
    destKeywords: ["surabaya", "sby", "waru"],
    displayName: "Jakarta → Surabaya (Trans Jawa)",
    distance: "± 782 km",
    duration: "± 9 - 10 jam",
    segments: [
      { name: "Jakarta - Cikampek", rates: { [VehicleClass.I]: 27000, [VehicleClass.II]: 40500, [VehicleClass.III]: 40500, [VehicleClass.IV]: 54000, [VehicleClass.V]: 54000 } },
      { name: "Cikopo - Palimanan", rates: { [VehicleClass.I]: 119000, [VehicleClass.II]: 196000, [VehicleClass.III]: 196000, [VehicleClass.IV]: 246000, [VehicleClass.V]: 246000 } },
      { name: "Palimanan - Kanci", rates: { [VehicleClass.I]: 13500, [VehicleClass.II]: 20000, [VehicleClass.III]: 20000, [VehicleClass.IV]: 27000, [VehicleClass.V]: 27000 } },
      { name: "Kanci - Pejagan", rates: { [VehicleClass.I]: 31500, [VehicleClass.II]: 47500, [VehicleClass.III]: 47500, [VehicleClass.IV]: 63500, [VehicleClass.V]: 63500 } },
      { name: "Pejagan - Pemalang", rates: { [VehicleClass.I]: 66000, [VehicleClass.II]: 99000, [VehicleClass.III]: 99000, [VehicleClass.IV]: 132000, [VehicleClass.V]: 132000 } },
      { name: "Pemalang - Batang", rates: { [VehicleClass.I]: 53000, [VehicleClass.II]: 79500, [VehicleClass.III]: 79500, [VehicleClass.IV]: 106000, [VehicleClass.V]: 106000 } },
      { name: "Batang - Semarang", rates: { [VehicleClass.I]: 111500, [VehicleClass.II]: 167500, [VehicleClass.III]: 167500, [VehicleClass.IV]: 223000, [VehicleClass.V]: 223000 } },
      { name: "Semarang ABC", rates: { [VehicleClass.I]: 5500, [VehicleClass.II]: 8500, [VehicleClass.III]: 8500, [VehicleClass.IV]: 11000, [VehicleClass.V]: 11000 } },
      { name: "Semarang - Solo", rates: { [VehicleClass.I]: 92000, [VehicleClass.II]: 138500, [VehicleClass.III]: 138500, [VehicleClass.IV]: 184500, [VehicleClass.V]: 184500 } },
      { name: "Solo - Ngawi", rates: { [VehicleClass.I]: 131000, [VehicleClass.II]: 196000, [VehicleClass.III]: 196000, [VehicleClass.IV]: 261500, [VehicleClass.V]: 261500 } },
      { name: "Ngawi - Kertosono", rates: { [VehicleClass.I]: 98000, [VehicleClass.II]: 147000, [VehicleClass.III]: 147000, [VehicleClass.IV]: 196000, [VehicleClass.V]: 196000 } },
      { name: "Kertosono - Mojokerto", rates: { [VehicleClass.I]: 54000, [VehicleClass.II]: 90000, [VehicleClass.III]: 90000, [VehicleClass.IV]: 113500, [VehicleClass.V]: 113500 } },
      { name: "Mojokerto - Surabaya", rates: { [VehicleClass.I]: 31500, [VehicleClass.II]: 52000, [VehicleClass.III]: 52000, [VehicleClass.IV]: 69000, [VehicleClass.V]: 69000 } },
    ]
  },
  {
    id: "jkt-ciawi",
    originKeywords: ["jakarta", "jkt", "cawang"],
    destKeywords: ["bogor", "ciawi", "puncak"],
    displayName: "Jakarta (Jagorawi) → Ciawi/Bogor",
    distance: "± 59 km",
    duration: "± 1 jam",
    segments: [
      { name: "Tol Jagorawi", rates: { [VehicleClass.I]: 7500, [VehicleClass.II]: 12000, [VehicleClass.III]: 12000, [VehicleClass.IV]: 17000, [VehicleClass.V]: 17000 } },
    ]
  },
  {
    id: "sby-mlg",
    originKeywords: ["surabaya", "sby", "waru"],
    destKeywords: ["malang", "mlg", "singosari"],
    displayName: "Surabaya → Malang",
    distance: "± 80 km",
    duration: "± 1 - 1.5 jam",
    segments: [
      { name: "Surabaya - Gempol", rates: { [VehicleClass.I]: 6000, [VehicleClass.II]: 9000, [VehicleClass.III]: 9000, [VehicleClass.IV]: 12000, [VehicleClass.V]: 12000 } },
      { name: "Gempol - Pandaan", rates: { [VehicleClass.I]: 13000, [VehicleClass.II]: 21500, [VehicleClass.III]: 21500, [VehicleClass.IV]: 27000, [VehicleClass.V]: 27000 } },
      { name: "Pandaan - Malang", rates: { [VehicleClass.I]: 35500, [VehicleClass.II]: 53500, [VehicleClass.III]: 53500, [VehicleClass.IV]: 71000, [VehicleClass.V]: 71000 } },
    ]
  },
  {
    id: "smg-solo",
    originKeywords: ["semarang", "smg"],
    destKeywords: ["solo", "surakarta"],
    displayName: "Semarang → Solo",
    distance: "± 72 km",
    duration: "± 1 jam",
    segments: [
      { name: "Tol Semarang - Solo", rates: { [VehicleClass.I]: 92000, [VehicleClass.II]: 138500, [VehicleClass.III]: 138500, [VehicleClass.IV]: 184500, [VehicleClass.V]: 184500 } },
    ]
  }
];

export const generateDatabaseResponse = (route: TollRouteDB, vehicleClass: VehicleClass): string => {
  let totalCost = 0;
  let tableRows = "";

  route.segments.forEach(seg => {
    const cost = seg.rates[vehicleClass] || 0;
    totalCost += cost;
    tableRows += `| ${seg.name} | ${fmt(cost)} |\n`;
  });

  return `
**Total Estimasi: ${fmt(totalCost)}**

| Ruas Tol | Tarif (${vehicleClass.split(' ')[0]} ${vehicleClass.split(' ')[1]}) |
| :--- | :--- |
${tableRows}

*   **Jarak**: ${route.distance}
*   **Waktu**: ${route.duration}
*   **Catatan**: Pastikan saldo E-Toll mencukupi. Data dari Database Internal.
`;
};
