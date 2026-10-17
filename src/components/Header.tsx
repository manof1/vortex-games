import React, { useState, useEffect, useRef } from 'react';
import { 
  Gamepad2, 
  Search, 
  Sun, 
  Moon, 
  User, 
  Layers, 
  Clock, 
  Trash2, 
  Sparkles, 
  MessageSquarePlus, 
  Flame, 
  X,
  Trophy,
  ChevronDown
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';

export const TOP_OPTIONS = [
  {
    key: 'top_rating' as const,
    label: 'Mais Bem Avaliados (Geral)',
    icon: '⭐',
    description: 'Maior nota e pontuação agregada da comunidade'
  },
  {
    key: 'top_critic' as const,
    label: 'Melhores Notas da Crítica (Metascore)',
    icon: '🎖️',
    description: 'Maiores notas da imprensa no Metacritic & OpenCritic'
  },
  {
    key: 'top_user' as const,
    label: 'Melhores Notas dos Usuários',
    icon: '👥',
    description: 'User Score do Metacritic e notas GameFAQs'
  },
  {
    key: 'top_views' as const,
    label: 'Os Mais Acessados',
    icon: '🔥',
    description: 'Recordistas em acessos e buscas'
  },
  {
    key: 'top_downloads' as const,
    label: 'Os Mais Baixados',
    icon: '📥',
    description: 'Campeões absolutos de downloads e torrents'
  }
];

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
    setActiveGame,
    setIsLibraryOpen, 
    setIsUserMenuOpen,
    userProfile,
    isLoggedIn,
    setIsAuthModalOpen,
    setIsGameRequestOpen,
    openCreatorLab,
    theme, 
    toggleTheme 
  } = useGame();
  const { t } = useLanguage();

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

  const [isTopMenuOpen, setIsTopMenuOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const topDropdownRef = useRef<HTMLDivElement>(null);

  // Sync recent searches to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vortex_recent_searches', JSON.stringify(recentSearches));
    } catch {
      // ignore
    }
  }, [recentSearches]);

  // Close search dropdown and TOP menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
      if (topDropdownRef.current && !topDropdownRef.current.contains(e.target as Node)) {
        setIsTopMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectTop = (sortKey: typeof TOP_OPTIONS[number]['key']) => {
    setActiveGame(null);
    setIsLibraryOpen(false);
    setIsUserMenuOpen(false);
    setIsTopMenuOpen(false);
    setFilters(prev => ({
      ...prev,
      sortBy: sortKey,
      search: '',
      category: 'Todos'
    }));
    const el = document.getElementById('catalogo-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
                  placeholder={t('header.searchPlaceholder', 'Buscar por título, gênero (ex: RPG, Terror) ou repacker...')}
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
                        {t('header.searchHistory', 'Buscas Recentes')}
                      </span>
                      <button
                        type="button"
                        onClick={handleClearRecentSearches}
                        className="text-[10px] text-rose-500 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        {t('header.clearHistory', 'Limpar histórico')}
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
                    {t('header.popularSearches', 'Mais Buscados')}
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
            
            {/* BOTÃO TOP (RANKING DOS MELHORES JOGOS) */}
            <div ref={topDropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setIsTopMenuOpen(prev => !prev)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm ${
                  filters.sortBy.startsWith('top_')
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-amber-500/30 ring-2 ring-amber-400 font-extrabold'
                    : 'bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 hover:from-amber-500/25 hover:to-yellow-500/25 text-amber-500 dark:text-amber-400 border border-amber-500/30 hover:border-amber-500/50'
                }`}
                title="TOP Rankings: Mais Bem Avaliados, Melhores Notas da Crítica, Melhores Notas dos Usuários, Mais Acessados e Mais Baixados"
              >
                <Trophy className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span className="tracking-wide">TOP</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isTopMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown com as 5 Categorias TOP solicitadas pelo usuário */}
              {isTopMenuOpen && (
                <div className="absolute right-0 sm:left-0 sm:right-auto top-full mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2.5 z-50 animate-fadeIn">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-500 fill-amber-400" />
                      <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                        TOP Rankings Vortex
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Explore os recordistas e melhores jogos do acervo:
                    </p>
                  </div>

                  <div className="space-y-1">
                    {TOP_OPTIONS.map(opt => {
                      const isActive = filters.sortBy === opt.key;
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => handleSelectTop(opt.key)}
                          className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-all cursor-pointer ${
                            isActive
                              ? 'bg-amber-500/20 border border-amber-500/40 text-amber-600 dark:text-amber-300 font-bold'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span className="text-lg shrink-0 w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            {opt.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-slate-900 dark:text-white">
                                {opt.label}
                              </span>
                              {isActive && (
                                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-500 text-slate-950">
                                  ATIVO
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                              {opt.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

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
              <span>{t('header.catalog', 'Catálogo')}</span>
            </button>

            {/* SEÇÃO PEDIR UM JOGO */}
            <button
              onClick={() => setIsGameRequestOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-white bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800/50 transition-all cursor-pointer"
              title="Pedir um jogo que ainda não está no site"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden sm:inline">{t('header.requestGame', 'Pedir Jogo')}</span>
            </button>

            {/* Dados do Cadastrado OU Botão Entrar/Cadastrar */}
            {isLoggedIn ? (
              <button
                onClick={() => {
                  setActiveGame(null);
                  setIsLibraryOpen(false);
                  setIsUserMenuOpen(true);
                }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-800/80 text-slate-900 dark:text-slate-100 transition-all group cursor-pointer shadow-sm"
                title="Menu do Usuário: Perfil, Minha Biblioteca e Configurações"
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
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer transform hover:scale-[1.02]"
                title="Cadastre-se ou Entre para liberar downloads em alta velocidade"
              >
                <User className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{t('header.signIn', 'Entrar / Cadastrar')}</span>
              </button>
            )}

            {/* Alternador de Tema (Claro & Escuro) */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-yellow-400 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
              title={theme === 'dark' ? t('header.lightMode', 'Ativar Modo Claro') : t('header.darkMode', 'Ativar Modo Escuro')}
            >
              {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            </button>

            {/* Bolinha Discreta no canto do cabeçalho: Ambiente de Testes PKG do Criador (manof1@gmail.com) */}
            <button
              type="button"
              onClick={openCreatorLab}
              className="group relative p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all cursor-pointer flex items-center justify-center"
              title="Ambiente de Testes PKG • TheZukoStore + GameFAQs (Criador)"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500/80 group-hover:bg-cyan-400 group-hover:scale-125 transition-all shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
              <span className="sr-only">Ambiente de Testes PKG</span>
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
                placeholder={t('header.searchPlaceholder', 'Buscar jogos, gêneros ou repacker...')}
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
