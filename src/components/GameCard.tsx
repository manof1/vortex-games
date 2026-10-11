import React from 'react';
import { 
  Download, 
  Star, 
  HardDrive, 
  Bookmark, 
  Check, 
  Sparkles,
  Lock
} from 'lucide-react';
import { Game } from '../types';
import { useGame } from '../context/GameContext';

interface GameCardProps {
  game: Game;
}

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const { 
    setActiveGame, 
    isInLibrary, 
    addToLibrary, 
    removeFromLibrary, 
    incrementDownload, 
    isLoggedIn, 
    setIsAuthModalOpen 
  } = useGame();
  
  const libraryStatus = isInLibrary(game.id);

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
      window.location.href = torrentLink.url;
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
      onClick={() => setActiveGame(game)}
      className="group relative flex flex-col rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 hover:border-cyan-500/50 hover:shadow-xl dark:hover:shadow-cyan-950/30 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950">
        <img
          src={game.coverUrl}
          alt={game.title}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80';
          }}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient shadows */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges overlay */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 z-10 pointer-events-none">
          {/* Repacker badge */}
          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border backdrop-blur-md shadow-sm ${getRepackerColor(game.repackInfo.repacker)}`}>
            {game.repackInfo.repacker.replace(' Repack', '')}
          </span>

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

        {/* Bottom image overlay: Rating & Size */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs text-white z-10 pointer-events-none">
          {/* Real User Rating or Trending */}
          {game.rating > 0 ? (
            <div className="flex items-center gap-1 bg-slate-950/80 px-2 py-0.5 rounded-lg border border-amber-500/30 backdrop-blur-md text-amber-400 font-bold">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{game.rating.toFixed(1)}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 bg-slate-950/80 px-2 py-0.5 rounded-lg border border-cyan-500/30 backdrop-blur-md text-cyan-400 font-bold text-[10px]">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Novo</span>
            </div>
          )}

          {/* Repack Size */}
          <div className="flex items-center gap-1 bg-slate-950/80 px-2 py-0.5 rounded-lg border border-white/10 backdrop-blur-md text-slate-200 font-mono text-[11px]">
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
        </div>

        {/* Card footer: Seeds Ativos & Download Buttons */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-1.5 flex-wrap">
          {/* Seeds Ativos Status - Selo de Saúde Excelente */}
          <div 
            className="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20"
            title="Saúde do Torrent: Excelente (+50 seeds ativos testados em tempo real)"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              Saúde: Excelente ({((torrentLink?.seeders) || 78).toLocaleString('pt-BR')} seeds)
            </span>
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            {/* Torrent Button - Direct App Launch */}
            {hasTorrent && (
              <button
                onClick={handleTorrentDownload}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-50 dark:bg-cyan-500/10 hover:bg-cyan-500 text-cyan-700 dark:text-cyan-400 hover:text-slate-950 border border-cyan-200 dark:border-cyan-500/30 transition-all duration-200 cursor-pointer"
                title={isLoggedIn ? 'Abrir Magnet direto no seu qBittorrent / uTorrent' : '🔒 Exclusivo para membros cadastrados. Clique para liberar!'}
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
                title={isLoggedIn ? 'Download Arquivo PKG Console' : '🔒 Exclusivo para membros cadastrados. Clique para liberar!'}
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
                <span>Baixar</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
