import React from 'react';
import { Sparkles, Download, Flame, ArrowRight, ExternalLink } from 'lucide-react';
import { Game } from '../types';
import { useGame } from '../context/GameContext';

interface RecentReleasesRowProps {
  onViewAll?: () => void;
}

export const RecentReleasesRow: React.FC<RecentReleasesRowProps> = ({ onViewAll }) => {
  const { games, setActiveGame, incrementDownload } = useGame();

  // Filter latest automated or recent releases (FitGirl + DODI + year 2026/2024)
  const recentReleases = React.useMemo(() => {
    return games
      .filter(g => g.id.startsWith('fg-') || g.id.startsWith('dodi-') || g.categories.includes('Lançamentos'))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  }, [games]);

  if (recentReleases.length === 0) return null;

  const handleDownload = (e: React.MouseEvent, game: Game) => {
    e.stopPropagation();
    const link = game.downloadLinks.find(l => l.type === 'magnet' || l.type === 'torrent');
    if (link) {
      incrementDownload(game.id);
      window.location.href = link.url;
    } else {
      setActiveGame(game);
    }
  };

  const getBadge = (game: Game) => {
    if (game.id.startsWith('fg-') || game.repackInfo.repacker.toLowerCase().includes('fitgirl')) {
      return { text: 'FitGirl Bot', bg: 'bg-pink-500/20 text-pink-300 border-pink-500/40' };
    }
    if (game.id.startsWith('dodi-') || game.repackInfo.repacker.toLowerCase().includes('dodi')) {
      return { text: 'DODI Dual', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
    }
    return { text: 'Lançamento', bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' };
  };

  return (
    <section className="w-full mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Flame className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white font-display flex items-center gap-2">
              <span>Novos Lançamentos Indexados</span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-cyan-500 text-slate-950">
                FitGirl & DODI
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Jogos recém-chegados pelo robô de sincronização automática com torrents verificados
            </p>
          </div>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors p-1"
          >
            <span>Ver Todos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Horizontal Carousel */}
      <div className="flex gap-3.5 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {recentReleases.map(game => {
          const badge = getBadge(game);
          return (
            <div
              key={game.id}
              onClick={() => setActiveGame(game)}
              className="group shrink-0 w-44 sm:w-48 bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-2.5 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-lg hover:shadow-cyan-950/40"
            >
              <div className="space-y-2">
                {/* Poster with badges */}
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-950">
                  <img
                    src={game.coverUrl}
                    alt={game.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-70" />

                  {/* Top Badge */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1">
                    <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase border backdrop-blur-md ${badge.bg}`}>
                      {badge.text}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-slate-950/80 text-cyan-300 border border-slate-800 backdrop-blur-md">
                      {game.repackInfo.repackSize}
                    </span>
                  </div>

                  {/* PT-BR indicator if available */}
                  {(game.hasPtBrAudio || game.hasPtBrSubs || game.languages?.some(l => l.includes('Português'))) && (
                    <div className="absolute bottom-1.5 left-2">
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase bg-emerald-500/90 text-slate-950 shadow-sm flex items-center gap-0.5">
                        <span>🇧🇷</span> PT-BR
                      </span>
                    </div>
                  )}
                </div>

                {/* Title and metadata */}
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-tight">
                    {game.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                    {game.repackInfo.version || game.developer}
                  </p>
                </div>
              </div>

              {/* Quick Action Button */}
              <button
                onClick={(e) => handleDownload(e, game)}
                className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 border border-cyan-500/30 text-[11px] font-bold transition-all"
                title="Baixar Torrent ou Abrir Página"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar Torrent</span>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
