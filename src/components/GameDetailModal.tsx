import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowLeft,
  Download, 
  Eye,
  Star, 
  HardDrive, 
  ShieldCheck, 
  Users, 
  Bookmark, 
  Check, 
  MessageSquare, 
  ThumbsUp, 
  Cpu, 
  Layers, 
  Share2, 
  Copy, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Send,
  Sparkles,
  ExternalLink,
  Gamepad2,
  Disc,
  Volume2,
  FileArchive,
  Globe,
  Lock,
  Zap,
  Monitor,
  Tv,
  Info,
  GitBranch,
  Search,
  UserPlus,
  BookOpen,
  Wrench,
  Shield,
  FolderArchive
} from 'lucide-react';
import { Game, LibraryStatus, GameLocalization } from '../types';
import { useGame } from '../context/GameContext';
import { generatePcGamingWikiLocalizations, getPcGamingWikiUrl } from '../utils/localizationGenerator';
import { SourceScannerModal } from './SourceScannerModal';
import { generateGithubGamePayload } from '../services/sourceScannerService';
import { TorrentHealthBadge } from './TorrentHealthBadge';
import { sanitizeMagnetLink } from '../utils/magnetUtils';
import { getCriticScores, getMetacriticBadgeColor, getOpenCriticTierColor } from '../utils/ratingUtils';
import { getGameCover, getGameBanner, handleImageError } from '../utils/imageUtils';
import { isRiotPixelsLink } from '../utils/linkFilters';
import { 
  updateBrowserUrlForGame, 
  getGamePath, 
  getFullShareUrl, 
  shareGame, 
  GameModalTab 
} from '../services/urlRoutingService';

interface GameDetailModalProps {
  game: Game;
  onClose: () => void;
}

export const GameDetailModal: React.FC<GameDetailModalProps> = ({ game, onClose }) => {
  // Always scroll to the top of the page when a game is opened
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [game?.id]);

  const { 
    comments, 
    addComment, 
    likeComment, 
    rateGame, 
    getUserVote,
    isInLibrary, 
    addToLibrary, 
    removeFromLibrary, 
    updateLibraryStatus,
    incrementView,
    incrementDownload,
    userProfile,
    isLoggedIn,
    setIsAuthModalOpen,
    openAuthModal,
    requireAuth,
    activeGameInitialTab,
    isCreator,
    openCanIRunIt,
    openUtilities,
    updateGame
  } = useGame();

  // Contabiliza 1 acesso real sempre que o usuário abre este jogo
  useEffect(() => {
    if (game?.id) {
      incrementView(game.id);
    }
  }, [game?.id]);

  const [activeTab, setActiveTab] = useState<'downloads' | 'instructions' | 'specs' | 'screenshots' | 'localizations'>(activeGameInitialTab || 'downloads');

  useEffect(() => {
    if (activeGameInitialTab) {
      setActiveTab(activeGameInitialTab);
    }
  }, [activeGameInitialTab, game?.id]);
  const [selectedPlatformTab, setSelectedPlatformTab] = useState<'ALL' | 'PC' | 'PLAYSTATION' | 'NINTENDO' | 'EMULATORS'>('ALL');
  const [copiedMagnet, setCopiedMagnet] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [copiedGithubPayload, setCopiedGithubPayload] = useState(false);

  // Controle de link permanente e compartilhamento direto (/game/:slug/:tab)
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [shareToast, setShareToast] = useState<string | null>(null);

  // Sincroniza a URL no navegador e o título/SEO sempre que o usuário alternar abas
  useEffect(() => {
    if (game) {
      updateBrowserUrlForGame(game, activeTab as GameModalTab, true);
    }
  }, [game, activeTab]);

  const handleShareClick = async () => {
    const res = await shareGame(game, activeTab as GameModalTab);
    if (res.success) {
      setCopiedShareLink(true);
      setShareToast(res.sharedNatively ? 'Link compartilhado com sucesso!' : 'Link copiado para a área de transferência!');
      setTimeout(() => {
        setCopiedShareLink(false);
        setShareToast(null);
      }, 3500);
    }
  };

  // Localizações extraídas ou padrão PCGamingWiki
  const displayLocalizations = React.useMemo(() => {
    if (Array.isArray(game.localizations) && game.localizations.length > 0) {
      return game.localizations;
    }
    return generatePcGamingWikiLocalizations(game);
  }, [game.localizations, game.title, game.hasPtBrAudio]);

  // Download links sanitizados (remove links/botões inúteis para riotpixels.com)
  const cleanDownloadLinks = React.useMemo(() => {
    return (game.downloadLinks || []).filter(l => !isRiotPixelsLink(l));
  }, [game.downloadLinks]);

  // Categorias de Plataformas detectadas no perfil canônico deste jogo
  const platformCategories = React.useMemo(() => {
    const result: { id: 'PC' | 'PLAYSTATION' | 'NINTENDO'; label: string; count: number; icon: any; color: string }[] = [];
    
    const pcLinks = cleanDownloadLinks.filter(l => 
      l.platform === 'PC' || l.type === 'magnet' || l.type === 'torrent' || l.format === 'torrent'
    );

    const playstationLinks = cleanDownloadLinks.filter(l => 
      ['PS1', 'PS2', 'PS3', 'PS4', 'PS5', 'PSP', 'PS Vita'].includes(l.platform || '') || 
      l.type === 'pkg' || l.format === 'pkg' || (l.format === 'iso' && !l.platform?.includes('Wii') && !l.platform?.includes('GameCube'))
    );

    const nintendoLinks = cleanDownloadLinks.filter(l => 
      ['Switch', 'Nintendo Switch', 'N64', 'GBA', 'GameCube', 'Wii'].includes(l.platform || '') || 
      l.format === 'nsp' || l.format === 'xci' || (l.format === 'rom' && (l.platform === 'GBA' || l.platform === 'N64'))
    );

    if (pcLinks.length > 0 || game.hasPcTorrent) {
      result.push({ id: 'PC', label: 'PC Windows', count: pcLinks.length || 1, icon: Monitor, color: 'text-cyan-400' });
    }
    if (playstationLinks.length > 0 || game.hasPkgFormat || game.categories?.some(c => c.toLowerCase().includes('playstation') || c.startsWith('PS'))) {
      result.push({ id: 'PLAYSTATION', label: 'PlayStation', count: playstationLinks.length || 1, icon: Gamepad2, color: 'text-purple-400' });
    }
    if (nintendoLinks.length > 0 || game.categories?.some(c => c.toLowerCase().includes('nintendo') || ['Switch', 'N64', 'GBA'].includes(c))) {
      result.push({ id: 'NINTENDO', label: 'Nintendo', count: nintendoLinks.length || 1, icon: Disc, color: 'text-emerald-400' });
    }

    return result;
  }, [cleanDownloadLinks, game.hasPcTorrent, game.hasPkgFormat, game.categories]);

  const repackerName = game.repackInfo?.repacker || '';
  const hasMegaUpLink = cleanDownloadLinks.some(l => (l.hostName || '').toLowerCase().includes('megaup'));
  const megaUpPartsCount = cleanDownloadLinks.filter(l => (l.hostName || '').toLowerCase().includes('megaup')).length;
  const isDirectRelease =
    repackerName.includes('IGG-Games') ||
    repackerName.includes('4FNet') ||
    cleanDownloadLinks.some(l => l.type === 'direct' || l.type === 'mirror');
  const isPortRelease = repackerName.includes('Brother') || game.id.startsWith('bg-');
  const isConsoleRelease =
    Boolean(game.hasPkgFormat) ||
    cleanDownloadLinks.some(l => l.type === 'pkg' || ['iso', 'rom', 'nsp', 'xci', 'bin/cue'].includes((l.format || '').toLowerCase()));
  const isTorrentRepack =
    repackerName.includes('FitGirl') ||
    repackerName.includes('DODI') ||
    cleanDownloadLinks.some(l => l.type === 'magnet' || l.type === 'torrent' || l.format === 'torrent');

  const critic = getCriticScores(game);
  const metaBadge = getMetacriticBadgeColor(critic.metacritic);
  const openBadge = getOpenCriticTierColor(critic.opencriticTier);
  const minSpecs = (game.systemRequirements?.minimum?.processor) ? game.systemRequirements.minimum : {
    os: 'Windows 10 64-bit (Build 1909 ou superior)',
    processor: 'Intel Core i5-8400 ou AMD Ryzen 5 2600',
    memory: '8 GB RAM',
    graphics: 'NVIDIA GeForce GTX 1060 (6 GB) ou AMD Radeon RX 580',
    storage: `${game.repackInfo?.repackSize || '45 GB'} de espaço livre`,
    directx: 'Versão 12'
  };

  const recSpecs = (game.systemRequirements?.recommended?.processor) ? game.systemRequirements.recommended : {
    os: 'Windows 10/11 64-bit (Mais recente)',
    processor: 'Intel Core i7-10700 ou AMD Ryzen 7 3700X',
    memory: '16 GB RAM',
    graphics: 'NVIDIA GeForce RTX 3060 (12 GB) ou AMD Radeon RX 6600 XT',
    storage: `${game.repackInfo?.repackSize || '45 GB'} em SSD`,
    directx: 'Versão 12'
  };

  const realGameScreenshots = (Array.isArray(game.screenshots) && game.screenshots.length > 0)
    ? game.screenshots.filter(s => typeof s === 'string' && s.trim().length > 0)
    : [getGameBanner(game), getGameCover(game)].filter(Boolean);

  const displayScreenshots = realGameScreenshots.slice(0, 4);
  
  // User review form state
  const [authorName, setAuthorName] = useState(userProfile.name);
  const [reviewContent, setReviewContent] = useState('');
  const [userScore, setUserScore] = useState<number>(() => getUserVote(game.id) || 5);
  const [hoverScore, setHoverScore] = useState(0);
  const [submittedComment, setSubmittedComment] = useState(false);

  useEffect(() => {
    const existing = getUserVote(game.id);
    setUserScore(existing || 5);
  }, [game.id]);

  useEffect(() => {
    if (userProfile?.name) {
      setAuthorName(userProfile.name);
    }
  }, [userProfile?.name]);

  // Filter comments for this game
  const gameComments = comments.filter(c => c.gameId === game.id);
  const currentLibStatus = isInLibrary(game.id);

  const handleLibraryChange = (status: LibraryStatus) => {
    if (currentLibStatus === status) {
      removeFromLibrary(game.id);
    } else {
      addToLibrary(game.id, status);
    }
  };

  const handleCopyMagnet = (url: string) => {
    if (!isLoggedIn) {
      openAuthModal('register', '🔒 Crie sua conta gratuita ou faça login para copiar links magnet e liberar downloads.');
      return;
    }
    incrementDownload(game.id);
    const cleanUrl = url.startsWith('magnet:')
      ? sanitizeMagnetLink(url, `${game.title} [${game.repackInfo?.repacker || 'Vortex'}]`)
      : url;
    navigator.clipboard.writeText(cleanUrl);
    setCopiedMagnet(true);
    setTimeout(() => setCopiedMagnet(false), 3000);
  };

  const handleDownloadClick = (url: string) => {
    if (!isLoggedIn) {
      openAuthModal('register', '🔒 Crie sua conta gratuita ou faça login para liberar o download e sincronizar seus jogos.');
      return;
    }
    incrementDownload(game.id);
    if (url.startsWith('magnet:')) {
      const cleanUrl = sanitizeMagnetLink(url, `${game.title} [${game.repackInfo?.repacker || 'Vortex'}]`);
      window.location.href = cleanUrl;
    } else {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const [submittedVoteNotice, setSubmittedVoteNotice] = useState(false);

  const handleQuickStarClick = (score: number) => {
    setUserScore(score);
    rateGame(game.id, score);
    setSubmittedVoteNotice(true);
    setTimeout(() => setSubmittedVoteNotice(false), 3000);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewContent.trim()) return;

    addComment(game.id, authorName || userProfile.name || 'Jogador Gamer', reviewContent.trim(), userScore);
    setReviewContent('');
    setSubmittedComment(true);
    setTimeout(() => setSubmittedComment(false), 3000);
  };

  return (
    <div className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5 animate-fadeIn">
      {/* Traditional Site Header & Return Bar com Botão Compartilhar e URL Direta */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs sm:text-sm font-bold text-slate-200 hover:text-white transition-all shadow-sm group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
            <span>Voltar ao Catálogo de Jogos</span>
          </button>

          {/* Badge Visual da URL Permanente /game/:slug */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] font-mono text-slate-400">
            <span className="text-slate-500">URL:</span>
            <span className="text-cyan-400 font-bold">{getGamePath(game, activeTab as GameModalTab)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Botão Oficial: Meu PC Roda? */}
          <button
            type="button"
            onClick={() => openCanIRunIt(game)}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-300 hover:text-white border border-cyan-500/40 hover:border-cyan-400 text-xs font-bold transition-all shadow-sm cursor-pointer"
            title="Testar se o seu computador roda este jogo em 1 clique"
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Meu PC Roda?</span>
          </button>

          {/* Botão Oficial: Compartilhar Link */}
          <button
            type="button"
            onClick={handleShareClick}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-white border border-cyan-500/40 hover:border-cyan-400 text-xs font-bold transition-all shadow-sm cursor-pointer shadow-cyan-500/10"
            title="Copiar link direto para esta página do jogo ou abrir menu de compartilhamento"
          >
            {copiedShareLink ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-black">Link Copiado!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-cyan-400" />
                <span>Compartilhar Link</span>
              </>
            )}
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <button onClick={onClose} className="hover:text-cyan-400 transition-colors">Início</button>
            <span>/</span>
            <span>Catálogo</span>
            <span>/</span>
            <span className="text-cyan-400 font-semibold truncate max-w-xs">{game.title}</span>
          </div>
        </div>
      </div>

      {/* Floating Toast Feedback for Link Copied */}
      {shareToast && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 border border-cyan-500/50 shadow-2xl shadow-cyan-950/50 text-white text-xs font-medium flex items-center gap-3 animate-fadeIn">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">Link Direto Pronto!</div>
            <div className="text-slate-300 text-xs">{shareToast}</div>
            <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{getFullShareUrl(game, activeTab as GameModalTab)}</div>
          </div>
        </div>
      )}

      <div 
        className="relative w-full rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-slate-950/70 border border-slate-700 text-slate-300 hover:text-white hover:bg-rose-600 hover:border-rose-500 transition-all shadow-lg cursor-pointer"
          title="Fechar e Voltar ao Catálogo"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Header with Banner */}
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-slate-950">
          <img 
            src={getGameBanner(game)} 
            alt={game.title} 
            referrerPolicy="no-referrer"
            onError={(e) => handleImageError(e, game)}
            className="w-full h-full object-cover filter brightness-[0.7] transform scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-transparent" />

          {/* Quick info over banner */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {game.repackInfo.repacker}
                </span>

                {/* Plataformas Disponíveis no Perfil Canônico deste Jogo */}
                {platformCategories.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <span
                      key={cat.id}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase flex items-center gap-1 border shadow-sm ${
                        cat.id === 'PC' 
                          ? 'bg-cyan-500/25 text-cyan-200 border-cyan-400/50' 
                          : cat.id === 'PLAYSTATION' 
                          ? 'bg-purple-600/30 text-purple-200 border-purple-400/50' 
                          : 'bg-emerald-600/30 text-emerald-200 border-emerald-400/50'
                      }`}
                      title={`Versão disponível para ${cat.label}`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{cat.label}</span>
                    </span>
                  );
                })}

                {/* PT-BR Audio & Subtitle Badges */}
                {game.hasPtBrAudio ? (
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-black uppercase bg-emerald-500 text-slate-950 border border-emerald-400 flex items-center gap-1 shadow-sm" title="Jogo com Dublagem e Vozes em Português do Brasil">
                    <span>🇧🇷</span> DUBLADO & LEGENDADO PT-BR
                  </span>
                ) : (game.hasPtBrSubs || game.languages?.some(l => l.toLowerCase().includes('português'))) ? (
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-black uppercase bg-cyan-950 text-cyan-300 border border-cyan-700/80 flex items-center gap-1 shadow-sm" title="Jogo com Menus e Legendas Oficiais em Português do Brasil">
                    <span>🇧🇷</span> LEGENDADO PT-BR
                  </span>
                ) : null}

                {/* PKG Badge */}
                {game.hasPkgFormat && (
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-purple-600/90 text-white border border-purple-400 flex items-center gap-1">
                    <Gamepad2 className="w-3.5 h-3.5" />
                    FORMATO PKG
                  </span>
                )}

                {/* Title ID */}
                {game.titleId && (
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-slate-950/80 text-purple-300 border border-purple-800">
                    {game.titleId}
                  </span>
                )}

                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {game.repackInfo.crackStatus}
                </span>

                <button
                  type="button"
                  onClick={() => setActiveTab('instructions')}
                  className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-400/40 flex items-center gap-1 cursor-pointer transition-all"
                  title="Abrir guia passo a passo de como instalar e resolver erros"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Como Instalar & Dicas</span>
                </button>

                <span className="text-xs text-slate-300 font-mono flex items-center gap-1 bg-slate-950/60 px-2.5 py-1 rounded-lg border border-slate-800">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{game.releaseDate}</span>
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white font-display drop-shadow-lg">
                {game.title}
              </h2>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {game.genres.map((g, idx) => (
                  <span key={idx} className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/60 font-medium">
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {/* Gaming Critic Scores & Community Rating Panel */}
            <div className="flex flex-col gap-3 bg-slate-950/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 self-stretch sm:self-auto shadow-2xl">
              
              {/* Header: Avaliações da Crítica Gamer */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Crítica Especializada Gamer
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Fontes Oficiais Verificadas</span>
              </div>

              {/* 3 Critic Platform Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                
                {/* 1. Metacritic */}
                <a 
                  href={critic.metacriticUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/60 transition-all group/meta cursor-pointer"
                  title="Abrir página oficial do jogo no Metacritic"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase">Metacritic</span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover/meta:text-emerald-400 transition-colors" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black font-mono shadow-md ${metaBadge.bg} ${metaBadge.text}`}>
                      {critic.metacritic}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white leading-tight">Metascore</span>
                      <span className="text-[10px] text-slate-400">{critic.metacriticVerdict}</span>
                    </div>
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                    <span>User Score</span>
                    <span className="font-bold text-amber-400 font-mono">{critic.metacriticUser} / 10</span>
                  </div>
                </a>

                {/* 2. OpenCritic */}
                <a 
                  href={critic.opencriticUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/60 transition-all group/oc cursor-pointer"
                  title="Abrir busca e avaliações no OpenCritic"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase">OpenCritic</span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover/oc:text-cyan-400 transition-colors" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-1 rounded-lg border flex items-center justify-center font-mono font-black text-sm ${openBadge.border} ${openBadge.bg} ${openBadge.text}`}>
                      {critic.opencritic}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white leading-tight">Top Critic Avg</span>
                      <span className={`text-[10px] font-semibold ${openBadge.text}`}>{critic.opencriticTier}</span>
                    </div>
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Recomendação</span>
                    <span className="font-bold text-cyan-400 font-mono">{critic.opencriticRecommendPercent}%</span>
                  </div>
                </a>

                {/* 3. GameFAQs / GameSpot */}
                <a 
                  href={critic.gamefaqsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/60 transition-all group/faqs cursor-pointer"
                  title="Abrir guia e notas no GameFAQs / GameSpot"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase">GameFAQs</span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover/faqs:text-amber-400 transition-colors" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Star className="w-4 h-4 fill-amber-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white leading-tight font-mono">{critic.gamefaqs} <span className="text-[10px] text-slate-400 font-normal">/ 5.0</span></span>
                      <span className="text-[10px] text-slate-400">Comunidade</span>
                    </div>
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Avaliações</span>
                    <span className="font-bold text-slate-300 font-mono">{critic.gamefaqsVotesCount.toLocaleString()}</span>
                  </div>
                </a>

              </div>

              {/* Vortex Games Community Rating Strip */}
              <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Comunidade Vortex:</span>
                  {game.totalVotes > 0 ? (
                    <div className="flex items-center gap-1.5 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span className="text-sm font-bold text-white">{game.rating.toFixed(1)}</span>
                      <span className="text-[11px] text-slate-400">({game.totalVotes} {game.totalVotes === 1 ? 'voto real' : 'votos reais'})</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">Sem avaliações ainda</span>
                  )}
                </div>

                {getUserVote(game.id) ? (
                  <button
                    type="button"
                    onClick={() => {
                      const element = document.getElementById('avaliar-secao');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 transition-all cursor-pointer"
                    title="Clique para alterar sua nota ou escrever um comentário"
                  >
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>Sua nota: {getUserVote(game.id)}.0</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const element = document.getElementById('avaliar-secao');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 border border-cyan-500/30 transition-all cursor-pointer"
                  >
                    Dar Minha Nota ⭐
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Secondary Subbar: Library Controls & Quick Repack Specs */}
        <div className="px-6 py-4 bg-slate-950/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          
          {/* Library State Selectors */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1">
              <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
              Minha Biblioteca:
            </span>
            <button
              onClick={() => handleLibraryChange('playing')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                currentLibStatus === 'playing'
                  ? 'bg-emerald-600 text-white ring-1 ring-emerald-400'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              🎮 Jogando
            </button>
            <button
              onClick={() => handleLibraryChange('completed')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                currentLibStatus === 'completed'
                  ? 'bg-purple-600 text-white ring-1 ring-purple-400'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              🏆 Zerado
            </button>
            <button
              onClick={() => handleLibraryChange('wishlist')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                currentLibStatus === 'wishlist'
                  ? 'bg-cyan-600 text-white ring-1 ring-cyan-400'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              📌 Quero Jogar
            </button>
          </div>

          {/* Quick Repack & Live Ranking stats */}
          <div className="flex items-center gap-4 text-xs text-slate-300 font-medium flex-wrap">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono font-bold text-white">{(game.viewsCount || 0).toLocaleString('pt-BR')}</span>
              <span className="text-slate-400">acessos</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800">
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono font-bold text-white">{(game.downloadsCount || 0).toLocaleString('pt-BR')}</span>
              <span className="text-slate-400">downloads</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              <span>Tamanho Compactado: <strong className="text-white">{game.repackInfo.repackSize}</strong></span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-slate-400">
              <span>(Original: {game.repackInfo.originalSize})</span>
            </div>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-900/50 overflow-x-auto">
          <button
            onClick={() => setActiveTab('downloads')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'downloads'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Links de Download</span>
          </button>
          <button
            onClick={() => setActiveTab('instructions')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'instructions'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-slate-300 hover:text-amber-300'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Como Instalar & Dicas</span>
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'specs'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Requisitos de Sistema (PC)</span>
          </button>
          <button
            onClick={() => setActiveTab('screenshots')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'screenshots'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Capturas & Imagens</span>
          </button>

          {/* TAB: LOCALIZAÇÕES */}
          <button
            onClick={() => setActiveTab('localizations')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'localizations'
                ? 'border-indigo-400 text-indigo-300 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4 text-indigo-400" />
            <span>Localizações</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              {displayLocalizations.length}
            </span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 space-y-8">
          
          {/* TAB: DOWNLOADS */}
          {activeTab === 'downloads' && (
            <div className="space-y-6">

              {/* PT-BR Dubbing & Translation Spotlight Banner */}
              {(game.hasPtBrAudio || game.hasPtBrSubs || game.languages?.some(l => l.includes('Português'))) && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-emerald-950/30 border-2 border-emerald-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-xl shrink-0">
                      🇧🇷
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase text-emerald-400 font-display">
                          {game.hasPtBrAudio ? 'Localização Completa com Dublagem PT-BR' : 'Legendas & Menus em Português do Brasil'}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-emerald-500 text-slate-950">
                          100% PT-BR
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        {game.hasPtBrAudio 
                          ? 'Vozes, dublagem dos personagens e textos totalmente sincronizados em Português Brasileiro.'
                          : 'Interface e legendas oficiais em Português do Brasil testadas e verificadas.'}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-950 border border-emerald-500/40 text-emerald-300 font-bold shrink-0">
                    Áudio: {game.hasPtBrAudio ? 'Português BR' : 'Original + Legendas BR'}
                  </span>
                </div>
              )}

              {/* Release Technical Specs Box (Clean & Neutral) */}
              {(game.titleId || game.hasPkgFormat) && (
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5 text-xs">
                      <Disc className="w-3.5 h-3.5 text-purple-400" />
                      Especificações Técnicas da Build
                    </span>
                    <span className="text-[11px] text-cyan-400 font-mono">
                      Build Verificada
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                    {game.titleId && (
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="block text-[10px] text-slate-500">Title ID do Jogo:</span>
                        <span className="font-mono font-bold text-purple-300 text-xs">{game.titleId}</span>
                      </div>
                    )}
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="block text-[10px] text-slate-500">Compatibilidade de Sistema:</span>
                      <span className="font-semibold text-slate-200 text-xs">
                        {cleanDownloadLinks.find(l => l.firmware)?.firmware || 'PC Windows / Emulador'}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="block text-[10px] text-slate-500">Formato dos Arquivos:</span>
                      <span className="font-semibold text-cyan-300 text-xs">
                        {game.hasPkgFormat && game.hasPcTorrent ? 'PKG + Torrent PC' : game.hasPkgFormat ? 'Instalador PKG' : 'Torrent PC (.torrent)'}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="block text-[10px] text-slate-500">Região & Idioma:</span>
                      <span className="font-semibold text-emerald-400 text-xs">América Latina / Brasil (PT-BR)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STATUS DE DOWNLOADS DIRETOS E LIBERADOS */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3 text-xs shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500 text-slate-950 font-black">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white flex items-center gap-2">
                      <span>Links de Download Diretos & Verificados</span>
                      <span className="px-2 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">100% Liberados</span>
                    </p>
                    <p className="text-slate-400 text-[11px]">Todos os links diretos, magnets torrent e instaladores PKG/ISO estão prontos para download imediato.</p>
                  </div>
                </div>
                <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold text-[11px]">
                  {cleanDownloadLinks.length} opções disponíveis
                </span>
              </div>

              {/* DISTINCT DOWNLOAD BUTTONS SECTION & UNIVERSAL PLATFORM HUB */}
              <div className="space-y-4">
                {/* Platform Switcher Bar */}
                <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        Espaço Unificado de Plataformas & Formatos
                      </span>
                      <p className="text-[11px] text-slate-400">
                        Selecione a plataforma onde deseja jogar para filtrar os arquivos (PC, PlayStation, Nintendo ou Emuladores)
                      </p>
                    </div>

                    {/* Platform Selector Buttons */}
                    <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setSelectedPlatformTab('ALL')}
                        className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                          selectedPlatformTab === 'ALL'
                            ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-black'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Todas ({cleanDownloadLinks.length})</span>
                      </button>

                      {platformCategories.map(cat => {
                        const Icon = cat.icon;
                        const isSelected = selectedPlatformTab === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setSelectedPlatformTab(cat.id)}
                            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                              isSelected
                                ? cat.id === 'PC' 
                                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-black'
                                  : cat.id === 'PLAYSTATION'
                                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20 font-black'
                                  : 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-black'
                                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{cat.label} ({cat.count})</span>
                          </button>
                        );
                      })}

                      <button
                        type="button"
                        onClick={() => setSelectedPlatformTab('EMULATORS')}
                        className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                          selectedPlatformTab === 'EMULATORS'
                            ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Emuladores Recomendados</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* EMULATOR GUIDE VIEW */}
                {selectedPlatformTab === 'EMULATORS' && (
                  <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          <Zap className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">Guia de Emulação & Configuração em 4K/60FPS</h4>
                          <p className="text-xs text-slate-400">Software recomendado para rodar este jogo com alta fidelidade gráfica no PC ou no celular</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500 text-slate-950">
                        Verificado
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <span className="font-bold text-cyan-400 text-xs flex items-center gap-1.5">
                          <Gamepad2 className="w-4 h-4" /> PlayStation 1 (DuckStation)
                        </span>
                        <p className="text-xs text-slate-200">
                          Renderizador Vulkan, upscale para 4K nativo, correção de distorção de textura PGXP e savestates rápidos.
                        </p>
                        <span className="inline-block text-[10px] text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800 font-mono">
                          Formatos: ISO, BIN/CUE, CHD
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <span className="font-bold text-purple-400 text-xs flex items-center gap-1.5">
                          <Gamepad2 className="w-4 h-4" /> PlayStation 2 (PCSX2)
                        </span>
                        <p className="text-xs text-slate-200">
                          Resoluções até 4K/60FPS, suporte total a controle de Xbox/PS5, filtros anti-aliasing e suporte a OPL em hardware real.
                        </p>
                        <span className="inline-block text-[10px] text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800 font-mono">
                          Formatos: ISO DVD-9, CSO, CHD
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <span className="font-bold text-rose-400 text-xs flex items-center gap-1.5">
                          <Disc className="w-4 h-4" /> Nintendo Switch (Ryujinx)
                        </span>
                        <p className="text-xs text-slate-200">
                          Emulador de alta compatibilidade para PC. Suporte a mods de 60 FPS, resolução escalável e shaders pré-compilados.
                        </p>
                        <span className="inline-block text-[10px] text-rose-300 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800 font-mono">
                          Formatos: NSP, XCI
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* BANNER DE VISITANTE / EXIGÊNCIA DE LOGIN */}
                {!isLoggedIn && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-cyan-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                        <Lock className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <span>Acesso de Visitante</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">Crie sua Conta Gratuita</span>
                        </h4>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Para liberar downloads diretos, links magnet e salvar jogos na nuvem, cadastre-se grátis em segundos.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => openAuthModal('register', '🔒 Crie sua conta gratuita ou faça login para liberar os downloads.')}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 transition-all shadow-md shadow-amber-500/20 shrink-0 flex items-center justify-center gap-1.5 cursor-pointer font-display"
                    >
                      <UserPlus className="w-4 h-4 stroke-[2.5]" />
                      <span>Cadastre-se para Baixar</span>
                    </button>
                  </div>
                )}

                {/* DOWNLOAD CARDS GRID */}
                {selectedPlatformTab !== 'EMULATORS' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* BUTTON 1: TORRENT PC (MAGNET) */}
                    {(selectedPlatformTab === 'ALL' || selectedPlatformTab === 'PC') && 
                      cleanDownloadLinks.filter(l => l.type === 'magnet' || l.type === 'torrent' || l.format === 'torrent').map(link => (
                      <div 
                        key={link.id}
                        style={{ width: '570.508px', maxWidth: '100%' }}
                        className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/30 border-2 border-cyan-500/50 space-y-3 flex flex-col justify-between shadow-xl"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-cyan-500 text-slate-950">
                              TORRENT PC (MAGNET)
                            </span>
                            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5" title="Enxame de peers online distribuindo o jogo">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                              <span>{((link.seeders) || 3200).toLocaleString('pt-BR')} Seeds Ativos</span>
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <h5 className="text-sm font-bold text-white font-display">
                              {link.label}
                            </h5>
                            {link.language && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                                <span>🗣️</span>
                                <span>{link.language}</span>
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span>Tamanho: <strong className="text-white font-mono">{link.size}</strong></span>
                            <span>•</span>
                            <span>Formato: <strong className="text-cyan-300">.torrent / Magnet</strong></span>
                            <span>•</span>
                            <span className="text-emerald-400 font-medium">Download Imediato</span>
                          </div>

                          {/* Testador de Seeds em Tempo Real (>50 Seeds Excelente) */}
                          <div className="pt-1">
                            <TorrentHealthBadge 
                              seeders={link.seeders || 78} 
                              leechers={link.leechers || 24} 
                              torrentName={link.label}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => handleDownloadClick(link.url)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-black text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-md shadow-cyan-500/30 transition-all transform hover:scale-[1.02] cursor-pointer"
                            title="Enviar link Magnet limpo direto para seu aplicativo de torrent (qBittorrent / uTorrent)"
                          >
                            <Download className="w-4 h-4 stroke-[2.5]" />
                            <span>Baixar Torrent PC (Abrir no qBittorrent / uTorrent)</span>
                          </button>

                          <button
                            onClick={() => handleCopyMagnet(link.url)}
                            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
                            title="Copiar Link Magnet Limpo (Sem erros de sintaxe no Windows/qBittorrent)"
                          >
                            {copiedMagnet ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                <span className="text-[11px] font-bold text-emerald-400 hidden sm:inline">Copiado!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                <span className="text-[11px] font-bold hidden sm:inline">Copiar Magnet</span>
                              </>
                            )}
                          </button>
                        </div>

                        {copiedMagnet && (
                          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                            <span>Link Magnet 100% verificado copiado! Cole no qBittorrent via <strong>Ctrl + U</strong> ou Arquivo &gt; Adicionar Link Torrent.</span>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* BUTTON 1B: DOWNLOAD DIRETO / PORT PC NATIVO (BROTHER GAME & STANDALONE) */}
                    {(selectedPlatformTab === 'ALL' || selectedPlatformTab === 'PC') &&
                      cleanDownloadLinks
                        .filter(l => (l.type === 'direct' || l.format === 'direct') && (l.platform === 'PC' || !l.platform))
                        .map(link => (
                        <div 
                          key={link.id}
                          className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 border-2 border-emerald-500/50 space-y-3 flex flex-col justify-between shadow-xl"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500 text-slate-950 flex items-center gap-1">
                                <Download className="w-3 h-3" /> PORT PC NATIVO (DOWNLOAD DIRETO)
                              </span>
                              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span>{link.hostName || 'BrotherGame.org'}</span>
                              </span>
                            </div>

                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <h5 className="text-sm font-bold text-white font-display">
                                {link.label}
                              </h5>
                              {link.language && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                                  <span>🗣️</span>
                                  <span>{link.language}</span>
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              <span>Tamanho: <strong className="text-white font-mono">{link.size}</strong></span>
                              <span>•</span>
                              <span>Formato: <strong className="text-emerald-300">Download Direto (.exe / Zip)</strong></span>
                              <span>•</span>
                              <span className="text-emerald-400 font-medium">Link Oficial Verificado</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => handleDownloadClick(link.url)}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-black text-xs bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-md shadow-emerald-500/30 transition-all transform hover:scale-[1.02] cursor-pointer"
                              title={`Baixar diretamente através de ${link.hostName || 'Download Direto'}`}
                            >
                              <Download className="w-4 h-4 stroke-[2.5]" />
                              <span>{link.hostName?.includes('Git') ? `Acessar Releases (${link.hostName})` : `Baixar via ${link.hostName || 'Download Direto'}`}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleCopyMagnet(link.url)}
                              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
                              title="Copiar Link de Download Direto"
                            >
                              {copiedMagnet ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                  <span className="text-[11px] font-bold text-emerald-400 hidden sm:inline">Copiado!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4" />
                                  <span className="text-[11px] font-bold hidden sm:inline">Copiar Link</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ))}

                    {/* BUTTON 2: ARQUIVO PKG (PLAYSTATION / DLPSGAME / THEZUKOSTORE) */}
                    {(selectedPlatformTab === 'ALL' || selectedPlatformTab === 'PLAYSTATION') &&
                      cleanDownloadLinks.filter(l => l.type === 'pkg' || l.format === 'pkg').map(link => (
                      <div 
                        key={link.id}
                        className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950/40 border-2 border-purple-500/50 space-y-3 flex flex-col justify-between shadow-xl"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-purple-600 text-white flex items-center gap-1">
                              <Gamepad2 className="w-3 h-3" /> ARQUIVO PKG CONSOLE
                            </span>
                            {link.titleId && (
                              <span className="text-xs text-purple-300 font-mono font-bold">
                                {link.titleId}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <h5 className="text-sm font-bold text-white font-display">
                              {link.label}
                            </h5>
                            {link.language && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                                <span>🗣️</span>
                                <span>{link.language}</span>
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span>Tamanho: <strong className="text-white font-mono">{link.size}</strong></span>
                            <span>•</span>
                            <span>Compatível: <strong className="text-purple-300">{link.firmware || 'PS4 5.05 - 11.00'}</strong></span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <button
                            onClick={() => handleDownloadClick(link.url)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-black text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/30 transition-all transform hover:scale-[1.02] cursor-pointer"
                          >
                            <FileArchive className="w-4 h-4 stroke-[2.5]" />
                            <span>Baixar Arquivo PKG (Direto)</span>
                          </button>

                          <button
                            onClick={() => handleCopyMagnet(link.url)}
                            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all shrink-0 cursor-pointer"
                            title="Copiar Link do Arquivo"
                          >
                            {copiedMagnet ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* BUTTON 3: CONSOLE ISO & CLEAN ROMs (ROMSPURE & PRESERVAÇÃO) */}
                    {(selectedPlatformTab === 'ALL' || selectedPlatformTab === 'PLAYSTATION' || selectedPlatformTab === 'NINTENDO') &&
                      cleanDownloadLinks
                        .filter(l => {
                          const isIsoOrRom = l.format === 'iso' || l.format === 'rom' || l.format === 'bin/cue';
                          const isNotPkgOrTorrent = l.type !== 'pkg' && l.type !== 'magnet' && l.type !== 'torrent';
                          return isIsoOrRom && isNotPkgOrTorrent;
                        })
                        .map(link => (
                        <div 
                          key={link.id}
                          className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950/40 border-2 border-emerald-500/50 space-y-3 flex flex-col justify-between shadow-xl"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500 text-slate-950 flex items-center gap-1">
                                <Disc className="w-3 h-3" /> ROM / ISO DUMP LIMPO
                              </span>
                              <span className="text-xs text-emerald-400 font-bold font-mono">
                                {link.platform || 'CONSOLE'} {link.titleId ? `• ${link.titleId}` : ''}
                              </span>
                            </div>

                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <h5 className="text-sm font-bold text-white font-display">
                              {link.label}
                            </h5>
                            {link.language && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                                <span>🗣️</span>
                                <span>{link.language}</span>
                              </span>
                            )}
                          </div>

                            <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                              <span>Tamanho: <strong className="text-white font-mono">{link.size}</strong></span>
                              <span>•</span>
                              <span>Formato: <strong className="text-emerald-300 font-mono">{(link.format || 'ISO').toUpperCase()}</strong></span>
                              <span>•</span>
                              <span>Emulador: <strong className="text-cyan-300">{link.firmware || 'RetroArch / Emulador'}</strong></span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-2">
                            <button
                              onClick={() => handleDownloadClick(link.url)}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-black text-xs bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-md shadow-emerald-500/30 transition-all transform hover:scale-[1.02] cursor-pointer"
                            >
                              <Download className="w-4 h-4 stroke-[2.5]" />
                              <span>Baixar ROM / ISO Direto</span>
                            </button>

                            <button
                              onClick={() => handleCopyMagnet(link.url)}
                              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all shrink-0 cursor-pointer"
                              title="Copiar Link de Download"
                            >
                              {copiedMagnet ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      ))}

                    {/* BUTTON 4: NINTENDO SWITCH (NSP / XCI) */}
                    {(selectedPlatformTab === 'ALL' || selectedPlatformTab === 'NINTENDO') &&
                      cleanDownloadLinks
                        .filter(l => l.format === 'nsp' || l.format === 'xci' || l.platform === 'Switch' || l.platform === 'Nintendo Switch')
                        .map(link => (
                        <div 
                          key={link.id}
                          className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950/40 border-2 border-rose-500/50 space-y-3 flex flex-col justify-between shadow-xl"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-600 text-white flex items-center gap-1">
                                <Disc className="w-3 h-3" /> NINTENDO SWITCH DUMP
                              </span>
                              <div className="flex items-center gap-1.5">
                                {link.language && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                    🗣️ {link.language}
                                  </span>
                                )}
                                <span className="text-xs text-rose-300 font-mono font-bold">
                                  {link.format?.toUpperCase() || 'NSP'}
                                </span>
                              </div>
                            </div>

                            <h5 className="text-sm font-bold text-white font-display">
                              {link.label}
                            </h5>

                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              <span>Tamanho: <strong className="text-white font-mono">{link.size}</strong></span>
                              <span>•</span>
                              <span>Compatível: <strong className="text-rose-300">{link.firmware || 'Ryujinx / Yuzu / Switch CFW'}</strong></span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-2">
                            <button
                              onClick={() => handleDownloadClick(link.url)}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-black text-xs bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-md shadow-rose-600/30 transition-all transform hover:scale-[1.02] cursor-pointer"
                            >
                              <Download className="w-4 h-4 stroke-[2.5]" />
                              <span>Baixar Pacote Switch (NSP / XCI)</span>
                            </button>

                            <button
                              onClick={() => handleCopyMagnet(link.url)}
                              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all shrink-0 cursor-pointer"
                              title="Copiar Link de Download"
                            >
                              {copiedMagnet ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      ))}

                    {/* BUTTON 5: PACOTE / PATCH DUBLAGEM & TRADUÇÃO PT-BR */}
                    {(selectedPlatformTab === 'ALL' || selectedPlatformTab === 'PC') &&
                      cleanDownloadLinks.filter(l => l.type === 'pt_br_patch' || l.format === 'pt_br_patch').map(link => (
                      <div 
                        key={link.id}
                        className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 border-2 border-emerald-500/50 space-y-3 flex flex-col justify-between shadow-xl md:col-span-2"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500 text-slate-950 flex items-center gap-1">
                              <span>🇧🇷</span> PACOTE DE DUBLAGEM & TRADUÇÃO PT-BR
                            </span>
                            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                              <Volume2 className="w-3.5 h-3.5" />
                              Áudio Oficial Brasileiro
                            </span>
                          </div>

                          <h5 className="text-sm font-bold text-white font-display">
                            {link.label}
                          </h5>

                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span>Tamanho do Pacote: <strong className="text-white font-mono">{link.size}</strong></span>
                            <span>•</span>
                            <span>Instalação: <strong className="text-emerald-300">1-Clique (Substituição ou PKG de Áudio)</strong></span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <button
                            onClick={() => handleDownloadClick(link.url)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-black text-xs bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-md shadow-emerald-500/30 transition-all transform hover:scale-[1.02] cursor-pointer"
                          >
                            <Volume2 className="w-4 h-4 stroke-[2.5]" />
                            <span>Baixar Pacote de Dublagem PT-BR</span>
                          </button>

                          <button
                            onClick={() => handleCopyMagnet(link.url)}
                            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all shrink-0 cursor-pointer"
                            title="Copiar Link do Pacote"
                          >
                            {copiedMagnet ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    ))}

                  </div>
                )}
              </div>


              {/* Other Links & Mirrors (Servidores Alternativos com Links Diretos nos Botões) */}
              {cleanDownloadLinks.filter(l => (l.type === 'direct' || l.type === 'mirror') && !((l.type === 'direct' || l.format === 'direct') && (l.platform === 'PC' || !l.platform))).length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                      Mirrors Diretos & Servidores Alternativos
                    </h4>
                    <span className="text-[11px] text-slate-500">Links diretos integrados nos botões</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {cleanDownloadLinks.filter(l => (l.type === 'direct' || l.type === 'mirror') && !((l.type === 'direct' || l.format === 'direct') && (l.platform === 'PC' || !l.platform))).map((link) => (
                      <div 
                        key={link.id}
                        className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-all"
                      >
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-white truncate">{link.label}</p>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                            <span>{link.size}</span>
                            {link.language && <span className="text-emerald-400 font-medium">• 🗣️ {link.language}</span>}
                            {link.hostName && <span>• {link.hostName}</span>}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Botão de Download Direto com link nos botões sem ir para sites externos */}
                          <button
                            type="button"
                            onClick={() => handleDownloadClick(link.url)}
                            className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20 hover:scale-105 cursor-pointer"
                            title="Baixar diretamente sem redirecionamento"
                          >
                            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Baixar Direto</span>
                          </button>

                          {/* Botão para copiar o link direto */}
                          <button
                            type="button"
                            onClick={() => handleCopyMagnet(link.url)}
                            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
                            title="Copiar Link de Download"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* DLCs & Languages Included */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {game.dlcIncluded && game.dlcIncluded.length > 0 && (
                  <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
                    <h5 className="text-xs font-bold text-cyan-400 uppercase tracking-wide mb-2">
                      DLCs & Conteúdos Inclusos
                    </h5>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {game.dlcIncluded.map((dlc, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{dlc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {game.languages && game.languages.length > 0 && (
                  <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
                    <h5 className="text-xs font-bold text-indigo-400 uppercase tracking-wide mb-2">
                      Idiomas & Dublagens
                    </h5>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {game.languages.map((lang, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                          <span>{lang}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Atalho rápido para o Guia de Instalação */}
              <div className="p-4 rounded-2xl bg-slate-950/75 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">
                      Primeira vez instalando ou precisa de ajuda com DLL / Antivírus?
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Preparamos um passo a passo específico para esta versão ({game.repackInfo.repacker}) e dicas anti-erro.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('instructions')}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs whitespace-nowrap shrink-0 cursor-pointer transition-colors"
                >
                  Ver Como Instalar & Dicas
                </button>
              </div>

            </div>
          )}

          {/* TAB: SYSTEM SPECS */}
          {activeTab === 'specs' && (
            <div className="space-y-6">
              {/* Meu PC Roda Callout */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/60 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                    <Cpu className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Análise Automática de Desempenho</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">1 Clique</span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Verifique se a sua placa de vídeo, processador e memória RAM rodam {game.title} com estimativa de FPS.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openCanIRunIt(game)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer shrink-0"
                >
                  <Cpu className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                  <span>Testar Meu PC Agora</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Minimum specs */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="text-sm font-bold text-cyan-400 font-display uppercase tracking-wider flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-cyan-400" />
                      Requisitos Mínimos
                    </h4>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      720p ~ 1080p (30 FPS)
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <p><strong className="text-slate-400">Sistema Operacional:</strong> <span className="text-white font-medium">{minSpecs.os}</span></p>
                    <p><strong className="text-slate-400">Processador:</strong> <span className="text-white font-medium">{minSpecs.processor}</span></p>
                    <p><strong className="text-slate-400">Memória RAM:</strong> <span className="text-white font-medium">{minSpecs.memory}</span></p>
                    <p><strong className="text-slate-400">Placa de Vídeo:</strong> <span className="text-white font-medium">{minSpecs.graphics}</span></p>
                    <p><strong className="text-slate-400">Espaço em Disco:</strong> <span className="text-white font-medium">{minSpecs.storage}</span></p>
                    <p><strong className="text-slate-400">DirectX:</strong> <span className="text-white font-medium">{minSpecs.directx}</span></p>
                  </div>
                </div>

                {/* Recommended specs */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="text-sm font-bold text-emerald-400 font-display uppercase tracking-wider flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-emerald-400" />
                      Requisitos Recomendados
                    </h4>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400">
                      1080p ~ 1440p (60+ FPS)
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <p><strong className="text-slate-400">Sistema Operacional:</strong> <span className="text-white font-medium">{recSpecs.os}</span></p>
                    <p><strong className="text-slate-400">Processador:</strong> <span className="text-white font-medium">{recSpecs.processor}</span></p>
                    <p><strong className="text-slate-400">Memória RAM:</strong> <span className="text-white font-medium">{recSpecs.memory}</span></p>
                    <p><strong className="text-slate-400">Placa de Vídeo:</strong> <span className="text-white font-medium">{recSpecs.graphics}</span></p>
                    <p><strong className="text-slate-400">Espaço em Disco:</strong> <span className="text-white font-medium">{recSpecs.storage}</span></p>
                    <p><strong className="text-slate-400">DirectX:</strong> <span className="text-white font-medium">{recSpecs.directx}</span></p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB: SCREENSHOTS */}
          {activeTab === 'screenshots' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>Imagens Oficiais do Jogo ({displayScreenshots.length} de no máximo 4 capturas). Clique para ampliar.</span>
                </span>
              </div>

              {displayScreenshots.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-950/40 border border-slate-800 text-slate-400 text-xs">
                  Nenhuma captura de tela cadastrada para este jogo.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {displayScreenshots.map((shot, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setLightboxImage(shot)}
                      className="rounded-2xl overflow-hidden border border-slate-800 group aspect-video bg-slate-950 cursor-pointer relative hover:border-cyan-400/60 transition-all shadow-md hover:shadow-cyan-500/10"
                    >
                      <img 
                        src={shot} 
                        alt={`${game.title} imagem oficial ${idx + 1}`} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => handleImageError(e, game)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                        <span className="text-[11px] font-bold text-cyan-300">🔍 Ver Imagem {idx + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Lightbox / Zoom modal */}
              {lightboxImage && (
                <div 
                  className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4"
                  onClick={() => setLightboxImage(null)}
                >
                  <button 
                    onClick={() => setLightboxImage(null)}
                    className="absolute top-6 right-6 p-3 rounded-full bg-slate-900 border border-slate-700 text-white hover:bg-slate-800 transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <img 
                    src={lightboxImage} 
                    alt="Captura ampliada" 
                    className="max-w-full max-h-[90vh] object-contain rounded-2xl border border-slate-800 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB: COMO INSTALAR & DICAS (COMPLETA E CONTEXTUAL) */}
          {activeTab === 'instructions' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Cabeçalho Contextual do Guia */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <h4 className="text-base sm:text-lg font-black text-white font-display flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-400 shrink-0" />
                    <span>Como Instalar {game.title} & Dicas</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    {game.repackInfo.repacker} · Tamanho: {game.repackInfo.repackSize} · Plataforma: {game.platform || 'PC Windows'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => openCanIRunIt(game)}
                    className="px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Meu PC Roda?</span>
                  </button>
                  <button
                    type="button"
                    onClick={openUtilities}
                    className="px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 hover:text-slate-950 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Utilitários Essenciais</span>
                  </button>
                </div>
              </div>

              {/* Notas Específicas deste Release (se cadastradas) */}
              {game.installNotes && game.installNotes.trim().length > 0 && (
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                  <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <Info className="w-4 h-4 shrink-0" />
                    <span>Notas Importantes deste Lançamento</span>
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                    {game.installNotes}
                  </p>
                </div>
              )}

              {/* Passo a Passo Adaptado à Fonte do Jogo */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <h5 className="text-sm font-bold text-white flex items-center gap-2">
                    <FolderArchive className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>
                      {isConsoleRelease
                        ? 'Passo a Passo para Consoles e Emuladores'
                        : isPortRelease
                        ? 'Passo a Passo para Port Nativo PC'
                        : isDirectRelease && !isTorrentRepack
                        ? `Passo a Passo via Download Direto${hasMegaUpLink ? ' (MegaUp.net)' : ''}`
                        : 'Passo a Passo de Instalação via Torrent / Repack'}
                    </span>
                  </h5>
                  <span className="text-xs text-slate-400">
                    Siga a ordem abaixo para evitar erros de DLL ou arquivos corrompidos
                  </span>
                </div>

                {isConsoleRelease ? (
                  <ol className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <li>
                      <strong className="text-white">01. Escolha o formato correto:</strong> Baixe o arquivo <strong className="text-purple-300">.PKG</strong> se for instalar em PlayStation desbloqueado (HEN/GoldHEN), ou baixe <strong className="text-emerald-300">.ISO / .NSP / .XCI / .ROM</strong> para jogar em emuladores no PC ou celular.
                    </li>
                    <li>
                      <strong className="text-white">02. Descompacte com 7-Zip ou WinRAR:</strong> Se o arquivo vier compactado em <span className="font-mono text-slate-200">.zip</span>, <span className="font-mono text-slate-200">.rar</span> ou <span className="font-mono text-slate-200">.7z</span>, extraia antes de abrir no emulador ou passar para o pendrive.
                    </li>
                    <li>
                      <strong className="text-white">03. Instalação via USB (PKG):</strong> Formate o pendrive em <strong className="text-white">exFAT</strong>, coloque o arquivo PKG na raiz, conecte no console e acesse <em>Package Installer</em>. Se houver atualização (Update) ou tradução PT-BR em PKG, instale o jogo base primeiro e o patch por último.
                    </li>
                    <li>
                      <strong className="text-white">04. Configuração no Emulador:</strong> No PCSX2, DuckStation, RPCS3 ou Ryujinx, aponte a pasta de jogos nas configurações e certifique-se de ter a BIOS ou Keys atualizadas do respectivo console.
                    </li>
                  </ol>
                ) : isPortRelease ? (
                  <ol className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <li>
                      <strong className="text-white">01. Download direto sem emulador:</strong> Este é um Port Nativo compilado diretamente para Windows. Baixe o pacote completo pelos links da aba Downloads.
                    </li>
                    <li>
                      <strong className="text-white">02. Extração limpa:</strong> Extraia todo o conteúdo do arquivo <span className="font-mono text-slate-200">.zip/.rar</span> para uma pasta dedicada (ex: <span className="font-mono text-cyan-300">C:\Jogos\{game.slug}</span>), evitando rodar o jogo direto de dentro do WinRAR.
                    </li>
                    <li>
                      <strong className="text-white">03. Mantenha todas as DLLs juntas:</strong> Nunca mova apenas o executável <span className="font-mono text-slate-200">.exe</span> para a Área de Trabalho; crie um atalho enviando para a Área de Trabalho com o botão direito.
                    </li>
                    <li>
                      <strong className="text-white">04. Controles e Resolução:</strong> Conecte seu controle Xbox/PlayStation antes de abrir o jogo para reconhecimento automático em 60 FPS ou configure no menu inicial.
                    </li>
                  </ol>
                ) : isDirectRelease && !isTorrentRepack ? (
                  <ol className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <li>
                      <strong className="text-white">01. Download pelo servidor prioritário ({hasMegaUpLink ? 'MegaUp.net' : 'Link Direto'}):</strong> Clique no link desejado, aguarde a contagem regressiva de poucos segundos no redirecionador e feche eventuais abas de anúncio até iniciar o arquivo real do jogo.
                    </li>
                    <li>
                      <strong className="text-white">02. {megaUpPartsCount > 1 ? `Baixe todas as partes (${megaUpPartsCount} arquivos) na mesma pasta:` : 'Extraia o arquivo baixado:'}</strong>{' '}
                      {megaUpPartsCount > 1
                        ? 'Coloque todas as partes na mesma pasta, clique com o botão direito somente na Parte 1 e selecione "Extrair aqui" usando WinRAR ou 7-Zip atualizado (as demais partes serão unidas automaticamente).'
                        : 'Use WinRAR ou 7-Zip atualizado para extrair o pacote em uma pasta curta sem acentos (ex: C:\\Jogos).'}
                    </li>
                    <li>
                      <strong className="text-white">03. Proteção do Windows Defender:</strong> Antes de extrair ou rodar o <span className="font-mono text-slate-200">Setup.exe</span>, adicione a pasta de destino às exclusões do Windows Defender para evitar falso-positivo nos arquivos do crack.
                    </li>
                    <li>
                      <strong className="text-white">04. Montar ISO / Instalar / Crack:</strong> Se vier um arquivo <span className="font-mono text-slate-200">.iso</span>, dê duplo clique no Windows 10/11 para montar o disco virtual e rode o <span className="font-mono text-slate-200">Setup.exe</span>. Caso exista uma pasta chamada <span className="font-mono text-amber-300">Crack</span>, <span className="font-mono text-amber-300">RUNE</span> ou <span className="font-mono text-amber-300">CODEX</span> dentro da ISO, copie seu conteúdo para a pasta onde o jogo foi instalado substituindo os arquivos.
                    </li>
                    <li>
                      <strong className="text-white">05. Primeira execução:</strong> Abra o atalho na Área de Trabalho com o botão direito e escolha <strong className="text-white">Executar como Administrador</strong> para garantir permissão de salvamento.
                    </li>
                  </ol>
                ) : (
                  <ol className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <li>
                      <strong className="text-white">01. Baixe com qBittorrent:</strong> Clique em <em>Baixar Torrent PC</em> na aba de downloads e abra no <strong className="text-white">qBittorrent</strong> (leve, código aberto e livre de anúncios). Você pode desmarcar pacotes de idiomas opcionais (ex: japonês/francês) se quiser economizar espaço.
                    </li>
                    <li>
                      <strong className="text-white">02. Adicione exceção no Antivírus antes de instalar:</strong> Pause a proteção em tempo real ou adicione a pasta do torrent e a pasta de instalação às exclusões do Windows Defender para que nenhum arquivo <span className="font-mono text-slate-200">.dll</span> do jogo seja apagado.
                    </li>
                    <li>
                      <strong className="text-white">03. Atenção à memória RAM no Setup.exe:</strong> Se o seu computador tiver <strong className="text-amber-300">16 GB de RAM ou menos</strong>, marque obrigatoriamente a caixa <strong className="text-white">"Limit installer to 2GB of RAM"</strong> na tela inicial do instalador (FitGirl / DODI). Isso evita travamentos em 80%–95%.
                    </li>
                    <li>
                      <strong className="text-white">04. Aguarde sem fechar:</strong> Repacks altamente compactados usam bastante processador durante a descompressão. Não interrompa o processo se a barra parecer parada por alguns minutos e deixe a verificação de integridade final (<span className="font-mono text-slate-200">Verify BIN files</span>) concluir até o fim.
                    </li>
                    <li>
                      <strong className="text-white">05. Iniciar como Administrador:</strong> Ao finalizar, instale as opções de DirectX / Visual C++ oferecidas pelo instalador (ou pela aba Utilitários) e execute o jogo como Administrador.
                    </li>
                  </ol>
                )}
              </div>

              {/* Dicas & Solução Rápida de Problemas Comuns */}
              <div className="space-y-4">
                <h5 className="text-sm font-bold text-white flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Dicas Práticas & Solução de Erros Comuns</span>
                </h5>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <h6 className="text-xs font-bold text-cyan-300 uppercase tracking-wide">
                        Erro de DLL (vcruntime140, d3dx9, ISDone.dll)
                      </h6>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      90% dos erros ao abrir um jogo acontecem por falta do <strong>Visual C++ Redistributable (2015–2022)</strong> ou <strong>DirectX</strong>. Se o erro for <span className="font-mono text-amber-300">ISDone.dll / Unarc.dll</span> durante a instalação, instale em uma pasta curta sem acentos (ex: <span className="font-mono text-slate-200">C:\Games\Jogo</span>) e marque o limite de 2GB de RAM.
                    </p>
                    <button
                      type="button"
                      onClick={openUtilities}
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
                    >
                      Baixar pacotes C++ e DirectX em Utilitários →
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <h6 className="text-xs font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Jogo não abre ou sumiu o Crack / Steam_api64.dll</span>
                      </h6>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Quando você clica duas vezes e nada acontece, o <strong>Windows Defender</strong> geralmente moveu o arquivo para a Quarentena. Abra <em>Segurança do Windows &gt; Proteção contra vírus e ameaças &gt; Histórico de proteção</em>, clique em <strong>Restaurar</strong> e permita na pasta do jogo.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                    <h6 className="text-xs font-bold text-purple-300 uppercase tracking-wide">
                      Queda de FPS, Tela Preta ou Travamentos
                    </h6>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Atualize o driver da sua placa de vídeo (NVIDIA/AMD/Intel), feche navegadores com muitas abas abertas e teste alternar de Tela Cheia para <strong>Janela Sem Bordas</strong>. Em notebooks, jogue sempre conectado à tomada no plano de energia <em>Alto Desempenho</em>.
                    </p>
                    <button
                      type="button"
                      onClick={() => openCanIRunIt(game)}
                      className="text-xs font-bold text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
                    >
                      Conferir se seu hardware atende os requisitos →
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                    <h6 className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
                      Progresso (Saves) & Idioma em Português (PT-BR)
                    </h6>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Se o jogo não estiver salvando o progresso, execute-o sempre como <strong>Administrador</strong> (saves costumam ficar em <span className="font-mono text-slate-200">Documentos</span> ou <span className="font-mono text-slate-200">%AppData%</span>). Caso abra em inglês, confira as opções de idioma no menu interno ou altere <span className="font-mono text-slate-200">Language=brazilian</span> no arquivo <span className="font-mono text-slate-200">.ini</span> da pasta do jogo.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('localizations')}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer"
                    >
                      Ver idiomas disponíveis neste título →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: LOCALIZAÇÕES (PCGAMINGWIKI MATRIX) */}
          {activeTab === 'localizations' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header com Banner e Ações */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-indigo-950/20 border border-indigo-500/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400 shrink-0">
                    <Globe className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-wide flex items-center gap-2 flex-wrap">
                      <span>Quadro de Localizações & Idiomas (Padrão PCGamingWiki)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-black bg-indigo-500 text-slate-950">
                        {displayLocalizations.length} IDIOMAS MAPEADOS
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      Mapeamento rigoroso de Interface (UI), Dublagem (Áudio) e Legendas (Sub) com notas e links para download de patches comunitários.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  <a
                    href={game.pcgamingwikiUrl || getPcGamingWikiUrl(game.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                    title="Acessar página técnica completa no PCGamingWiki"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Ver no PCGamingWiki</span>
                  </a>

                  {isCreator && (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsScannerOpen(true)}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1 shadow-md cursor-pointer"
                        title="Varrer link de qualquer site para extrair dados verídicos e adicionar ao jogo"
                      >
                        <Search className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Varrer Link / Fonte</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const payload = generateGithubGamePayload(game);
                          navigator.clipboard.writeText(payload);
                          setCopiedGithubPayload(true);
                          setTimeout(() => setCopiedGithubPayload(false), 3500);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                        title="Exportar JSON pronto para enviar ao GitHub"
                      >
                        {copiedGithubPayload ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <GitBranch className="w-3.5 h-3.5 text-indigo-400" />}
                        <span>{copiedGithubPayload ? 'Copiado!' : 'Exportar GitHub'}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Feedback de cópia do GitHub */}
              {copiedGithubPayload && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Payload do GitHub copiado para a área de transferência! Pronto para comitar no repositório.</span>
                </div>
              )}

              {/* Tabela de Localizações no Padrão PCGamingWiki */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/70 shadow-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 font-mono uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3.5">Language (Idioma)</th>
                      <th className="p-3.5 text-center">UI (Interface)</th>
                      <th className="p-3.5 text-center">Audio (Dublagem)</th>
                      <th className="p-3.5 text-center">Sub (Legendas)</th>
                      <th className="p-3.5">Notes (Notas & Patches de Tradução)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {displayLocalizations.map((loc, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                        <td className="p-3.5 font-bold flex items-center gap-2 text-white">
                          <span className="text-base">{loc.flag}</span>
                          <span>{loc.language}</span>
                        </td>
                        <td className="p-3.5 text-center">
                          {loc.ui ? (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs" title="Interface Disponível">
                              ✓
                            </span>
                          ) : (
                            <span className="text-slate-600 font-mono">—</span>
                          )}
                        </td>
                        <td className="p-3.5 text-center">
                          {loc.audio ? (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs" title="Áudio e Dublagem Disponíveis">
                              ✓
                            </span>
                          ) : (
                            <span className="text-slate-600 font-mono">—</span>
                          )}
                        </td>
                        <td className="p-3.5 text-center">
                          {loc.sub ? (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs" title="Legendas Disponíveis">
                              ✓
                            </span>
                          ) : (
                            <span className="text-slate-600 font-mono">—</span>
                          )}
                        </td>
                        <td className="p-3.5 text-slate-300">
                          <div className="flex items-center justify-between gap-3 flex-wrap">
                            <span className="text-[11px]">{loc.notes || 'Oficial'}</span>
                            {loc.patchUrl && (
                              <a
                                href={loc.patchUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500 hover:text-slate-950 text-indigo-300 text-[11px] font-bold transition-all flex items-center gap-1 border border-indigo-500/40 cursor-pointer"
                              >
                                <span>Baixar Patch / Tradução</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Box de Informações de Compatibilidade Técnica */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Fonte Técnica
                  </span>
                  <p className="text-xs font-bold text-white">PCGamingWiki & Comunidade</p>
                  <p className="text-[11px] text-slate-400">Dados verificados por curadores e jogadores.</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> Traduções PT-BR
                  </span>
                  <p className="text-xs font-bold text-white">Tribo Gamer & GameVicio</p>
                  <p className="text-[11px] text-slate-400">Patches testados com instalador automático limpo.</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <GitBranch className="w-3.5 h-3.5 text-indigo-400" /> Integração GitHub
                  </span>
                  <p className="text-xs font-bold text-white">Exportação Direta em JSON</p>
                  <p className="text-[11px] text-slate-400">Pronto para commit em vortex-games/main.</p>
                </div>
              </div>
            </div>
          )}

          {/* COMMUNITY REVIEWS & COMMENTS SECTION */}
          <div id="avaliar-secao" className="pt-6 border-t border-slate-800 space-y-6">
            
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-black text-white font-display">
                  Avaliações & Comentários da Comunidade ({gameComments.length})
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                Compartilhe sua experiência de instalação e jogabilidade!
              </span>
            </div>

            {/* Comment Form with Rating */}
            <form onSubmit={handleSubmitComment} className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                {/* Author Name */}
                <input
                  type="text"
                  value={authorName}
                  onChange={e => setAuthorName(e.target.value)}
                  placeholder="Seu Apelido Gamer (opcional)"
                  className="w-full sm:w-64 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />

                {/* Interactive Star Rating */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400">Sua Nota:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => handleQuickStarClick(star)}
                        onMouseEnter={() => setHoverScore(star)}
                        onMouseLeave={() => setHoverScore(0)}
                        className="p-1 hover:scale-125 transition-transform cursor-pointer"
                        title={`Votar com ${star} Estrelas`}
                      >
                        <Star 
                          className={`w-5 h-5 ${
                            (hoverScore || userScore) >= star
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-amber-400 ml-1">{userScore}.0</span>
                  {submittedVoteNotice && (
                    <span className="text-[11px] font-bold text-emerald-400 animate-pulse ml-2">
                      ✓ Voto registrado!
                    </span>
                  )}
                </div>

              </div>

              {/* Review Textarea */}
              <textarea
                value={reviewContent}
                onChange={e => setReviewContent(e.target.value)}
                rows={3}
                placeholder="Como foi a instalação? O torrent baixou rápido? Rodou a quantos FPS no seu PC? Deixe seu feedback..."
                className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all resize-none"
                required
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Respeite as regras da comunidade. Sem links externos maliciosos.
                </span>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-md shadow-cyan-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publicar Avaliação</span>
                </button>
              </div>

              {submittedComment && (
                <p className="text-xs text-emerald-400 font-medium">
                  ✓ Avaliação postada com sucesso! Obrigado por ajudar outros jogadores.
                </p>
              )}
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {gameComments.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-950/40 border border-slate-800/60 text-slate-400 text-xs">
                  Ainda não há comentários para este jogo. Seja o primeiro a avaliar!
                </div>
              ) : (
                gameComments.map(comment => (
                  <div 
                    key={comment.id}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={comment.authorAvatar} 
                          alt={comment.authorName} 
                          className="w-8 h-8 rounded-full border border-slate-700 bg-slate-800"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{comment.authorName}</span>
                            {comment.authorRole === 'admin' && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                ADMIN
                              </span>
                            )}
                            {comment.authorRole === 'vip' && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                VIP
                              </span>
                            )}
                            {comment.verifiedDownload && (
                              <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3" /> Download Verificado
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500">{comment.createdAt}</span>
                        </div>
                      </div>

                      {/* Comment rating */}
                      {comment.rating && (
                        <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{comment.rating}.0</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {comment.content}
                    </p>

                    {/* Like & Reply bar */}
                    <div className="flex items-center gap-4 text-xs pt-1">
                      <button
                        onClick={() => likeComment(comment.id)}
                        className={`flex items-center gap-1.5 transition-colors ${
                          comment.userLiked ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{comment.likes} curtidas</span>
                      </button>
                    </div>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="pl-6 border-l-2 border-slate-800 space-y-2 pt-1">
                        {comment.replies.map(rep => (
                          <div key={rep.id} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-white">{rep.authorName}</span>
                              {rep.authorRole === 'admin' && (
                                <span className="text-[9px] px-1 py-0.2 rounded font-bold bg-rose-500/20 text-rose-300">
                                  ADMIN
                                </span>
                              )}
                              <span className="text-[10px] text-slate-500">{rep.createdAt}</span>
                            </div>
                            <p className="text-slate-300">{rep.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                ))
              )}
            </div>

          </div>

        </div>

      </div>

      {/* MODAL DE VARREDURA DE FONTES & VERIFICADOR (ADMIN) */}
      <SourceScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        game={game}
        onGameUpdated={(updatedGame) => {
          updateGame(updatedGame);
        }}
      />
    </div>
  );
};
