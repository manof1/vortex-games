import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import { 
  X, 
  ArrowLeft, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Star, 
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
  SlidersHorizontal,
  AlertCircle,
  Eye,
  Send,
  Edit3,
  Trash2,
  Image as ImageIcon,
  Zap,
  Package,
  Layers,
  ArrowRight,
  Bookmark
} from 'lucide-react';
import { PkgGame, getStoredPkgGames, savePkgGames, resetPkgGamesToDefault, updateStoredPkgGame, deleteStoredPkgGame } from '../data/pkgTestLabGames';
import { 
  pullGameDataFromSources, 
  convertScrapedToPkgGame, 
  ScrapedGameResult,
  KNOWN_SCRAPED_GAMES,
  extractCleanGameTitle,
  importCheatsFromGameFaqs,
  fetchNexusModsForGame,
  fetchGameFaqsBoxes,
  fetchGameFaqsImages
} from '../services/pkgScraperService';
import { GameCheat, GameMod } from '../types';

interface PkgTestLabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Error Boundary para garantir que a tela NUNCA fique preta
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
            Houve uma falha temporária. Clique abaixo para restaurar o catálogo padrão de PS1, PS2 e PS3.
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

  // Visão principal: 'catalog' | 'editor'
  const [currentTab, setCurrentTab] = useState<'catalog' | 'editor'>('catalog');
  // Modo no editor: 'form' | 'preview'
  const [editorSubTab, setEditorSubTab] = useState<'form' | 'preview'>('form');

  const [selectedPlatform, setSelectedPlatform] = useState<'ALL' | 'PS1' | 'PS2' | 'PS3' | 'PS4' | 'PS5' | 'PSP' | 'PS Vita' | string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<PkgGame | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCheatId, setCopiedCheatId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // ---- ESTADOS DO EDITOR / CRIADOR DE PUBLICAÇÃO ----
  const [editingGameId, setEditingGameId] = useState<string | null>(null);
  const [scraperInput, setScraperInput] = useState('');
  const [scraperPlatform, setScraperPlatform] = useState<string>('PS2');
  const [isScraping, setIsScraping] = useState(false);
  const [isImportingCheats, setIsImportingCheats] = useState(false);
  const [isSyncingMods, setIsSyncingMods] = useState(false);
  const [isFetchingBoxes, setIsFetchingBoxes] = useState(false);
  const [isFetchingImages, setIsFetchingImages] = useState(false);
  const [cheatCategoryFilter, setCheatCategoryFilter] = useState<string>('ALL');

  // Campos do formulário
  const [formTitle, setFormTitle] = useState('');
  const [formPlatform, setFormPlatform] = useState<string>('PS2');
  const [formTitleId, setFormTitleId] = useState('');
  const [formDownloadUrl, setFormDownloadUrl] = useState('');
  const [formFormat, setFormFormat] = useState<string>('PKG');
  const [formFileSize, setFormFileSize] = useState('1.5 GB');
  const [formCoverUrl, setFormCoverUrl] = useState('');
  const [coverCandidates, setCoverCandidates] = useState<string[]>([]);
  const [formGamefaqsBoxesUrl, setFormGamefaqsBoxesUrl] = useState<string>('');
  const [formGamefaqsImagesUrl, setFormGamefaqsImagesUrl] = useState<string>('');
  // 4 fotos da postagem
  const [formScreenshots, setFormScreenshots] = useState<string[]>([
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80'
  ]);
  const [screenshotCandidates, setScreenshotCandidates] = useState<string[]>([]);
  const [formDescription, setFormDescription] = useState('');
  const [formDeveloper, setFormDeveloper] = useState('');
  const [formPublisher, setFormPublisher] = useState('');
  const [formReleaseYear, setFormReleaseYear] = useState<number>(2004);
  const [formGenres, setFormGenres] = useState<string[]>(['Ação', 'Clássico']);
  const [formGamefaqsRating, setFormGamefaqsRating] = useState<number>(4.8);
  const [formPtBrSupport, setFormPtBrSupport] = useState<boolean>(true);
  const [formCheats, setFormCheats] = useState<GameCheat[]>([]);
  const [formGamefaqsCheatsUrl, setFormGamefaqsCheatsUrl] = useState('');
  const [formMods, setFormMods] = useState<GameMod[]>([]);
  const [formNexusModsUrl, setFormNexusModsUrl] = useState('');

  // Novo cheat manual
  const [newCheatTitle, setNewCheatTitle] = useState('');
  const [newCheatCode, setNewCheatCode] = useState('');
  const [newCheatCategory, setNewCheatCategory] = useState<string>('Geral');

  // Novo mod manual
  const [newModTitle, setNewModTitle] = useState('');
  const [newModNexusUrl, setNewModNexusUrl] = useState('');
  const [newModDesc, setNewModDesc] = useState('');

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Filtragem dos jogos no catálogo
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

  const handleCopyCheat = (cheatId: string, code: string) => {
    try {
      navigator.clipboard.writeText(code);
      setCopiedCheatId(cheatId);
      setTimeout(() => setCopiedCheatId(null), 2500);
    } catch {
      // fallback
    }
  };

  // Puxar Dados Automáticos do GameFAQs + TheZukoStore + Nexus Mods
  const handleAutoPull = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = customQuery || scraperInput;
    if (!query.trim()) return;

    setIsScraping(true);

    try {
      const result = await pullGameDataFromSources(query, scraperPlatform);
      if (result) {
        setFormTitle(result.title);
        setFormPlatform(result.platform);
        setFormTitleId(result.titleId);
        setFormDownloadUrl(result.fileUrl);
        setFormFormat(result.format || 'PKG');
        setFormFileSize(result.fileSize);
        setFormCoverUrl(result.coverUrl);
        setCoverCandidates(result.coverOptions || [result.coverUrl]);
        setFormGamefaqsBoxesUrl(result.gamefaqsBoxesUrl || '');
        setFormScreenshots(result.screenshots?.slice(0, 4) || []);
        setScreenshotCandidates(result.screenshotOptions || result.screenshots || []);
        setFormGamefaqsImagesUrl(result.gamefaqsImagesUrl || '');
        setFormDescription(result.description);
        setFormDeveloper(result.developer);
        setFormPublisher(result.publisher);
        setFormReleaseYear(result.releaseYear);
        setFormGenres(result.genres || ['Ação']);
        setFormGamefaqsRating(result.gamefaqsRating || 4.8);
        setFormPtBrSupport(result.ptBrSupport ?? true);
        setFormCheats(result.cheats || []);
        setFormGamefaqsCheatsUrl(result.gamefaqsCheatsUrl || '');
        setFormMods(result.mods || []);
        setFormNexusModsUrl(result.nexusModsUrl || `https://www.nexusmods.com/search/?gsearch=${encodeURIComponent(result.title)}`);

        showNotification(`✓ Dados puxados com sucesso! Ficha, Capa da aba Boxes, 4 Screenshots da aba Images e Cheats do GameFAQs.`);
      } else {
        showNotification('Nenhum dado encontrado para a busca. Preencha manualmente ou ajuste o termo.');
      }
    } catch (err) {
      showNotification('Erro ao conectar com as fontes. Tente novamente.');
    } finally {
      setIsScraping(false);
    }
  };

  // Buscar Capas da Seção Boxes do GameFAQs (gamefaqs.com/<console>/<jogo>/boxes)
  const handleFetchBoxesDirectly = async () => {
    const target = formGamefaqsBoxesUrl || formTitle || scraperInput;
    if (!target.trim()) {
      showNotification('Informe o título do jogo ou o link da seção Boxes no GameFAQs.');
      return;
    }
    setIsFetchingBoxes(true);
    try {
      const res = await fetchGameFaqsBoxes(target, formPlatform);
      if (res && res.covers && res.covers.length > 0) {
        setCoverCandidates(res.covers);
        setFormCoverUrl(res.covers[0]);
        setFormGamefaqsBoxesUrl(res.boxesUrl);
        showNotification(`📦 ${res.covers.length} Capas e Boxes autênticos puxados da seção Media > Boxes do GameFAQs!`);
      } else {
        showNotification('Nenhuma capa encontrada na seção Boxes do GameFAQs.');
      }
    } catch {
      showNotification('Falha ao conectar com a seção Boxes do GameFAQs.');
    } finally {
      setIsFetchingBoxes(false);
    }
  };

  // Buscar Fotos da Seção Images do GameFAQs (gamefaqs.com/<console>/<jogo>/images)
  const handleFetchImagesDirectly = async () => {
    const target = formGamefaqsImagesUrl || formTitle || scraperInput;
    if (!target.trim()) {
      showNotification('Informe o título do jogo ou o link da seção Images no GameFAQs.');
      return;
    }
    setIsFetchingImages(true);
    try {
      const res = await fetchGameFaqsImages(target, formPlatform);
      if (res && res.screenshots && res.screenshots.length > 0) {
        setScreenshotCandidates(res.screenshots);
        setFormGamefaqsImagesUrl(res.imagesUrl);
        showNotification(`📸 ${res.screenshots.length} Screenshots reais de gameplay puxados da seção Media > Images do GameFAQs!`);
      } else {
        showNotification('Nenhuma imagem encontrada na seção Images do GameFAQs.');
      }
    } catch {
      showNotification('Falha ao conectar com a seção Images do GameFAQs.');
    } finally {
      setIsFetchingImages(false);
    }
  };

  // Preencher os 4 slots de fotos automaticamente com as primeiras imagens da galeria do GameFAQs
  const handleAutoFillScreenshots = () => {
    const pool = screenshotCandidates.length > 0 ? screenshotCandidates : [
      'https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc93d2.jpg',
      'https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc93d3.jpg',
      'https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc93d4.jpg',
      'https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc93d5.jpg'
    ];
    setFormScreenshots([
      pool[0] || '',
      pool[1] || pool[0] || '',
      pool[2] || pool[0] || '',
      pool[3] || pool[0] || ''
    ]);
    showNotification('✓ Os 4 slots de fotos da postagem foram preenchidos com fotos do GameFAQs!');
  };

  // Importar Cheats Direto do GameFAQs (com limpeza de versões e subtítulos)
  const handleImportCheatsDirectly = async () => {
    const targetTitle = formTitle || scraperInput;
    if (!targetTitle.trim()) {
      showNotification('Digite ou informe o nome do jogo antes de importar cheats.');
      return;
    }
    setIsImportingCheats(true);
    try {
      const res = await importCheatsFromGameFaqs(targetTitle);
      if (res && res.cheats && res.cheats.length > 0) {
        setFormCheats(res.cheats);
        setFormGamefaqsCheatsUrl(res.gamefaqsCheatsUrl);
        showNotification(`⚡ ${res.cheats.length} Cheats e códigos completos importados direto do GameFAQs para "${res.queryUsed}"!`);
      } else {
        showNotification('Nenhum cheat encontrado no GameFAQs para este título.');
      }
    } catch {
      showNotification('Falha ao importar cheats do GameFAQs.');
    } finally {
      setIsImportingCheats(false);
    }
  };

  // Sincronizar Mods do Nexus Mods (seguindo a regra do nome limpo)
  const handleSyncNexusModsDirectly = async () => {
    const targetTitle = formTitle || scraperInput;
    if (!targetTitle.trim()) {
      showNotification('Digite ou informe o nome do jogo antes de buscar mods.');
      return;
    }
    setIsSyncingMods(true);
    try {
      const res = await fetchNexusModsForGame(targetTitle);
      if (res && res.mods && res.mods.length > 0) {
        setFormMods(res.mods);
        setFormNexusModsUrl(res.nexusModsUrl);
        showNotification(`🧩 ${res.mods.length} Mods populares sincronizados do Nexus Mods para "${res.queryUsed}"!`);
      } else {
        showNotification('Nenhum mod encontrado no Nexus Mods.');
      }
    } catch {
      showNotification('Falha ao buscar mods no Nexus Mods.');
    } finally {
      setIsSyncingMods(false);
    }
  };

  // Iniciar criação de novo jogo do zero
  const handleStartNewGame = () => {
    setEditingGameId(null);
    setFormTitle('');
    setFormPlatform('PS2');
    setFormTitleId('SCUS-' + Math.floor(10000 + Math.random() * 89999));
    setFormDownloadUrl('');
    setFormFormat('PKG');
    setFormFileSize('2.5 GB');
    setFormCoverUrl('https://images.igdb.com/igdb/image/upload/t_cover_big/co2044.jpg');
    setCoverCandidates([
      'https://images.igdb.com/igdb/image/upload/t_cover_big/co2044.jpg',
      'https://images.igdb.com/igdb/image/upload/t_cover_big/co1v6b.jpg',
      'https://images.igdb.com/igdb/image/upload/t_cover_big/co1t9c.jpg',
      'https://images.igdb.com/igdb/image/upload/t_cover_big/co1xbu.jpg'
    ]);
    setFormGamefaqsBoxesUrl('');
    setFormScreenshots([
      'https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc93d2.jpg',
      'https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc93d3.jpg',
      'https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc93d4.jpg',
      'https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc93d5.jpg'
    ]);
    setScreenshotCandidates([
      'https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc93d2.jpg',
      'https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc93d3.jpg',
      'https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc93d4.jpg',
      'https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc93d5.jpg',
      'https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc8p9f.jpg'
    ]);
    setFormGamefaqsImagesUrl('');
    setFormDescription('');
    setFormDeveloper('PlayStation Scene');
    setFormPublisher('TheZukoStore Archive');
    setFormReleaseYear(2004);
    setFormGenres(['Ação', 'Aventura']);
    setFormGamefaqsRating(4.8);
    setFormPtBrSupport(true);
    setFormCheats([]);
    setFormGamefaqsCheatsUrl('');
    setFormMods([]);
    setFormNexusModsUrl('');
    setScraperInput('');
    setCurrentTab('editor');
    setEditorSubTab('form');
  };

  // Carregar jogo existente para Edição Posterior
  const handleEditGame = (game: PkgGame) => {
    setEditingGameId(game.id);
    setFormTitle(game.title);
    setFormPlatform(game.platform);
    setFormTitleId(game.titleId);
    setFormDownloadUrl(game.fileUrl);
    setFormFormat(game.format || 'PKG');
    setFormFileSize(game.fileSize);
    setFormCoverUrl(game.coverUrl);
    setCoverCandidates(game.coverOptions && game.coverOptions.length > 0 ? game.coverOptions : [game.coverUrl, game.bannerUrl].filter(Boolean));
    setFormGamefaqsBoxesUrl(game.gamefaqsBoxesUrl || '');
    setFormScreenshots(game.screenshots?.slice(0, 4) || []);
    setScreenshotCandidates(game.screenshots || []);
    setFormGamefaqsImagesUrl(game.gamefaqsImagesUrl || '');
    setFormDescription(game.description.replace(/^Sinopse GameFAQs:\s*/i, ''));
    setFormDeveloper(game.developer || '');
    setFormPublisher(game.publisher || '');
    setFormReleaseYear(game.releaseYear || 2000);
    setFormGenres(game.genres || []);
    setFormGamefaqsRating(game.gamefaqsRating || 4.8);
    setFormPtBrSupport(game.ptBrSupport ?? true);
    setFormCheats(game.cheats || []);
    setFormGamefaqsCheatsUrl(game.gamefaqsCheatsUrl || '');
    setFormMods(game.mods || []);
    setFormNexusModsUrl(game.nexusModsUrl || '');
    setScraperInput(game.title);
    setSelectedGame(null);
    setCurrentTab('editor');
    setEditorSubTab('form');
  };

  // Excluir jogo do catálogo de testes
  const handleDeleteGame = (gameId: string, title: string) => {
    if (window.confirm(`Tem certeza que deseja remover "${title}" do catálogo de testes?`)) {
      const updated = deleteStoredPkgGame(gameId);
      setGames(updated);
      if (selectedGame?.id === gameId) {
        setSelectedGame(null);
      }
      showNotification(`Jogo "${title}" removido com sucesso.`);
    }
  };

  // BOTÃO ENVIAR / SALVAR PUBLICAÇÃO
  const handleSaveOrPublish = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formTitle.trim()) {
      alert('Por favor, informe o título do jogo.');
      return;
    }
    if (!formDownloadUrl.trim()) {
      alert('Por favor, adicione o Link de Download do jogo (TheZukoStore PKG, Torrent ou link direto).');
      return;
    }

    const cleanPlatform = formPlatform.toLowerCase().replace(/[^a-z0-9]/g, '');
    const targetId = editingGameId || `pkg-${cleanPlatform}-${Date.now()}`;
    const cleanScreenshots = formScreenshots.filter(s => s && s.trim().startsWith('http'));
    const finalScreenshots = cleanScreenshots.length >= 3 ? cleanScreenshots.slice(0, 4) : [
      'https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc93d2.jpg',
      'https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc93d3.jpg',
      'https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc93d4.jpg',
      'https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc93d5.jpg'
    ];

    const cleanDesc = formDescription.replace(/^Sinopse GameFAQs:\s*/i, '').trim();

    const savedGame: PkgGame = {
      id: targetId,
      title: formTitle.trim(),
      platform: formPlatform,
      titleId: formTitleId.trim() || `${formPlatform}-00000`,
      fileUrl: formDownloadUrl.trim(),
      fileSize: formFileSize.trim() || '1.0 GB',
      format: formFormat.trim().toUpperCase() || 'PKG',
      firmware: `${formPlatform} CFW / HEN / Oficial`,
      region: 'NTSC-U',
      coverUrl: formCoverUrl.trim() || 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2044.jpg',
      coverOptions: coverCandidates.length > 0 ? coverCandidates : undefined,
      bannerUrl: formScreenshots[0] || formCoverUrl.trim(),
      screenshots: finalScreenshots,
      description: cleanDesc || `${formTitle} em formato ${formFormat || 'PKG'} para ${formPlatform}.`,
      releaseYear: formReleaseYear,
      releaseDate: `${formReleaseYear}`,
      developer: formDeveloper.trim() || 'PlayStation Scene',
      publisher: formPublisher.trim() || 'TheZukoStore Archive',
      genres: formGenres.length > 0 ? formGenres : ['Ação', 'Clássico'],
      gamefaqsRating: formGamefaqsRating,
      gamefaqsDifficulty: 'Just Right',
      ptBrSupport: formPtBrSupport,
      zukoStorePageUrl: formDownloadUrl.trim(),
      gamefaqsPageUrl: `https://gamefaqs.gamespot.com/${cleanPlatform}/search?game=${encodeURIComponent(formTitle)}`,
      gamefaqsBoxesUrl: formGamefaqsBoxesUrl.trim() || undefined,
      gamefaqsImagesUrl: formGamefaqsImagesUrl.trim() || undefined,
      gamefaqsCheatsUrl: formGamefaqsCheatsUrl.trim() || `https://gamefaqs.gamespot.com/${cleanPlatform}/search?game=${encodeURIComponent(formTitle)}+cheats`,
      nexusModsUrl: formNexusModsUrl.trim() || `https://www.nexusmods.com/search/?gsearch=${encodeURIComponent(formTitle)}`,
      tags: [formPlatform, formFormat || 'PKG', 'TheZukoStore', 'GameFAQs'],
      cheats: formCheats,
      mods: formMods
    };

    const updatedCatalog = updateStoredPkgGame(savedGame);
    setGames(updatedCatalog);
    setSelectedGame(savedGame);
    setCurrentTab('catalog');
    showNotification(editingGameId ? `✓ Publicação de "${savedGame.title}" atualizada com sucesso!` : `🚀 Jogo "${savedGame.title}" enviado e publicado com sucesso no catálogo!`);
  };

  // Gerenciamento de Screenshots (4 slots)
  const handleUpdateScreenshotSlot = (index: number, url: string) => {
    const updated = [...formScreenshots];
    updated[index] = url;
    setFormScreenshots(updated);
  };

  // Adicionar Cheat Manual
  const handleAddManualCheat = () => {
    if (!newCheatTitle.trim() || !newCheatCode.trim()) return;
    const cheat: GameCheat = {
      id: `cheat-${Date.now()}`,
      title: newCheatTitle.trim(),
      codeOrEffect: newCheatCode.trim(),
      category: newCheatCategory,
      source: 'GameFAQs'
    };
    setFormCheats([...formCheats, cheat]);
    setNewCheatTitle('');
    setNewCheatCode('');
  };

  const handleRemoveCheat = (id: string) => {
    setFormCheats(formCheats.filter(c => c.id !== id));
  };

  // Adicionar Mod Manual
  const handleAddManualMod = () => {
    if (!newModTitle.trim() || !newModNexusUrl.trim()) return;
    const mod: GameMod = {
      id: `mod-${Date.now()}`,
      title: newModTitle.trim(),
      nexusUrl: newModNexusUrl.trim(),
      description: newModDesc.trim() || 'Mod oficial para aprimoramento do jogo via Nexus Mods.',
      category: 'Gameplay',
      downloadsCount: '10.2k'
    };
    setFormMods([...formMods, mod]);
    setNewModTitle('');
    setNewModNexusUrl('');
    setNewModDesc('');
  };

  const handleRemoveMod = (id: string) => {
    setFormMods(formMods.filter(m => m.id !== id));
  };

  const handleResetCatalog = () => {
    if (window.confirm('Deseja restaurar a lista inicial completa de PS1, PS2 e PS3?')) {
      const def = resetPkgGamesToDefault();
      setGames(def);
      setSelectedGame(null);
      showNotification('Catálogo restaurado para a versão padrão.');
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

  const getPlatformBadge = (platform: string) => {
    switch (platform) {
      case 'PS1':
        return 'bg-gradient-to-r from-sky-600 to-blue-700 text-white border-sky-400/30';
      case 'PS2':
        return 'bg-gradient-to-r from-blue-700 to-indigo-900 text-amber-300 border-indigo-400/30';
      case 'PS3':
        return 'bg-gradient-to-r from-rose-700 to-red-900 text-white border-red-400/30';
      case 'PS4':
        return 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-blue-400/30';
      case 'PS5':
        return 'bg-gradient-to-r from-slate-200 to-slate-400 text-slate-950 font-black border-white/60';
      case 'PSP':
        return 'bg-gradient-to-r from-teal-600 to-emerald-700 text-white border-emerald-400/30';
      case 'PS Vita':
        return 'bg-gradient-to-r from-purple-600 to-indigo-800 text-white border-purple-400/30';
      default:
        return 'bg-slate-800 text-white border-slate-700';
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
              Screenshot do GameFAQs / GameSpot • Clique em qualquer lugar para fechar
            </span>
          </div>
        </div>
      )}

      {/* Toast de Sucesso */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-[70] px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-emerald-600 text-white font-bold text-xs shadow-2xl flex items-center gap-2 border border-cyan-400/50 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Main Container */}
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
                  AMBIENTE DE TESTES & PUBLICAÇÃO PKG • PLAYSTATION
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  manof1@gmail.com (Criador)
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Downloads <strong>TheZukoStore</strong> • Ficha, Capa, Fotos & Cheats <strong>GameFAQs</strong> • Mods <strong>NexusMods</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            
            {/* Alternador de Abas Principais: Catálogo vs Criador/Editor */}
            <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800">
              <button
                onClick={() => {
                  setCurrentTab('catalog');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentTab === 'catalog'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Catálogo ({games.length})</span>
              </button>

              <button
                onClick={handleStartNewGame}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentTab === 'editor' && !editingGameId
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Nova Publicação</span>
              </button>

              {editingGameId && currentTab === 'editor' && (
                <button
                  onClick={() => setCurrentTab('editor')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 shadow-md flex items-center gap-1.5 animate-pulse"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editando Jogo</span>
                </button>
              )}
            </div>

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

        {/* ========================================================================= */}
        {/* VIEW 1: CRIADOR & EDITOR DE PUBLICAÇÃO COM PRÉVIA DA PÁGINA E ENVIAR       */}
        {/* ========================================================================= */}
        {currentTab === 'editor' && (
          <div className="p-4 sm:p-6 space-y-6 animate-fadeIn">
            
            {/* Header da Seção de Edição / Publicação */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                    {editingGameId ? 'Modo de Edição Posterior' : 'Nova Publicação PKG'}
                  </span>
                  <span className="text-xs text-slate-400">
                    {editingGameId ? 'Altere capas, fotos, link de download, cheats e mods' : 'Puxe os dados ou configure do seu jeito'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white font-display">
                  {formTitle || 'Nova Publicação de Jogo PKG'}
                </h2>
              </div>

              {/* Botões do Topo: Alternar Formulário vs Prévia da Página + Botão Enviar */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex p-1 rounded-xl bg-slate-950 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditorSubTab('form')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      editorSubTab === 'form' 
                        ? 'bg-cyan-500 text-slate-950 shadow-md' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Campos & Fotos</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditorSubTab('preview')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      editorSubTab === 'preview' 
                        ? 'bg-cyan-500 text-slate-950 shadow-md' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Prévia da Página</span>
                  </button>
                </div>

                {/* BOTÃO ENVIAR / SALVAR */}
                <button
                  type="button"
                  onClick={() => handleSaveOrPublish()}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-lg shadow-emerald-500/25 flex items-center gap-2 transform hover:scale-[1.02]"
                >
                  <Send className="w-4 h-4" />
                  <span>{editingGameId ? 'Salvar Alterações (Atualizar)' : 'Enviar / Publicar no Catálogo'}</span>
                </button>
              </div>
            </div>

            {/* BARRA INTELIGENTE DE PUXAR DADOS DO GAMEFAQS + THEZUKOSTORE */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/30 space-y-3 shadow-lg">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Puxador Automático de Dados: Digite o Nome do Jogo
                </span>
                <span className="text-[11px] text-slate-400">
                  Nome & Link PKG de <strong>TheZukoStore</strong> • Capa, 4 Fotos e Cheats de <strong>GameFAQs</strong> • Mods de <strong>NexusMods</strong>
                </span>
              </div>

              <form onSubmit={handleAutoPull} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-7">
                  <input
                    type="text"
                    value={scraperInput}
                    onChange={e => setScraperInput(e.target.value)}
                    placeholder="Digite o nome do jogo (ex: Grim Dawn: Definitive Edition, Resident Evil 4, God of War...)"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <select
                    value={scraperPlatform}
                    onChange={e => setScraperPlatform(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer font-medium"
                  >
                    <option value="PS1">PlayStation</option>
                    <option value="PS2">PlayStation 2</option>
                    <option value="PS3">PlayStation 3</option>
                    <option value="PS4">PlayStation 4</option>
                    <option value="PS5">PlayStation 5</option>
                    <option value="PSP">PlayStation Portable (PSP)</option>
                    <option value="PS Vita">PlayStation Vita</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <button
                    type="submit"
                    disabled={isScraping || !scraperInput.trim()}
                    className="w-full h-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                  >
                    {isScraping ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-slate-950" />
                    )}
                    <span>{isScraping ? 'Puxando do GameFAQs...' : 'Puxar Dados dos Sites'}</span>
                  </button>
                </div>
              </form>

              {/* Box Inteligente de Detecção de Título Limpo (Regra Grim Dawn: Definitive Edition / Grim Dawn) */}
              {(() => {
                const detected = extractCleanGameTitle(scraperInput);
                const hasNoise = detected.raw && (Boolean(detected.versionTag) || detected.primaryClean.toLowerCase() !== detected.raw.toLowerCase());
                if (!hasNoise) return null;
                return (
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-cyan-500/40 text-xs space-y-2 animate-fadeIn shadow-inner">
                    <div className="flex items-center gap-2 text-cyan-300 font-bold flex-wrap">
                      <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Filtro de Nome Limpo Ativado (Versão Removida):</span>
                      {detected.versionTag && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                          Versão ignorada: {detected.versionTag}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-slate-400">Clique para buscar:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setScraperInput(detected.primaryClean);
                          handleAutoPull(undefined, detected.primaryClean);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-bold border border-cyan-500/40 transition-all cursor-pointer flex items-center gap-1.5"
                        title="Buscar pelo nome do jogo e edição sem versão"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>1. Nome Limpo: <strong>"{detected.primaryClean}"</strong></span>
                      </button>
                      {detected.simplifiedClean !== detected.primaryClean && (
                        <button
                          type="button"
                          onClick={() => {
                            setScraperInput(detected.simplifiedClean);
                            handleAutoPull(undefined, detected.simplifiedClean);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500 text-indigo-300 hover:text-white font-bold border border-indigo-500/40 transition-all cursor-pointer flex items-center gap-1.5"
                          title="Buscar em último caso pelo nome base simplificado do jogo"
                        >
                          <Search className="w-3.5 h-3.5" />
                          <span>2. Em último caso: <strong>"{detected.simplifiedClean}"</strong></span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Sugestões Rápidas */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase mr-1">Sugestões de Teste:</span>
                {[
                  'Grim Dawn: Definitive Edition (v1.3.1.1 + All DLCs + Bonus Content + MULTi13)',
                  'Grim Dawn',
                  'Silent Hill',
                  'Castlevania SOTN',
                  'God of War II',
                  'The Last of Us'
                ].map(sug => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => {
                      setScraperInput(sug);
                      handleAutoPull(undefined, sug);
                    }}
                    className="px-2.5 py-0.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 text-[11px] transition-all cursor-pointer border border-slate-700/60"
                  >
                    {sug.length > 35 ? sug.slice(0, 32) + '...' : sug}
                  </button>
                ))}
              </div>
            </div>

            {/* SE SUBTAB FOR 'FORM': CAMPOS DE EDIÇÃO, CAPA, 4 FOTOS, CHEATS E MODS */}
            {editorSubTab === 'form' && (
              <div className="space-y-6">

                {/* 1. DADOS BÁSICOS & LINK DE DOWNLOAD */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2 text-cyan-400">
                    <HardDrive className="w-4 h-4" />
                    1. Dados do Jogo e Link de Download (TheZukoStore)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                        Título do Jogo / Postagem *
                      </label>
                      <input
                        type="text"
                        value={formTitle}
                        onChange={e => setFormTitle(e.target.value)}
                        placeholder="Ex: Grim Dawn: Definitive Edition, Resident Evil 4..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold focus:outline-none focus:border-cyan-500"
                      />
                      {(() => {
                        const ftClean = extractCleanGameTitle(formTitle);
                        const hasExtOrVersion = ftClean.raw && (Boolean(ftClean.versionTag) || Boolean(ftClean.fileExtension) || ftClean.primaryClean.toLowerCase() !== ftClean.raw.toLowerCase());
                        if (!hasExtOrVersion) return null;
                        return (
                          <div className="mt-1.5 flex items-center gap-1.5 flex-wrap text-[11px] text-cyan-300">
                            <span className="text-slate-400">Usar nome sem extensão:</span>
                            <button
                              type="button"
                              onClick={() => {
                                setFormTitle(ftClean.primaryClean);
                                if (!formDownloadUrl && ftClean.fileExtension) {
                                  // Mantém extensão associada
                                }
                              }}
                              className="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-bold border border-cyan-500/30 transition-all cursor-pointer"
                              title="Remover extensão e versão do título para manter limpo"
                            >
                              "{ftClean.primaryClean}"
                            </button>
                            {ftClean.fileExtension && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                Extensão detectada: {ftClean.fileExtension} (informada no arquivo de download)
                              </span>
                            )}
                            {ftClean.simplifiedClean !== ftClean.primaryClean && (
                              <button
                                type="button"
                                onClick={() => setFormTitle(ftClean.simplifiedClean)}
                                className="px-2 py-0.5 rounded bg-indigo-500/20 hover:bg-indigo-500 text-indigo-300 hover:text-white font-bold border border-indigo-500/30 transition-all cursor-pointer"
                              >
                                (Último caso: "{ftClean.simplifiedClean}")
                              </button>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                        Console PlayStation
                      </label>
                      <select
                        value={formPlatform}
                        onChange={e => setFormPlatform(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 cursor-pointer font-medium"
                      >
                        <option value="PS1">PlayStation</option>
                        <option value="PS2">PlayStation 2</option>
                        <option value="PS3">PlayStation 3</option>
                        <option value="PS4">PlayStation 4</option>
                        <option value="PS5">PlayStation 5</option>
                        <option value="PSP">PlayStation Portable (PSP)</option>
                        <option value="PS Vita">PlayStation Vita</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                        Title ID (ZukoStore)
                      </label>
                      <input
                        type="text"
                        value={formTitleId}
                        onChange={e => setFormTitleId(e.target.value)}
                        placeholder="Ex: SLUS-21134"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 font-mono font-bold focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    {/* CAMPO DEDICADO DO LINK DE DOWNLOAD COM INFORMAÇÃO DA EXTENSÃO AO LADO */}
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-emerald-400 uppercase mb-1 flex items-center justify-between flex-wrap gap-1">
                        <span>Link de Download do Arquivo *</span>
                        {(() => {
                          const urlExtMatch = formDownloadUrl.match(/\.(pkg|iso|bin|cue|rar|zip|7z|torrent|cso|chd)\b/i);
                          const detectedExt = urlExtMatch ? `.${urlExtMatch[1].toUpperCase()}` : (extractCleanGameTitle(formTitle || scraperInput).fileExtension || `.${formFormat.toUpperCase()}`);
                          return (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              [Detectado: {detectedExt}]
                            </span>
                          );
                        })()}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={formDownloadUrl}
                          onChange={e => {
                            const val = e.target.value;
                            setFormDownloadUrl(val);
                            const m = val.match(/\.(pkg|iso|bin|cue|rar|zip|7z|torrent|cso|chd)\b/i);
                            if (m) {
                              setFormFormat(m[1].toUpperCase());
                            }
                          }}
                          placeholder="https://thezukostore.com/ps2-pkg-exemplo.pkg ou link direto"
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-emerald-500/50 text-emerald-300 font-mono text-xs focus:outline-none focus:border-emerald-400"
                        />
                        {formDownloadUrl && (
                          <a
                            href={formDownloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-400 border border-slate-700 transition-all flex items-center gap-1"
                            title="Testar link no navegador"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Testar</span>
                          </a>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5 flex-wrap">
                        <span className="text-emerald-400 font-bold">✓ Padrão Recomendado:</span>
                        <span>O nome do jogo não contém extensões. O formato (.PKG, .ISO, etc.) é informado ao lado.</span>
                      </p>
                    </div>

                    {/* FORMATO DO ARQUIVO (ENTRE LINK DE DOWNLOAD E TAMANHO DO ARQUIVO) */}
                    <div>
                      <label className="block text-[10px] font-bold text-indigo-400 uppercase mb-1 flex items-center justify-between">
                        <span>Formato do Arquivo *</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold">
                          .{formFormat.toUpperCase()}
                        </span>
                      </label>
                      <select
                        value={formFormat}
                        onChange={e => setFormFormat(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-indigo-500/50 text-white font-bold text-xs focus:outline-none focus:border-indigo-400 cursor-pointer"
                      >
                        <option value="PKG">PKG (.pkg - Pacote PlayStation)</option>
                        <option value="ISO">ISO (.iso - Imagem de Disco)</option>
                        <option value="RAR">WinRAR / RAR (.rar - Compactado)</option>
                        <option value="TORRENT">Torrent (.torrent / Magnet)</option>
                        <option value="7Z">7-Zip (.7z - Compactação Ultra)</option>
                        <option value="ZIP">ZIP (.zip - Arquivo Compactado)</option>
                        <option value="BIN/CUE">BIN / CUE (.bin / .cue - CD/DVD)</option>
                        <option value="CSO">CSO (.cso - Imagem Comprimida PSP)</option>
                        <option value="CHD">CHD (.chd - Imagem Comprimida PS1/PS2)</option>
                      </select>
                      <div className="mt-1 flex items-center gap-1 flex-wrap">
                        {['PKG', 'ISO', 'RAR', 'TORRENT', '7Z', 'ZIP'].map(fmt => (
                          <button
                            key={fmt}
                            type="button"
                            onClick={() => setFormFormat(fmt)}
                            className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold transition-all cursor-pointer ${
                              formFormat.toUpperCase() === fmt
                                ? 'bg-indigo-500 text-white shadow-sm'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                            }`}
                          >
                            .{fmt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                        Tamanho do Arquivo
                      </label>
                      <input
                        type="text"
                        value={formFileSize}
                        onChange={e => setFormFileSize(e.target.value)}
                        placeholder="Ex: 4.2 GB"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. ESCOLHA DA FOTO DA CAPA (COVER DO GAMEFAQS - ABA MEDIA > BOXES) */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-cyan-400" />
                      <h3 className="text-sm font-black text-white uppercase tracking-wider text-cyan-400">
                        2. Escolha da Foto da Capa (Cover do GameFAQs - Aba Media &gt; Boxes)
                      </h3>
                    </div>
                    {formGamefaqsBoxesUrl && (
                      <a
                        href={formGamefaqsBoxesUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                        title="Ver todas as capas e boxes no GameFAQs"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Abrir Seção Media &gt; Boxes no GameFAQs</span>
                      </a>
                    )}
                  </div>

                  {/* Input direto do endereço de Boxes do GameFAQs */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                      <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                        <span>Endereço do Jogo no GameFAQs (Aba Media &gt; Boxes):</span>
                      </label>
                      <span className="text-[10px] text-cyan-400 font-mono">gamefaqs.gamespot.com/&lt;console&gt;/&lt;jogo&gt;/boxes</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={formGamefaqsBoxesUrl}
                        onChange={e => setFormGamefaqsBoxesUrl(e.target.value)}
                        placeholder={`https://gamefaqs.gamespot.com/${formPlatform.toLowerCase()}/915010-god-of-war-ii/boxes`}
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleFetchBoxesDirectly}
                        disabled={isFetchingBoxes || (!formGamefaqsBoxesUrl.trim() && !formTitle.trim() && !scraperInput.trim())}
                        className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-black text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                      >
                        {isFetchingBoxes ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5" />}
                        <span>{isFetchingBoxes ? 'Buscando...' : 'Buscar Boxes no GameFAQs'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    {/* Preview da Capa Selecionada */}
                    <div className="md:col-span-3 flex flex-col items-center p-3.5 rounded-2xl bg-slate-900 border border-cyan-500/30 text-center">
                      <span className="text-[10px] font-bold text-cyan-300 uppercase mb-2">Capa Atualmente Escolhida</span>
                      <div className="relative w-36 aspect-[3/4] rounded-xl overflow-hidden border-2 border-cyan-500 shadow-xl bg-slate-950">
                        <img
                          src={formCoverUrl || 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2044.jpg'}
                          alt="Capa do Jogo"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 p-1 rounded-full bg-cyan-500 text-slate-950 font-bold">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-2 font-mono truncate max-w-[140px]">
                        {formCoverUrl.split('/').pop()?.slice(0, 20)}...
                      </span>
                    </div>

                    {/* Opções de Capas Extraídas da seção Boxes do GameFAQs */}
                    <div className="md:col-span-9 space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[10px] font-bold text-slate-300 uppercase">
                            Opções de Capas da Seção Boxes do GameFAQs (Clique para selecionar):
                          </label>
                          <span className="text-[10px] text-slate-400">
                            {coverCandidates.length} opções disponíveis
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {(coverCandidates.length > 0 ? coverCandidates : [
                            'https://images.igdb.com/igdb/image/upload/t_cover_big/co1v6b.jpg',
                            'https://images.igdb.com/igdb/image/upload/t_cover_big/co2044.jpg',
                            'https://images.igdb.com/igdb/image/upload/t_cover_big/co1t9c.jpg',
                            'https://images.igdb.com/igdb/image/upload/t_cover_big/co1xbu.jpg'
                          ]).map((cand, idx) => {
                            const boxLabels = [
                              'Frontal US (NTSC-U)',
                              'Frontal Europa (PAL)',
                              'Frontal Japão (NTSC-J)',
                              'Verso da Caixa (Back Box)',
                              'Edição Especial'
                            ];
                            const label = boxLabels[idx] || `Box Art #${idx + 1}`;
                            const isSelected = formCoverUrl === cand;
                            return (
                              <div
                                key={idx}
                                onClick={() => setFormCoverUrl(cand)}
                                className={`group relative flex flex-col items-center p-2 rounded-xl bg-slate-900 border-2 cursor-pointer transition-all ${
                                  isSelected 
                                    ? 'border-cyan-400 ring-2 ring-cyan-400/50 scale-[1.02] shadow-lg shadow-cyan-500/20' 
                                    : 'border-slate-800 hover:border-slate-600 opacity-80 hover:opacity-100'
                                }`}
                              >
                                <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden mb-1.5 bg-slate-950">
                                  <img src={cand} alt={label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                  {isSelected && (
                                    <div className="absolute top-1.5 right-1.5 p-1 rounded-full bg-cyan-500 text-slate-950 font-black shadow-md">
                                      <Check className="w-3 h-3 stroke-[3]" />
                                    </div>
                                  )}
                                </div>
                                <span className={`text-[10px] font-bold text-center leading-tight ${isSelected ? 'text-cyan-300' : 'text-slate-400'}`}>
                                  {label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                          Ou Cole a URL Direta da Capa Desejada
                        </label>
                        <input
                          type="url"
                          value={formCoverUrl}
                          onChange={e => setFormCoverUrl(e.target.value)}
                          placeholder="https://gamefaqs.gamespot.com/.../boxart.jpg"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. ESCOLHA DAS 4 FOTOS DA POSTAGEM (SCREENSHOTS GAMEFAQS - ABA MEDIA > IMAGES) */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Tv className="w-4 h-4 text-cyan-400" />
                      <h3 className="text-sm font-black text-white uppercase tracking-wider text-cyan-400">
                        3. Escolha das 4 Fotos da Postagem (Screenshots GameFAQs - Aba Media &gt; Images)
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={handleAutoFillScreenshots}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                        title="Preencher os 4 slots de fotos automaticamente com as melhores imagens"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Preencher 4 Slots Automaticamente</span>
                      </button>

                      {formGamefaqsImagesUrl && (
                        <a
                          href={formGamefaqsImagesUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                          title="Ver todas as fotos de gameplay no GameFAQs"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Abrir Seção Media &gt; Images no GameFAQs</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Input do endereço da seção Media > Images no GameFAQs */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                      <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                        <span>Endereço do Jogo no GameFAQs (Aba Media &gt; Images):</span>
                      </label>
                      <span className="text-[10px] text-cyan-400 font-mono">gamefaqs.gamespot.com/&lt;console&gt;/&lt;jogo&gt;/images</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={formGamefaqsImagesUrl}
                        onChange={e => setFormGamefaqsImagesUrl(e.target.value)}
                        placeholder={`https://gamefaqs.gamespot.com/${formPlatform.toLowerCase()}/915010-god-of-war-ii/images`}
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleFetchImagesDirectly}
                        disabled={isFetchingImages || (!formGamefaqsImagesUrl.trim() && !formTitle.trim() && !scraperInput.trim())}
                        className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-black text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                      >
                        {isFetchingImages ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Tv className="w-3.5 h-3.5" />}
                        <span>{isFetchingImages ? 'Buscando...' : 'Buscar Fotos no GameFAQs'}</span>
                      </button>
                    </div>
                  </div>

                  {/* 4 Slots de Fotos da Postagem */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[0, 1, 2, 3].map(slotIdx => {
                      const photoUrl = formScreenshots[slotIdx] || '';
                      return (
                        <div key={slotIdx} className="p-3 rounded-2xl bg-slate-900 border border-slate-700/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-black uppercase text-cyan-400 flex items-center gap-1">
                              <span>Foto #{slotIdx + 1}</span>
                              {photoUrl && <Check className="w-3 h-3 text-emerald-400" />}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateScreenshotSlot(slotIdx, '')}
                              className="text-[10px] text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                            >
                              Limpar
                            </button>
                          </div>

                          <div 
                            onClick={() => photoUrl && setLightboxImage(photoUrl)}
                            className="aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-950 relative group cursor-zoom-in"
                          >
                            <img
                              src={photoUrl || 'https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc93d2.jpg'}
                              alt={`Foto ${slotIdx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-[10px] text-white font-bold bg-slate-900/80 px-2 py-1 rounded-md">Ampliar</span>
                            </div>
                          </div>

                          <input
                            type="url"
                            value={photoUrl}
                            onChange={e => handleUpdateScreenshotSlot(slotIdx, e.target.value)}
                            placeholder={`URL da Foto ${slotIdx + 1}`}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-[11px] text-white focus:outline-none focus:border-cyan-500 font-mono"
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Galeria de Fotos Extras Encontradas no GameFAQs Images */}
                  {screenshotCandidates.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-[11px] font-bold text-slate-300 block uppercase">
                          Fotos de Gameplay Encontradas na Seção Images do GameFAQs:
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Clique em um dos botões (1, 2, 3, 4) para definir o slot
                        </span>
                      </div>
                      <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        {screenshotCandidates.map((cand, idx) => (
                          <div
                            key={idx}
                            className="shrink-0 group relative aspect-video w-36 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shadow-md"
                          >
                            <img src={cand} alt={`Opção de Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                              <span className="text-[9px] font-bold text-cyan-300 uppercase">Definir como:</span>
                              <div className="flex gap-1">
                                {[0, 1, 2, 3].map(s => (
                                  <button
                                    key={s}
                                    type="button"
                                    onClick={() => handleUpdateScreenshotSlot(s, cand)}
                                    className="w-6 h-6 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-[11px] flex items-center justify-center shadow cursor-pointer"
                                    title={`Definir como Foto ${s + 1} da Postagem`}
                                  >
                                    {s + 1}
                                  </button>
                                ))}
                              </div>
                              <button
                                type="button"
                                onClick={() => setLightboxImage(cand)}
                                className="text-[9px] text-slate-300 hover:text-white underline cursor-pointer"
                              >
                                Ampliar
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. CAMPO DE CHEATS (GAMEFAQS) */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <h3 className="text-sm font-black text-white uppercase tracking-wider">
                        4. Cheats & Códigos (Puxados do GameFAQs)
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        {formCheats.length} cheats cadastrados
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        disabled={isImportingCheats || (!formTitle.trim() && !scraperInput.trim())}
                        onClick={handleImportCheatsDirectly}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-50 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                        title="Buscar e importar todos os cheats, códigos, senhas e segredos disponíveis no GameFAQs"
                      >
                        {isImportingCheats ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 fill-current" />}
                        <span>{isImportingCheats ? 'Buscando todos no GameFAQs...' : '⚡ Buscar TODOS os Cheats do GameFAQs'}</span>
                      </button>

                      {formGamefaqsCheatsUrl && (
                        <a
                          href={formGamefaqsCheatsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Abrir Seção Cheats no GameFAQs</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Filtro por Categorias de Cheats */}
                  {formCheats.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1 pb-1 border-b border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Filtrar Categoria:</span>
                      {['ALL', 'Geral', 'Armas', 'Vidas/Energia', 'Dinheiro', 'Desbloqueáveis', 'Segredos', 'Glitches', 'Senhas'].map(cat => {
                        const count = cat === 'ALL' 
                          ? formCheats.length 
                          : formCheats.filter(c => (c.category || 'Geral').toLowerCase() === cat.toLowerCase()).length;
                        if (cat !== 'ALL' && count === 0) return null;
                        const isSelected = cheatCategoryFilter === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setCheatCategoryFilter(cat)}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500 text-slate-950 shadow-sm'
                                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                            }`}
                          >
                            {cat === 'ALL' ? 'Todos' : cat} ({count})
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Lista de Cheats Existentes Filtrada */}
                  <div className="space-y-2">
                    {formCheats.length === 0 ? (
                      <div className="p-4 rounded-xl bg-slate-900 text-center text-xs text-slate-400">
                        Nenhum cheat adicionado ainda. Clique em "Buscar TODOS os Cheats do GameFAQs" acima para puxar os códigos e segredos completos.
                      </div>
                    ) : (
                      formCheats
                        .filter(ch => {
                          if (cheatCategoryFilter === 'ALL') return true;
                          return (ch.category || 'Geral').toLowerCase() === cheatCategoryFilter.toLowerCase();
                        })
                        .map((ch, idx) => (
                        <div key={ch.id || idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-3">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-white">{ch.title}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                {ch.category || 'Geral'}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">Fonte: {ch.source || 'GameFAQs'}</span>
                            </div>
                            <div className="text-xs font-mono font-bold text-emerald-400 bg-slate-950 p-2 rounded-lg border border-slate-800">
                              {ch.codeOrEffect}
                            </div>
                            {ch.description && (
                              <p className="text-[11px] text-slate-400">{ch.description}</p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveCheat(ch.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/30 text-slate-400 hover:text-rose-300 transition-all cursor-pointer"
                            title="Remover cheat"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Adicionar Novo Cheat Manualmente */}
                  <div className="pt-2 border-t border-slate-800/80 space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 block uppercase">
                      + Adicionar Cheat / Macete Manualmente:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                      <div className="sm:col-span-4">
                        <input
                          type="text"
                          value={newCheatTitle}
                          onChange={e => setNewCheatTitle(e.target.value)}
                          placeholder="Nome do Cheat (ex: Vida Infinita, Todas as Armas)"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div className="sm:col-span-5">
                        <input
                          type="text"
                          value={newCheatCode}
                          onChange={e => setNewCheatCode(e.target.value)}
                          placeholder="Código / Sequência de botões (ex: Cima, Baixo, L1, R1...)"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <select
                          value={newCheatCategory}
                          onChange={e => setNewCheatCategory(e.target.value as any)}
                          className="w-full px-2 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                        >
                          <option value="Geral">Geral</option>
                          <option value="Armas">Armas</option>
                          <option value="Veículos">Veículos</option>
                          <option value="Vidas/Energia">Vidas/Energia</option>
                          <option value="Dinheiro">Dinheiro</option>
                          <option value="Segredos">Segredos</option>
                          <option value="Desbloqueáveis">Desbloqueáveis</option>
                          <option value="Glitches">Glitches</option>
                          <option value="Senhas">Senhas</option>
                        </select>
                      </div>
                      <div className="sm:col-span-1">
                        <button
                          type="button"
                          onClick={handleAddManualCheat}
                          className="w-full h-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all cursor-pointer flex items-center justify-center"
                          title="Inserir cheat"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. CAMPO DE MODS (NEXUS MODS) */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-orange-400" />
                      <h3 className="text-sm font-black text-white uppercase tracking-wider">
                        5. Mods & Patches (Site Nexus Mods: nexusmods.com)
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                        {formMods.length} mods recomendados
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        disabled={isSyncingMods || (!formTitle.trim() && !scraperInput.trim())}
                        onClick={handleSyncNexusModsDirectly}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                        title="Buscar e sincronizar mods recomendados no Nexus Mods para este título"
                      >
                        {isSyncingMods ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Package className="w-3.5 h-3.5" />}
                        <span>{isSyncingMods ? 'Sincronizando do Nexus...' : '🧩 Sincronizar Mods do Nexus Mods'}</span>
                      </button>

                      <a
                        href={formNexusModsUrl || 'https://www.nexusmods.com'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Visitar Nexus Mods Oficial</span>
                      </a>
                    </div>
                  </div>

                  {/* Lista de Mods */}
                  <div className="space-y-2">
                    {formMods.length === 0 ? (
                      <div className="p-4 rounded-xl bg-slate-900 text-center text-xs text-slate-400">
                        Nenhum mod configurado. Puxe do Nexus Mods acima ou adicione abaixo.
                      </div>
                    ) : (
                      formMods.map((mod, idx) => (
                        <div key={mod.id || idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-3">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">{mod.title}</span>
                              <span className="text-[10px] px-2 py-0.2 rounded-md font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                                {mod.category || 'Gameplay'}
                              </span>
                              {mod.downloadsCount && (
                                <span className="text-[10px] text-slate-400">Downloads: {mod.downloadsCount}</span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-300">{mod.description}</p>
                            <a
                              href={mod.nexusUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>{mod.nexusUrl}</span>
                            </a>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveMod(mod.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/30 text-slate-400 hover:text-rose-300 transition-all cursor-pointer"
                            title="Remover mod"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Adicionar Mod Manualmente */}
                  <div className="pt-2 border-t border-slate-800/80 space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 block uppercase">
                      + Adicionar Mod do Nexus Mods Manualmente:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                      <div className="sm:col-span-4">
                        <input
                          type="text"
                          value={newModTitle}
                          onChange={e => setNewModTitle(e.target.value)}
                          placeholder="Nome do Mod (ex: 4K Textures, Tradução PT-BR)"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <input
                          type="url"
                          value={newModNexusUrl}
                          onChange={e => setNewModNexusUrl(e.target.value)}
                          placeholder="https://www.nexusmods.com/.../mods/..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <input
                          type="text"
                          value={newModDesc}
                          onChange={e => setNewModDesc(e.target.value)}
                          placeholder="Descrição do mod..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <button
                          type="button"
                          onClick={handleAddManualMod}
                          className="w-full h-full py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs transition-all cursor-pointer flex items-center justify-center"
                          title="Inserir mod"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6. SINOPSE & DETALHES TÉCNICOS */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2 text-cyan-400">
                    <Info className="w-4 h-4" />
                    6. Sinopse Oficial do Jogo (GameFAQs) & Dados Complementares
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                        Texto / Sinopse Oficial do Jogo (GameFAQs / GameSpot)
                      </label>
                      <textarea
                        rows={3}
                        value={formDescription}
                        onChange={e => setFormDescription(e.target.value)}
                        placeholder="Texto da sinopse oficial extraída do GameFAQs..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Ano de Lançamento</label>
                        <input
                          type="number"
                          value={formReleaseYear}
                          onChange={e => setFormReleaseYear(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nota GameFAQs</label>
                        <input
                          type="number"
                          step="0.1"
                          max="5.0"
                          value={formGamefaqsRating}
                          onChange={e => setFormGamefaqsRating(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 font-bold focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Desenvolvedora</label>
                        <input
                          type="text"
                          value={formDeveloper}
                          onChange={e => setFormDeveloper(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Publicadora</label>
                        <input
                          type="text"
                          value={formPublisher}
                          onChange={e => setFormPublisher(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOTÕES DE AÇÃO INFERIORES */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800 flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setEditorSubTab('preview')}
                    className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Exibir Prévia da Página</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentTab('catalog')}
                      className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                    >
                      Cancelar
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSaveOrPublish()}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-xl shadow-emerald-500/25 flex items-center gap-2 transform hover:scale-[1.02]"
                    >
                      <Send className="w-4 h-4" />
                      <span>{editingGameId ? '✓ Salvar Alterações (Atualizar Jogo)' : '🚀 Enviar / Publicar no Catálogo'}</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* SE SUBTAB FOR 'PREVIEW': PRÉVIA DA PÁGINA (COMO FICARÁ NO SITE) */}
            {editorSubTab === 'preview' && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Banner de Status da Prévia */}
                <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-2 text-cyan-300 font-semibold">
                    <Eye className="w-4 h-4 text-cyan-400" />
                    <span>Prévia em Tempo Real da Página do Jogo como ela aparecerá para os usuários</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditorSubTab('form')}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer"
                    >
                      ✏️ Voltar para Edição
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveOrPublish()}
                      className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs cursor-pointer shadow-md flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{editingGameId ? 'Salvar Alterações' : 'Enviar Publicação'}</span>
                    </button>
                  </div>
                </div>

                {/* HERO BANNER DA PRÉVIA */}
                <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
                  <div className="absolute inset-0 z-0">
                    <img 
                      src={formScreenshots[0] || formCoverUrl} 
                      alt={formTitle} 
                      className="w-full h-full object-cover opacity-25 filter blur-sm scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
                  </div>

                  <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start">
                    
                    {/* Capa Escolhida */}
                    <div className="relative shrink-0 mx-auto md:mx-0 group">
                      <img
                        src={formCoverUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80'}
                        alt={formTitle}
                        className="w-44 sm:w-52 aspect-[3/4] object-cover rounded-2xl border-2 border-cyan-500/40 shadow-2xl shadow-cyan-500/10"
                      />
                      <span className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg text-xs font-black shadow-md border ${getPlatformBadge(formPlatform)}`}>
                        {formPlatform} PKG
                      </span>
                    </div>

                    {/* Informações Principais */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                          ID: {formTitleId || `${formPlatform}-00000`}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          PKG Pronto (CFW / HEN)
                        </span>
                        {formPtBrSupport && (
                          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            🇧🇷 PT-BR
                          </span>
                        )}
                        {formCheats.length > 0 && (
                          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1 animate-pulse">
                            <Zap className="w-3 h-3" />
                            Cheats GameFAQs ({formCheats.length})
                          </span>
                        )}
                        {formMods.length > 0 && (
                          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            Nexus Mods ({formMods.length})
                          </span>
                        )}
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-black text-white font-display leading-tight">
                        {formTitle || 'Título da Publicação'}
                      </h2>

                      {/* Metadados GameFAQs */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span>{formGamefaqsRating.toFixed(1)} / 5</span>
                          <span className="text-[10px] text-amber-200/70 uppercase tracking-wider font-normal">
                            (GameFAQs Community)
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">
                          <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{formFileSize} (TheZukoStore)</span>
                        </div>

                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">
                          <span>Ano: <strong>{formReleaseYear}</strong></span>
                        </div>
                      </div>

                      {/* Gêneros */}
                      <div className="flex flex-wrap gap-1.5">
                        {formGenres.map((g, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-800/80 text-slate-300 border border-slate-700/60">
                            {g}
                          </span>
                        ))}
                      </div>

                      {/* Botões de Download da Prévia com Informação da Extensão ao Lado */}
                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        <a
                          href={formDownloadUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 transition-all cursor-pointer transform hover:scale-[1.02]"
                        >
                          <Download className="w-4 h-4" />
                          <span>Baixar {formFormat || 'PKG'} (TheZukoStore • {formFileSize})</span>
                        </a>

                        {/* Extensão e Informações do Arquivo informadas ao lado do download */}
                        {(() => {
                          const urlExtMatch = formDownloadUrl.match(/\.(pkg|iso|bin|cue|rar|zip|7z|torrent|cso|chd)\b/i);
                          const detectedExt = urlExtMatch ? `.${urlExtMatch[1].toUpperCase()}` : (extractCleanGameTitle(formTitle || scraperInput).fileExtension || `.${formFormat.toUpperCase()}`);
                          return (
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm" title="Extensão identificada para o arquivo de download">
                                <span className="text-slate-400 font-sans text-[10px] uppercase">Extensão:</span>
                                <strong>{detectedExt}</strong>
                              </span>
                              <span className="px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold">
                                Formato: .{formFormat.toUpperCase()} ({formPlatform})
                              </span>
                            </div>
                          );
                        })()}

                        <button
                          type="button"
                          onClick={() => handleCopy(formDownloadUrl)}
                          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-all cursor-pointer"
                        >
                          {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                          <span>{copiedLink ? 'Link Copiado!' : 'Copiar Link PKG'}</span>
                        </button>
                      </div>

                    </div>
                  </div>
                </div>

                {/* AS 4 FOTOS DA POSTAGEM NA PRÉVIA */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-white font-display flex items-center gap-2">
                      <Tv className="w-4 h-4 text-cyan-400" />
                      Galeria das 4 Fotos da Postagem (GameFAQs)
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      As 4 capturas selecionadas para a publicação
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    {formScreenshots.slice(0, 4).map((shot, idx) => (
                      <div
                        key={idx}
                        onClick={() => setLightboxImage(shot)}
                        className="relative group rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video cursor-zoom-in shadow-md hover:border-cyan-500/50 transition-all"
                      >
                        <img 
                          src={shot} 
                          alt={`Screenshot ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Maximize2 className="w-4 h-4 text-cyan-400" />
                        </div>
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-[10px] font-mono text-slate-300">
                          Foto {idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CHEATS & MODS NA PRÉVIA */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Seção Cheats */}
                  <div className="p-5 rounded-3xl bg-slate-950/60 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-white uppercase flex items-center gap-2 text-amber-400">
                        <Zap className="w-4 h-4" />
                        Cheats & Dicas (GameFAQs)
                      </h4>
                      <span className="text-xs text-amber-300 font-bold">{formCheats.length} códigos</span>
                    </div>

                    {formCheats.length === 0 ? (
                      <p className="text-xs text-slate-400">Nenhum cheat cadastrado para esta publicação.</p>
                    ) : (
                      <div className="space-y-2">
                        {formCheats.map((ch, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white">{ch.title}</span>
                              <span className="text-[10px] px-2 py-0.2 rounded font-bold bg-amber-500/10 text-amber-300">
                                {ch.category || 'Geral'}
                              </span>
                            </div>
                            <div className="text-xs font-mono font-bold text-emerald-400 bg-slate-950 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
                              <span>{ch.codeOrEffect}</span>
                              <button
                                type="button"
                                onClick={() => handleCopyCheat(ch.id || `${idx}`, ch.codeOrEffect)}
                                className="text-[10px] text-cyan-400 hover:text-cyan-300 font-sans"
                              >
                                {copiedCheatId === (ch.id || `${idx}`) ? 'Copiado!' : 'Copiar'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Seção Mods */}
                  <div className="p-5 rounded-3xl bg-slate-950/60 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-white uppercase flex items-center gap-2 text-orange-400">
                        <Package className="w-4 h-4" />
                        Mods & Patches Recomendados (Nexus Mods)
                      </h4>
                      <span className="text-xs text-orange-300 font-bold">{formMods.length} mods</span>
                    </div>

                    {formMods.length === 0 ? (
                      <p className="text-xs text-slate-400">Nenhum mod do Nexus Mods cadastrado.</p>
                    ) : (
                      <div className="space-y-2">
                        {formMods.map((mod, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white">{mod.title}</span>
                              <span className="text-[10px] px-2 py-0.2 rounded font-bold bg-orange-500/10 text-orange-300">
                                {mod.category || 'Gameplay'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-300">{mod.description}</p>
                            <a
                              href={mod.nexusUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 font-mono pt-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Abrir página do mod no nexusmods.com</span>
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                {/* Sinopse da Prévia */}
                <div className="p-6 rounded-3xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <Info className="w-3.5 h-3.5" />
                    Sinopse Oficial do Jogo
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                    {formDescription || 'Sem sinopse cadastrada.'}
                  </p>
                </div>

                {/* BOTÃO FINAL DE ENVIO NA PRÉVIA */}
                <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="text-base font-black text-white">Gostou da prévia?</h4>
                    <p className="text-xs text-slate-400">
                      Clique no botão para publicar esta versão com capa, 4 fotos, link e cheats no catálogo.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSaveOrPublish()}
                    className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm transition-all cursor-pointer shadow-xl shadow-emerald-500/30 flex items-center gap-2 transform hover:scale-[1.03]"
                  >
                    <Send className="w-5 h-5 stroke-[2.5]" />
                    <span>{editingGameId ? 'Salvar Alterações (Atualizar Jogo)' : 'Enviar e Publicar Agora'}</span>
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: CATÁLOGO DE TESTES (LISTA DE JOGOS COM EDITAR POSTERIOR)          */}
        {/* ========================================================================= */}
        {currentTab === 'catalog' && (
          <PkgLabErrorBoundary onReset={handleResetCatalog}>
            {selectedGame ? (
              /* Vista de Detalhes no "Lindo Modelo" com prioridade total no jogo */
              <div className="p-4 sm:p-6 md:p-8 space-y-6 animate-fadeIn">
                
                {/* Barra de Navegação: Voltar & Editar Jogo */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedGame(null)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar para o catálogo de jogos PKG</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {/* Botão de Edição Posterior a partir do Jogo Aberto */}
                    <button
                      onClick={() => handleEditGame(selectedGame)}
                      className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editar Esta Publicação</span>
                    </button>

                    <button
                      onClick={() => handleDeleteGame(selectedGame.id, selectedGame.title)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/30 text-xs font-bold transition-all cursor-pointer"
                      title="Excluir este jogo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

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
                        {selectedGame.cheats && selectedGame.cheats.length > 0 && (
                          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                            <Zap className="w-3 h-3 text-amber-400" />
                            Cheats ({selectedGame.cheats.length})
                          </span>
                        )}
                        {selectedGame.mods && selectedGame.mods.length > 0 && (
                          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30 flex items-center gap-1">
                            <Package className="w-3 h-3 text-orange-400" />
                            Nexus Mods ({selectedGame.mods.length})
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

                      {/* Ações de Download e Links com Extensão ao Lado */}
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

                        {/* Extensão Informada ao Lado do Arquivo de Download */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm">
                            <span className="text-slate-400 font-sans text-[10px] uppercase">Extensão:</span>
                            <strong>.{selectedGame.format || 'PKG'}</strong>
                          </span>
                          <span className="px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold">
                            {selectedGame.platform} PKG Direct
                          </span>
                        </div>

                        <button
                          onClick={() => handleCopy(selectedGame.fileUrl)}
                          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-all cursor-pointer"
                          title="Copiar link direto do arquivo PKG"
                        >
                          {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                          <span>{copiedLink ? 'Link Copiado!' : 'Copiar Link PKG'}</span>
                        </button>

                        <button
                          onClick={() => handleEditGame(selectedGame)}
                          className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-md"
                          title="Editar título, fotos, link, cheats ou mods"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar Publicação</span>
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

                {/* Galeria de Fotos e Screenshots de Gameplay (4 Fotos GameFAQs) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-white font-display flex items-center gap-2">
                      <Tv className="w-4 h-4 text-cyan-400" />
                      Galeria de Fotos & Screenshots de Gameplay (GameFAQs / GameSpot)
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      {(selectedGame.screenshots || []).length} fotos autênticas • Clique para ampliar
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
                          <Maximize2 className="w-4 h-4 text-cyan-400" />
                        </div>
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-[10px] font-mono text-slate-300">
                          Foto {idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SEÇÃO DE CHEATS & MODS DO JOGO SELECIONADO */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Cheats GameFAQs */}
                  <div className="p-6 rounded-3xl bg-slate-950/60 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-amber-400">
                        <Zap className="w-4 h-4" />
                        Cheats & Códigos (GameFAQs.gamespot.com)
                      </h3>
                      {selectedGame.gamefaqsCheatsUrl && (
                        <a
                          href={selectedGame.gamefaqsCheatsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Ver Cheats GameFAQs</span>
                        </a>
                      )}
                    </div>

                    {(!selectedGame.cheats || selectedGame.cheats.length === 0) ? (
                      <p className="text-xs text-slate-400">Nenhum cheat registrado para este jogo. Clique em "Editar Publicação" para adicionar.</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedGame.cheats.map((ch, idx) => (
                          <div key={ch.id || idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white">{ch.title}</span>
                              <span className="text-[10px] px-2 py-0.2 rounded font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                {ch.category || 'Geral'}
                              </span>
                            </div>
                            <div className="text-xs font-mono font-bold text-emerald-400 bg-slate-950 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
                              <span>{ch.codeOrEffect}</span>
                              <button
                                type="button"
                                onClick={() => handleCopyCheat(ch.id, ch.codeOrEffect)}
                                className="text-[10px] text-cyan-400 hover:text-cyan-300 font-sans cursor-pointer"
                              >
                                {copiedCheatId === ch.id ? '✓ Copiado' : 'Copiar'}
                              </button>
                            </div>
                            {ch.description && <p className="text-[11px] text-slate-400">{ch.description}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Mods Nexus Mods */}
                  <div className="p-6 rounded-3xl bg-slate-950/60 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-orange-400">
                        <Package className="w-4 h-4" />
                        Mods & Patches (NexusMods.com)
                      </h3>
                      {selectedGame.nexusModsUrl && (
                        <a
                          href={selectedGame.nexusModsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-orange-400 hover:text-orange-300 flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Hub Nexus Mods</span>
                        </a>
                      )}
                    </div>

                    {(!selectedGame.mods || selectedGame.mods.length === 0) ? (
                      <p className="text-xs text-slate-400">Nenhum mod do Nexus Mods cadastrado para este jogo. Clique em "Editar Publicação" para adicionar.</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedGame.mods.map((mod, idx) => (
                          <div key={mod.id || idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white">{mod.title}</span>
                              <span className="text-[10px] px-2 py-0.2 rounded font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                                {mod.category || 'Gameplay'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-300">{mod.description}</p>
                            <a
                              href={mod.nexusUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1 pt-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>{mod.nexusUrl}</span>
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                {/* Sinopse & Ficha Técnica */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Sinopse GameFAQs */}
                  <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-950/60 border border-slate-800 space-y-3">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-cyan-400">
                      <Info className="w-4 h-4" />
                      Sinopse do Jogo
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
                        <strong className="text-emerald-400 font-mono">.{(selectedGame.format || 'PKG').toUpperCase()} ({selectedGame.platform})</strong>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                        <span className="text-slate-400">Origem Arquivo:</span>
                        <strong className="text-white">TheZukoStore.com</strong>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-slate-400">Dados & Fotos:</span>
                        <strong className="text-white">GameFAQs (GameSpot)</strong>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => handleEditGame(selectedGame)}
                        className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Editar Dados Deste Jogo</span>
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            ) : (
              /* Vista de Catálogo de Jogos com Botões de Editar Posterior */
              <div className="p-4 sm:p-6 space-y-6">
                
                {/* Filtros e Busca */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  
                  {/* Abas de Plataforma */}
                  <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 w-full sm:w-auto overflow-x-auto">
                    {[
                      { id: 'ALL', label: `Todos (${games.length})`, activeCls: 'bg-cyan-500 text-slate-950 shadow-md' },
                      { id: 'PS1', label: `PlayStation (${games.filter(g => g && g.platform === 'PS1').length})`, activeCls: 'bg-sky-600 text-white shadow-md' },
                      { id: 'PS2', label: `PlayStation 2 (${games.filter(g => g && g.platform === 'PS2').length})`, activeCls: 'bg-indigo-700 text-amber-300 shadow-md' },
                      { id: 'PS3', label: `PlayStation 3 (${games.filter(g => g && g.platform === 'PS3').length})`, activeCls: 'bg-rose-700 text-white shadow-md' },
                      { id: 'PS4', label: `PlayStation 4 (${games.filter(g => g && g.platform === 'PS4').length})`, activeCls: 'bg-blue-600 text-white shadow-md' },
                      { id: 'PS5', label: `PlayStation 5 (${games.filter(g => g && g.platform === 'PS5').length})`, activeCls: 'bg-slate-300 text-slate-950 shadow-md' },
                      { id: 'PSP', label: `PSP (${games.filter(g => g && g.platform === 'PSP').length})`, activeCls: 'bg-teal-700 text-white shadow-md' },
                      { id: 'PS Vita', label: `PS Vita (${games.filter(g => g && g.platform === 'PS Vita').length})`, activeCls: 'bg-purple-700 text-white shadow-md' },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setSelectedPlatform(tab.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                          selectedPlatform === tab.id
                            ? tab.activeCls
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Barra de Busca + Botão Nova Publicação */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
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

                    <button
                      onClick={handleStartNewGame}
                      className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">Nova Publicação</span>
                    </button>
                  </div>

                </div>

                {/* Grid de Jogos PKG com Opção de Editar Posterior */}
                {filteredGames.length === 0 ? (
                  <div className="p-12 text-center rounded-3xl bg-slate-950/40 border border-slate-800 space-y-3">
                    <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto" />
                    <h4 className="text-sm font-bold text-white">Nenhum jogo PKG encontrado</h4>
                    <p className="text-xs text-slate-400">Tente ajustar a busca ou use o botão "+ Nova Publicação" acima.</p>
                    <button
                      onClick={handleStartNewGame}
                      className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                    >
                      + Criar Publicação Agora
                    </button>
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
                            {game.platform} {game.format || 'PKG'}
                          </span>

                          {/* Title ID Chip */}
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-slate-900/90 text-cyan-300 border border-slate-700/80 shadow">
                            {game.titleId}
                          </span>

                          {/* Selos de Cheats e Mods no Card */}
                          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-1 pointer-events-none">
                            {game.cheats && game.cheats.length > 0 && (
                              <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-500/90 text-slate-950 shadow-md flex items-center gap-0.5">
                                <Zap className="w-2.5 h-2.5 fill-slate-950" />
                                <span>Cheats ON</span>
                              </span>
                            )}
                            {game.mods && game.mods.length > 0 && (
                              <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-orange-500/90 text-slate-950 shadow-md flex items-center gap-0.5 ml-auto">
                                <Package className="w-2.5 h-2.5" />
                                <span>Mods ON</span>
                              </span>
                            )}
                          </div>

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

                          {/* Botões de Ação: Ver Ficha & EDITAR POSTERIOR */}
                          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                            <div className="grid grid-cols-2 gap-1.5">
                              <button
                                onClick={() => setSelectedGame(game)}
                                className="py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                              >
                                <span>Ver</span>
                              </button>

                              {/* BOTÃO EDITAR POSTERIOR */}
                              <button
                                onClick={() => handleEditGame(game)}
                                className="py-1.5 px-2 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/30 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                                title="Editar esta postagem posteriormente"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>Editar</span>
                              </button>
                            </div>

                            <a
                              href={game.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 text-xs font-black transition-all cursor-pointer flex items-center justify-between gap-1.5 border border-cyan-500/30"
                              title={`Baixar arquivo .${game.format || 'PKG'} no TheZukoStore`}
                            >
                              <div className="flex items-center gap-1.5">
                                <Download className="w-3.5 h-3.5" />
                                <span>Baixar PKG</span>
                              </div>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950/80 text-emerald-300 border border-emerald-500/30">
                                .{game.format || 'PKG'}
                              </span>
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
        )}

      </div>
    </div>
  );
};
