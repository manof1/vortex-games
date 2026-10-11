import React, { useState, useEffect, useRef } from 'react';
import { 
  Gamepad2, 
  Search, 
  Bookmark, 
  Sun, 
  Moon, 
  User, 
  Layers, 
  Clock, 
  Trash2, 
  Sparkles, 
  MessageSquarePlus, 
  Flame, 
  X 
} from 'lucide-react';
import { useGame } from '../context/GameContext';

const POPULAR_SEARCHES = [
  'Resident Evil 4',
  'God of War',
  'Cyberpunk 2077',
  'GTA V',
  'FitGirl Repack',
  'Dublado PT-BR'
];

export const Header: React.FC = () => {
  const { 
    filters, 
    setFilters, 
    library, 
    setActiveGame,
    setIsLibraryOpen, 
    setIsUserMenuOpen,
    userProfile,
    isLoggedIn,
    setIsAuthModalOpen,
    setIsGameRequestOpen,
    theme, 
    toggleTheme 
  } = useGame();

  const [localSearch, setLocalSearch] = useState(filters.search);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vortex_recent_searches');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return ['Resident Evil', 'God of War', 'Cyberpunk', 'Silent Hill'];
  });

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Sync recent searches to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vortex_recent_searches', JSON.stringify(recentSearches));
    } catch {
      // ignore
    }
  }, [recentSearches]);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addSearchToHistory = (term: string) => {
    const clean = term.trim();
    if (!clean) return;
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== clean.toLowerCase());
      return [clean, ...filtered].slice(0, 8);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveGame(null);
    setIsLibraryOpen(false);
    setIsUserMenuOpen(false);
    setIsSearchFocused(false);
    if (localSearch.trim()) {
      addSearchToHistory(localSearch);
    }
    setFilters(prev => ({ ...prev, search: localSearch }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearch(val);
    setActiveGame(null);
    setIsLibraryOpen(false);
    setIsUserMenuOpen(false);
    setFilters(prev => ({ ...prev, search: val }));
  };

  const handleSelectRecentSearch = (term: string) => {
    setLocalSearch(term);
    addSearchToHistory(term);
    setActiveGame(null);
    setIsLibraryOpen(false);
    setIsUserMenuOpen(false);
    setIsSearchFocused(false);
    setFilters(prev => ({ ...prev, search: term }));
  };

  const handleDeleteRecentItem = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    setRecentSearches(prev => prev.filter(s => s !== term));
  };

  const handleClearRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/95 dark:bg-slate-950/85 border-b border-slate-200 dark:border-slate-800/80 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3 sm:gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => {
                setActiveGame(null);
                setIsLibraryOpen(false);
                setIsUserMenuOpen(false);
                setFilters(prev => ({ ...prev, search: '', genre: 'Todos', category: 'Todos', yearRange: 'all' }));
              }}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Gamepad2 className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 font-display">
                  VORTEX<span className="text-slate-900 dark:text-white">GAMES</span>
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-cyan-600 dark:text-cyan-400/80">
                  Torrents • Repacks • IGDB
                </span>
              </div>
            </div>
          </div>

          {/* Search bar with Recent Search History Dropdown */}
          <div ref={searchContainerRef} className="flex-1 max-w-xl mx-2 hidden md:block relative">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  value={localSearch}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={handleSearchChange}
                  placeholder="Buscar por título, gênero (ex: RPG, Terror) ou repacker..."
                  className="w-full pl-11 pr-10 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                {localSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setLocalSearch('');
                      setFilters(prev => ({ ...prev, search: '' }));
                    }}
                    className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>
            </form>

            {/* Dropdown de Histórico de Busca Recente */}
            {isSearchFocused && (
              <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-3 z-50 animate-fadeIn">
                {recentSearches.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between px-2 py-1 mb-1.5">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-cyan-500" />
                        Buscas Recentes
                      </span>
                      <button
                        type="button"
                        onClick={handleClearRecentSearches}
                        className="text-[10px] text-rose-500 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        Limpar histórico
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {recentSearches.map(term => (
                        <div
                          key={term}
                          onClick={() => handleSelectRecentSearch(term)}
                          className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500/15 hover:text-cyan-600 dark:hover:text-cyan-400 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all cursor-pointer border border-transparent hover:border-cyan-500/30"
                        >
                          <span>{term}</span>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteRecentItem(e, term)}
                            className="text-slate-400 hover:text-rose-500 ml-0.5 p-0.5"
                            title="Remover do histórico"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular searches suggestions */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block px-2 mb-1.5 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    Mais Buscados
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_SEARCHES.map(pop => (
                      <button
                        key={pop}
                        type="button"
                        onClick={() => handleSelectRecentSearch(pop)}
                        className="px-2.5 py-1 rounded-lg text-xs bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer border border-slate-200/60 dark:border-slate-800/60"
                      >
                        {pop}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* BOTÃO CATÁLOGO (MANTIDO E RESTAURADO) */}
            <button
              onClick={() => {
                setActiveGame(null);
                setIsLibraryOpen(false);
                setIsUserMenuOpen(false);
                setFilters(prev => ({ 
                  ...prev, 
                  search: '', 
                  category: 'Todos',
                  genre: 'Todos',
                  yearRange: 'all'
                }));
                const el = document.getElementById('catalogo-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
              title="Acessar todo o Catálogo Completo de Jogos"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-500" />
              <span>Catálogo</span>
            </button>

            {/* SEÇÃO PEDIR UM JOGO */}
            <button
              onClick={() => setIsGameRequestOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-white bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800/50 transition-all cursor-pointer"
              title="Pedir um jogo que ainda não está no site"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden sm:inline">Pedir Jogo</span>
            </button>

            {/* ÁREA UNIFICADA: BIBLIOTECA + MEMBRO / ENTRAR / CADASTRAR */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-0.5 shadow-sm">
              
              {/* Botão Biblioteca integrado */}
              <button
                onClick={() => {
                  setActiveGame(null);
                  setIsUserMenuOpen(false);
                  setIsLibraryOpen(true);
                }}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-slate-700 dark:text-slate-200 hover:text-cyan-500 dark:hover:text-cyan-400 transition-all group cursor-pointer"
                title="Minha Biblioteca de Favoritos e Downloads"
              >
                <Bookmark className="w-4 h-4 text-cyan-500 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold hidden md:inline">Biblioteca</span>
                <span className="px-1.5 py-0.2 rounded-md bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 text-[11px] font-bold border border-cyan-300 dark:border-cyan-800/50">
                  {library.length}
                </span>
              </button>

              <div className="w-[1px] h-5 bg-slate-300 dark:bg-slate-800 mx-0.5" />

              {/* Dados do Cadastrado OU Botão Entrar/Cadastrar */}
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    setActiveGame(null);
                    setIsLibraryOpen(false);
                    setIsUserMenuOpen(true);
                  }}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-200/80 dark:hover:bg-slate-800/80 text-slate-900 dark:text-slate-100 transition-all group cursor-pointer"
                  title="Menu do Usuário: Perfil, Nuvem e Configurações"
                >
                  <div className="relative">
                    <img 
                      src={userProfile.avatar} 
                      alt={userProfile.name} 
                      className="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-400 object-cover group-hover:scale-105 transition-transform" 
                    />
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border border-white dark:border-slate-950" />
                  </div>
                  <div className="flex flex-col text-left hidden sm:flex">
                    <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-400 transition-colors leading-tight">
                      {userProfile.name.split(' ')[0]}
                    </span>
                    <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold leading-tight flex items-center gap-0.5">
                      <span>✓</span> VIP
                    </span>
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer transform hover:scale-[1.02]"
                  title="Cadastre-se ou Entre para liberar downloads em alta velocidade"
                >
                  <User className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Entrar / Cadastrar</span>
                </button>
              )}

            </div>

            {/* Alternador de Tema (Claro & Escuro) */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-yellow-400 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
              title={theme === 'dark' ? 'Ativar Modo Claro (Visual Limpo e Iluminado)' : 'Ativar Modo Escuro (Visual Cyber & Sci-Fi)'}
            >
              {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            </button>
          </div>

        </div>

        {/* Mobile Search with Recent history */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <input
                type="text"
                value={localSearch}
                onChange={handleSearchChange}
                placeholder="Buscar jogos, gêneros ou repacker..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            </div>
          </form>
        </div>

      </div>
    </header>
  );
};
