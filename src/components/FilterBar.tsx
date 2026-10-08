import React from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Tag } from 'lucide-react';
import { useGame } from '../context/GameContext';

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

const CATEGORIES = [
  { id: 'Todos', label: 'Todos os Jogos' },
  { id: 'FitGirl', label: '🤖 FitGirl Auto-Sync' },
  { id: 'Lançamentos', label: '🔥 Lançamentos' },
  { id: 'Mais Populares', label: '⭐ Mais Populares' },
  { id: 'AAA', label: '💎 Superproduções (AAA)' },
  { id: 'Repacks Leves', label: '⚡ Repacks Leves' },
  { id: 'Indiezinhos', label: '🎮 Indie Clássicos' }
];

export const FilterBar: React.FC = () => {
  const { filters, setFilters } = useGame();

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
    filters.search !== '';

  const clearFilters = () => {
    setFilters(prev => ({
      ...prev,
      genre: 'Todos',
      category: 'Todos',
      repacker: 'Todos',
      search: '',
      sortBy: 'latest'
    }));
  };

  return (
    <div className="w-full space-y-4 mb-8 bg-slate-900/50 p-4 sm:p-5 rounded-2xl border border-slate-800/80">
      
      {/* Category Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-800/60">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none w-full sm:w-auto">
          {CATEGORIES.map(cat => {
            const isActive = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
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
            className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition-colors ml-auto py-1 font-medium"
          >
            <X className="w-3.5 h-3.5" />
            <span>Limpar Filtros</span>
          </button>
        )}
      </div>

      {/* Genre Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="flex items-center gap-1 text-xs font-bold text-slate-400 whitespace-nowrap mr-1">
          <Tag className="w-3.5 h-3.5 text-cyan-400" />
          Gêneros:
        </span>
        {GENRES.map(g => {
          const isSelected = filters.genre === g;
          return (
            <button
              key={g}
              onClick={() => handleGenreClick(g)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                  : 'bg-slate-800/40 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {g}
            </button>
          );
        })}
      </div>

      {/* Dropdown controls for sorting & repacker */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
        
        <div className="flex items-center gap-3 flex-wrap">
          {/* PT-BR Quick Filter Button */}
          <button
            onClick={() => setFilters(prev => ({ ...prev, onlyPtBr: !prev.onlyPtBr }))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filters.onlyPtBr
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25 ring-1 ring-emerald-400'
                : 'bg-slate-950/60 text-slate-300 border border-slate-800 hover:border-emerald-500/50'
            }`}
          >
            <span>🇧🇷</span>
            <span>Dublado / PT-BR</span>
          </button>

          {/* Format selector (Torrent vs PKG) */}
          <div className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 font-medium">Formato:</span>
            <select
              value={filters.formatFilter || 'all'}
              onChange={e => setFilters(prev => ({ ...prev, formatFilter: e.target.value as any }))}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-white">Todos os Formatos</option>
              <option value="torrent" className="bg-slate-900 text-white">💻 Torrent PC (.torrent)</option>
              <option value="pkg" className="bg-slate-900 text-white">🎮 Arquivo PKG (PlayStation)</option>
            </select>
          </div>

          {/* Repacker selector */}
          <div className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400 font-medium">Origem / Grupo:</span>
            <select
              value={filters.repacker}
              onChange={handleRepackerChange}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="Todos" className="bg-slate-900 text-white">Todos os Grupos</option>
              <option value="FitGirl Repack" className="bg-slate-900 text-white">FitGirl Repack</option>
              <option value="TheZukoStore" className="bg-slate-900 text-white">TheZukoStore (PKG/PS)</option>
              <option value="Tapochek" className="bg-slate-900 text-white">Tapochek.net Tracker</option>
              <option value="DODI Repack" className="bg-slate-900 text-white">DODI Repack</option>
              <option value="ElAmigos" className="bg-slate-900 text-white">ElAmigos</option>
            </select>
          </div>
        </div>

        {/* Sort order */}
        <div className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
          <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400 font-medium">Ordenar por:</span>
          <select
            value={filters.sortBy}
            onChange={handleSortChange}
            className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="latest" className="bg-slate-900 text-white">Mais Recentes</option>
            <option value="popular" className="bg-slate-900 text-white">Mais Vistos</option>
            <option value="rating" className="bg-slate-900 text-white">Melhor Avaliados (Notas)</option>
            <option value="downloads" className="bg-slate-900 text-white">Mais Baixados</option>
            <option value="sizeAsc" className="bg-slate-900 text-white">Menor Tamanho (Leves)</option>
            <option value="sizeDesc" className="bg-slate-900 text-white">Maior Tamanho</option>
          </select>
        </div>

      </div>

    </div>
  );
};
