import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Zap, 
  Package, 
  CheckCircle2, 
  RefreshCw, 
  X, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  Flame,
  ArrowRight,
  Sliders,
  History,
  Check
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { SundaySyncInfo } from '../services/weeklyCheatsModsScheduler';

interface SundaySyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SundaySyncModal: React.FC<SundaySyncModalProps> = ({ isOpen, onClose }) => {
  const { 
    games, 
    sundaySyncInfo, 
    triggerSundayCheatsModsUpdate, 
    toggleSundaySyncActive 
  } = useGame();

  const [isUpdating, setIsUpdating] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [justFinished, setJustFinished] = useState(false);

  if (!isOpen) return null;

  const handleRunNow = () => {
    setIsUpdating(true);
    setProgressPercent(10);
    setProgressStatus('Iniciando varredura nos repositórios GameFAQs & Nexus Mods...');

    setTimeout(() => {
      setProgressPercent(40);
      setProgressStatus(`Sincronizando códigos e trainers para ${games.length} jogos...`);
    }, 400);

    setTimeout(() => {
      setProgressPercent(75);
      setProgressStatus('Aplicando pacotes de tradução PT-BR, 60 FPS e texturas 4K...');
    }, 800);

    setTimeout(() => {
      setProgressPercent(100);
      setProgressStatus('Finalizando gravação no banco de dados local & global...');
      triggerSundayCheatsModsUpdate(true);
      setIsUpdating(false);
      setJustFinished(true);

      setTimeout(() => {
        setJustFinished(false);
        setProgressPercent(0);
        setProgressStatus('');
      }, 4000);
    }, 1200);
  };

  const totalCheats = games.reduce((acc, g) => acc + (g.cheats?.length || 0), 0);
  const totalMods = games.reduce((acc, g) => acc + (g.mods?.length || 0), 0);
  const gamesWithBoth = games.filter(
    g => Array.isArray(g.cheats) && g.cheats.length > 0 && Array.isArray(g.mods) && g.mods.length > 0
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Decorativo */}
        <div className="relative p-6 bg-gradient-to-br from-amber-950/50 via-slate-900 to-cyan-950/40 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/30 text-slate-950">
                <Calendar className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-white font-display">
                    Atualização Semanal de Domingo
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Cheats & Mods
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Programação automática semanal para manter 100% dos jogos com Cheats ON e Mods ON
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          {/* Status Bar / Toggle da Programação */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-3.5 h-3.5 rounded-full ${sundaySyncInfo.enabled ? 'bg-emerald-400 shadow-[0_0_12px_#34d399]' : 'bg-slate-600'} animate-pulse`} />
              <div>
                <p className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Programação Semanal:</span>
                  <span className={sundaySyncInfo.enabled ? 'text-emerald-400' : 'text-slate-400'}>
                    {sundaySyncInfo.enabled ? 'ATIVADA (Todo Domingo às 00:00)' : 'PAUSADA'}
                  </span>
                </p>
                <p className="text-xs text-slate-400">
                  Todo domingo a rotina roda silenciosamente em background ao abrir o portal.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleSundaySyncActive}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                sundaySyncInfo.enabled
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{sundaySyncInfo.enabled ? 'Pausar Agendador' : 'Ativar Agendador'}</span>
            </button>
          </div>

          {/* Cards de Métricas em Grade */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Cobertura
              </span>
              <p className="text-lg font-black text-cyan-400 font-mono">
                {games.length > 0 ? `${Math.round((gamesWithBoth / games.length) * 100)}%` : '100%'}
              </p>
              <p className="text-[11px] text-slate-400">{gamesWithBoth} de {games.length} jogos</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Cheats ON
              </span>
              <p className="text-lg font-black text-amber-400 font-mono">{totalCheats}</p>
              <p className="text-[11px] text-slate-400">GameFAQs & WeMod</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Package className="w-3.5 h-3.5 text-orange-400" /> Mods ON
              </span>
              <p className="text-lg font-black text-orange-400 font-mono">{totalMods}</p>
              <p className="text-[11px] text-slate-400">Nexus Mods & PT-BR</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> Frequência
              </span>
              <p className="text-sm font-black text-white font-mono mt-1">7 Dias</p>
              <p className="text-[11px] text-slate-400">Aos Domingos</p>
            </div>
          </div>

          {/* Painel do Próximo e Último Domingo */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-2.5">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Última Execução:</span>
              </span>
              <span className="font-bold text-white font-mono">{sundaySyncInfo.lastSyncFormatted}</span>
            </div>

            <div className="flex items-center justify-between text-xs pt-0.5">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Próximo Domingo Agendado:</span>
              </span>
              <span className="font-bold text-cyan-300 font-mono">{sundaySyncInfo.nextSyncFormatted}</span>
            </div>
          </div>

          {/* Barra de Progresso durante Execução Manual */}
          {isUpdating && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  {progressStatus}
                </span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-cyan-400 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {justFinished && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-300 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-xs">
                <p className="font-bold">Atualização de Domingo Concluída com Sucesso!</p>
                <p className="text-slate-400 mt-0.5">
                  Todos os {games.length} jogos foram verificados e sincronizados com Cheats e Mods recentes.
                </p>
              </div>
            </div>
          )}

          {/* O que a rotina de domingo faz */}
          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Como funciona a Revisão Automática em Lote?
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ZERO TRABALHO MANUAL
              </span>
            </h4>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li>
                <strong className="text-slate-200">Sem Refazer Jogo por Jogo:</strong> O sistema varre e revisa 100% dos títulos do catálogo em bloco, categorizando automaticamente pela plataforma do jogo.
              </li>
              <li>
                <strong className="text-slate-200">Jogos Retrô / Emulação (PS1, PS2, PSP, GBA, SNES):</strong> Aplica os códigos autênticos da biblioteca comunitária <em>LibRetro Database</em> (GameShark, Action Replay e combinações clássicas).
              </li>
              <li>
                <strong className="text-slate-200">Jogos de PC Windows:</strong> Integra trainers verificados do <em>WeMod</em> (God Mode, munição infinita, recursos) e comandos reais de console nativo (~ tgm, tcl, etc.).
              </li>
              <li>
                <strong className="text-slate-200">Novas Dicas & Revisões:</strong> Quando surgir uma dica nova na internet, basta clicar no botão abaixo para revisar e sincronizar todo o acervo instantaneamente!
              </li>
            </ul>
          </div>

          {/* Histórico Recente de Execuções */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-cyan-400" />
              Histórico de Sincronizações
            </h4>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {sundaySyncInfo.logs.slice(0, 5).map(log => (
                <div 
                  key={log.id} 
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/70 text-xs flex items-start justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      {log.title}
                    </p>
                    <p className="text-[11px] text-slate-400">{log.detail}</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap shrink-0">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer com Ações */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-3 flex-wrap">
          <div className="text-xs text-slate-400">
            <span>Status: </span>
            <strong className="text-emerald-400">100% dos jogos ativos no portal</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Fechar
            </button>

            <button
              type="button"
              disabled={isUpdating}
              onClick={handleRunNow}
              className="px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
              <span>{isUpdating ? 'Sincronizando...' : 'Executar Atualização de Domingo Agora'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
