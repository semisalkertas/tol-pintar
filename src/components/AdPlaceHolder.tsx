import React from 'react';

interface AdPlaceholderProps {
  format: 'horizontal' | 'rectangle' | 'vertical';
  className?: string;
  slotName?: string; // Untuk identifikasi slot iklan nanti
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ format, className = '', slotName = 'Iklan' }) => {
  // Ukuran standar IAB (Interactive Advertising Bureau)
  const sizes = {
    horizontal: 'h-[90px] w-full max-w-[728px]', // Leaderboard 728x90 / Mobile Banner 320x50
    rectangle: 'h-[250px] w-full max-w-[300px]', // Medium Rectangle 300x250
    vertical: 'h-[600px] w-full max-w-[160px]', // Wide Skyscraper 160x600
  };

  return (
    <div className={`flex flex-col items-center justify-center my-4 mx-auto ${className}`}>
      <span className="text-[10px] text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-1">Iklan</span>
      <div 
        className={`${sizes[format]} bg-slate-100 dark:bg-gmaps-surface border-2 border-dashed border-slate-300 dark:border-gray-700 rounded-lg flex items-center justify-center relative overflow-hidden group hover:border-brand-300 dark:hover:border-gray-500 transition-colors`}
      >
        {/* Placeholder Content - GANTI BAGIAN INI DENGAN SCRIPT ADSENSE ANDA */}
        <div className="text-center p-4">
          <p className="text-slate-400 dark:text-gray-500 text-xs font-medium group-hover:text-brand-500 dark:group-hover:text-gray-300 transition-colors">
            Space Iklan {format === 'horizontal' ? 'Leaderboard' : format === 'rectangle' ? 'Medium Rectangle' : 'Skyscraper'}
          </p>
          <p className="text-slate-300 dark:text-gray-600 text-[10px] mt-1">
            (Tempatkan kode iklan di sini)
          </p>
        </div>
      </div>
    </div>
  );
};