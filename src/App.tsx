import React, { useMemo, useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { FilterBar } from './components/FilterBar';
import { GameCard } from './components/GameCard';
import { GameDetailModal } from './components/GameDetailModal';
import { UserLibraryView } from './components/UserLibraryView';
import { UserMenuModal } from './components/UserMenuModal';
import { AuthModal } from './components/AuthModal';
import { GameRequestModal } from './components/GameRequestModal';
import { PkgTestLabModal } from './components/PkgTestLabModal';
import { CreatorAuthModal } from './components/CreatorAuthModal';
import { SundaySyncModal } from './components/SundaySyncModal';
import { SidebarBanners } from './components/SidebarBanners';
import { Footer } from './components/Footer';
import { SearchX, Sparkles, Flame, Trophy, X, Star, Medal, Users, Eye, Download, Calendar } from 'lucide-react';
import { TOP_OPTIONS } from './components/Header';

const MainContent: React.FC = () => {
  const { 
    games, 
    filters, 
    setFilters,
    activeGame, 
    setActiveGame, 
    isLibraryOpen, 
    setIsLibraryOpen,
    isUserMenuOpen, 
    setIsUserMenuOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isGameRequestOpen,
    setIsGameRequestOpen,
    isPkgLabOpen,
    setIsPkgLabOpen,
    isCreatorAuthOpen,
    setIsCreatorAuthOpen,
    isSundaySyncOpen,
    setIsSundaySyncOpen,
    openSundaySyncModal
  } = useGame();
  const { t } = useLanguage();

  // Scroll to top whenever a game is opened
  useEffect(() => {
    if (activeGame) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [activeGame]);

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
          if (filters.category === 'Lançamentos' && !game.categories.includes('Lançamentos') && game.releaseYear < 2024 && !game.id.startsWith('fg-') && !game.id.startsWith('dodi-')) return false;
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

        // Platform filter (PC vs PlayStation vs Nintendo vs Retrô)
        if (filters.platform && filters.platform !== 'all') {
          const plat = filters.platform;
          const links = game.downloadLinks || [];
          const gamePlat = (game.platform || '').toLowerCase();
          const categories = (game.categories || []).map(c => c.toLowerCase());
          
          if (plat === 'pc') {
            const hasPc = game.hasPcTorrent || gamePlat.includes('pc') || gamePlat.includes('windows') || links.some(l => l.platform === 'PC' || l.type === 'magnet');
            if (!hasPc) return false;
          } else if (plat === 'playstation') {
            const hasPs = game.hasPkgFormat || gamePlat.includes('ps') || gamePlat.includes('playstation') || categories.some(c => c.includes('playstation') || c.startsWith('ps')) || links.some(l => ['PS1', 'PS2', 'PS3', 'PS4', 'PS5', 'PSP'].includes(l.platform || ''));
            if (!hasPs) return false;
          } else if (plat === 'nintendo') {
            const hasNin = gamePlat.includes('nintendo') || gamePlat.includes('switch') || gamePlat.includes('n64') || gamePlat.includes('gba') || categories.some(c => c.includes('nintendo') || ['switch', 'n64', 'gba'].includes(c)) || links.some(l => ['Switch', 'Nintendo Switch', 'N64', 'GBA'].includes(l.platform || ''));
            if (!hasNin) return false;
          } else if (plat === 'retro') {
            const isRetro = game.releaseYear < 2010 || ['PS1', 'PS2', 'PSP', 'N64', 'GBA', 'SNES'].some(p => gamePlat.includes(p.toLowerCase()));
            if (!isRetro) return false;
          }
        }

        // Format filter (Torrent PC vs PKG Console vs ISO/ROM)
        if (filters.formatFilter && filters.formatFilter !== 'all') {
          const links = game.downloadLinks || [];
          if (filters.formatFilter === 'pkg' && !game.hasPkgFormat && !links.some(l => l.type === 'pkg' || l.format === 'pkg')) return false;
          if (filters.formatFilter === 'torrent' && !game.hasPcTorrent && !links.some(l => l.type === 'torrent' || l.type === 'magnet')) return false;
          if (filters.formatFilter === 'iso_rom' && !links.some(l => ['iso', 'rom', 'bin', 'nsp', 'xci'].includes((l.format || '').toLowerCase()))) return false;
        }

        // Repacker / Source Tracker filter
        if (filters.repacker !== 'Todos') {
          const matchRepacker = game.repackInfo.repacker.toLowerCase().includes(filters.repacker.toLowerCase());
          const matchOrigin = game.sourceOrigin?.toLowerCase().includes(filters.repacker.toLowerCase());
          const matchTags = game.tags.some(t => t.toLowerCase().includes(filters.repacker.toLowerCase()));
          if (!matchRepacker && !matchOrigin && !matchTags) return false;
        }

        // Year Range filter (Faixa de Ano)
        if (filters.yearRange && filters.yearRange !== 'all') {
          if (filters.yearRange === '2024-2026' && (game.releaseYear < 2024 || game.releaseYear > 2026)) return false;
          if (filters.yearRange === '2020-2023' && (game.releaseYear < 2020 || game.releaseYear > 2023)) return false;
          if (filters.yearRange === '2015-2019' && (game.releaseYear < 2015 || game.releaseYear > 2019)) return false;
          if (filters.yearRange === 'retro' && game.releaseYear >= 2015) return false;
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
          case 'top_rating':
            if (b.totalVotes > 0 && a.totalVotes === 0) return 1;
            if (a.totalVotes > 0 && b.totalVotes === 0) return -1;
            if (b.rating !== a.rating) return b.rating - a.rating;
            return (b.totalVotes || 0) - (a.totalVotes || 0);
          case 'top_critic': {
            const bMeta = b.criticScores?.metacritic || b.criticScores?.opencritic || 0;
            const aMeta = a.criticScores?.metacritic || a.criticScores?.opencritic || 0;
            if (bMeta !== aMeta) return bMeta - aMeta;
            return b.rating - a.rating;
          }
          case 'top_user': {
            const bUser = b.criticScores?.metacriticUser ? b.criticScores.metacriticUser * 10 : (b.rating * 20);
            const aUser = a.criticScores?.metacriticUser ? a.criticScores.metacriticUser * 10 : (a.rating * 20);
            if (bUser !== aUser) return bUser - aUser;
            return b.rating - a.rating;
          }
          case 'top_views':
            return (b.viewsCount || 0) - (a.viewsCount || 0);
          case 'downloads':
          case 'top_downloads':
            return (b.downloadsCount || 0) - (a.downloadsCount || 0);
          case 'sizeAsc':
            return parseFloat(a.repackInfo.repackSize) - parseFloat(b.repackInfo.repackSize);
          case 'sizeDesc':
            return parseFloat(b.repackInfo.repackSize) - parseFloat(a.repackInfo.repackSize);
          default:
            return 0;
        }
      });
  }, [games, filters]);

  const showHero = !filters.search && (filters.category === 'Todos' || filters.category === 'Lançamentos');

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 transition-colors duration-200">
      {/* Header - Tradicional & Sempre Visível */}
      <Header />

      {/* Banners Laterais Discretos Adsterra (160x600 - Sem Pop-up) */}
      <SidebarBanners />

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
            {/* Hero Spotlight (Shown on Homepage & Lançamentos) */}
            {showHero && <HeroBanner />}

            {/* Anchor for smooth scrolling */}
            <div id="catalogo-section" className="scroll-mt-24" />

            {/* Advanced Filter Bar */}
            <FilterBar />

            {/* TOP Rankings Spotlight Banner (Quando qualquer modo TOP estiver ativado) */}
            {filters.sortBy.startsWith('top_') && (() => {
              const activeTop = TOP_OPTIONS.find(o => o.key === filters.sortBy) || TOP_OPTIONS[0];
              return (
                <div className="mb-6 p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-yellow-500/10 border-2 border-amber-500/40 shadow-xl shadow-amber-500/10 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/30">
                        <Trophy className="w-6 h-6 fill-slate-950 stroke-[2.5]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                            RANKING OFICIAL
                          </span>
                          <span className="text-xs text-amber-400 font-bold">
                            {filteredGames.length} Jogos Ranqueados
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-2xl font-black text-white font-display flex items-center gap-2 mt-0.5">
                          <span>{activeTop.icon}</span>
                          <span>{activeTop.label}</span>
                        </h3>
                        <p className="text-xs text-slate-300">
                          {activeTop.description}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setFilters(prev => ({ ...prev, sortBy: 'latest' }))}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-700"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Voltar à Ordem Padrão</span>
                    </button>
                  </div>

                  {/* Quick Switcher Tabs para alternar entre os 5 TOPs com 1 clique */}
                  <div className="pt-2 border-t border-amber-500/20 flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider shrink-0 mr-1">
                      Alternar Critério:
                    </span>
                    {TOP_OPTIONS.map(opt => {
                      const isCur = filters.sortBy === opt.key;
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => setFilters(prev => ({ ...prev, sortBy: opt.key }))}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                            isCur
                              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 ring-1 ring-amber-300'
                              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                          }`}
                        >
                          <span>{opt.icon}</span>
                          <span>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Section Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-300 dark:border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display flex items-center gap-2">
                  {filters.sortBy.startsWith('top_') ? (
                    <>
                      <Trophy className="w-6 h-6 text-amber-500 fill-amber-400" />
                      <span>TOP Rankings: {TOP_OPTIONS.find(o => o.key === filters.sortBy)?.label}</span>
                    </>
                  ) : filters.search ? (
                    <span>{t('catalog.resultsFor', 'Resultados para')} "{filters.search}"</span>
                  ) : filters.category !== 'Todos' ? (
                    <span>{filters.category}</span>
                  ) : filters.genre !== 'Todos' ? (
                    <span>Jogos de {filters.genre}</span>
                  ) : (
                    <>
                      <Flame className="w-5 h-5 text-cyan-500" />
                      <span>{t('catalog.title', 'Catálogo de Torrents')}</span>
                    </>
                  )}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-800/40">
                  {filteredGames.length} {t('catalog.games', 'jogos')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openSundaySyncModal}
                  className="px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500/15 via-yellow-400/15 to-amber-500/15 hover:from-amber-500/25 hover:to-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-500/40 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer hover:scale-105 active:scale-95"
                  title="Atualização Semanal Automática de Cheats & Mods (Todo Domingo). Clique para gerenciar ou forçar agora!"
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden sm:inline">Domingo Sync:</span>
                  <span>Cheats & Mods</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </button>

                <div className="hidden lg:flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <span>{t('catalog.p2pVerified', 'Torrent P2P com Seeds Testados')}</span>
                </div>
              </div>
            </div>

            {/* Games Grid */}
            {filteredGames.length === 0 ? (
              <div className="p-16 text-center rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 my-8">
                <SearchX className="w-16 h-16 text-slate-400 dark:text-slate-600 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('catalog.noGamesFound', 'Nenhum jogo encontrado com esses filtros')}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  {t('catalog.noGamesDesc', 'Tente pesquisar por outro título, escolher outro gênero ou limpar os filtros de busca para navegar em todos os jogos disponíveis.')}
                </p>
                <button
                  onClick={() => {
                    setActiveGame(null);
                    setIsLibraryOpen(false);
                    setIsUserMenuOpen(false);
                    setFilters(prev => ({ ...prev, search: '', genre: 'Todos', category: 'Todos', repacker: 'Todos', sortBy: 'popular' }));
                  }}
                  className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all cursor-pointer shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{t('catalog.resetFilters', 'Limpar Filtros e Ver Catálogo Completo')}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6 pb-12">
                {filteredGames.map((game, index) => (
                  <GameCard 
                    key={game.id} 
                    game={game} 
                    rank={filters.sortBy.startsWith('top_') ? index + 1 : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Member Auth Modal (Login / Register) */}
      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}

      {/* Pedir um Jogo Modal (Comunidade) */}
      <GameRequestModal 
        isOpen={isGameRequestOpen} 
        onClose={() => setIsGameRequestOpen(false)} 
      />

      {/* Laboratório de Testes PKG Exclusivo para o Criador (manof1@gmail.com) */}
      <PkgTestLabModal
        isOpen={isPkgLabOpen}
        onClose={() => setIsPkgLabOpen(false)}
      />

      {/* Modal de Confirmação de Acesso do Criador */}
      <CreatorAuthModal
        isOpen={isCreatorAuthOpen}
        onClose={() => setIsCreatorAuthOpen(false)}
        onSuccess={() => {
          setIsCreatorAuthOpen(false);
          setIsPkgLabOpen(true);
        }}
      />

      {/* Modal da Programação Semanal de Domingo (Cheats & Mods) */}
      <SundaySyncModal
        isOpen={isSundaySyncOpen}
        onClose={() => setIsSundaySyncOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <GameProvider>
        <MainContent />
      </GameProvider>
    </LanguageProvider>
  );
}
