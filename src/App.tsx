import React, { useMemo } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { FilterBar } from './components/FilterBar';
import { GameCard } from './components/GameCard';
import { GameDetailModal } from './components/GameDetailModal';
import { UserLibraryView } from './components/UserLibraryView';
import { NotificationModal } from './components/NotificationModal';
import { UserMenuModal } from './components/UserMenuModal';
import { Footer } from './components/Footer';
import { SearchX, Sparkles, Flame } from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    games, 
    filters, 
    setFilters,
    activeGame, 
    setActiveGame, 
    isLibraryOpen, 
    setIsLibraryOpen,
    isNotificationsOpen, 
    setIsNotificationsOpen,
    isUserMenuOpen, 
    setIsUserMenuOpen 
  } = useGame();

  // Filter & sort games
  const filteredGames = useMemo(() => {
    return games
      .filter(game => {
        // Search filter
        if (filters.search) {
          const q = filters.search.toLowerCase();
          const matchTitle = game.title.toLowerCase().includes(q);
          const matchGenre = game.genres.some(g => g.toLowerCase().includes(q));
          const matchRepacker = game.repackInfo.repacker.toLowerCase().includes(q);
          const matchTags = game.tags.some(t => t.toLowerCase().includes(q));
          if (!matchTitle && !matchGenre && !matchRepacker && !matchTags) return false;
        }

        // Category filter
        if (filters.category !== 'Todos') {
          if (filters.category === 'FitGirl' && !game.repackInfo.repacker.toLowerCase().includes('fitgirl') && !game.id.startsWith('fg-')) return false;
          if (filters.category === 'DODI' && !game.repackInfo.repacker.toLowerCase().includes('dodi') && !game.id.startsWith('dodi-')) return false;
          if (filters.category === 'Lançamentos' && !game.categories.includes('Lançamentos') && game.releaseYear < 2024) return false;
          if (filters.category === 'Mais Populares' && !game.isTrending && game.rating < 4.8) return false;
          if (filters.category === 'AAA' && !game.categories.includes('AAA')) return false;
          if (filters.category === 'Repacks Leves' && parseFloat(game.repackInfo.repackSize) > 20) return false;
          if (filters.category === 'Indiezinhos' && !game.categories.includes('Indiezinhos') && !game.genres.includes('Indie')) return false;
        }

        // Genre filter
        if (filters.genre !== 'Todos') {
          if (!game.genres.some(g => g.toLowerCase() === filters.genre.toLowerCase())) return false;
        }

        // Only PT-BR Dubbed / Subtitled filter
        if (filters.onlyPtBr) {
          const isPtBr = game.hasPtBrAudio || game.hasPtBrSubs || game.languages?.some(l => l.toLowerCase().includes('português'));
          if (!isPtBr) return false;
        }

        // Format filter (Torrent PC vs PKG Console)
        if (filters.formatFilter && filters.formatFilter !== 'all') {
          if (filters.formatFilter === 'pkg' && !game.hasPkgFormat && !game.downloadLinks.some(l => l.type === 'pkg' || l.format === 'pkg')) return false;
          if (filters.formatFilter === 'torrent' && !game.hasPcTorrent && !game.downloadLinks.some(l => l.type === 'torrent' || l.type === 'magnet')) return false;
        }

        // Repacker / Source Tracker filter
        if (filters.repacker !== 'Todos') {
          const matchRepacker = game.repackInfo.repacker.toLowerCase().includes(filters.repacker.toLowerCase());
          const matchOrigin = game.sourceOrigin?.toLowerCase().includes(filters.repacker.toLowerCase());
          const matchTags = game.tags.some(t => t.toLowerCase().includes(filters.repacker.toLowerCase()));
          if (!matchRepacker && !matchOrigin && !matchTags) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'latest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'popular':
            return b.viewsCount - a.viewsCount;
          case 'rating':
            return b.rating - a.rating;
          case 'downloads':
            return b.downloadsCount - a.downloadsCount;
          case 'sizeAsc':
            return parseFloat(a.repackInfo.repackSize) - parseFloat(b.repackInfo.repackSize);
          case 'sizeDesc':
            return parseFloat(b.repackInfo.repackSize) - parseFloat(a.repackInfo.repackSize);
          default:
            return 0;
        }
      });
  }, [games, filters]);

  const isBrowsingAll = !filters.search && filters.genre === 'Todos' && filters.category === 'Todos';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Header - Tradicional & Sempre Visível */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {activeGame ? (
          <GameDetailModal game={activeGame} onClose={() => setActiveGame(null)} />
        ) : isLibraryOpen ? (
          <UserLibraryView onClose={() => setIsLibraryOpen(false)} />
        ) : isUserMenuOpen ? (
          <UserMenuModal onClose={() => setIsUserMenuOpen(false)} />
        ) : (
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            {/* Hero Spotlight (Shown when no specific search is active) */}
            {isBrowsingAll && <HeroBanner />}

            {/* Advanced Filter Bar */}
            <FilterBar />

            {/* Section Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2">
                  {filters.search ? (
                    <span>Resultados para "{filters.search}"</span>
                  ) : filters.category !== 'Todos' ? (
                    <span>{filters.category}</span>
                  ) : filters.genre !== 'Todos' ? (
                    <span>Jogos de {filters.genre}</span>
                  ) : (
                    <>
                      <Flame className="w-5 h-5 text-cyan-400" />
                      <span>Catálogo de Torrents</span>
                    </>
                  )}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                  {filteredGames.length} jogos
                </span>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
                <span>Torrent P2P com Seeds Testados</span>
              </div>
            </div>

            {/* Games Grid */}
            {filteredGames.length === 0 ? (
              <div className="p-16 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4 my-8">
                <SearchX className="w-16 h-16 text-slate-600 mx-auto" />
                <h3 className="text-lg font-bold text-white">Nenhum jogo encontrado com esses filtros</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Tente pesquisar por outro título, escolher outro gênero ou limpar os filtros de busca para navegar em todos os jogos disponíveis.
                </p>
                <button
                  onClick={() => {
                    setActiveGame(null);
                    setIsLibraryOpen(false);
                    setIsUserMenuOpen(false);
                    setFilters(prev => ({ ...prev, search: '', genre: 'Todos', category: 'Todos', repacker: 'Todos', sortBy: 'popular' }));
                  }}
                  className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Limpar Filtros e Ver Catálogo Completo</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6 pb-12">
                {filteredGames.map(game => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Notifications Drawer/Modal */}
      {isNotificationsOpen && (
        <NotificationModal onClose={() => setIsNotificationsOpen(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <MainContent />
    </GameProvider>
  );
}
