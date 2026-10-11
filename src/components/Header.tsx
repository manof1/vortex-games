import React, { useState } from 'react';
import { 
  Gamepad2, 
  Search, 
  Bookmark, 
  Bell, 
  Sun, 
  Moon, 
  User,
  Unlock,
  Flame
} from 'lucide-react';
import { useGame } from '../context/GameContext';

export const Header: React.FC = () => {
  const { 
    filters, 
    setFilters, 
    library, 
    notifications, 
    setActiveGame,
    setIsLibraryOpen, 
    setIsNotificationsOpen,
    isUserMenuOpen,
    setIsUserMenuOpen,
    userProfile,
    isLoggedIn,
    setIsAuthModalOpen,
    theme, 
    toggleTheme 
  } = useGame();

  const [localSearch, setLocalSearch] = useState(filters.search);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveGame(null);
    setIsLibraryOpen(false);
    setIsUserMenuOpen(false);
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

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/95 dark:bg-slate-950/85 border-b border-slate-200 dark:border-slate-800/80 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => {
                setActiveGame(null);
                setIsLibraryOpen(false);
                setIsUserMenuOpen(false);
                setFilters(prev => ({ ...prev, search: '', genre: 'Todos', category: 'Todos' }));
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

          {/* Search bar */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="flex-1 max-w-xl mx-2 hidden md:block"
          >
            <div className="relative">
              <input
                type="text"
                value={localSearch}
                onChange={handleSearchChange}
                placeholder="Buscar por título, gênero (ex: RPG, Terror, Ação) ou repacker..."
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

          {/* Action buttons - Traditional Clean Site Navigation */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Lançamentos Button */}
            <button
              onClick={() => {
                setActiveGame(null);
                setIsLibraryOpen(false);
                setIsUserMenuOpen(false);
                setFilters(prev => ({ 
                  ...prev, 
                  search: '', 
                  category: 'Lançamentos',
                  sortBy: 'latest' 
                }));
                const el = document.getElementById('catalogo-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-white bg-cyan-50 dark:bg-cyan-950/40 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 border border-cyan-200 dark:border-cyan-800/50 transition-all cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 text-cyan-500" />
              <span>Lançamentos</span>
            </button>

            {/* Notification Center */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(true)}
                className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-cyan-500 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
                title="Notificações e Novos Jogos"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[18px] text-[10px] font-bold text-black bg-cyan-400 rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* Minha Biblioteca */}
            <button
              onClick={() => {
                setActiveGame(null);
                setIsUserMenuOpen(false);
                setIsLibraryOpen(true);
              }}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:border-cyan-500/50 transition-all group cursor-pointer"
              title="Minha Biblioteca de Jogos"
            >
              <Bookmark className="w-4 h-4 text-cyan-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold hidden sm:inline">Biblioteca</span>
              <span className="px-1.5 py-0.2 rounded-md bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 text-[11px] font-bold border border-cyan-300 dark:border-cyan-800/50">
                {library.length}
              </span>
            </button>

            {/* Member Access / Profile Button */}
            {isLoggedIn ? (
              <button
                onClick={() => {
                  setActiveGame(null);
                  setIsLibraryOpen(false);
                  setIsUserMenuOpen(true);
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 hover:border-cyan-500 hover:bg-slate-200/80 dark:hover:bg-slate-800/80 text-slate-900 dark:text-slate-100 transition-all group shadow-sm cursor-pointer"
                title="Menu do Usuário: Perfil e Status de Membro"
              >
                <div className="relative">
                  <img 
                    src={userProfile.avatar} 
                    alt={userProfile.name} 
                    className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-400 object-cover group-hover:scale-105 transition-transform" 
                  />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border border-white dark:border-slate-950" />
                </div>
                <div className="flex flex-col text-left hidden sm:flex">
                  <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors leading-tight">
                    {userProfile.name.split(' ')[0]}
                  </span>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold leading-tight flex items-center gap-0.5">
                    <span>✓</span> Membro VIP
                  </span>
                </div>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer transform hover:scale-[1.02]"
                title="Cadastre-se ou Faça Login para liberar os downloads de todos os jogos"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Entrar / Cadastrar</span>
              </button>
            )}

            {/* Theme Toggle Button (Light & Dark) */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-yellow-400 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
              title={theme === 'dark' ? 'Ativar Modo Claro (Visual Limpo e Iluminado)' : 'Ativar Modo Escuro (Visual Cyber & Sci-Fi)'}
            >
              {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
            </button>
          </div>

        </div>

        {/* Mobile Search */}
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
