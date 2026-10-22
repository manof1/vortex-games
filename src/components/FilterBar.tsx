import React from 'react';
import { SlidersHorizontal, ArrowUpDown, X, Tag, Globe } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';

const GENRES = [
  'Todos',
  'Ação',
  'RPG',
  'Mundo Aberto',
  'Terror',
  'FPS',
  'Aventura',
  'Estratégia',
  'Corrida',
  'Metroidvania',
  'Soulslike'
];

export const FilterBar: React.FC = () => {
  const { filters, setFilters } = useGame();
  const { t, language, setLanguage, supportedLanguages } = useLanguage();

  const CATEGORIES = [
    { id: 'Todos', label: t('filter.allGames', 'Todos os Jogos') },
    { id: 'FitGirl', label: `🌸 ${t('filter.fitgirl', 'FitGirl Repacks')}` },
    { id: 'DODI', label: `⚡ ${t('filter.dodi', 'DODI Repacks')}` },
    { id: 'Lançamentos', label: `🔥 ${t('filter.launches', 'Lançamentos')}` },
    { id: 'Mais Populares', label: `⭐ ${t('filter.popular', 'Mais Populares')}` },
    { id: 'AAA', label: `💎 ${t('filter.aaa', 'Superproduções (AAA)')}` },
    { id: 'Repacks Leves', label: `⚡ ${t('filter.lightweight', 'Repacks Leves')}` }
  ];

  const handleCategoryClick = (catId: string) => {
    setFilters(prev => ({ ...prev, category: catId }));
  };

  const handleGenreClick = (genre: string) => {
    setFilters(prev => ({ ...prev, genre }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, sortBy: e.target.value as any }));
  };

  const handleRepackerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, repacker: e.target.value }));
  };

  const hasActiveFilters = 
    filters.genre !== 'Todos' || 
    filters.category !== 'Todos' || 
    filters.repacker !== 'Todos' || 
    filters.search !== '' ||
    filters.onlyPtBr ||
    (filters.formatFilter && filters.formatFilter !== 'all');

  const clearFilters = () => {
    setFilters(prev => ({
      ...prev,
      genre: 'Todos',
      category: 'Todos',
      repacker: 'Todos',
      search: '',
      yearRange: 'all',
      onlyPtBr: false,
      sortBy: 'latest'
    }));
  };

  const PLATFORMS = [
    { id: 'all' as const, label: 'Todas as Plataformas', icon: '🌐' },
    { id: 'pc' as const, label: 'PC Windows (Torrents)', icon: '🖥️' },
    { id: 'playstation' as const, label: 'PlayStation (PS4, PS3, PS2, PS1)', icon: '🎮' },
    { id: 'nintendo' as const, label: 'Nintendo (Switch, N64, GBA)', icon: '🕹️' },
    { id: 'retro' as const, label: 'Retrô & Clássicos', icon: '👾' },
  ];

  return (
    <div className="w-full space-y-4 mb-8 bg-white dark:bg-slate-900/50 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm transition-colors">
      
      {/* 1. SELETOR DE PLATAFORMAS (PC VS CONSOLES) */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none pb-2.5 border-b border-slate-200 dark:border-slate-800/80">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mr-1 shrink-0">
          Plataforma:
        </span>
        {PLATFORMS.map(p => {
          const isSelected = (filters.platform || 'all') === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setFilters(prev => ({ ...prev, platform: p.id }))}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25 ring-1 ring-purple-400'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <span>{p.icon}</span>
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-200 dark:border-slate-800/60">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none w-full sm:w-auto">
          {CATEGORIES.map(cat => {
            const isActive = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Clear filter indicator if active */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 transition-colors ml-auto py-1 font-bold cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>{t('filter.clearFilters', 'Limpar Filtros')}</span>
          </button>
        )}
      </div>

      {/* Genre Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap mr-1">
          <Tag className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
          {t('filter.genres', 'Gêneros:')}
        </span>
        {GENRES.map(g => {
          const isSelected = filters.genre === g;
          return (
            <button
              key={g}
              onClick={() => handleGenreClick(g)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                  : 'bg-slate-100 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {g}
            </button>
          );
        })}
      </div>

      {/* Dropdown controls for sorting & filters & language */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
        
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* PT-BR Quick Filter Button */}
          <button
            onClick={() => setFilters(prev => ({ ...prev, onlyPtBr: !prev.onlyPtBr }))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filters.onlyPtBr
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25 ring-1 ring-emerald-400'
                : 'bg-slate-100 dark:bg-slate-950/60 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-800 hover:border-emerald-500'
            }`}
          >
            <span>🇧🇷</span>
            <span>{t('filter.ptbrOnly', 'PT-BR (Dublado & Legendado)')}</span>
          </button>

          {/* Format selector (Torrent vs PKG) */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 font-medium">{t('filter.format', 'Formato:')}</span>
            <select
              value={filters.formatFilter || 'all'}
              onChange={e => setFilters(prev => ({ ...prev, formatFilter: e.target.value as any }))}
              className="bg-transparent text-slate-800 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{t('filter.allFormats', 'Todos os Formatos')}</option>
              <option value="torrent" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">💻 {t('filter.torrentPc', 'Torrent PC (.torrent / magnet)')}</option>
              <option value="pkg" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">🎮 {t('filter.pkgConsole', 'Arquivo PKG (PlayStation)')}</option>
              <option value="iso_rom" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">🕹️ Arquivos ISO / ROM (RomsPure / DLPS)</option>
            </select>
          </div>

          {/* Seletor de Idioma para o Sistema (Escolha no próprio idioma nativo) */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-800">
            <Globe className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              {t('header.language', 'Idioma')}:
            </span>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value as any)}
              className="bg-transparent text-slate-800 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              {supportedLanguages.map(opt => (
                <option 
                  key={opt.code} 
                  value={opt.code} 
                  className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  {opt.flag} {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Repacker selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-800">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
            <span className="text-slate-500 dark:text-slate-400 font-medium">{t('filter.sourceGroup', 'Origem / Grupo:')}</span>
            <select
              value={filters.repacker}
              onChange={handleRepackerChange}
              className="bg-transparent text-slate-800 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="Todos" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{t('filter.allGroups', 'Todos os Grupos')}</option>
              <option value="FitGirl Repack" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">FitGirl Repack</option>
              <option value="TheZukoStore" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">TheZukoStore (PKG/PS)</option>
              <option value="Tapochek" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Tapochek.net Tracker</option>
              <option value="DODI Repack" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">DODI Repack</option>
              <option value="ElAmigos" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">ElAmigos</option>
            </select>
          </div>
        </div>

        {/* Right cluster: Sort order */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-800">
            <ArrowUpDown className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
            <span className="text-slate-500 dark:text-slate-400 font-medium">{t('filter.sortBy', 'Ordenar por:')}</span>
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              className="bg-transparent text-slate-800 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="latest" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{t('filter.sortLatest', 'Mais Recentes')}</option>
              <option value="popular" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{t('filter.sortPopular', 'Mais Vistos')}</option>
              <option value="top_rating" className="bg-white dark:bg-slate-900 text-amber-500 dark:text-amber-400 font-bold">⭐ TOP: Mais Bem Avaliados (Geral)</option>
              <option value="top_critic" className="bg-white dark:bg-slate-900 text-amber-500 dark:text-amber-400 font-bold">🎖️ TOP: Melhores Notas da Crítica (Metascore)</option>
              <option value="top_user" className="bg-white dark:bg-slate-900 text-amber-500 dark:text-amber-400 font-bold">👥 TOP: Melhores Notas dos Usuários</option>
              <option value="top_views" className="bg-white dark:bg-slate-900 text-amber-500 dark:text-amber-400 font-bold">🔥 TOP: Os Mais Acessados</option>
              <option value="top_downloads" className="bg-white dark:bg-slate-900 text-amber-500 dark:text-amber-400 font-bold">📥 TOP: Os Mais Baixados</option>
              <option value="rating" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{t('filter.sortRating', 'Melhor Avaliados (Notas)')}</option>
              <option value="downloads" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{t('filter.sortDownloads', 'Mais Baixados')}</option>
              <option value="sizeAsc" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{t('filter.sortSizeAsc', 'Menor Tamanho (Leves)')}</option>
              <option value="sizeDesc" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{t('filter.sortSizeDesc', 'Maior Tamanho')}</option>
            </select>
          </div>
        </div>

      </div>

    </div>
  );
};
