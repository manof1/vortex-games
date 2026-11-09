import React, { useState, useEffect } from 'react';
import { 
  X, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Zap, 
  Sparkles, 
  HardDrive, 
  Layers, 
  Search,
  ExternalLink,
  ChevronRight,
  Monitor
} from 'lucide-react';
import { Game } from '../types';
import { 
  UserHardwareSpec, 
  HARDWARE_PRESETS, 
  getSavedUserHardware, 
  saveUserHardware, 
  detectBrowserHardware, 
  evaluateGamePerformance 
} from '../services/hardwareCheckService';

interface CanIRunItModalProps {
  isOpen: boolean;
  onClose: () => void;
  games: Game[];
  initialGame?: Game | null;
  onSelectGame?: (game: Game) => void;
}

export const CanIRunItModal: React.FC<CanIRunItModalProps> = ({
  isOpen,
  onClose,
  games,
  initialGame,
  onSelectGame
}) => {
  const [hardware, setHardware] = useState<UserHardwareSpec>(getSavedUserHardware);
  const [selectedGame, setSelectedGame] = useState<Game | null>(initialGame || games[0] || null);
  const [gameSearch, setGameSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'test' | 'config'>('test');
  const [copiedSaved, setCopiedSaved] = useState(false);

  useEffect(() => {
    if (initialGame) {
      setSelectedGame(initialGame);
    } else if (!selectedGame && games.length > 0) {
      setSelectedGame(games[0]);
    }
  }, [initialGame, games]);

  if (!isOpen) return null;

  const result = selectedGame ? evaluateGamePerformance(selectedGame, hardware) : null;

  const handleSelectPreset = (presetSpec: UserHardwareSpec) => {
    setHardware(presetSpec);
    saveUserHardware(presetSpec);
    setCopiedSaved(true);
    setTimeout(() => setCopiedSaved(false), 2000);
  };

  const handleAutoDetect = () => {
    const detected = detectBrowserHardware();
    setHardware(detected);
    saveUserHardware(detected);
    setCopiedSaved(true);
    setTimeout(() => setCopiedSaved(false), 2000);
  };

  const filteredGames = games
    .filter(g => !gameSearch || g.title.toLowerCase().includes(gameSearch.toLowerCase()))
    .slice(0, 10);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-cyan-500/30 rounded-3xl shadow-2xl shadow-cyan-500/10 overflow-hidden flex flex-col my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20">
              <Cpu className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500 text-slate-950">
                  CAN YOU RUN IT
                </span>
                <span className="text-xs text-slate-400 font-bold">1-Clique</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white font-display">
                Meu PC Roda? Testador de Requisitos
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Abas Rápidas */}
            <div className="flex items-center p-1 bg-slate-800 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('test')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'test' ? 'bg-cyan-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Analisar Jogo
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('config')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'config' ? 'bg-cyan-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Meu Hardware
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Hardware Bar Resumo */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                <Monitor className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Perfil de Hardware Ativo:
                </span>
                <span className="font-bold text-white">
                  {hardware.gpuName} · {hardware.ramGb} GB RAM · {hardware.cpuName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAutoDetect}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                title="Tentar identificar GPU e RAM do seu navegador automaticamente"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Auto-Detectar</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('config')}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-bold transition-all border border-cyan-500/30 cursor-pointer"
              >
                Mudar Specs
              </button>
            </div>
          </div>

          {copiedSaved && (
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Especificações do seu computador salvas! O portal irá memorizar suas configurações.</span>
            </div>
          )}

          {/* TAB 1: ANALISAR JOGO */}
          {activeTab === 'test' && (
            <div className="space-y-6">
              
              {/* Seletor de Jogo */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Escolha o Jogo para Testar:</span>
                </label>

                <div className="relative">
                  <input
                    type="text"
                    value={gameSearch}
                    onChange={(e) => setGameSearch(e.target.value)}
                    placeholder="Digite o nome de qualquer jogo da biblioteca (ex: Resident Evil 4, God of War, Star Fox)..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-all pl-10"
                  />
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                </div>

                {/* Lista rápida de jogos filtrados */}
                {gameSearch && (
                  <div className="p-2 rounded-2xl bg-slate-900 border border-slate-800 max-h-48 overflow-y-auto space-y-1">
                    {filteredGames.map(g => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => {
                          setSelectedGame(g);
                          setGameSearch('');
                        }}
                        className={`w-full flex items-center gap-3 p-2 rounded-xl text-left transition-all cursor-pointer ${
                          selectedGame?.id === g.id ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <img 
                          src={g.coverUrl} 
                          alt={g.title} 
                          className="w-8 h-10 object-cover rounded shadow shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate text-white">{g.title}</p>
                          <p className="text-[10px] text-slate-400">{g.repackInfo?.repacker || 'Repack'} · {g.genres.slice(0, 2).join(', ')}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Card de Veredito */}
              {selectedGame && result && (
                <div className="space-y-4">
                  {/* Banner do Jogo Selecionado & Status */}
                  <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between shadow-xl">
                    <div className="flex items-center gap-4">
                      <img 
                        src={selectedGame.coverUrl} 
                        alt={selectedGame.title} 
                        className="w-16 h-22 object-cover rounded-2xl shadow-lg border border-slate-700 shrink-0" 
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {selectedGame.repackInfo?.repacker || 'Vortex'}
                          </span>
                          <span className="text-xs text-slate-400 font-bold">
                            {selectedGame.releaseYear}
                          </span>
                        </div>
                        <h4 className="text-lg sm:text-xl font-black text-white font-display mt-0.5">
                          {selectedGame.title}
                        </h4>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">
                          Tamanho: {selectedGame.repackInfo?.repackSize || '15 GB'} · {selectedGame.genres.slice(0, 3).join(', ')}
                        </p>
                      </div>
                    </div>

                    {/* Veredito Grande */}
                    <div className={`p-4 rounded-2xl border flex items-center gap-3 w-full md:w-auto shrink-0 shadow-lg ${
                      result.verdict === 'recommended'
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 shadow-emerald-500/10'
                        : result.verdict === 'minimum'
                        ? 'bg-amber-950/40 border-amber-500/50 text-amber-300 shadow-amber-500/10'
                        : 'bg-rose-950/40 border-rose-500/50 text-rose-300 shadow-rose-500/10'
                    }`}>
                      {result.verdict === 'recommended' ? (
                        <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                      ) : result.verdict === 'minimum' ? (
                        <AlertTriangle className="w-8 h-8 text-amber-400 shrink-0" />
                      ) : (
                        <XCircle className="w-8 h-8 text-rose-400 shrink-0" />
                      )}
                      <div>
                        <span className="text-[10px] uppercase font-black tracking-widest block opacity-80">
                          Veredito Vortex
                        </span>
                        <span className="text-sm font-black block">
                          {result.title}
                        </span>
                        <span className="text-xs font-mono opacity-90 block mt-0.5">
                          {result.fpsEstimate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Detalhes de Hardware Lado a Lado */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    
                    {/* CPU */}
                    <div className={`p-4 rounded-2xl border space-y-1 ${
                      result.details.cpu.pass ? 'bg-slate-900/60 border-slate-800' : 'bg-rose-950/20 border-rose-500/30'
                    }`}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-400 flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-cyan-400" /> CPU
                        </span>
                        {result.details.cpu.pass ? (
                          <span className="text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> OK
                          </span>
                        ) : (
                          <span className="text-rose-400 text-[11px] font-bold flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> Fraco
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-white truncate" title={result.details.cpu.current}>
                        {result.details.cpu.current}
                      </p>
                      <p className="text-[10px] text-slate-500 line-clamp-1">
                        Requer: {result.details.cpu.requiredMin}
                      </p>
                    </div>

                    {/* GPU */}
                    <div className={`p-4 rounded-2xl border space-y-1 ${
                      result.details.gpu.pass ? 'bg-slate-900/60 border-slate-800' : 'bg-rose-950/20 border-rose-500/30'
                    }`}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-400 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-yellow-400" /> GPU (Placa de Vídeo)
                        </span>
                        {result.details.gpu.pass ? (
                          <span className="text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> OK
                          </span>
                        ) : (
                          <span className="text-rose-400 text-[11px] font-bold flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> Fraca
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-white truncate" title={result.details.gpu.current}>
                        {result.details.gpu.current}
                      </p>
                      <p className="text-[10px] text-slate-500 line-clamp-1">
                        Mínimo: {result.details.gpu.requiredMin}
                      </p>
                    </div>

                    {/* RAM */}
                    <div className={`p-4 rounded-2xl border space-y-1 ${
                      result.details.ram.pass ? 'bg-slate-900/60 border-slate-800' : 'bg-rose-950/20 border-rose-500/30'
                    }`}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-400 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-purple-400" /> Memória RAM
                        </span>
                        {result.details.ram.pass ? (
                          <span className="text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> OK
                          </span>
                        ) : (
                          <span className="text-rose-400 text-[11px] font-bold flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> Insuficiente
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-white">
                        {result.details.ram.current}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Pede: {result.details.ram.requiredMin}
                      </p>
                    </div>

                    {/* Disco */}
                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-400 flex items-center gap-1.5">
                          <HardDrive className="w-3.5 h-3.5 text-blue-400" /> Armazenamento
                        </span>
                        <span className="text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> OK
                        </span>
                      </div>
                      <p className="text-xs font-bold text-white">
                        {hardware.storageType.toUpperCase()}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {result.details.storage.requiredMin}
                      </p>
                    </div>

                  </div>

                  {/* Dicas e Recomendações */}
                  {result.tips.length > 0 && (
                    <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
                      <h5 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        Dicas de Otimização para este Jogo:
                      </h5>
                      <ul className="space-y-1 text-xs text-slate-400">
                        {result.tips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-cyan-400">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Botão para abrir o jogo diretamente */}
                  {onSelectGame && (
                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectGame(selectedGame);
                          onClose();
                        }}
                        className="px-5 py-2.5 rounded-xl font-black text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
                      >
                        <span>Abrir Página e Baixar {selectedGame.title}</span>
                        <ExternalLink className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  )}

                </div>
              )}
            </div>
          )}

          {/* TAB 2: CONFIGURAR MEU HARDWARE */}
          {activeTab === 'config' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                  Selecione um Perfil Pronto ou Monte o Seu:
                </h4>
                <p className="text-xs text-slate-400">
                  Defina o computador que você usa para jogar. O Vortex Games salvará sua escolha e indicará automaticamente se os jogos rodam suave.
                </p>
              </div>

              {/* Presets Rápidos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {HARDWARE_PRESETS.map(p => {
                  const isCurrent = hardware.presetId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectPreset(p.spec)}
                      className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex items-start gap-3 ${
                        isCurrent
                          ? 'bg-cyan-500/15 border-cyan-500 shadow-md shadow-cyan-500/10'
                          : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="text-2xl p-2 rounded-xl bg-slate-800/80 shrink-0">
                        {p.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-white">{p.name}</span>
                          {isCurrent && (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-cyan-500 text-slate-950">
                              SELECIONADO
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {p.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Personalização Manual */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h5 className="text-xs font-black uppercase tracking-wider text-cyan-400">
                  Ou Personalize os Componentes:
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Memória RAM */}
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">
                      Memória RAM (GB):
                    </label>
                    <select
                      value={hardware.ramGb}
                      onChange={(e) => {
                        const newSpec = { ...hardware, ramGb: parseInt(e.target.value, 10), presetId: 'custom' };
                        setHardware(newSpec);
                        saveUserHardware(newSpec);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-cyan-500"
                    >
                      <option value="4">4 GB RAM (Básico)</option>
                      <option value="8">8 GB RAM (Padrão)</option>
                      <option value="12">12 GB RAM</option>
                      <option value="16">16 GB RAM (Recomendado)</option>
                      <option value="24">24 GB RAM</option>
                      <option value="32">32 GB RAM (Avançado)</option>
                      <option value="64">64 GB RAM (Entusiasta)</option>
                    </select>
                  </div>

                  {/* Categoria da Placa de Vídeo */}
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">
                      Placa de Vídeo (Tier):
                    </label>
                    <select
                      value={hardware.gpuTier}
                      onChange={(e) => {
                        const tier = parseInt(e.target.value, 10);
                        const names = [
                          '',
                          'Gráficos Integrados (Intel UHD / Vega)',
                          'GeForce GTX 1650 / 1660 / RX 580',
                          'GeForce RTX 3060 / 4060 / RX 6600',
                          'GeForce RTX 4070 / 4080 / 4090'
                        ];
                        const newSpec = { ...hardware, gpuTier: tier, gpuName: names[tier], presetId: 'custom' };
                        setHardware(newSpec);
                        saveUserHardware(newSpec);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-cyan-500"
                    >
                      <option value="1">Tier 1: Integrada / Intel UHD / Vega</option>
                      <option value="2">Tier 2: GTX 1650 / 1660 / RX 580 / RTX 3050</option>
                      <option value="3">Tier 3: RTX 3060 / 4060 / RX 6600 / RTX 2060</option>
                      <option value="4">Tier 4: RTX 4070 / 4080 / 4090 / RX 7900</option>
                    </select>
                  </div>

                  {/* Tipo de Armazenamento */}
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">
                      Armazenamento Principal:
                    </label>
                    <select
                      value={hardware.storageType}
                      onChange={(e) => {
                        const newSpec = { ...hardware, storageType: e.target.value as 'hdd' | 'ssd', presetId: 'custom' };
                        setHardware(newSpec);
                        saveUserHardware(newSpec);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-cyan-500"
                    >
                      <option value="ssd">SSD (NVMe ou SATA - Rápido)</option>
                      <option value="hdd">HDD (Disco Rígido Mecânico)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveTab('test')}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all cursor-pointer"
                  >
                    Salvar e Testar Jogos
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
