import React from 'react';
import { 
  Download, 
  Star, 
  HardDrive, 
  ShieldCheck, 
  Bookmark, 
  Check, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Game } from '../types';
import { useGame } from '../context/GameContext';

interface GameCardProps {
  game: Game;
}

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const { setActiveGame, isInLibrary, addToLibrary, removeFromLibrary, incrementDownload } = useGame();
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
    const pkgLink = game.downloadLinks.find(l => l.type === 'pkg' || l.format === 'pkg');
    if (pkgLink) {
      incrementDownload(game.id);
      window.open(pkgLink.url, '_blank');
    } else {
      setActiveGame(game);
    }
  };

  // Check available formats
  const hasTorrent = game.hasPcTorrent || game.downloadLinks.some(l => l.type === 'magnet' || l.type === 'torrent' || l.format === 'torrent');
  const hasPkg = game.hasPkgFormat || game.downloadLinks.some(l => l.type === 'pkg' || l.format === 'pkg');

  // Badge color based on repacker
  const getRepackerColor = (repacker: string) => {
    if (repacker.includes('FitGirl')) return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
    if (repacker.includes('DODI')) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    if (repacker.includes('ElAmigos')) return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
  };

  return (
    <div
      onClick={() => setActiveGame(game)}
      className="group relative flex flex-col rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-950/30 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950">
        <img
          src={game.coverUrl}
          alt={game.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient shadows */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 z-10">
          <div className="flex items-center gap-1 flex-wrap">
            {game.id.startsWith('fg-') && (
              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase bg-pink-500 text-slate-950 border border-pink-400 shadow-sm flex items-center gap-0.5 animate-pulse">
                <span>🤖</span> AUTO-SYNC
              </span>
            )}

            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase border backdrop-blur-md ${getRepackerColor(game.repackInfo.repacker)}`}>
              {game.repackInfo.repacker}
            </span>

            {/* PT-BR Audio Badge */}
            {(game.hasPtBrAudio || game.languages?.some(l => l.includes('Dublado') || l.includes('Dublagem'))) && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-emerald-500/90 text-slate-950 border border-emerald-400 shadow-sm flex items-center gap-0.5">
                <span>🇧🇷</span> DUBLADO
              </span>
            )}

            {/* PKG Badge */}
            {game.hasPkgFormat && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-purple-600/90 text-white border border-purple-400 shadow-sm">
                PKG
              </span>
            )}
          </div>

          {/* Library bookmark button */}
          <button
            onClick={handleLibraryToggle}
            className={`p-1.5 rounded-lg backdrop-blur-md border transition-all ${
              libraryStatus
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/40'
                : 'bg-slate-950/70 text-slate-300 border-slate-700/80 hover:text-white hover:bg-slate-900'
            }`}
            title={libraryStatus ? 'Na sua biblioteca' : 'Adicionar à biblioteca'}
          >
            {libraryStatus ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Bookmark className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Bottom overlays inside image: Rating & Crack info */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs z-10">
          <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-slate-800 text-amber-400 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{game.rating.toFixed(1)}</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-slate-800 text-cyan-300 font-semibold text-[11px]">
            <HardDrive className="w-3 h-3 text-cyan-400" />
            <span>{game.repackInfo.repackSize}</span>
          </div>
        </div>
      </div>

      {/* Card Info Content */}
      <div className="flex flex-col flex-1 p-4 justify-between space-y-3">
        <div>
          {/* Release year & developer */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="font-semibold text-slate-400 truncate max-w-[130px]">{game.developer}</span>
            <div className="flex items-center gap-1.5">
              {game.titleId && (
                <span className="font-mono text-[9px] px-1 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800">
                  {game.titleId}
                </span>
              )}
              <span className="font-mono">{game.releaseYear}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1 font-display">
            {game.title}
          </h3>

          {/* Genre list */}
          <div className="flex flex-wrap gap-1 mt-2">
            {game.genres.slice(0, 3).map((genre, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 font-medium"
              >
                {genre}
              </span>
            ))}
            {game.genres.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/40 text-slate-400">
                +{game.genres.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Card footer: Distinct Action Buttons (Torrent vs PKG) */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate max-w-[100px]">{game.repackInfo.crackStatus}</span>
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            {/* Torrent Button */}
            {hasTorrent && (
              <button
                onClick={handleTorrentDownload}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 border border-cyan-500/30 transition-all duration-200"
                title="Download Torrent PC (.torrent / Magnet)"
              >
                <Download className="w-3 h-3" />
                <span>Torrent</span>
              </button>
            )}

            {/* PKG Button */}
            {hasPkg && (
              <button
                onClick={handlePkgDownload}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-purple-500/15 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 transition-all duration-200"
                title="Download Arquivo PKG Console (TheZukoStore)"
              >
                <span>PKG</span>
              </button>
            )}

            {!hasTorrent && !hasPkg && (
              <button
                onClick={(e) => { e.stopPropagation(); setActiveGame(game); }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-cyan-500 text-slate-300 hover:text-slate-950 border border-slate-700 transition-all"
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
