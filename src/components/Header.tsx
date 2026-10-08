import React, { useState } from 'react';
import { 
  Gamepad2, 
  Search, 
  Bookmark, 
  Bell, 
  ShieldAlert, 
  Sun, 
  Moon, 
  Database,
  Sparkles,
  Layers,
  User,
  Star
} from 'lucide-react';
import { useGame } from '../context/GameContext';

export const Header: React.FC = () => {
  const { 
    filters, 
    setFilters, 
    library, 
    notifications, 
    setIsLibraryOpen, 
    setIsAdminOpen, 
    setIsNotificationsOpen,
    setIsSupabaseGuideOpen,
    isUserMenuOpen,
    setIsUserMenuOpen,
    userProfile,
    theme, 
    toggleTheme 
  } = useGame();

  const [localSearch, setLocalSearch] = useState(filters.search);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: localSearch }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearch(val);
    setFilters(prev => ({ ...prev, search: val }));
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => {
                setFilters(prev => ({ ...prev, search: '', genre: 'Todos', category: 'Todos' }));
                setIsLibraryOpen(false);
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
                <span className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 font-display">
                  VORTEX<span className="text-white">GAMES</span>
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-cyan-400/80">
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
                className="w-full pl-11 pr-10 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalSearch('');
                    setFilters(prev => ({ ...prev, search: '' }));
                  }}
                  className="absolute right-3 top-3 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </form>

          {/* Action buttons - Traditional Clean Site Navigation */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Links Navigation */}
            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, search: '', genre: 'Todos', category: 'Todos' }));
                setIsLibraryOpen(false);
              }}
              className="hidden lg:flex items-center px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-all"
            >
              Catálogo
            </button>

            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, category: 'Lançamentos' }));
                setIsLibraryOpen(false);
              }}
              className="hidden lg:flex items-center px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-all"
            >
              Lançamentos
            </button>

            {/* Notification Center */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(true)}
                className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-slate-700 transition-all"
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
              onClick={() => setIsLibraryOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-cyan-500/50 transition-all group"
              title="Minha Biblioteca de Jogos"
            >
              <Bookmark className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold hidden sm:inline">Biblioteca</span>
              <span className="px-1.5 py-0.2 rounded-md bg-cyan-950 text-cyan-400 text-[11px] font-bold border border-cyan-800/50">
                {library.length}
              </span>
            </button>

            {/* Menu de Acesso do Usuário (Baixar, Avaliar, Perfil e Interagir) */}
            <button
              onClick={() => setIsUserMenuOpen(true)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-cyan-400 hover:bg-slate-800/80 text-slate-100 transition-all group shadow-sm cursor-pointer"
              title="Menu do Usuário: Baixar, Avaliar Jogos e Perfil"
            >
              <div className="relative">
                <img 
                  src={userProfile.avatar} 
                  alt={userProfile.name} 
                  className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-400 object-cover group-hover:scale-105 transition-transform" 
                />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border border-slate-950" />
              </div>
              <div className="flex flex-col text-left hidden sm:flex">
                <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors leading-tight">
                  {userProfile.name.split(' ')[0]}
                </span>
                <span className="text-[9px] text-cyan-400 font-semibold leading-tight">
                  Conta & Jogos
                </span>
              </div>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-yellow-400 hover:border-slate-700 transition-all"
              title={theme === 'dark' ? 'Ativar Modo Claro' : 'Ativar Modo Escuro'}
            >
              {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
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
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            </div>
          </form>
        </div>

      </div>
    </header>
  );
};
