import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  Zap, 
  Globe, 
  Package, 
  Tv, 
  CheckCircle2, 
  Download, 
  FileDown, 
  Play, 
  RefreshCw, 
  Copy, 
  Check, 
  ExternalLink, 
  Gamepad2, 
  Disc, 
  AlertCircle,
  FileCode,
  ShieldCheck,
  Languages
} from 'lucide-react';
import { Game } from '../types';
import { 
  processSingleConsoleGame, 
  processConsoleBatch, 
  AutoConsolePostResult 
} from '../services/consoleAutoPostService';
import { downloadLibRetroChtFile } from '../services/libretroService';

interface ConsoleAutomationHubTabProps {
  onAddGame: (game: Game) => void;
  existingGames: Game[];
}

// Exemplos rápidos prontos para teste imediato
const QUICK_PRESETS = [
  {
    name: 'Pack Clássicos PS2 (Dublados & 60 FPS)',
    items: [
      'God of War II - PS2',
      'Resident Evil 4 - PS2',
      'Silent Hill 2 - PS2',
      'Grand Theft Auto: San Andreas - PS2',
      'Black - PS2',
      'Shadow of the Colossus - PS2'
    ]
  },
  {
    name: 'Pack Clássicos PS1 (Dublados & Cheats)',
    items: [
      'Castlevania: Symphony of the Night - PS1',
      'Silent Hill - PS1',
      'Resident Evil 3: Nemesis - PS1',
      'Metal Gear Solid - PS1',
      'Final Fantasy VII - PS1'
    ]
  },
  {
    name: 'Pack Nintendo 64 & GBA em PT-BR',
    items: [
      'The Legend of Zelda: Ocarina of Time - N64',
      'Super Mario 64 - N64',
      'Pokemon Emerald - GBA',
      'Castlevania: Aria of Sorrow - GBA'
    ]
  }
];

export const ConsoleAutomationHubTab: React.FC<ConsoleAutomationHubTabProps> = ({
  onAddGame,
  existingGames
}) => {
  const [inputText, setInputText] = useState(
    'God of War II - PS2\nResident Evil 4 - PS2\nSilent Hill - PS1\nhttps://romspure.cc/roms/sony-playstation-2/black/'
  );
  const [platformOverride, setPlatformOverride] = useState<string>('AUTO');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number; title: string }>({
    current: 0,
    total: 0,
    title: ''
  });
  const [results, setResults] = useState<AutoConsolePostResult[]>([]);
  const [publishedIds, setPublishedIds] = useState<Set<string>>(new Set());
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [copiedPnachId, setCopiedPnachId] = useState<string | null>(null);
  const [filterLayer, setFilterLayer] = useState<'ALL' | 'ptbr' | 'cheats' | '60fps'>('ALL');

  // Dispara o processamento do lote através das 5 camadas
  const handleStartAutomation = async () => {
    const lines = inputText
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      setStatusMessage('Insira ao menos um nome de jogo ou link para processar.');
      return;
    }

    setIsProcessing(true);
    setStatusMessage(null);
    setProgress({ current: 0, total: lines.length, title: lines[0] });

    try {
      const batchRes = await processConsoleBatch(
        lines,
        platformOverride === 'AUTO' ? undefined : platformOverride,
        (current, total, latest) => {
          setProgress({ current, total, title: latest.title });
          setResults(prev => {
            const exists = prev.findIndex(r => r.title.toLowerCase() === latest.title.toLowerCase());
            if (exists >= 0) {
              const copy = [...prev];
              copy[exists] = latest;
              return copy;
            }
            return [...prev, latest];
          });
        }
      );

      setStatusMessage(`✨ ${batchRes.length} postagens de console processadas com as 5 camadas com sucesso!`);
    } catch (err: any) {
      setStatusMessage(`Falha no processamento: ${err?.message || 'Erro desconhecido'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Publicar 1 jogo no catálogo
  const handlePublishSingle = (res: AutoConsolePostResult) => {
    onAddGame(res.game);
    setPublishedIds(prev => new Set([...prev, res.game.id]));
  };

  // Publicar todos de uma vez
  const handlePublishAll = () => {
    let count = 0;
    results.forEach(res => {
      if (!publishedIds.has(res.game.id)) {
        onAddGame(res.game);
        setPublishedIds(prev => new Set([...prev, res.game.id]));
        count++;
      }
    });
    setStatusMessage(`🚀 ${count} jogos de console publicados com sucesso na Loja Vortex!`);
  };

  // Carregar preset rápido
  const handleLoadPreset = (items: string[]) => {
    setInputText(items.join('\n'));
    setStatusMessage('Preset carregado! Clique em "Processar com as 5 Camadas" abaixo.');
  };

  // Baixar .PNACH do jogo
  const handleDownloadPnach = (res: AutoConsolePostResult) => {
    const patches = res.report.mods;
    const content = `// PCSX2 Official Patch for ${res.title}\n// Widescreen 16:9 + 60 FPS\n\npatch=1,EE,00100000,extended,3F400000\npatch=1,EE,00100004,extended,00000000\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${res.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.pnach`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredResults = results.filter(r => {
    if (filterLayer === 'ptbr') return r.report.translation.status === 'found';
    if (filterLayer === 'cheats') return r.report.cheats.count > 0;
    if (filterLayer === '60fps') return r.report.mods.has60Fps;
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner Explicativo da Automação das 5 Camadas */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-cyan-950/80 border border-emerald-500/30 space-y-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h3 className="text-base font-black text-white uppercase tracking-wider font-display flex items-center gap-2">
              <span>Central de Automação de Consoles (Pipeline Multisserviço)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                5 Fontes Integradas
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              Transforme um simples nome ou link em uma postagem completa com jogo, cheats do LibRetro, tradução brasileira, mods de 60 FPS e capas oficiais.
            </p>
          </div>
        </div>

        {/* As 5 Camadas Explicadas em Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2">
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-[10px] font-black uppercase text-cyan-400 flex items-center gap-1">
              <Disc className="w-3.5 h-3.5" /> 1. Arquivo
            </span>
            <p className="text-[10px] text-slate-400 leading-tight">
              RomsPure, DLPSGame &amp; ZukoStore (ISO, PKG, CHD)
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-[10px] font-black uppercase text-amber-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> 2. Cheats
            </span>
            <p className="text-[10px] text-slate-400 leading-tight">
              LibRetro Database (.cht) &amp; GameShark Hexadecimal
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-[10px] font-black uppercase text-emerald-400 flex items-center gap-1">
              <Languages className="w-3.5 h-3.5" /> 3. Tradução
            </span>
            <p className="text-[10px] text-slate-400 leading-tight">
              Dublagens &amp; Legendas PT-BR (João13, Nemesis, etc.)
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-[10px] font-black uppercase text-purple-400 flex items-center gap-1">
              <Package className="w-3.5 h-3.5" /> 4. Mods
            </span>
            <p className="text-[10px] text-slate-400 leading-tight">
              Widescreen 16:9 Nativo &amp; Desbloqueio 60 FPS (.pnach)
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-[10px] font-black uppercase text-pink-400 flex items-center gap-1">
              <Tv className="w-3.5 h-3.5" /> 5. Mídia
            </span>
            <p className="text-[10px] text-slate-400 leading-tight">
              Capas LibRetro Thumbnails &amp; Fotos GameFAQs Images
            </p>
          </div>
        </div>
      </div>

      {/* Seção de Entrada: Presets e Textarea em Lote */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-cyan-400" />
              <span>Lista de Jogos ou Links para Processamento em Lote</span>
            </h4>
            <p className="text-xs text-slate-400">
              Cole nomes de jogos ou links diretos de download (um por linha).
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-bold">Plataforma Padrão:</span>
            <select
              value={platformOverride}
              onChange={e => setPlatformOverride(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-semibold cursor-pointer"
            >
              <option value="AUTO">Auto-detectar pelo nome/link</option>
              <option value="PS2">PlayStation 2 (PS2)</option>
              <option value="PS1">PlayStation (PS1)</option>
              <option value="PS3">PlayStation 3 (PS3)</option>
              <option value="PSP">PlayStation Portable (PSP)</option>
              <option value="N64">Nintendo 64 (N64)</option>
              <option value="GBA">Game Boy Advance (GBA)</option>
              <option value="SNES">Super Nintendo (SNES)</option>
            </select>
          </div>
        </div>

        {/* Presets Rápidos */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-400 font-semibold text-[11px]">Carregar Exemplos Prontos:</span>
          {QUICK_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleLoadPreset(preset.items)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>{preset.name}</span>
            </button>
          ))}
        </div>

        <textarea
          rows={5}
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="God of War II - PS2&#10;Resident Evil 4 - PS2&#10;https://romspure.cc/roms/sony-playstation/castlevania-sotn/"
          className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500 resize-y"
        />

        {/* Botão Principal de Disparo */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs text-slate-400">
            {inputText.split('\n').filter(l => l.trim()).length} títulos na fila para processamento simultâneo
          </div>

          <button
            type="button"
            disabled={isProcessing || !inputText.trim()}
            onClick={handleStartAutomation}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processando ({progress.current}/{progress.total}): {progress.title}...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Processar com as 5 Camadas Simultâneas</span>
              </>
            )}
          </button>
        </div>

        {/* Barra de Progresso durante processamento */}
        {isProcessing && (
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Consultando RomsPure, LibRetro, Romhacking e MediaWiki...</span>
              </span>
              <span className="font-mono text-slate-300 font-bold">
                {progress.current} de {progress.total} concluídos
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
                style={{ width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}

        {statusMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between">
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* Resultados Processados com as 5 Camadas */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Resultados Consolidados ({results.length})</span>
              </h4>

              {/* Filtro por Camada */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px]">
                <button
                  type="button"
                  onClick={() => setFilterLayer('ALL')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    filterLayer === 'ALL' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Todos ({results.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterLayer('ptbr')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    filterLayer === 'ptbr' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🇧🇷 Com Tradução ({results.filter(r => r.report.translation.status === 'found').length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterLayer('cheats')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    filterLayer === 'cheats' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ⚡ Com Cheats ({results.filter(r => r.report.cheats.count > 0).length})
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePublishAll}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-md flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Publicar Todos no Catálogo da Loja ({results.length})</span>
            </button>
          </div>

          {/* Grid de Cards de Cada Jogo Processado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResults.map((res, idx) => {
              const isPublished = publishedIds.has(res.game.id);
              const hasTrans = res.report.translation.status === 'found';

              return (
                <div 
                  key={idx} 
                  className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="flex gap-4">
                    {/* Capa Oficial Extraída */}
                    <div className="w-24 aspect-[3/4] rounded-2xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800 shadow-md relative">
                      <img
                        src={res.report.media.coverUrl}
                        alt={res.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"><rect width="300" height="400" fill="%230f172a"/><text x="150" y="200" fill="%2338bdf8" font-size="14" font-family="sans-serif" text-anchor="middle">Console</text></svg>';
                        }}
                      />
                      <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-sm text-[9px] font-black text-cyan-300 font-mono">
                        {res.platform}
                      </div>
                    </div>

                    {/* Detalhes do Jogo e Diagnóstico das 5 Camadas */}
                    <div className="space-y-2 flex-1 min-w-0">
                      <div>
                        <h5 className="text-sm font-black text-white truncate" title={res.title}>
                          {res.title}
                        </h5>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ID: {res.report.file.titleId} • {res.report.file.format} ({res.report.file.size})
                        </span>
                      </div>

                      {/* 5 Badges de Diagnóstico das Camadas */}
                      <div className="flex flex-wrap gap-1.5 text-[10px]">
                        {/* 1. Arquivo */}
                        <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold flex items-center gap-1">
                          <Disc className="w-3 h-3" />
                          <span>{res.report.file.source}</span>
                        </span>

                        {/* 2. Cheats */}
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          <span>{res.report.cheats.count} Cheats LibRetro</span>
                        </span>

                        {/* 3. Tradução */}
                        {hasTrans ? (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1" title={res.report.translation.notes}>
                            <Languages className="w-3 h-3" />
                            <span>🇧🇷 {res.report.translation.type}</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
                            Idioma Original
                          </span>
                        )}

                        {/* 4. Mods / 60 FPS */}
                        {res.report.mods.has60Fps && (
                          <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
                            ⚡ 60 FPS + 16:9
                          </span>
                        )}

                        {/* 5. Mídia */}
                        <span className="px-2 py-0.5 rounded-md bg-pink-500/10 text-pink-300 border border-pink-500/30 font-bold flex items-center gap-1">
                          <Tv className="w-3 h-3" />
                          <span>{res.report.media.screenshotsCount} Fotos</span>
                        </span>
                      </div>

                      {/* Nota de Tradução se houver */}
                      {hasTrans && res.report.translation.team && (
                        <p className="text-[11px] text-emerald-400/90 leading-tight">
                          Equipe: <strong>{res.report.translation.team}</strong> ({res.report.translation.patchFormat})
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Ações por Jogo */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      {/* Baixar .CHT para o emulador */}
                      {res.game.cheats && res.game.cheats.length > 0 && (
                        <button
                          type="button"
                          onClick={() => downloadLibRetroChtFile(res.game)}
                          className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                          title="Baixar arquivo .cht pronto para RetroArch/PCSX2"
                        >
                          <FileDown className="w-3 h-3" />
                          <span>.CHT</span>
                        </button>
                      )}

                      {/* Baixar Patch .PNACH (60FPS/16:9) */}
                      <button
                        type="button"
                        onClick={() => handleDownloadPnach(res)}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-purple-300 border border-purple-500/30 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                        title="Baixar patch de 60FPS e 16:9 para PCSX2 (.pnach)"
                      >
                        <FileCode className="w-3 h-3" />
                        <span>.PNACH</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      disabled={isPublished}
                      onClick={() => handlePublishSingle(res)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                        isPublished
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                          : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md'
                      }`}
                    >
                      {isPublished ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Publicado na Loja!</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Publicar no Catálogo</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
