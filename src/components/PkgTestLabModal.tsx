import React, { useState, useMemo, Component, ErrorInfo, ReactNode } from 'react';
import { 
  X, 
  ArrowLeft, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Star, 
  Layers, 
  HardDrive, 
  Gamepad2, 
  ShieldCheck, 
  Search, 
  Plus, 
  RotateCcw, 
  FileDown, 
  Info, 
  Tv, 
  Disc, 
  CheckCircle2, 
  Sparkles,
  Maximize2,
  RefreshCw,
  Globe,
  SlidersHorizontal,
  AlertCircle
} from 'lucide-react';
import { PkgGame, getStoredPkgGames, savePkgGames, resetPkgGamesToDefault } from '../data/pkgTestLabGames';
import { 
  pullGameDataFromSources, 
  convertScrapedToPkgGame, 
  ScrapedGameResult,
  KNOWN_SCRAPED_GAMES 
} from '../services/pkgScraperService';

interface PkgTestLabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Error Boundary para garantir que a tela NUNCA fique preta se houver qualquer erro
interface ErrorBoundaryProps {
  children: ReactNode;
  onReset: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class PkgLabErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('PkgTestLab Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center space-y-4 bg-slate-900 rounded-3xl border border-rose-500/40 text-slate-100">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Recuperação do Laboratório PKG</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Houve uma falha temporária ao carregar a lista de testes. Clique abaixo para restaurar o catálogo padrão de PS1, PS2 e PS3.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => {
                this.props.onReset();
                this.setState({ hasError: false });
              }}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              Restaurar Catálogo Padrão
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const PkgTestLabModal: React.FC<PkgTestLabModalProps> = ({ isOpen, onClose }) => {
  const [games, setGames] = useState<PkgGame[]>(() => {
    try {
      return getStoredPkgGames();
    } catch {
      return [];
    }
  });

  const [selectedPlatform, setSelectedPlatform] = useState<'ALL' | 'PS1' | 'PS2' | 'PS3'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<PkgGame | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  
  // Scraper Tool State
  const [showScraperTool, setShowScraperTool] = useState(false);
  const [scraperInput, setScraperInput] = useState('');
  const [scraperPlatform, setScraperPlatform] = useState<'PS1' | 'PS2' | 'PS3'>('PS2');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapedPreview, setScrapedPreview] = useState<ScrapedGameResult | null>(null);
  const [scraperFeedback, setScraperFeedback] = useState<string | null>(null);

  // Manual Add Form State
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualPlatform, setManualPlatform] = useState<'PS1' | 'PS2' | 'PS3'>('PS1');
  const [manualTitleId, setManualTitleId] = useState('');
  const [manualFileUrl, setManualFileUrl] = useState('');
  const [manualFileSize, setManualFileSize] = useState('');
  const [manualCoverUrl, setManualCoverUrl] = useState('');
  const [manualScreenshots, setManualScreenshots] = useState('');
  const [manualDescription, setManualDescription] = useState('');

  if (!isOpen) return null;

  // Filtro seguro contra propriedades nulas
  const filteredGames = games.filter(g => {
    if (!g) return false;
    if (selectedPlatform !== 'ALL' && g.platform !== selectedPlatform) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (g.title || '').toLowerCase().includes(q);
      const matchId = (g.titleId || '').toLowerCase().includes(q);
      const genresList = Array.isArray(g.genres) ? g.genres : [];
      const matchGenre = genresList.some(gen => (gen || '').toLowerCase().includes(q));
      if (!matchTitle && !matchId && !matchGenre) return false;
    }
    return true;
  });

  const handleCopy = (url: string) => {
    try {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // fallback
    }
  };

  // Puxar Dados Automáticos dos Sites (TheZukoStore + GameFAQs)
  const handleAutoPull = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!scraperInput.trim()) return;

    setIsScraping(true);
    setScraperFeedback(null);
    setScrapedPreview(null);

    try {
      const result = await pullGameDataFromSources(scraperInput, scraperPlatform);
      if (result) {
        setScrapedPreview(result);
        setScraperFeedback(`✓ Dados puxados com sucesso! Nome & Link PKG do TheZukoStore • Capa, 4 Screenshots e Sinopse do GameFAQs.`);
      } else {
        setScraperFeedback('Nenhum dado encontrado para a busca. Tente digitar o nome em inglês ou colar o link.');
      }
    } catch (err) {
      setScraperFeedback('Erro ao conectar com as fontes. Tente novamente.');
    } finally {
      setIsScraping(false);
    }
  };

  // Salvar Jogo Puxado no Catálogo de Testes
  const handleSaveScrapedGame = () => {
    if (!scrapedPreview) return;
    const newPkg = convertScrapedToPkgGame(scrapedPreview);
    const updated = [newPkg, ...games];
    setGames(updated);
    savePkgGames(updated);
    setSelectedGame(newPkg);
    setScrapedPreview(null);
    setShowScraperTool(false);
    setScraperInput('');
  };

  // Adicionar Manualmente
  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim() || !manualFileUrl.trim()) return;

    const screenshotsList = (manualScreenshots || '')
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.startsWith('http'));

    const newGame: PkgGame = {
      id: `pkg-${manualPlatform.toLowerCase()}-${Date.now()}`,
      title: manualTitle.trim(),
      platform: manualPlatform,
      titleId: manualTitleId.trim() || `${manualPlatform}-00000`,
      fileUrl: manualFileUrl.trim(),
      fileSize: manualFileSize.trim() || '1.0 GB',
      format: 'PKG',
      firmware: 'PS3 CFW / HEN 4.90+ (PKG)',
      region: 'NTSC-U',
      coverUrl: manualCoverUrl.trim() || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
      bannerUrl: manualCoverUrl.trim() || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      screenshots: screenshotsList.length >= 3 ? screenshotsList.slice(0, 4) : [
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80'
      ],
      description: manualDescription.trim() || `Sinopse GameFAQs: Clássico de ${manualPlatform} em formato PKG do TheZukoStore.`,
      releaseYear: new Date().getFullYear(),
      releaseDate: 'Original PlayStation Release',
      developer: 'Sony PlayStation Scene',
      publisher: 'TheZukoStore Archive',
      genres: ['Ação', 'Aventura', 'Clássico'],
      gamefaqsRating: 4.8,
      gamefaqsDifficulty: 'Just Right',
      ptBrSupport: true,
      zukoStorePageUrl: 'https://thezukostore.com',
      gamefaqsPageUrl: 'https://gamefaqs.gamespot.com',
      tags: [manualPlatform, 'PKG', 'TheZukoStore', 'GameFAQs']
    };

    const updated = [newGame, ...games];
    setGames(updated);
    savePkgGames(updated);
    setShowManualForm(false);
    setSelectedGame(newGame);
    // Limpar campos
    setManualTitle('');
    setManualTitleId('');
    setManualFileUrl('');
    setManualFileSize('');
    setManualCoverUrl('');
    setManualScreenshots('');
    setManualDescription('');
  };

  const handleResetCatalog = () => {
    if (window.confirm('Deseja restaurar a lista inicial completa de PS1, PS2 e PS3?')) {
      const def = resetPkgGamesToDefault();
      setGames(def);
      setSelectedGame(null);
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(games, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'thezukostore_gamefaqs_pkg_catalog.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getPlatformBadge = (platform: 'PS1' | 'PS2' | 'PS3') => {
    switch (platform) {
      case 'PS1':
        return 'bg-gradient-to-r from-sky-600 to-blue-700 text-white border-sky-400/30';
      case 'PS2':
        return 'bg-gradient-to-r from-blue-700 to-indigo-900 text-amber-300 border-indigo-400/30';
      case 'PS3':
        return 'bg-gradient-to-r from-rose-700 to-red-900 text-white border-red-400/30';
      default:
        return 'bg-slate-800 text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex justify-center items-start p-2 sm:p-4 md:p-6 animate-fadeIn">
      
      {/* Lightbox Modal para Screenshots */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out animate-fadeIn"
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <img 
              src={lightboxImage} 
              alt="Screenshot ampliada GameFAQs" 
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl border border-slate-700"
            />
            <button 
              onClick={() => setLightboxImage(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-white/20 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="block text-center text-xs text-slate-400 mt-2 font-mono">
              Screenshot autêntica do GameFAQs / GameSpot • Clique em qualquer lugar para fechar
            </span>
          </div>
        </div>
      )}

      {/* Main Container - sem my-auto para nunca colapsar ou sumir na tela */}
      <div className="w-full max-w-7xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-4 sm:my-8 text-slate-100">
        
        {/* Lab Top Bar */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 font-display">
                  AMBIENTE DE TESTES PKG • PLAYSTATION (PS1 • PS2 • PS3)
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  manof1@gmail.com (Criador)
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Arquivos do <strong>TheZukoStore.com</strong> • Capas, Fotos & Ficha do <strong>GameFAQs.gamespot.com</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Botão de Puxar Dados Automáticos dos Sites */}
            <button
              onClick={() => {
                setShowScraperTool(!showScraperTool);
                setShowManualForm(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                showScraperTool 
                  ? 'bg-cyan-500 text-slate-950 shadow-md' 
                  : 'bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/30'
              }`}
              title="Puxar dados automaticamente do TheZukoStore e GameFAQs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Puxar Dados dos Sites</span>
            </button>

            {/* Botão Manual */}
            <button
              onClick={() => {
                setShowManualForm(!showManualForm);
                setShowScraperTool(false);
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Cadastrar jogo manualmente"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* Exportar JSON */}
            <button
              onClick={handleExportJson}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Exportar catálogo em JSON"
            >
              <FileDown className="w-4 h-4" />
            </button>

            {/* Restaurar Padrão */}
            <button
              onClick={handleResetCatalog}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Restaurar catálogo inicial"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Fechar */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-400 transition-all cursor-pointer ml-1"
              title="Fechar Laboratório de Testes"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Ferramenta Interativa: PUXADOR AUTOMÁTICO DE DADOS (TheZukoStore + GameFAQs) */}
        {showScraperTool && (
          <div className="p-5 bg-slate-950/90 border-b border-cyan-500/30 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Sincronizador Inteligente: TheZukoStore + GameFAQs
                </h3>
                <p className="text-xs text-slate-400">
                  Digite o nome do jogo ou cole o link do TheZukoStore / GameFAQs. O sistema extrai automaticamente o link .pkg e as 4 fotos com sinopse!
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => setShowScraperTool(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕ Fechar
              </button>
            </div>

            <form onSubmit={handleAutoPull} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-7">
                <input
                  type="text"
                  value={scraperInput}
                  onChange={e => setScraperInput(e.target.value)}
                  placeholder="Ex: Silent Hill, God of War, Castlevania, ou cole o link da página..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={scraperPlatform}
                  onChange={e => setScraperPlatform(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="PS1">PlayStation 1 (PS1 PKG)</option>
                  <option value="PS2">PlayStation 2 (PS2 PKG)</option>
                  <option value="PS3">PlayStation 3 (PS3 PKG)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={isScraping || !scraperInput.trim()}
                  className="w-full h-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                  {isScraping ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  ) : (
                    <Search className="w-4 h-4 text-slate-950" />
                  )}
                  <span>{isScraping ? 'Puxando...' : 'Puxar Dados'}</span>
                </button>
              </div>
            </form>

            {/* Sugestões Rápidas de Jogos Indexados */}
            <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Sugestões rápidas:</span>
              {['Silent Hill', 'Castlevania SOTN', 'God of War II', 'GTA San Andreas', 'The Last of Us', 'Demons Souls'].map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => {
                    setScraperInput(sug);
                    pullGameDataFromSources(sug).then(res => {
                      if (res) {
                        setScrapedPreview(res);
                        setScraperFeedback(`✓ Encontrado: ${res.title} (${res.platform} PKG) com TheZukoStore + GameFAQs!`);
                      }
                    });
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 text-[11px] transition-all cursor-pointer border border-slate-700"
                >
                  {sug}
                </button>
              ))}
            </div>

            {/* Feedback Message */}
            {scraperFeedback && (
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{scraperFeedback}</span>
              </div>
            )}

            {/* Preview do Jogo Puxado antes de salvar */}
            {scrapedPreview && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/40 space-y-4 animate-fadeIn">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex gap-4">
                    <img 
                      src={scrapedPreview.coverUrl} 
                      alt={scrapedPreview.title} 
                      className="w-24 aspect-[3/4] object-cover rounded-xl border border-cyan-500/40 shadow-lg"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${getPlatformBadge(scrapedPreview.platform)}`}>
                          {scrapedPreview.platform} PKG
                        </span>
                        <span className="text-xs font-mono text-cyan-300 font-bold">
                          {scrapedPreview.titleId}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">
                          • {scrapedPreview.fileSize}
                        </span>
                      </div>
                      <h4 className="text-base font-black text-white">{scrapedPreview.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2 max-w-xl">{scrapedPreview.description}</p>
                      <div className="text-[11px] text-emerald-400 font-mono">
                        Link PKG TheZukoStore: {scrapedPreview.fileUrl}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSaveScrapedGame}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-lg shadow-cyan-500/25 flex items-center gap-2"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Adicionar ao Ambiente de Testes</span>
                    </button>
                  </div>
                </div>

                {/* 4 Screenshots Preview */}
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block mb-2 uppercase">
                    4 Fotos de Gameplay do GameFAQs / GameSpot:
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {(scrapedPreview.screenshots || []).map((shot, idx) => (
                      <div key={idx} className="aspect-video rounded-lg overflow-hidden border border-slate-700 bg-slate-950">
                        <img src={shot} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Cadastro Manual de Novo Jogo PKG */}
        {showManualForm && (
          <form onSubmit={handleManualAdd} className="p-5 bg-slate-950/80 border-b border-slate-800 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                Cadastrar Jogo PKG Manualmente
              </h3>
              <button 
                type="button" 
                onClick={() => setShowManualForm(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕ Cancelar
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nome do Jogo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Tekken 3 (PS1 PKG)"
                  value={manualTitle}
                  onChange={e => setManualTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Plataforma PKG</label>
                <select
                  value={manualPlatform}
                  onChange={e => setManualPlatform(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="PS1">PlayStation 1 (PS1 PKG)</option>
                  <option value="PS2">PlayStation 2 (PS2 PKG)</option>
                  <option value="PS3">PlayStation 3 (PS3 PKG)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Title ID</label>
                <input
                  type="text"
                  placeholder="Ex: SLUS-00402"
                  value={manualTitleId}
                  onChange={e => setManualTitleId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tamanho do Arquivo</label>
                <input
                  type="text"
                  placeholder="Ex: 500 MB ou 3.5 GB"
                  value={manualFileSize}
                  onChange={e => setManualFileSize(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Link do Arquivo .PKG (TheZukoStore)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://thezukostore.com/... ou link direto .pkg"
                  value={manualFileUrl}
                  onChange={e => setManualFileUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  URL da Capa do Jogo (GameFAQs)
                </label>
                <input
                  type="url"
                  placeholder="https://... capa oficial do GameFAQs"
                  value={manualCoverUrl}
                  onChange={e => setManualCoverUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Screenshots de Gameplay GameFAQs (1 URL por linha, 3 a 4 fotos)
                </label>
                <textarea
                  rows={2}
                  placeholder="https://...\nhttps://...\nhttps://..."
                  value={manualScreenshots}
                  onChange={e => setManualScreenshots(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Sinopse Oficial do Jogo (GameFAQs)
                </label>
                <textarea
                  rows={2}
                  placeholder="Texto oficial do GameFAQs sobre a história e gameplay..."
                  value={manualDescription}
                  onChange={e => setManualDescription(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer"
              >
                Salvar Jogo
              </button>
            </div>
          </form>
        )}

        {/* Corpo do Laboratório com Error Boundary */}
        <PkgLabErrorBoundary onReset={handleResetCatalog}>
          {selectedGame ? (
            /* Vista de Detalhes no "Lindo Modelo" com prioridade total no jogo */
            <div className="p-4 sm:p-6 md:p-8 space-y-6 animate-fadeIn">
              
              {/* Botão Voltar */}
              <button
                onClick={() => setSelectedGame(null)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar para o catálogo de jogos PKG</span>
              </button>

              {/* Hero / Banner Principal */}
              <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
                <div className="absolute inset-0 z-0">
                  <img 
                    src={selectedGame.bannerUrl || selectedGame.coverUrl} 
                    alt={selectedGame.title} 
                    className="w-full h-full object-cover opacity-25 filter blur-sm scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
                </div>

                <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start">
                  
                  {/* Capa Oficial GameFAQs */}
                  <div className="relative shrink-0 mx-auto md:mx-0 group">
                    <img
                      src={selectedGame.coverUrl}
                      alt={selectedGame.title}
                      className="w-44 sm:w-52 aspect-[3/4] object-cover rounded-2xl border-2 border-cyan-500/40 shadow-2xl shadow-cyan-500/10 group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg text-xs font-black shadow-md border ${getPlatformBadge(selectedGame.platform)}`}>
                      {selectedGame.platform} PKG
                    </span>
                  </div>

                  {/* Informações Centrais do Jogo */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                        ID: {selectedGame.titleId}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        Região {selectedGame.region || 'NTSC-U'}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {selectedGame.firmware || 'PKG Pronto'}
                      </span>
                      {selectedGame.ptBrSupport && (
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                          🇧🇷 PT-BR Disponível
                        </span>
                      )}
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-white font-display leading-tight">
                      {selectedGame.title}
                    </h2>

                    {/* Metadados GameFAQs */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span>{selectedGame.gamefaqsRating || 4.8} / 5</span>
                        <span className="text-[10px] text-amber-200/70 uppercase tracking-wider font-normal">
                          (GameFAQs Community)
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">
                        <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{selectedGame.fileSize} (TheZukoStore)</span>
                      </div>

                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">
                        <span>Ano: <strong>{selectedGame.releaseYear || 2000}</strong></span>
                      </div>
                    </div>

                    {/* Gêneros */}
                    <div className="flex flex-wrap gap-1.5">
                      {(selectedGame.genres || []).map(g => (
                        <span key={g} className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-800/80 text-slate-300 border border-slate-700/60">
                          {g}
                        </span>
                      ))}
                    </div>

                    {/* Ações de Download e Links */}
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <a
                        href={selectedGame.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 transition-all cursor-pointer transform hover:scale-[1.02]"
                      >
                        <Download className="w-4 h-4" />
                        <span>Baixar PKG (TheZukoStore • {selectedGame.fileSize})</span>
                      </a>

                      <button
                        onClick={() => handleCopy(selectedGame.fileUrl)}
                        className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-all cursor-pointer"
                        title="Copiar link direto do arquivo PKG"
                      >
                        {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                        <span>{copiedLink ? 'Link Copiado!' : 'Copiar Link PKG'}</span>
                      </button>

                      {selectedGame.gamefaqsPageUrl && (
                        <a
                          href={selectedGame.gamefaqsPageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3.5 py-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 text-xs font-bold text-slate-400 hover:text-white transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Ficha GameFAQs</span>
                        </a>
                      )}
                    </div>

                  </div>
                </div>
              </div>

              {/* Galeria de Fotos e Screenshots de Gameplay (3 a 4 Fotos GameFAQs) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-white font-display flex items-center gap-2">
                    <Tv className="w-4 h-4 text-cyan-400" />
                    Galeria de Fotos & Screenshots de Gameplay (GameFAQs / GameSpot)
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    {(selectedGame.screenshots || []).length} fotos autênticas • Clique para ampliar em tela cheia
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  {(selectedGame.screenshots || []).map((shot, idx) => (
                    <div
                      key={idx}
                      onClick={() => setLightboxImage(shot)}
                      className="relative group rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video cursor-zoom-in shadow-md hover:border-cyan-500/50 transition-all"
                    >
                      <img 
                        src={shot} 
                        alt={`${selectedGame.title} screenshot ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="p-2 rounded-xl bg-slate-900/90 text-cyan-400">
                          <Maximize2 className="w-4 h-4" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-[10px] font-mono text-slate-300">
                        Foto {idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sinopse & Ficha Técnica */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Sinopse GameFAQs */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-cyan-400">
                    <Info className="w-4 h-4" />
                    Sinopse & Análise Oficial (GameFAQs.gamespot.com)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                    {selectedGame.description}
                  </p>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
                    <span>Desenvolvedora: <strong className="text-slate-200">{selectedGame.developer || 'PlayStation Scene'}</strong></span>
                    <span>Publicadora: <strong className="text-slate-200">{selectedGame.publisher || 'TheZukoStore'}</strong></span>
                  </div>
                </div>

                {/* Especificações Técnicas PKG */}
                <div className="p-6 rounded-3xl bg-slate-950/60 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-indigo-400">
                    <Disc className="w-4 h-4" />
                    Ficha Técnica PKG (TheZukoStore)
                  </h3>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                      <span className="text-slate-400">Plataforma:</span>
                      <strong className="text-white">{selectedGame.platform}</strong>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                      <span className="text-slate-400">Title ID:</span>
                      <strong className="text-cyan-400 font-mono">{selectedGame.titleId}</strong>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                      <span className="text-slate-400">Tamanho:</span>
                      <strong className="text-white">{selectedGame.fileSize}</strong>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                      <span className="text-slate-400">Formato:</span>
                      <strong className="text-emerald-400">.PKG Instalável</strong>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                      <span className="text-slate-400">Origem:</span>
                      <strong className="text-white">TheZukoStore.com</strong>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-400">Dados & Fotos:</span>
                      <strong className="text-white">GameFAQs (GameSpot)</strong>
                    </div>
                  </div>

                  {/* Instruções de Instalação */}
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 space-y-1.5">
                    <p className="font-bold text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Como Instalar no Console:
                    </p>
                    <p className="text-slate-400 leading-tight">
                      1. Copie o arquivo .PKG para a pasta <code>/packages</code> em um pendrive formatado em FAT32 ou exFAT.
                    </p>
                    <p className="text-slate-400 leading-tight">
                      2. No PS3 com HEN ou CFW ativo, abra <strong>Package Manager &gt; Install Package Files &gt; Standard</strong>.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            /* Vista de Catálogo Completo no "Lindo Modelo" */
            <div className="p-4 sm:p-6 space-y-6">
              
              {/* Filtros e Busca */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Abas de Plataforma */}
                <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 w-full sm:w-auto overflow-x-auto">
                  <button
                    onClick={() => setSelectedPlatform('ALL')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedPlatform === 'ALL'
                        ? 'bg-cyan-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Todos ({games.length})
                  </button>
                  <button
                    onClick={() => setSelectedPlatform('PS1')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedPlatform === 'PS1'
                        ? 'bg-sky-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    PS1 Classics ({games.filter(g => g && g.platform === 'PS1').length})
                  </button>
                  <button
                    onClick={() => setSelectedPlatform('PS2')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedPlatform === 'PS2'
                        ? 'bg-indigo-700 text-amber-300 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    PS2 Classics ({games.filter(g => g && g.platform === 'PS2').length})
                  </button>
                  <button
                    onClick={() => setSelectedPlatform('PS3')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedPlatform === 'PS3'
                        ? 'bg-rose-700 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    PS3 PKG ({games.filter(g => g && g.platform === 'PS3').length})
                  </button>
                </div>

                {/* Barra de Busca */}
                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Buscar por título, ID ou gênero..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>

              </div>

              {/* Grid de Jogos PKG no Lindo Modelo */}
              {filteredGames.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-slate-950/40 border border-slate-800 space-y-2">
                  <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto" />
                  <h4 className="text-sm font-bold text-white">Nenhum jogo PKG encontrado</h4>
                  <p className="text-xs text-slate-400">Tente ajustar a busca ou use o botão "Puxar Dados dos Sites" acima.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                  {filteredGames.map(game => (
                    <div
                      key={game.id}
                      className="group relative rounded-2xl overflow-hidden bg-slate-950/70 border border-slate-800/80 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col"
                    >
                      {/* Box da Capa GameFAQs */}
                      <div 
                        onClick={() => setSelectedGame(game)}
                        className="relative aspect-[3/4] overflow-hidden cursor-pointer"
                      >
                        <img
                          src={game.coverUrl}
                          alt={game.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Selo da Plataforma */}
                        <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-lg text-[10px] font-black shadow-md border ${getPlatformBadge(game.platform)}`}>
                          {game.platform} PKG
                        </span>

                        {/* Title ID Chip */}
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-slate-900/90 text-cyan-300 border border-slate-700/80 shadow">
                          {game.titleId}
                        </span>

                        {/* Overlay Hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                          <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                            <Maximize2 className="w-3.5 h-3.5" />
                            Ver Ficha & 4 Fotos
                          </span>
                        </div>
                      </div>

                      {/* Box de Informações */}
                      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          {/* Nota & Tamanho */}
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="text-amber-400 font-bold flex items-center gap-1">
                              <Star className="w-3 h-3 fill-amber-400" />
                              {game.gamefaqsRating || 4.8}
                            </span>
                            <span className="text-slate-400 font-semibold flex items-center gap-1">
                              <HardDrive className="w-3 h-3 text-cyan-400" />
                              {game.fileSize}
                            </span>
                          </div>

                          {/* Título do Jogo */}
                          <h4 
                            onClick={() => setSelectedGame(game)}
                            className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2 cursor-pointer leading-tight"
                          >
                            {game.title}
                          </h4>

                          <span className="text-[10px] text-slate-500 block mt-1">
                            {(game.genres || []).slice(0, 2).join(' • ')}
                          </span>
                        </div>

                        {/* Botões de Ação */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                          <button
                            onClick={() => setSelectedGame(game)}
                            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <span>Ver Ficha & 4 Fotos</span>
                          </button>

                          <a
                            href={game.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-cyan-500/30"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Baixar PKG</span>
                          </a>
                        </div>

                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          )}
        </PkgLabErrorBoundary>

      </div>
    </div>
  );
};
