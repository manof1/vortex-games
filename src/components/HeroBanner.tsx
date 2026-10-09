import React, { useState, useEffect, useMemo } from 'react';
import { 
  Download, 
  Star, 
  HardDrive, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Flame,
  ChevronLeft,
  ChevronRight,
  Bot
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { Game } from '../types';

export const HeroBanner: React.FC = () => {
  const { games, setActiveGame, incrementDownload } = useGame();

  // Pick top 6 spotlight releases (prioritizing new automated releases and trending games)
  const spotlightGames = useMemo(() => {
    if (!games || games.length === 0) return [];
    
    // Automated games (FitGirl & DODI bot)
    const automated = games.filter(g => g.id.startsWith('fg-') || g.id.startsWith('dodi-'));
    // Other featured games
    const others = games.filter(g => !g.id.startsWith('fg-') && !g.id.startsWith('dodi-') && (g.isFeatured || g.isTrending));
    
    const combined = [...automated, ...others];
    // Take the top 6 distinct games
    const seen = new Set<string>();
    const unique: Game[] = [];
    for (const g of combined) {
      if (!seen.has(g.id)) {
        seen.add(g.id);
        unique.push(g);
      }
      if (unique.length >= 6) break;
    }
    
    return unique.length > 0 ? unique : games.slice(0, 5);
  }, [games]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance slide every 7 seconds
  useEffect(() => {
    if (spotlightGames.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % spotlightGames.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [spotlightGames.length, isPaused]);

  if (spotlightGames.length === 0) return null;

  const current = spotlightGames[currentIndex] || spotlightGames[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev === 0 ? spotlightGames.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % spotlightGames.length);
  };

  const handleQuickMagnet = (e: React.MouseEvent) => {
    e.stopPropagation();
    const magnetLink = current.downloadLinks.find(l => l.type === 'magnet' || l.type === 'torrent');
    if (magnetLink) {
      incrementDownload(current.id);
      window.location.href = magnetLink.url;
    } else {
      setActiveGame(current);
    }
  };

  const scrollToCatalog = (e: React.MouseEvent) => {
    e.stopPropagation();
    const el = document.getElementById('catalogo-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isBotGame = current.id.startsWith('fg-') || current.id.startsWith('dodi-');
  const isFitGirl = current.id.startsWith('fg-') || current.repackInfo.repacker.toLowerCase().includes('fitgirl');
  const isDodi = current.id.startsWith('dodi-') || current.repackInfo.repacker.toLowerCase().includes('dodi');

  return (
    <div 
      className="relative w-full mb-8 overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-900/60 shadow-2xl group/hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background image with blur and gradients */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-105 filter blur-[1px]"
        style={{ backgroundImage: `url(${current.bannerUrl || current.coverUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/50" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />

      {/* Hero content */}
      <div className="relative z-10 max-w-7xl mx-auto p-5 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-center gap-6 lg:gap-8 justify-between">
        
        {/* Left Column: Game Info */}
        <div className="max-w-2xl space-y-3.5 sm:space-y-4">
          
          {/* Badge row */}
          <div className="flex flex-wrap items-center gap-2">
            {isBotGame ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-cyan-500 text-slate-950 border border-cyan-400 shadow-md shadow-cyan-500/25 animate-pulse">
                <Bot className="w-3.5 h-3.5" /> Auto-Bot Indexado
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <Flame className="w-3.5 h-3.5" /> Destaque da Semana
              </span>
            )}

            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
              isFitGirl 
                ? 'bg-pink-500/20 text-pink-300 border-pink-500/40' 
                : isDodi 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
            }`}>
              <Sparkles className="w-3 h-3" /> {current.repackInfo.repacker}
            </span>

            {/* PT-BR badge */}
            {(current.hasPtBrAudio || current.hasPtBrSubs || current.languages?.some(l => l.includes('Português'))) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 border border-emerald-400 shadow-sm">
                <span>🇧🇷</span> Dublado PT-BR
              </span>
            )}

            {/* PKG badge */}
            {current.hasPkgFormat && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-600 text-white border border-purple-400 shadow-sm">
                Formato PKG
              </span>
            )}

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" /> {current.repackInfo.crackStatus || 'Crackeado'}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-display drop-shadow-md leading-tight">
            {current.title}
          </h1>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed max-w-xl">
            {current.shortDescription || current.description}
          </p>

          {/* Metadata chips */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-300 py-1">
            {/* IMDb / Rating */}
            <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-amber-500/40 text-amber-300 font-bold shadow-sm">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded uppercase">IMDb</span>
              <span className="text-sm font-black font-mono">{(current.imdbRating || (current.rating * 1.85 + 0.4)).toFixed(1)}</span>
              <span className="text-slate-400 text-[10px]">/ 10</span>
            </div>

            {/* User Rating */}
            <div className="flex items-center gap-1.5 text-amber-400 font-bold bg-slate-950/70 px-2.5 py-1 rounded-lg border border-slate-800">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{current.rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({(current.totalVotes || 450).toLocaleString('pt-BR')} votos)</span>
            </div>

            {/* Repack Size */}
            <div className="flex items-center gap-1.5 bg-slate-950/70 px-2.5 py-1 rounded-lg border border-slate-800">
              <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
              <span>Repack: <strong className="text-white">{current.repackInfo.repackSize}</strong></span>
              {current.repackInfo.originalSize && (
                <span className="text-slate-500 line-through text-[11px]">({current.repackInfo.originalSize})</span>
              )}
            </div>

            {/* Seeds */}
            <div className="flex items-center gap-1.5 bg-slate-950/70 px-2.5 py-1 rounded-lg border border-slate-800 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Seeds: <strong className="text-emerald-400">{(current.downloadLinks[0]?.seeders || 3500).toLocaleString('pt-BR')} Ativos</strong></span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleQuickMagnet}
              className="flex items-center gap-2 px-5 sm:px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transform hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 stroke-[2.5]" />
              <span>Baixar Torrent (Magnet)</span>
            </button>

            <button
              onClick={() => setActiveGame(current)}
              className="flex items-center gap-2 px-4 sm:px-5 py-3 rounded-xl font-bold text-xs sm:text-sm bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-slate-500 transition-all cursor-pointer"
            >
              <span>Ver Detalhes & Requisitos</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={scrollToCatalog}
              className="flex items-center gap-1.5 px-3.5 py-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <span>Ver no Catálogo ↓</span>
            </button>
          </div>

        </div>

        {/* Right Column: Poster + Carousel Controls */}
        <div className="relative flex flex-col items-center">
          <div 
            onClick={() => setActiveGame(current)}
            className="relative group cursor-pointer w-48 sm:w-56 lg:w-64 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-cyan-500/40 shadow-2xl shadow-cyan-950/80 group-hover:border-cyan-400 transition-all duration-300 transform group-hover:scale-[1.02] bg-slate-950"
          >
            <img 
              src={current.coverUrl} 
              alt={current.title} 
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80';
              }}
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-2.5 left-2.5 right-2.5 p-2.5 bg-slate-950/80 backdrop-blur-md rounded-xl border border-slate-800">
              <p className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">{current.developer || 'Repack Verificado'}</p>
              <p className="text-xs text-slate-200 font-semibold truncate">{current.repackInfo.version}</p>
            </div>
          </div>

          {/* Carousel Slide Indicators & Arrows */}
          <div className="flex items-center gap-2 mt-3 z-20">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 border border-slate-800 transition-all cursor-pointer"
              title="Jogo Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5 px-2">
              {spotlightGames.map((g, idx) => (
                <button
                  key={g.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`transition-all rounded-full cursor-pointer ${
                    currentIndex === idx 
                      ? 'w-6 h-2 bg-cyan-400 shadow-sm shadow-cyan-400' 
                      : 'w-2 h-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                  title={g.title}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 border border-slate-800 transition-all cursor-pointer"
              title="Próximo Jogo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
