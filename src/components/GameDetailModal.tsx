import React, { useState } from 'react';
import { 
  X, 
  ArrowLeft,
  Download, 
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
  Globe
} from 'lucide-react';
import { Game, LibraryStatus } from '../types';
import { useGame } from '../context/GameContext';

interface GameDetailModalProps {
  game: Game;
  onClose: () => void;
}

export const GameDetailModal: React.FC<GameDetailModalProps> = ({ game, onClose }) => {
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
    incrementDownload,
    userProfile 
  } = useGame();

  const [activeTab, setActiveTab] = useState<'downloads' | 'specs' | 'screenshots' | 'instructions'>('downloads');
  const [copiedMagnet, setCopiedMagnet] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  
  // Safe System Requirements computation
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

  // Exibir apenas as imagens do jogo com limite estrito de 4 imagens
  const realGameScreenshots = (Array.isArray(game.screenshots) && game.screenshots.length > 0)
    ? game.screenshots.filter(s => typeof s === 'string' && s.trim().length > 0)
    : [game.bannerUrl, game.coverUrl].filter(Boolean);

  const displayScreenshots = realGameScreenshots.slice(0, 4);
  
  // User review form state
  const [authorName, setAuthorName] = useState(userProfile.name);
  const [reviewContent, setReviewContent] = useState('');
  const [userScore, setUserScore] = useState(5);
  const [hoverScore, setHoverScore] = useState(0);
  const [submittedComment, setSubmittedComment] = useState(false);

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
    navigator.clipboard.writeText(url);
    setCopiedMagnet(true);
    setTimeout(() => setCopiedMagnet(false), 2500);
  };

  const handleDownloadClick = (url: string) => {
    incrementDownload(game.id);
    if (url.startsWith('magnet:')) {
      window.location.href = url;
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

    rateGame(game.id, userScore);
    addComment(game.id, authorName || 'Jogador Gamer', reviewContent.trim(), userScore);
    setReviewContent('');
    setSubmittedComment(true);
    setTimeout(() => setSubmittedComment(false), 3000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5 animate-fadeIn">
      {/* Traditional Site Header & Return Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs sm:text-sm font-bold text-slate-200 hover:text-white transition-all shadow-sm group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
          <span>Voltar ao Catálogo de Jogos</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <button onClick={onClose} className="hover:text-cyan-400 transition-colors">Início</button>
          <span>/</span>
          <span>Catálogo</span>
          <span>/</span>
          <span className="text-cyan-400 font-semibold truncate max-w-xs">{game.title}</span>
        </div>
      </div>

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
            src={game.bannerUrl || game.coverUrl} 
            alt={game.title} 
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

            {/* Dual Rating Badges: IMDb & User Rating (Votos Reais) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-950/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800 self-stretch sm:self-auto shadow-xl">
              
              {/* IMDb Rating */}
              <div className="flex items-center gap-2 pr-0 sm:pr-3 border-b sm:border-b-0 sm:border-r border-slate-800 pb-2.5 sm:pb-0">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm">
                      IMDb
                    </span>
                    <span className="text-xl font-black text-amber-300 font-mono">
                      {(game.imdbRating || 8.8).toFixed(1)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">/ 10</span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                    Crítica Externa
                  </span>
                </div>
              </div>

              {/* User Community Rating - Baseado 100% em Votos Reais */}
              <div className="flex items-center justify-between sm:justify-start gap-3">
                <div>
                  {game.totalVotes > 0 ? (
                    <>
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span className="text-xl font-black text-white">{game.rating.toFixed(1)}</span>
                        <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        {game.totalVotes} {game.totalVotes === 1 ? 'voto real' : 'votos reais'} da comunidade
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-1 text-slate-400">
                        <Star className="w-4 h-4 text-slate-600" />
                        <span className="text-sm font-bold text-slate-300">Sem avaliações</span>
                      </div>
                      <p className="text-[10px] text-cyan-400 font-semibold">
                        Nenhum voto ainda
                      </p>
                    </>
                  )}
                </div>

                {/* User rating button trigger */}
                {getUserVote(game.id) ? (
                  <div className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>Seu voto: {getUserVote(game.id)}.0</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      const element = document.getElementById('avaliar-secao');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 border border-cyan-500/30 transition-all cursor-pointer whitespace-nowrap"
                  >
                    Votar no Jogo
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

          {/* Quick Repack stats */}
          <div className="flex items-center gap-4 text-xs text-slate-300 font-medium">
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
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'downloads'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Links de Download Torrent</span>
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
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
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'screenshots'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Capturas & Imagens</span>
          </button>
          <button
            onClick={() => setActiveTab('instructions')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'instructions'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Como Instalar & Dicas</span>
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
                        {game.downloadLinks.find(l => l.firmware)?.firmware || 'PC Windows / Emulador'}
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

              {/* DISTINCT DOWNLOAD BUTTONS SECTION */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-cyan-400" />
                  Opções de Download por Formato & Plataforma
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* BUTTON 1: TORRENT PC (MAGNET) */}
                  {game.downloadLinks.filter(l => l.type === 'magnet' || l.type === 'torrent' || l.format === 'torrent').map(link => (
                    <div 
                      key={link.id}
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

                        <h5 className="text-sm font-bold text-white font-display">
                          {link.label}
                        </h5>

                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>Tamanho: <strong className="text-white font-mono">{link.size}</strong></span>
                          <span>•</span>
                          <span>Formato: <strong className="text-cyan-300">.torrent / Magnet</strong></span>
                          <span>•</span>
                          <span className="text-emerald-400 font-medium">Download Imediato</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <a
                          href={link.url}
                          onClick={() => incrementDownload(game.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-black text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-md shadow-cyan-500/30 transition-all transform hover:scale-[1.02] cursor-pointer"
                          title="Enviar link Magnet direto para seu aplicativo de torrent (qBittorrent / uTorrent)"
                        >
                          <Download className="w-4 h-4 stroke-[2.5]" />
                          <span>Baixar Torrent PC (Abrir no qBittorrent / uTorrent)</span>
                        </a>

                        <button
                          onClick={() => handleCopyMagnet(link.url)}
                          className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all shrink-0"
                          title="Copiar Link Magnet"
                        >
                          {copiedMagnet ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* BUTTON 2: ARQUIVO PKG (PLAYSTATION / THEZUKOSTORE) */}
                  {game.downloadLinks.filter(l => l.type === 'pkg' || l.format === 'pkg').map(link => (
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

                        <h5 className="text-sm font-bold text-white font-display">
                          {link.label}
                        </h5>

                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>Tamanho: <strong className="text-white font-mono">{link.size}</strong></span>
                          <span>•</span>
                          <span>Compatível: <strong className="text-purple-300">{link.firmware || 'PS4 5.05 - 11.00'}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => handleDownloadClick(link.url)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-black text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/30 transition-all transform hover:scale-[1.02]"
                        >
                          <FileArchive className="w-4 h-4 stroke-[2.5]" />
                          <span>Baixar Arquivo PKG (Direto)</span>
                        </button>

                        <button
                          onClick={() => handleCopyMagnet(link.url)}
                          className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all shrink-0"
                          title="Copiar Link do Arquivo"
                        >
                          {copiedMagnet ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* BUTTON 3: PACOTE / PATCH DUBLAGEM & TRADUÇÃO PT-BR */}
                  {game.downloadLinks.filter(l => l.type === 'pt_br_patch' || l.format === 'pt_br_patch').map(link => (
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
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-black text-xs bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-md shadow-emerald-500/30 transition-all transform hover:scale-[1.02]"
                        >
                          <Volume2 className="w-4 h-4 stroke-[2.5]" />
                          <span>Baixar Pacote de Dublagem PT-BR</span>
                        </button>

                        <button
                          onClick={() => handleCopyMagnet(link.url)}
                          className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all shrink-0"
                          title="Copiar Link do Pacote"
                        >
                          {copiedMagnet ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))}

                </div>
              </div>

              {/* Other Links & Mirrors (Servidores Alternativos com Links Diretos nos Botões) */}
              {game.downloadLinks.filter(l => l.type === 'direct' || l.type === 'mirror').length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                      Mirrors Diretos & Servidores Alternativos
                    </h4>
                    <span className="text-[11px] text-slate-500">Links diretos integrados nos botões</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {game.downloadLinks.filter(l => l.type === 'direct' || l.type === 'mirror').map((link) => (
                      <div 
                        key={link.id}
                        className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-all"
                      >
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-white truncate">{link.label}</p>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                            <span>{link.size}</span>
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

            </div>
          )}

          {/* TAB: SYSTEM SPECS */}
          {activeTab === 'specs' && (
            <div className="space-y-6">
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
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (game.coverUrl && target.src !== game.coverUrl) {
                            target.src = game.coverUrl;
                          }
                        }}
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

          {/* TAB: INSTRUCTIONS */}
          {activeTab === 'instructions' && (
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4 text-xs text-slate-300">
              <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wide flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Guia Rápido de Instalação Sem Erros de DLL ou Antivírus
              </h4>

              <ol className="list-decimal list-inside space-y-2.5 leading-relaxed">
                <li><strong className="text-white">Baixe o Torrent:</strong> Utilize clientes recomendados como <em>qBittorrent</em> ou <em>Transmission</em> para máxima taxa de download.</li>
                <li><strong className="text-white">Antivírus / Windows Defender:</strong> Pause temporariamente o antivírus ou adicione a pasta de instalação como exceção. Os arquivos do crack podem gerar falso-positivo em alguns antivírus.</li>
                <li><strong className="text-white">Execute o Setup.exe:</strong> Caso seu PC tenha menos de 16GB de RAM, marque a opção "Limit RAM to 2GB" na tela inicial do instalador FitGirl / DODI para evitar travamentos de descompressão.</li>
                <li><strong className="text-white">Softwares Necessários:</strong> Certifique-se de possuir o DirectX atualizado e os pacotes <em>Visual C++ Redistributable (2015-2022)</em> instalados.</li>
                <li><strong className="text-white">Executar como Administrador:</strong> Clique com botão direito no atalho criado e selecione "Executar como Administrador" para jogar.</li>
              </ol>
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
    </div>
  );
};
