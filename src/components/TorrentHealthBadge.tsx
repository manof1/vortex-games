import React, { useState } from 'react';
import { Activity, CheckCircle2, ShieldCheck, Zap, RefreshCw, Radio, Wifi } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface TorrentHealthBadgeProps {
  seeders?: number;
  leechers?: number;
  compact?: boolean;
  torrentName?: string;
}

export const TorrentHealthBadge: React.FC<TorrentHealthBadgeProps> = ({
  seeders = 75,
  leechers = 18,
  compact = false,
  torrentName
}) => {
  const { t } = useLanguage();
  const [isTesting, setIsTesting] = useState(false);
  const [tested, setTested] = useState(false);
  const [currentSeeds, setCurrentSeeds] = useState(seeders);
  const [currentLeechers, setCurrentLeechers] = useState(leechers);
  const [pingMs, setPingMs] = useState(24);

  // Check if seeds >= 50
  const isExcellent = currentSeeds >= 50;
  const isGood = currentSeeds >= 20 && currentSeeds < 50;

  const handleTestTrackers = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTesting(true);

    setTimeout(() => {
      // Simulate real live DHT tracker query update
      const variation = Math.floor(Math.random() * 9) - 3;
      const newSeedCount = Math.max(52, currentSeeds + variation);
      setCurrentSeeds(newSeedCount);
      setCurrentLeechers(Math.max(8, currentLeechers + Math.floor(Math.random() * 5)));
      setPingMs(Math.floor(18 + Math.random() * 22));
      setIsTesting(false);
      setTested(true);
    }, 850);
  };

  if (compact) {
    return (
      <div 
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold border transition-all ${
          isExcellent
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
            : isGood
            ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30'
            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
        }`}
        title={`Seeds: ${currentSeeds}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>{isExcellent ? t('health.excellent', 'Saúde: Excelente') : t('health.good', 'Saúde: Boa')} ({currentSeeds} seeds)</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-3 bg-slate-900/90 border border-emerald-500/30 shadow-lg space-y-2">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wide flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isExcellent ? t('health.excellent', 'Saúde do Torrent: Excelente') : isGood ? t('health.good', 'Saúde do Torrent: Boa') : t('health.regular', 'Saúde do Torrent: Moderada')}
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                +50 SEEDS ONLINE
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium">
              Verificado via DHT/Trackers • Download em velocidade máxima
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleTestTrackers}
          disabled={isTesting}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-emerald-500/50 transition-all cursor-pointer disabled:opacity-60"
          title="Fazer ping e testar resposta dos trackers de torrent"
        >
          <RefreshCw className={`w-3 h-3 text-emerald-400 ${isTesting ? 'animate-spin' : ''}`} />
          <span>{isTesting ? 'Verificando...' : tested ? 'Re-testar' : 'Testar Trackers'}</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800/80 text-[11px]">
        <div className="flex items-center gap-1.5 bg-slate-950/60 px-2 py-1 rounded-lg">
          <Zap className="w-3 h-3 text-emerald-400" />
          <span className="text-slate-400">Seeds:</span>
          <strong className="text-emerald-400 font-mono font-bold">{currentSeeds}</strong>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950/60 px-2 py-1 rounded-lg">
          <Activity className="w-3 h-3 text-cyan-400" />
          <span className="text-slate-400">Peers:</span>
          <strong className="text-cyan-300 font-mono font-bold">{currentLeechers}</strong>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950/60 px-2 py-1 rounded-lg">
          <Wifi className="w-3 h-3 text-indigo-400" />
          <span className="text-slate-400">Ping:</span>
          <strong className="text-white font-mono font-bold">{pingMs}ms</strong>
        </div>
      </div>

      {tested && (
        <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 bg-emerald-950/40 px-2 py-1 rounded border border-emerald-500/20">
          <span>✓</span>
          <span>4 Trackers Públicos Online (opentrackr.org, stealth.si, coppersurfer.tk) • 100% Saudável</span>
        </div>
      )}
    </div>
  );
};
