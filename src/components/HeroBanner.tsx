import React from 'react';
import { 
  Download, 
  Star, 
  HardDrive, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  ArrowRight,
  Flame
} from 'lucide-react';
import { useGame } from '../context/GameContext';

export const HeroBanner: React.FC = () => {
  const { games, setActiveGame, incrementDownload } = useGame();

  // Find a featured game or the first trending game
  const featured = games.find(g => g.isFeatured) || games[0];
  if (!featured) return null;

  const handleQuickMagnet = (e: React.MouseEvent) => {
    e.stopPropagation();
    const magnetLink = featured.downloadLinks.find(l => l.type === 'magnet');
    if (magnetLink) {
      incrementDownload(featured.id);
      window.location.href = magnetLink.url;
    } else {
      setActiveGame(featured);
    }
  };

  return (
    <div className="relative w-full mb-8 overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-900/40 shadow-2xl">
      {/* Background with gradient overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-105 filter blur-[1px]"
        style={{ backgroundImage: `url(${featured.bannerUrl || featured.coverUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/50" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />

      {/* Hero content */}
      <div className="relative z-10 max-w-7xl mx-auto p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row items-center gap-8 justify-between">
        <div className="max-w-2xl space-y-4">
          
          {/* Badge row */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Flame className="w-3.5 h-3.5" /> Destaque da Semana
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Sparkles className="w-3 h-3 text-cyan-400" /> {featured.repackInfo.repacker}
            </span>

            {/* PT-BR badge */}
            {(featured.hasPtBrAudio || featured.languages?.some(l => l.includes('Dublado'))) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 border border-emerald-400 shadow-sm">
                <span>🇧🇷</span> Dublado PT-BR
              </span>
            )}

            {/* PKG badge */}
            {featured.hasPkgFormat && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-600 text-white border border-purple-400 shadow-sm">
                Formato PKG
              </span>
            )}

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" /> {featured.repackInfo.crackStatus}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-display drop-shadow-md">
            {featured.title}
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-300 line-clamp-3 leading-relaxed max-w-xl">
            {featured.shortDescription || featured.description}
          </p>

          {/* Key metadata chips */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300 py-1">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold bg-slate-950/70 px-2.5 py-1 rounded-lg border border-slate-800">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{featured.rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({featured.totalVotes} votos)</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950/70 px-2.5 py-1 rounded-lg border border-slate-800">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              <span>Repack: <strong className="text-white">{featured.repackInfo.repackSize}</strong></span>
              <span className="text-slate-500 line-through">({featured.repackInfo.originalSize})</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950/70 px-2.5 py-1 rounded-lg border border-slate-800">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Seeds: <strong className="text-emerald-400">+{featured.downloadLinks[0]?.seeders || 2500}</strong></span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              onClick={handleQuickMagnet}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transform hover:-translate-y-0.5 transition-all"
            >
              <Download className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              <span>Baixar Torrent (Magnet)</span>
            </button>

            <button
              onClick={() => setActiveGame(featured)}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-slate-500 transition-all"
            >
              <span>Ver Detalhes & Requisitos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Poster showcase */}
        <div 
          onClick={() => setActiveGame(featured)}
          className="relative group cursor-pointer hidden lg:block"
        >
          <div className="relative w-64 h-96 rounded-2xl overflow-hidden border-2 border-cyan-500/40 shadow-2xl shadow-cyan-950/80 group-hover:border-cyan-400 transition-all duration-300 transform group-hover:scale-[1.02]">
            <img 
              src={featured.coverUrl} 
              alt={featured.title} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-3 left-3 right-3 p-3 bg-slate-950/80 backdrop-blur-md rounded-xl border border-slate-800">
              <p className="text-xs font-bold text-cyan-300 uppercase tracking-wider">{featured.developer}</p>
              <p className="text-xs text-slate-300 font-medium truncate">{featured.repackInfo.version}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
