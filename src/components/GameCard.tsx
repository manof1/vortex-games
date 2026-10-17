import React from 'react';
import { 
  Download, 
  Star, 
  HardDrive, 
  Bookmark, 
  Check, 
  Sparkles,
  Lock,
  Zap,
  Package,
  Trophy,
  Medal
} from 'lucide-react';
import { Game } from '../types';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import { sanitizeMagnetLink } from '../utils/magnetUtils';
import { getCriticScores, getMetacriticBadgeColor, getOpenCriticTierColor } from '../utils/ratingUtils';
import { getGameCover, handleImageError } from '../utils/imageUtils';

interface GameCardProps {
  game: Game;
  rank?: number;
}

export const GameCard: React.FC<GameCardProps> = ({ game, rank }) => {
  const { 
    setActiveGame, 
    isInLibrary, 
    addToLibrary, 
    removeFromLibrary, 
    incrementDownload, 
    isLoggedIn, 
    setIsAuthModalOpen 
  } = useGame();
  const { t } = useLanguage();
  
  const critic = getCriticScores(game);
  const metaBadge = getMetacriticBadgeColor(critic.metacritic);
  const openBadge = getOpenCriticTierColor(critic.opencriticTier);
  
  const libraryStatus = isInLibrary(game.id);
  const hasGameCheats = Array.isArray(game.cheats) && game.cheats.length > 0;
  const hasGameMods = (Array.isArray(game.mods) && game.mods.length > 0) || !!game.nexusModsUrl;

  const handleLibraryToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (libraryStatus) {
      removeFromLibrary(game.id);
    } else {
      addToLibrary(game.id, 'wishlist');
    }
  };

  const handleTorrentDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }
    const torrentLink = game.downloadLinks.find(l => l.type === 'magnet' || l.type === 'torrent' || l.format === 'torrent');
    if (torrentLink) {
      incrementDownload(game.id);
      const cleanUrl = torrentLink.url.startsWith('magnet:')
        ? sanitizeMagnetLink(torrentLink.url, `${game.title} [${game.repackInfo?.repacker || 'Vortex'}]`)
        : torrentLink.url;
      window.location.href = cleanUrl;
    } else {
      setActiveGame(game);
    }
  };

  const handlePkgDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }
    const pkgLink = game.downloadLinks.find(l => l.type === 'pkg' || l.format === 'pkg');
    if (pkgLink) {
      incrementDownload(game.id);
      window.open(pkgLink.url, '_blank');
    } else {
      setActiveGame(game);
    }
  };

  // Check available formats
  const torrentLink = game.downloadLinks?.find(l => l.type === 'magnet' || l.type === 'torrent' || l.format === 'torrent');
  const hasTorrent = game.hasPcTorrent || !!torrentLink;
  const hasPkg = game.hasPkgFormat || game.downloadLinks.some(l => l.type === 'pkg' || l.format === 'pkg');

  // Badge color based on repacker
  const getRepackerColor = (repacker: string) => {
    if (repacker.includes('FitGirl')) return 'bg-pink-500/20 text-pink-700 dark:text-pink-300 border-pink-500/30';
    if (repacker.includes('DODI')) return 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
    if (repacker.includes('ElAmigos')) return 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30';
    return 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/30';
  };

  return (
    <div
      onClick={() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        setActiveGame(game);
      }}
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

          {/* Cheats & Mods Indicators (Ligado se disponível) */}
          {(hasGameCheats || hasGameMods) && (
            <div className="flex items-center gap-1.5 mt-1.5">
              {hasGameCheats && (
                <span 
                  className="inline-flex items-center gap-1 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                  title={`${game.cheats?.length} Cheats GameFAQs disponíveis!`}
                >
                  <Zap className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                  <span>Cheats ON</span>
                </span>
              )}
              {hasGameMods && (
                <span 
                  className="inline-flex items-center gap-1 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md bg-orange-500/15 text-orange-700 dark:text-orange-300 border border-orange-500/30"
                  title="Mods do Nexus Mods recomendados para este jogo"
                >
                  <Package className="w-2.5 h-2.5 text-orange-500" />
                  <span>Mods ON</span>
                </span>
              )}
            </div>
          )}

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
        </div>

        {/* Card footer: Seeds Ativos & Download Buttons */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-1.5 flex-wrap">
          {/* Seeds Ativos Status - Selo de Saúde Excelente */}
          <div 
            className="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20"
            title="Saúde do Torrent: Excelente (+50 seeds)"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {t('health.excellent', 'Saúde: Excelente')} ({((torrentLink?.seeders) || 78).toLocaleString('pt-BR')} seeds)
            </span>
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            {/* Torrent Button - Direct App Launch */}
            {hasTorrent && (
              <button
                onClick={handleTorrentDownload}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-50 dark:bg-cyan-500/10 hover:bg-cyan-500 text-cyan-700 dark:text-cyan-400 hover:text-slate-950 border border-cyan-200 dark:border-cyan-500/30 transition-all duration-200 cursor-pointer"
                title={isLoggedIn ? 'Abrir Magnet direto no seu qBittorrent / uTorrent' : '🔒 Exclusivo para membros cadastrados'}
              >
                {isLoggedIn ? <Download className="w-3 h-3" /> : <Lock className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />}
                <span>Torrent</span>
              </button>
            )}

            {/* PKG Button */}
            {hasPkg && (
              <button
                onClick={handlePkgDownload}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-purple-50 dark:bg-purple-500/15 hover:bg-purple-600 text-purple-700 dark:text-purple-300 hover:text-white border border-purple-200 dark:border-purple-500/30 transition-all duration-200 cursor-pointer"
                title={isLoggedIn ? 'Download Arquivo PKG Console' : '🔒 Exclusivo para membros cadastrados'}
              >
                {isLoggedIn ? null : <Lock className="w-2.5 h-2.5 text-purple-600 dark:text-purple-400" />}
                <span>PKG</span>
              </button>
            )}

            {!hasTorrent && !hasPkg && (
              <button
                onClick={(e) => { e.stopPropagation(); setActiveGame(game); }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-cyan-500 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-950 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>{t('card.download', 'Baixar')}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
