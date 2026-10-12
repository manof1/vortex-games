import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageCode } from '../i18n/translations';

interface LanguageSelectorProps {
  compact?: boolean;
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ compact = false, className = '' }) => {
  const { language, setLanguage, supportedLanguages, currentLanguageOption } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={`flex items-center gap-1.5 rounded-xl transition-all cursor-pointer border ${
          compact
            ? 'px-2.5 py-1.5 text-xs bg-slate-100 dark:bg-slate-950/60 border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-cyan-500'
            : 'px-3 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-cyan-500 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
        }`}
        title={`Idioma: ${currentLanguageOption.label}`}
      >
        <Globe className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
        <span className="text-sm leading-none">{currentLanguageOption.flag}</span>
        <span className="font-semibold hidden sm:inline whitespace-nowrap">
          {compact ? currentLanguageOption.code.toUpperCase() : currentLanguageOption.label}
        </span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Floating Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 z-50 animate-fadeIn divide-y divide-slate-100 dark:divide-slate-800/60">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-cyan-500" />
            <span>Selecionar Idioma / Language</span>
          </div>

          <div className="pt-1 space-y-0.5 max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
            {supportedLanguages.map(opt => {
              const isSelected = opt.code === language;
              return (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => handleSelect(opt.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-bold border border-cyan-500/30'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-base leading-none">{opt.flag}</span>
                    <div className="flex flex-col truncate">
                      <span className="truncate leading-tight">{opt.label}</span>
                      <span className="text-[10px] text-slate-400 leading-tight">{opt.nameEn}</span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-cyan-500 shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
