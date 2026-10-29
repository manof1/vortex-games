import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Globe, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Zap, 
  Languages, 
  Database, 
  GitBranch, 
  RefreshCw,
  Sliders
} from 'lucide-react';
import { Game, SourceScanResult } from '../types';
import { scanSourceUrl, applyScanResultToGame, persistGameToDatabase, generateGithubGamePayload } from '../services/sourceScannerService';
import { cleanGameTitle } from '../utils/cheatsModsGenerator';

interface SourceScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game;
  onGameUpdated: (updatedGame: Game) => void;
}

export const SourceScannerModal: React.FC<SourceScannerModalProps> = ({
  isOpen,
  onClose,
  game,
  onGameUpdated
}) => {
  const [sourceUrl, setSourceUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<SourceScanResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [copiedGithub, setCopiedGithub] = useState(false);
  const [activeTab, setActiveTab] = useState<'result' | 'github'>('result');

  if (!isOpen) return null;

  // Sugestões rápidas de URLs para o jogo atual
  const quickUrls = [
    {
      label: 'PCGamingWiki Oficial',
      url: `https://www.pcgamingwiki.com/wiki/${encodeURIComponent(game.title.replace(/\s+/g, '_'))}`,
      icon: '🌐'
    },
    {
      label: 'Tribo Gamer (Traduções PT-BR)',
      url: `https://tribogamer.com/traducoes/busca?q=${encodeURIComponent(game.title)}`,
      icon: '🇧🇷'
    },
    {
      label: 'WeMod Trainers',
      url: `https://www.wemod.com/cheats/${encodeURIComponent(cleanGameTitle(game.title))}`,
      icon: '⚡'
    },
    {
      label: 'Nexus Mods',
      url: `https://www.nexusmods.com/search/?gsearch=${encodeURIComponent(cleanGameTitle(game.title))}`,
      icon: '📦'
    },
    {
      label: 'LibRetro Cheats DB (GitHub)',
      url: `https://github.com/libretro/libretro-database/tree/master/cht`,
      icon: '👾'
    }
  ];

  const handleStartScan = async (urlToScan?: string) => {
    const target = (urlToScan || sourceUrl).trim();
    if (!target) {
      setErrorMessage('Por favor, digite ou cole uma URL válida.');
      return;
    }

    setErrorMessage(null);
    setSaveSuccessMessage(null);
    setIsScanning(true);

    try {
      const result = await scanSourceUrl(target, game);
      setScanResult(result);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao realizar a varredura da fonte.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleApplyAndSave = async () => {
    if (!scanResult) return;
    setIsSaving(true);
    try {
      const updated = applyScanResultToGame(game, scanResult);
      const res = await persistGameToDatabase(updated);
      onGameUpdated(updated);
      setSaveSuccessMessage(res.message);
      setTimeout(() => setSaveSuccessMessage(null), 5000);
    } catch (err: any) {
      setErrorMessage('Erro ao persistir no banco de dados: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyGithubJson = () => {
    const payload = generateGithubGamePayload(scanResult ? applyScanResultToGame(game, scanResult) : game);
    navigator.clipboard.writeText(payload);
    setCopiedGithub(true);
    setTimeout(() => setCopiedGithub(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-blue-950/50 via-slate-900 to-indigo-950/50 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-slate-950">
              <Search className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white font-display">
                  Varredor & Verificador de Fontes
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  ADM / CRIADOR
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Cole qualquer link externo para verificar veracidade, extrair localizações e cheats para <strong>{game.title}</strong>
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

        {/* Corpo com Scroll */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          {/* Campo de Input da URL */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>URL da Fonte / Site para Varredura:</span>
              <span className="text-[11px] text-cyan-400">Ex: PCGamingWiki, Tribo Gamer, Nexus Mods, Wiki</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={sourceUrl}
                  onChange={e => setSourceUrl(e.target.value)}
                  placeholder="https://www.pcgamingwiki.com/wiki/..."
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all font-mono"
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleStartScan();
                  }}
                />
              </div>

              <button
                type="button"
                disabled={isScanning || !sourceUrl.trim()}
                onClick={() => handleStartScan()}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-xs transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50 shrink-0"
              >
                <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
                <span>{isScanning ? 'Verificando...' : 'Iniciar Varredura'}</span>
              </button>
            </div>

            {/* Sugestões Rápidas de Links */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-[11px] text-slate-400 font-bold">Atalhos para este jogo:</span>
              {quickUrls.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSourceUrl(item.url);
                    handleStartScan(item.url);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-all flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Feedback de erro */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Feedback de sucesso */}
          {saveSuccessMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{saveSuccessMessage}</span>
            </div>
          )}

          {/* Loading de Varredura */}
          {isScanning && (
            <div className="p-8 rounded-3xl bg-slate-950/60 border border-slate-800 text-center space-y-3 animate-pulse">
              <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
              <p className="text-sm font-bold text-white">Analisando e verificando a fonte em tempo real...</p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Consultando banco de dados técnico, checando veracidade e extraindo tabela de localizações e cheats.
              </p>
            </div>
          )}

          {/* Resultado da Varredura */}
          {scanResult && !isScanning && (
            <div className="space-y-5 animate-in fade-in">
              {/* Card de Classificação e Veracidade */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                    scanResult.veracityStatus === 'VERIFICADO_UTIL' 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase text-white">Status da Fonte:</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        scanResult.veracityStatus === 'VERIFICADO_UTIL'
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-amber-500 text-slate-950'
                      }`}>
                        {scanResult.veracityStatus === 'VERIFICADO_UTIL' ? 'Verificado & Útil' : 'Parcialmente Útil'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Domínio: <strong className="text-slate-200">{scanResult.domain}</strong> • Confiança: <strong className="text-cyan-400">{scanResult.confidenceScore}%</strong>
                    </p>
                  </div>
                </div>

                <a
                  href={scanResult.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Abrir Link Original</span>
                </a>
              </div>

              {/* Resumo da Análise */}
              <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-1.5">
                <h5 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Diagnóstico da Fonte:
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {scanResult.summary}
                </p>
              </div>

              {/* Quadro de Localizações (Padrão PCGamingWiki) */}
              {scanResult.extractedLocalizations && scanResult.extractedLocalizations.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                      <Languages className="w-4 h-4 text-indigo-400" />
                      <span>Matriz de Localizações Extraída (Padrão PCGamingWiki)</span>
                    </h5>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {scanResult.extractedLocalizations.length} idiomas indexados
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 font-mono uppercase text-[10px]">
                        <tr>
                          <th className="p-3">Idioma</th>
                          <th className="p-3 text-center">UI</th>
                          <th className="p-3 text-center">Áudio</th>
                          <th className="p-3 text-center">Legendas</th>
                          <th className="p-3">Notas & Patches</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-200">
                        {scanResult.extractedLocalizations.map((loc, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                            <td className="p-3 font-medium flex items-center gap-2">
                              <span>{loc.flag}</span>
                              <span>{loc.language}</span>
                            </td>
                            <td className="p-3 text-center">
                              {loc.ui ? <span className="text-emerald-400 font-bold">✓</span> : <span className="text-slate-600">—</span>}
                            </td>
                            <td className="p-3 text-center">
                              {loc.audio ? <span className="text-emerald-400 font-bold">✓</span> : <span className="text-slate-600">—</span>}
                            </td>
                            <td className="p-3 text-center">
                              {loc.sub ? <span className="text-emerald-400 font-bold">✓</span> : <span className="text-slate-600">—</span>}
                            </td>
                            <td className="p-3 text-slate-400 text-[11px]">
                              <span>{loc.notes || 'Oficial'}</span>
                              {loc.patchUrl && (
                                <a
                                  href={loc.patchUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-2 inline-flex items-center gap-1 text-cyan-400 hover:underline font-bold"
                                >
                                  <span>Baixar Patch</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Cheats & Comandos Extraídos */}
              {scanResult.extractedCheats && scanResult.extractedCheats.length > 0 && (
                <div className="space-y-3">
                  <h5 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>Cheats & Comandos de Console Extraídos ({scanResult.extractedCheats.length})</span>
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {scanResult.extractedCheats.map((c, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{c.title}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                            {c.category || 'Geral'}
                          </span>
                        </div>
                        <p className="font-mono text-xs text-emerald-400 bg-slate-900 p-2 rounded-lg break-all select-all">
                          {c.codeOrEffect}
                        </p>
                        {c.description && <p className="text-[11px] text-slate-400">{c.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer com Ações */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between gap-3 flex-wrap">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Banco de Dados: </span>
            <strong className="text-emerald-400">Supabase & Local Ativos</strong>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleCopyGithubJson}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700 cursor-pointer"
              title="Copiar JSON estruturado pronto para enviar ao GitHub"
            >
              {copiedGithub ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <GitBranch className="w-3.5 h-3.5 text-indigo-400" />}
              <span>{copiedGithub ? '✓ JSON Copiado!' : 'Exportar p/ GitHub'}</span>
            </button>

            {scanResult && (
              <button
                type="button"
                disabled={isSaving}
                onClick={handleApplyAndSave}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
              >
                <Database className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Gravando...' : 'Aplicar & Salvar no Banco'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
