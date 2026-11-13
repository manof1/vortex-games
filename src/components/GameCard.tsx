import React from 'react';
import { 
  Star, 
  HardDrive, 
  Bookmark, 
  Check, 
  Sparkles,
  Trophy,
  Medal,
  ArrowRight,
  Eye,
  Download,
  Users
} from 'lucide-react';
import { Game } from '../types';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import {
  getCriticScores,
  getCombinedUserScore,
  getOverallRatingScore,
  getMetacriticBadgeColor,
  getOpenCriticTierColor
} from '../utils/ratingUtils';
import { getGameCover, handleImageError } from '../utils/imageUtils';

interface GameCardProps {
  game: Game;
  rank?: number;
}

export const GameCard: React.FC<GameCardProps> = ({ game, rank }) => {
  const { 
    filters,
    setActiveGame, 
    isInLibrary, 
    addToLibrary, 
    removeFromLibrary
  } = useGame();
  const { t } = useLanguage();
  
  const critic = getCriticScores(game);
  const combinedUserScore = getCombinedUserScore(game);
  const overallScore = getOverallRatingScore(game);
  const metaBadge = getMetacriticBadgeColor(critic.metacritic);
  const openBadge = getOpenCriticTierColor(critic.opencriticTier);
  
  const libraryStatus = isInLibrary(game.id);

  const handleLibraryToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (libraryStatus) {
      removeFromLibrary(game.id);
    } else {
      addToLibrary(game.id, 'wishlist');
    }
  };


  // Badge color based on repacker
  const getRepackerColor = (repacker: string) => {
    if (repacker.includes('FitGirl')) return 'bg-pink-500/20 text-pink-700 dark:text-pink-300 border-pink-500/30';
    if (repacker.includes('DODI')) return 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
    if (repacker.includes('Brother')) return 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30';
    if (repacker.includes('ElAmigos')) return 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30';
    return 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/30';
  };

  return (
    <div
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey) {
          window.open(`/game/${game.slug}`, '_blank');
          return;
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        setActiveGame(game);
      }}
      data-href={`/game/${game.slug}`}
      className="group relative flex flex-col rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 hover:border-cyan-500/50 hover:shadow-xl dark:hover:shadow-cyan-950/30 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950">
        <img
          src={getGameCover(game)}
          alt={game.title}
          referrerPolicy="no-referrer"
          onError={(e) => handleImageError(e, game)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient shadows */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges overlay */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* TOP Ranking Rank Badge (ex: #1, #2, #3, ...) */}
            {rank !== undefined && (
              <span className="flex items-center gap-1 shadow-xl">
                {rank === 1 ? (
                  <span className="flex items-center gap-1 text-[10px] font-black text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 px-2 py-0.5 rounded-md shadow-lg shadow-amber-500/40 border border-yellow-200 animate-pulse">
                    <Trophy className="w-3 h-3 fill-slate-950 stroke-[2.5]" />
                    <span>#1 TOP</span>
                  </span>
                ) : rank === 2 ? (
                  <span className="flex items-center gap-1 text-[10px] font-black text-slate-950 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-300 px-1.5 py-0.5 rounded-md shadow-md border border-white">
                    <Medal className="w-3 h-3 fill-slate-950" />
                    <span>#2 TOP</span>
                  </span>
                ) : rank === 3 ? (
                  <span className="flex items-center gap-1 text-[10px] font-black text-amber-100 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 px-1.5 py-0.5 rounded-md shadow-md border border-amber-500/50">
                    <Medal className="w-3 h-3 fill-amber-300 text-amber-300" />
                    <span>#3 TOP</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-0.5 text-[10px] font-mono font-black text-amber-400 bg-slate-950/90 px-1.5 py-0.5 rounded-md border border-amber-500/40">
                    <span>#</span>
                    <span>{rank}</span>
                  </span>
                )}
              </span>
            )}

            {/* Repacker badge */}
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border backdrop-blur-md shadow-sm ${getRepackerColor(game.repackInfo.repacker)}`}>
              {game.repackInfo.repacker.replace(' Repack', '')}
            </span>

            {/* Port Nativo PC Badge */}
            {(game.genres?.some(g => g.toLowerCase().includes('port')) ||
              game.categories?.some(c => c.toLowerCase().includes('brothergame')) ||
              game.tags?.some(tag => tag.toLowerCase().includes('port nativo')) ||
              game.title.toLowerCase().includes('port nativo') ||
              game.title.toLowerCase().includes('port pc') ||
              game.id.startsWith('bg-')) && (
              <span 
                className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-cyan-400 text-slate-950 border border-cyan-300 font-extrabold flex items-center gap-0.5 shadow-sm"
                title="Port Nativo de PC direto no Windows (Sem emulador - 60 FPS)"
              >
                <span>⚡</span>
                <span>Port PC</span>
              </span>
            )}
          </div>

          {/* PT-BR Badge - Dublado ou Legendado */}
          {(game.hasPtBrAudio || game.hasPtBrSubs) && (
            <span 
              className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded border backdrop-blur-md flex items-center gap-1 shadow-sm ${
                game.hasPtBrAudio 
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold' 
                  : 'bg-emerald-950/90 text-emerald-300 border-emerald-600/60'
              }`}
              title={game.hasPtBrAudio ? 'Dublagem e Áudio PT-BR Completo' : 'Legendas e Menus em Português do Brasil'}
            >
              <span>🇧🇷</span>
              <span>{game.hasPtBrAudio ? 'Dublado' : 'Legendado'}</span>
            </span>
          )}
        </div>

        {/* Library Bookmark Button */}
        <button
          onClick={handleLibraryToggle}
          className={`absolute top-2.5 right-2.5 z-20 p-2 rounded-xl backdrop-blur-md border transition-all ${
            libraryStatus
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/30'
              : 'bg-slate-900/60 text-slate-300 border-white/10 hover:bg-slate-900 hover:text-white'
          }`}
          title={libraryStatus ? 'Remover da Biblioteca' : 'Salvar na Biblioteca'}
        >
          {libraryStatus ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Bookmark className="w-3.5 h-3.5" />}
        </button>

        {/* Bottom image overlay: Critic Rating (Metascore & OpenCritic) & Size */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs text-white z-10 pointer-events-none">
          {/* Critic Scores Badges: Metacritic + OpenCritic */}
          <div className="flex items-center gap-1.5 max-w-[70%]">
            {/* Metacritic Metascore - Always visible directly on game cover */}
            <div 
              className="flex items-center gap-1 bg-slate-950/90 px-1.5 py-0.5 rounded-lg border border-slate-700/80 backdrop-blur-md shadow-lg"
              title={`Metascore Oficial: ${critic.metacritic}/100 (${critic.metacriticVerdict})\nOpenCritic: ${critic.opencritic}/100 (${critic.opencriticTier})\nGameFAQs: ${critic.gamefaqs}/5.0`}
            >
              <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-black font-mono leading-none shadow-sm ${metaBadge.bg} ${metaBadge.text}`}>
                {critic.metacritic}
              </span>
              <span className="text-[10px] font-bold text-slate-200 tracking-tight">
                Meta
              </span>
            </div>

            {/* OpenCritic Badge */}
            <div 
              className={`hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded-lg border backdrop-blur-md text-[10px] font-bold shadow-md bg-slate-950/90 ${openBadge.border} ${openBadge.text}`}
              title={`OpenCritic: ${critic.opencritic}/100 (Classificação: ${critic.opencriticTier})`}
            >
              <span className="text-[9px] text-slate-400 font-normal">OC</span>
              <span className="font-mono">{critic.opencritic}</span>
            </div>

            {/* Real User Rating if available */}
            {game.rating > 0 && (
              <div 
                className="flex items-center gap-1 bg-slate-950/85 px-1.5 py-0.5 rounded-lg border border-amber-500/30 backdrop-blur-md text-amber-400 font-bold text-[10px]"
                title={`Avaliação dos Usuários Vortex: ${game.rating.toFixed(1)}/5.0 (${game.totalVotes} votos)`}
              >
                <Star className="w-2.5 h-2.5 fill-amber-400" />
                <span>{game.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Repack Size */}
          <div className="flex items-center gap-1 bg-slate-950/90 px-2 py-0.5 rounded-lg border border-white/10 backdrop-blur-md text-slate-200 font-mono text-[11px] shrink-0">
            <HardDrive className="w-3 h-3 text-cyan-400" />
            <span>{game.repackInfo.repackSize}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col justify-between p-3.5 space-y-3">
        <div>
          {/* Categories / Format indicators */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 text-[10px]">
              {game.categories[0] || 'Jogo Completo'}
            </span>
            <div className="flex items-center gap-1.5">
              {game.titleId && (
                <span className="font-mono text-[9px] px-1 py-0.2 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                  {game.titleId}
                </span>
              )}
              <span className="font-mono">{game.releaseYear}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-1 font-display">
            {game.title}
          </h3>



          {/* Genre list */}
          <div className="flex flex-wrap gap-1 mt-2">
            {game.genres.slice(0, 3).map((genre, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-medium"
              >
                {genre}
              </span>
            ))}
            {game.genres.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400">
                +{game.genres.length - 3}
              </span>
            )}
          </div>

          {/* Live Ranking Metric Strip */}
          {(filters.sortBy === 'top_views' || filters.sortBy === 'popular') && (
            <div className="mt-2.5 flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-bold text-cyan-700 dark:text-cyan-300">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-cyan-500" />
                <span>Acessos</span>
              </span>
              <span className="font-mono font-black">{(game.viewsCount || 0).toLocaleString('pt-BR')}</span>
            </div>
          )}

          {(filters.sortBy === 'top_downloads' || filters.sortBy === 'downloads') && (
            <div className="mt-2.5 flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
              <span className="flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-emerald-500" />
                <span>Downloads</span>
              </span>
              <span className="font-mono font-black">{(game.downloadsCount || 0).toLocaleString('pt-BR')}</span>
            </div>
          )}

          {filters.sortBy === 'top_user' && (
            <div className="mt-2.5 flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] font-bold text-amber-700 dark:text-amber-300">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-500" />
                <span>Nota Usuários</span>
              </span>
              <span className="font-mono font-black">
                {(combinedUserScore / 10).toFixed(1)}/10
                {game.totalVotes > 0 ? ` (${game.rating.toFixed(1)}★)` : ''}
              </span>
            </div>
          )}

          {(filters.sortBy === 'top_rating' || filters.sortBy === 'rating') && (
            <div className="mt-2.5 flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] font-bold text-amber-700 dark:text-amber-300">
              <span className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>Pontuação Geral</span>
              </span>
              <span className="font-mono font-black">
                {(overallScore / 20).toFixed(2)}/5.0
                {game.totalVotes > 0 ? ` (${game.totalVotes} voto${game.totalVotes > 1 ? 's' : ''})` : ''}
              </span>
            </div>
          )}

          {filters.sortBy === 'top_critic' && (
            <div className="mt-2.5 flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-[11px] font-bold text-purple-700 dark:text-purple-300">
              <span className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-purple-400" />
                <span>Crítica (Meta/OC)</span>
              </span>
              <span className="font-mono font-black">{critic.metacritic} / {critic.opencritic}</span>
            </div>
          )}
        </div>

        {/* Card footer: Plataforma & Botão Ver Jogo */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-1.5 flex-wrap">
          {/* Plataforma / Console Indicator */}
          <div 
            className="flex items-center gap-1 text-[10px] text-slate-700 dark:text-slate-300 font-semibold bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700/60"
            title={game.platform ? `Disponível para: ${game.platform}` : 'Disponível para PC e Consoles'}
          >
            <span>{game.platform || (game.hasPkgFormat ? 'PC & Console' : 'PC Windows')}</span>
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            <span 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800/90 group-hover:bg-cyan-500 dark:group-hover:bg-cyan-500 text-slate-700 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-slate-950 border border-slate-200 dark:border-slate-700/80 group-hover:border-cyan-400 transition-all duration-200 shadow-sm"
            >
              <span>{t('card.viewGame', 'Ver Jogo')}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
