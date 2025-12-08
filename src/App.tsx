import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Truck,
  Navigation,
  Search,
  ExternalLink,
  Loader2,
  Database,
  Zap,
  ArrowUpDown,
  Map,
  Moon,
  Sun,
  Monitor,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { calculateTollRoute } from './services/geminiService';
import { TollCalculationResult, VehicleClass } from './types';
import { InputGroup } from './components/InputGroup';
import { SelectGroup } from './components/SelectGroup';
import { AdPlaceholder } from './components/AdPlaceholder';

const App: React.FC = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [vehicleClass, setVehicleClass] = useState<VehicleClass>(
    VehicleClass.I
  );

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TollCalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Theme State: 'system' is default (auto)
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  // Theme Logic
  useEffect(() => {
    const root = window.document.documentElement;
    const darkMedia = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      const isSystemDark = darkMedia.matches;
      const isDark = theme === 'dark' || (theme === 'system' && isSystemDark);

      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();

    // Listen for system changes if mode is 'system'
    darkMedia.addEventListener('change', applyTheme);
    return () => darkMedia.removeEventListener('change', applyTheme);
  }, [theme]);

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination) {
      setError('Mohon isi lokasi asal dan tujuan.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await calculateTollRoute(origin, destination, vehicleClass);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menghitung tarif.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gmaps-bg text-slate-800 dark:text-gmaps-text transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gmaps-surface shadow-sm sticky top-0 z-20 border-b border-slate-200 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-brand-500 to-brand-700 p-2.5 rounded-xl shadow-lg shadow-brand-500/20">
              <Map className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-none tracking-tight">
                TolPintar
              </h1>
              <p className="text-xs text-slate-500 dark:text-gray-400 font-medium mt-0.5">
                Asisten Perjalanan Cerdas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={() =>
                setTheme((prev) =>
                  prev === 'system'
                    ? 'light'
                    : prev === 'light'
                    ? 'dark'
                    : 'system'
                )
              }
              className="p-2 rounded-full bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600 transition-all"
              title={`Mode: ${
                theme === 'system'
                  ? 'Otomatis'
                  : theme === 'dark'
                  ? 'Gelap'
                  : 'Terang'
              }`}
            >
              {theme === 'system' ? (
                <Monitor className="w-4 h-4" />
              ) : theme === 'dark' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </button>

            <div className="hidden sm:block">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 border border-brand-100 dark:border-brand-800">
                <Zap className="w-3 h-3 mr-1 fill-brand-700 dark:fill-brand-300" />
                AI Powered
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* SLOT IKLAN 1 */}
        <AdPlaceholder
          format="horizontal"
          className="mb-8"
          slotName="Top Banner"
        />

        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2 transition-colors">
            Rencanakan Perjalanan Anda
          </h2>
          <p className="text-slate-600 dark:text-gray-400 transition-colors">
            Masukkan <b>Alamat Lengkap</b> atau <b>Nama Kota</b>.{' '}
            <br className="hidden sm:block" />
            Sistem kami akan mencarikan gerbang tol paling efisien.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Form Section */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white dark:bg-gmaps-surface rounded-xl shadow-md border border-slate-100 dark:border-gray-800 p-6 transition-colors duration-300">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative flex flex-col gap-5">
                  <InputGroup
                    id="origin"
                    label="Dari Mana?"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="Contoh: Rumah Saya, Kemang"
                    icon={<MapPin className="w-5 h-5" />}
                  />

                  <button
                    type="button"
                    onClick={handleSwap}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-full shadow-sm text-slate-500 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-400 hover:bg-slate-50 transition-all"
                    title="Tukar Lokasi Asal & Tujuan"
                  >
                    <ArrowUpDown className="w-4 h-4" />
                  </button>

                  <InputGroup
                    id="destination"
                    label="Mau Ke Mana?"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Contoh: Gedung Sate, Bandung"
                    icon={<Navigation className="w-5 h-5" />}
                  />
                </div>

                <SelectGroup
                  label="Golongan Kendaraan"
                  value={vehicleClass}
                  onChange={(e) =>
                    setVehicleClass(e.target.value as VehicleClass)
                  }
                  icon={<Truck className="w-5 h-5" />}
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-lg shadow-lg shadow-brand-500/30 text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all disabled:opacity-70 transform hover:-translate-y-0.5 dark:shadow-none"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Menganalisis Rute...
                    </>
                  ) : (
                    <>
                      <Search className="-ml-1 mr-2 h-4 w-4" />
                      Cek Tarif Sekarang
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* SLOT IKLAN 2 */}
            <AdPlaceholder format="rectangle" slotName="Sidebar Ad" />
          </div>

          {/* Results Section */}
          <div className="md:col-span-7 space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg mb-4">
                <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                  {error}
                </p>
              </div>
            )}

            {!isLoading && !result && !error && (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-slate-400 dark:text-gray-600 bg-white dark:bg-gmaps-surface rounded-xl border-2 border-dashed border-slate-200 dark:border-gray-700 p-6 text-center transition-colors">
                <div className="bg-slate-50 dark:bg-gray-800 p-4 rounded-full mb-4">
                  <Database className="w-8 h-8 opacity-40 text-slate-500 dark:text-gray-400" />
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-gray-400">
                  Hasil pencarian rute & tarif
                  <br />
                  akan muncul di sini.
                </p>
                <p className="text-xs text-slate-400 dark:text-gray-600 mt-2 max-w-[200px]">
                  Tips: Gunakan nama tempat spesifik untuk hasil lebih akurat.
                </p>
              </div>
            )}

            {result && (
              <>
                <div className="bg-white dark:bg-gmaps-surface rounded-xl shadow-lg border border-slate-100 dark:border-gray-800 overflow-hidden animate-fade-in-up transition-colors">
                  {/* Result Header */}
                  <div
                    className={`${
                      result.sourceType === 'database'
                        ? 'bg-emerald-600 dark:bg-emerald-700'
                        : 'bg-brand-600 dark:bg-brand-700'
                    } px-6 py-4 flex justify-between items-center transition-colors`}
                  >
                    <div className="flex items-center text-white">
                      {result.sourceType === 'database' ? (
                        <>
                          <Database className="w-5 h-5 mr-2" />
                          <span className="font-bold tracking-wide">
                            DATA INSTAN
                          </span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5 mr-2" />
                          <span className="font-bold tracking-wide">
                            ANALISIS AI LIVE
                          </span>
                        </>
                      )}
                    </div>
                    <span className="text-white/90 text-[10px] uppercase font-bold bg-black/20 px-2 py-1 rounded tracking-wider">
                      {result.sourceType === 'database'
                        ? 'OFFLINE DB'
                        : 'GOOGLE SEARCH'}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="prose prose-sm prose-slate dark:prose-invert prose-headings:font-bold prose-headings:text-slate-800 dark:prose-headings:text-gray-100 prose-p:text-slate-600 dark:prose-p:text-gray-300 prose-table:text-xs sm:prose-table:text-sm prose-th:bg-slate-50 dark:prose-th:bg-gray-800 prose-th:text-slate-700 dark:prose-th:text-gray-300 prose-td:border-slate-100 dark:prose-td:border-gray-700 max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {result.text}
                      </ReactMarkdown>
                    </div>

                    {result.sources.length > 0 && (
                      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-gray-700">
                        <h4 className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                          Referensi
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {result.sources.map((source, index) => (
                            <a
                              key={index}
                              href={source.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 rounded-full bg-slate-50 dark:bg-gray-800 hover:bg-brand-50 dark:hover:bg-gray-700 text-slate-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 text-[10px] border border-slate-200 dark:border-gray-700 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              <span className="truncate max-w-[150px]">
                                {source.title}
                              </span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* SLOT IKLAN 3 */}
                <AdPlaceholder
                  format="horizontal"
                  slotName="Bottom Result Ad"
                />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
