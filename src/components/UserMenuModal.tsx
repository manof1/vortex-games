import React, { useState } from 'react';
import { 
  X, 
  ArrowLeft,
  User, 
  Bookmark, 
  Download, 
  Star, 
  Flame, 
  CheckCircle2, 
  Trophy, 
  Settings, 
  Sparkles, 
  ExternalLink,
  Edit3,
  LogOut,
  Gamepad2,
  Cloud,
  Smartphone,
  RefreshCw,
  Zap,
  Award
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import { LibraryStatus, UserProfile } from '../types';
import { sanitizeMagnetLink } from '../utils/magnetUtils';
import { getGameCover, handleImageError } from '../utils/imageUtils';

interface UserMenuModalProps {
  onClose: () => void;
}

export const UserMenuModal: React.FC<UserMenuModalProps> = ({ onClose }) => {
  const { 
    userProfile, 
    updateUserProfile, 
    library, 
    games, 
    comments, 
    rateGame, 
    updateLibraryStatus, 
    removeFromLibrary, 
    incrementDownload, 
    setActiveGame,
    setIsAdminOpen,
    isLoggedIn,
    logout,
    setIsAuthModalOpen,
    syncToCloud,
    getUserVote
  } = useGame();
  const { language, setLanguage, supportedLanguages } = useLanguage();

  const [activeTab, setActiveTab] = useState<'profile' | 'library' | 'reviews' | 'settings'>('profile');
  const [libraryFilter, setLibraryFilter] = useState<'all' | LibraryStatus>('all');
  const [syncStatusMsg, setSyncStatusMsg] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [nameInput, setNameInput] = useState(userProfile.name);
  const [tagInput, setTagInput] = useState(userProfile.tag);
  const [bioInput, setBioInput] = useState(userProfile.bio);
  const [favGenreInput, setFavGenreInput] = useState(userProfile.favoriteGenre);
  const [platformInput, setPlatformInput] = useState(userProfile.preferredPlatform);

  // Available Avatar Seeds
  const avatarSeeds = ['GamerPro', 'CyberVortex', 'ShadowKnight', 'PixelWarrior', 'FitGirlFan', 'RetroMaster'];

  // User comments & text reviews
  const userReviews = comments.filter(c => 
    c.authorName.toLowerCase() === userProfile.name.toLowerCase() || 
    c.authorName.toLowerCase() === 'vigilancia' ||
    c.authorName.toLowerCase() === 'jogador gamer' ||
    c.authorName.toLowerCase() === 'jogador anônimo'
  );

  // User rating votes map (estrelas dadas no catálogo e salvas em vortex_user_votes)
  const userVotesMap: Record<string, number> = (() => {
    try {
      return JSON.parse(localStorage.getItem('vortex_user_votes') || '{}');
    } catch {
      return {};
    }
  })();

  // User downloaded games list from localStorage
  const userDownloadedIds: string[] = (() => {
    try {
      return JSON.parse(localStorage.getItem('vortex_downloaded_ids') || '[]');
    } catch {
      return [];
    }
  })();

  // Games in user's library with metadata
  const libraryGames = library.map(entry => {
    const game = games.find(g => g.id === entry.gameId);
    return { entry, game };
  }).filter((item): item is { entry: typeof item.entry; game: NonNullable<typeof item.game> } => !!item.game);

  // Downloaded games calculation (unifies library entries with status 'downloaded', downloadCount > 0, and userDownloadedIds)
  const allDownloadedGameIds = new Set<string>([
    ...userDownloadedIds,
    ...libraryGames
      .filter(item => item.entry.status === 'downloaded' || (item.entry.downloadCount && item.entry.downloadCount > 0))
      .map(item => item.entry.gameId)
  ]);
  const downloadedCount = allDownloadedGameIds.size;

  // Library stats
  const totalInLibrary = library.length;
  const playingCount = library.filter(e => e.status === 'playing').length;
  const completedCount = library.filter(e => e.status === 'completed').length;
  const wishlistCount = library.filter(e => e.status === 'wishlist').length;

  // Build unified map of ALL games evaluated by the user (stars or reviews)
  const evaluatedMap = new Map<string, { gameId: string; score: number; comment?: string; date?: string }>();

  // 1. From local votes map (star votes on catalog or modal)
  Object.entries(userVotesMap).forEach(([gid, score]) => {
    if (typeof score === 'number' && score > 0) {
      evaluatedMap.set(gid, { gameId: gid, score, date: 'Avaliação Registrada' });
    }
  });

  // 2. From library userRating
  library.forEach(entry => {
    if (entry.userRating && entry.userRating > 0) {
      const existing = evaluatedMap.get(entry.gameId);
      evaluatedMap.set(entry.gameId, {
        gameId: entry.gameId,
        score: entry.userRating,
        comment: existing?.comment,
        date: existing?.date || 'Avaliado na Biblioteca'
      });
    }
  });

  // 3. From user comments & written reviews
  userReviews.forEach(r => {
    const existing = evaluatedMap.get(r.gameId);
    evaluatedMap.set(r.gameId, {
      gameId: r.gameId,
      score: r.rating || existing?.score || 5,
      comment: r.content,
      date: r.createdAt || 'Avaliação Recente'
    });
  });

  // Consolidated list of evaluations with full game metadata
  const allUserEvaluations = Array.from(evaluatedMap.values()).map(item => {
    const game = games.find(g => g.id === item.gameId);
    return { ...item, game };
  }).filter((item): item is typeof item & { game: NonNullable<typeof item.game> } => !!item.game);

  // Active evaluations count (100% reactive)
  const avaliacoesCount = Math.max(evaluatedMap.size, allUserEvaluations.length, userProfile.reviewsCount || 0);

  // Gamer Level & XP System (Gamification Idea)
  const totalXP = (downloadedCount * 20) + (playingCount * 30) + (completedCount * 120) + (avaliacoesCount * 40);
  const userLevel = Math.max(1, Math.floor(totalXP / 100) + 1);
  const currentLevelXP = totalXP % 100;
  const levelTitle = userLevel >= 10 
    ? 'Lenda dos Games' 
    : userLevel >= 7 
    ? 'Mestre dos Torrents' 
    : userLevel >= 4 
    ? 'Gamer Experiente' 
    : userLevel >= 2 
    ? 'Explorador de Repacks' 
    : 'Recruta Gamer';

  // Filtered games for Library Tab
  const filteredLibraryGames = libraryGames.filter(item => {
    if (libraryFilter === 'all') return true;
    if (libraryFilter === 'downloaded') {
      return item.entry.status === 'downloaded' || (item.entry.downloadCount && item.entry.downloadCount > 0) || allDownloadedGameIds.has(item.entry.gameId);
    }
    return item.entry.status === libraryFilter;
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: nameInput.trim() || userProfile.name,
      tag: tagInput.trim() || userProfile.tag,
      bio: bioInput.trim(),
      favoriteGenre: favGenreInput,
      preferredPlatform: platformInput
    });
    setIsEditingBio(false);
  };

  const handleAvatarSelect = (seed: string) => {
    updateUserProfile({
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`
    });
  };

  const handleQuickDownload = (game: any) => {
    incrementDownload(game.id);
    const link = game.downloadLinks.find((l: any) => l.type === 'magnet' || l.type === 'torrent') || game.downloadLinks[0];
    if (link) {
      if (link.type === 'magnet' || link.url?.startsWith('magnet:')) {
        const cleanUrl = sanitizeMagnetLink(link.url, `${game.title} [${game.repackInfo?.repacker || 'Vortex'}]`);
        window.location.href = cleanUrl;
      } else {
        window.open(link.url, '_blank');
      }
    } else {
      setActiveGame(game);
      onClose();
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5 animate-fadeIn">
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs sm:text-sm font-bold text-slate-200 hover:text-white transition-all shadow-sm group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
          <span>Voltar ao Catálogo de Jogos</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Automatic Cloud Sync Status Pill */}
          <div 
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold"
            title="Sua conta, favoritos e notas salvam automaticamente na nuvem ao fazer login."
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">Sincronização Nuvem:</span>
            <span>Ativa</span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
            <button onClick={onClose} className="hover:text-cyan-400 transition-colors">Início</button>
            <span>/</span>
            <span className="text-cyan-400 font-semibold">Conta & Perfil do Jogador</span>
          </div>
        </div>
      </div>

      <div 
        className="relative w-full rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[580px]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-slate-800/80 hover:bg-rose-600 text-slate-400 hover:text-white transition-all shadow-md cursor-pointer"
          title="Fechar e Voltar ao Catálogo"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Sidebar / User Navigation */}
        <div className="w-full md:w-64 bg-slate-950/70 border-b md:border-b-0 md:border-r border-slate-800 p-5 flex flex-col justify-between shrink-0">
          <div>
            {/* User Mini Avatar & Name */}
            <div className="flex items-center gap-3.5 mb-6 pb-5 border-b border-slate-800/80">
              <div className="relative">
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-13 h-13 rounded-2xl bg-cyan-950 border-2 border-cyan-500/40 p-1 shadow-lg shadow-cyan-500/10 object-cover"
                />
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950" title="Online" />
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white truncate font-display">{userProfile.name}</h3>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-black bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">VIP</span>
                </div>
                <p className="text-xs text-slate-400 font-mono">#{userProfile.tag}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-[10px] font-bold text-amber-300">Nvl {userLevel} • {levelTitle}</span>
                </div>
              </div>
            </div>

            {/* Menu Items (Simplified and purposeful) */}
            <nav className="space-y-1.5">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === 'profile'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Perfil & Estatísticas</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('library');
                  setLibraryFilter('all');
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === 'library'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Bookmark className="w-4 h-4" />
                  <span>Minha Biblioteca</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                  activeTab === 'library' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-cyan-400'
                }`}>
                  {totalInLibrary}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === 'reviews'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4" />
                  <span>Minhas Avaliações</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                  activeTab === 'reviews' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-amber-400'
                }`}>
                  {avaliacoesCount}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === 'settings'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Preferências & Conta</span>
              </button>
            </nav>
          </div>

          {/* Quick Access to Admin Panel */}
          <div className="pt-4 border-t border-slate-800/80">
            <button
              onClick={() => {
                onClose();
                setIsAdminOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Painel Admin & IGDB</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-5 sm:p-7 overflow-y-auto max-h-[85vh]">
          
          {/* TAB 1: PROFILE & DYNAMIC STATS */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950/80 via-slate-900 to-slate-950 border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <Gamepad2 className="w-40 h-40 text-cyan-400" />
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                  <div className="flex items-center gap-4">
                    <img
                      src={userProfile.avatar}
                      alt={userProfile.name}
                      className="w-20 h-20 rounded-2xl bg-slate-950 border-2 border-cyan-400 p-1 shadow-lg shadow-cyan-500/20"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-black text-white font-display">{userProfile.name}</h2>
                        <span className="text-xs text-slate-400 font-mono">#{userProfile.tag}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{userProfile.bio}</p>
                      
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-800/40 font-medium">
                          🎮 Plataforma: {userProfile.preferredPlatform}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-purple-950/80 text-purple-300 border border-purple-800/40 font-medium">
                          🔥 Gênero Favorito: {userProfile.favoriteGenre}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsEditingBio(!isEditingBio)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all shrink-0 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isEditingBio ? 'Cancelar' : 'Editar Perfil'}</span>
                  </button>
                </div>

                {/* Edit Form */}
                {isEditingBio && (
                  <form onSubmit={handleSaveProfile} className="mt-5 pt-5 border-t border-slate-800 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Nome de Jogador</label>
                        <input
                          type="text"
                          value={nameInput}
                          onChange={e => setNameInput(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Tag / Nick</label>
                        <input
                          type="text"
                          value={tagInput}
                          onChange={e => setTagInput(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Bio Gamer</label>
                      <input
                        type="text"
                        value={bioInput}
                        onChange={e => setBioInput(e.target.value)}
                        placeholder="Escreva algo sobre seus gostos de jogos..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Plataforma Principal</label>
                        <select
                          value={platformInput}
                          onChange={e => setPlatformInput(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                        >
                          <option value="PC">PC Gamer (Torrent / Repacks)</option>
                          <option value="PS4">PlayStation 4 (PKG / Hen)</option>
                          <option value="PS5">PlayStation 5</option>
                          <option value="Emulador">Emuladores (RPCS3 / ShadPS4)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Gênero Favorito</label>
                        <input
                          type="text"
                          value={favGenreInput}
                          onChange={e => setFavGenreInput(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    {/* Choose Avatar */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-2">Escolha seu Avatar Gamer</label>
                      <div className="flex items-center gap-3 overflow-x-auto pb-2">
                        {avatarSeeds.map(seed => (
                          <img
                            key={seed}
                            src={`https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`}
                            alt={seed}
                            onClick={() => handleAvatarSelect(seed)}
                            className="w-12 h-12 rounded-xl bg-slate-950 border-2 border-slate-700 hover:border-cyan-400 p-1 cursor-pointer transition-all hover:scale-105"
                          />
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
                    >
                      Salvar Alterações
                    </button>
                  </form>
                )}
              </div>

              {/* Extra Feature: Gamification / Gamer Level & XP Bar */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border border-indigo-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white">Nível Gamer: Nvl {userLevel} • {levelTitle}</span>
                      <p className="text-[11px] text-slate-400">Ganhe XP baixando repacks, jogando e avaliando jogos!</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-300">{totalXP} XP Total</span>
                </div>

                {/* Progress bar to next level */}
                <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-amber-400 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(5, currentLevelXP))}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Progresso do Nível Atual: {currentLevelXP} / 100 XP</span>
                  <span>Faltam {100 - currentLevelXP} XP para o próximo nível</span>
                </div>
              </div>

              {/* Gamer Stats Grid (100% Dynamic & Clickable) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Estatísticas Reais da Sua Conta</h4>
                  <span className="text-[11px] text-cyan-400 font-medium">Toque em qualquer card para ver a lista</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {/* Stat 1: Jogos Baixados */}
                  <div 
                    onClick={() => {
                      setActiveTab('library');
                      setLibraryFilter('downloaded');
                    }}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/80 transition-all text-center cursor-pointer group"
                    title="Clique para ver seus jogos baixados na biblioteca"
                  >
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 w-fit mx-auto mb-2 group-hover:scale-110 transition-transform">
                      <Download className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-black text-white font-display group-hover:text-blue-400 transition-colors">
                      {downloadedCount}
                    </div>
                    <div className="text-xs text-slate-400 font-medium">Jogos Baixados</div>
                  </div>

                  {/* Stat 2: Jogando Agora */}
                  <div 
                    onClick={() => {
                      setActiveTab('library');
                      setLibraryFilter('playing');
                    }}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/80 transition-all text-center cursor-pointer group"
                    title="Clique para ver os jogos marcados como 'Jogando'"
                  >
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit mx-auto mb-2 group-hover:scale-110 transition-transform">
                      <Gamepad2 className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-black text-white font-display group-hover:text-emerald-400 transition-colors">
                      {playingCount}
                    </div>
                    <div className="text-xs text-slate-400 font-medium">Jogando Agora</div>
                  </div>

                  {/* Stat 3: Jogos Zerados */}
                  <div 
                    onClick={() => {
                      setActiveTab('library');
                      setLibraryFilter('completed');
                    }}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-900/80 transition-all text-center cursor-pointer group"
                    title="Clique para ver os jogos que você já zerou"
                  >
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 w-fit mx-auto mb-2 group-hover:scale-110 transition-transform">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-black text-white font-display group-hover:text-purple-400 transition-colors">
                      {completedCount}
                    </div>
                    <div className="text-xs text-slate-400 font-medium">Jogos Zerados</div>
                  </div>

                  {/* Stat 4: Avaliações Feitas (Corrigido e Reativo) */}
                  <div 
                    onClick={() => setActiveTab('reviews')}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/80 transition-all text-center cursor-pointer group"
                    title="Clique para ver todas as avaliações e notas dadas"
                  >
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 w-fit mx-auto mb-2 group-hover:scale-110 transition-transform">
                      <Star className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-black text-white font-display group-hover:text-amber-400 transition-colors">
                      {avaliacoesCount}
                    </div>
                    <div className="text-xs text-slate-400 font-medium">Avaliações Feitas</div>
                  </div>
                </div>
              </div>

              {/* Quick Jump Shortcuts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div 
                  onClick={() => {
                    setActiveTab('library');
                    setLibraryFilter('all');
                  }}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                      <Bookmark className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">Explorar Minha Biblioteca</h4>
                      <p className="text-xs text-slate-400">{totalInLibrary} títulos salvos e organizados</p>
                    </div>
                  </div>
                  <span className="text-cyan-400 text-lg">→</span>
                </div>

                <div 
                  onClick={() => setActiveTab('reviews')}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                      <Star className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">Minhas Avaliações & Notas</h4>
                      <p className="text-xs text-slate-400">{avaliacoesCount} jogos pontuados por você</p>
                    </div>
                  </div>
                  <span className="text-amber-400 text-lg">→</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY LIBRARY (Includes Downloads + All Status with Filters) */}
          {activeTab === 'library' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white font-display">Minha Biblioteca Gamer</h3>
                  <p className="text-xs text-slate-400">Gerencie todos os seus repacks, downloads, jogos zerados e status</p>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => setLibraryFilter('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      libraryFilter === 'all'
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    Todos ({libraryGames.length})
                  </button>
                  <button
                    onClick={() => setLibraryFilter('downloaded')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      libraryFilter === 'downloaded'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Download className="w-3 h-3" />
                    <span>Baixados ({downloadedCount})</span>
                  </button>
                  <button
                    onClick={() => setLibraryFilter('playing')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      libraryFilter === 'playing'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    Jogando ({playingCount})
                  </button>
                  <button
                    onClick={() => setLibraryFilter('completed')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      libraryFilter === 'completed'
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    Zerados ({completedCount})
                  </button>
                  <button
                    onClick={() => setLibraryFilter('wishlist')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      libraryFilter === 'wishlist'
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    Quero Jogar ({wishlistCount})
                  </button>
                </div>
              </div>

              {filteredLibraryGames.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-slate-950/40 border border-slate-800 space-y-3">
                  <Bookmark className="w-12 h-12 text-slate-600 mx-auto" />
                  <h4 className="text-sm font-bold text-white">Nenhum jogo nesta categoria</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    {libraryFilter === 'downloaded' 
                      ? 'Quando você baixar jogos via torrent ou PKG, eles ficarão listados aqui com acesso rápido para baixar novamente!'
                      : 'Navegue pelo catálogo e adicione jogos à sua biblioteca ou mude o status para preencher esta lista!'}
                  </p>
                  <button
                    onClick={() => onClose()}
                    className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 cursor-pointer"
                  >
                    Navegar pelo Catálogo
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredLibraryGames.map(({ entry, game }) => (
                    <div
                      key={entry.gameId}
                      className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={getGameCover(game)}
                          alt={game.title}
                          referrerPolicy="no-referrer"
                          onError={(e) => handleImageError(e, game)}
                          className="w-14 h-18 object-cover rounded-xl border border-slate-800 shrink-0 cursor-pointer hover:opacity-90"
                          onClick={() => {
                            setActiveGame(game);
                            onClose();
                          }}
                        />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <select
                              value={entry.status}
                              onChange={e => updateLibraryStatus(game.id, e.target.value as LibraryStatus)}
                              className="text-[11px] font-bold bg-slate-900 border border-slate-700 rounded-lg px-2 py-0.5 text-cyan-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
                            >
                              <option value="playing">🎮 Jogando</option>
                              <option value="completed">🏆 Zerado</option>
                              <option value="wishlist">📌 Quero Jogar</option>
                              <option value="backlog">⏳ Na Fila</option>
                              <option value="downloaded">💾 Baixado</option>
                            </select>
                            <span className="text-xs text-slate-400 font-mono">{game.repackInfo?.repackSize || '45 GB'}</span>
                            {game.repackInfo?.repacker && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                                {game.repackInfo.repacker}
                              </span>
                            )}
                          </div>
                          
                          <h4
                            onClick={() => {
                              setActiveGame(game);
                              onClose();
                            }}
                            className="text-sm font-bold text-white hover:text-cyan-400 cursor-pointer mt-1 font-display"
                          >
                            {game.title}
                          </h4>

                          {/* Interactive Rating Stars (Updates stats in real time) */}
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-[11px] text-slate-400 mr-1">Sua nota:</span>
                            {[1, 2, 3, 4, 5].map(star => {
                              const activeVote = getUserVote(game.id) || entry.userRating || 0;
                              return (
                                <button
                                  key={star}
                                  onClick={() => rateGame(game.id, star)}
                                  className="p-0.5 hover:scale-125 transition-transform cursor-pointer"
                                  title={`Avaliar com ${star} Estrelas`}
                                >
                                  <Star
                                    className={`w-3.5 h-3.5 ${
                                      activeVote >= star
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-slate-600 hover:text-slate-400'
                                    }`}
                                  />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                        <button
                          onClick={() => {
                            setActiveGame(game);
                            onClose();
                          }}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-cyan-500 text-slate-300 hover:text-slate-950 border border-slate-700 hover:border-cyan-400 transition-all cursor-pointer"
                          title="Ver Ficha Completa do Jogo"
                        >
                          <span>Ver Ficha do Jogo</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => removeFromLibrary(game.id)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Remover da Biblioteca"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MY REVIEWS & EVALUATIONS (Active, unified list) */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white font-display">Minhas Avaliações & Notas de Jogos</h3>
                  <p className="text-xs text-slate-400">Todos os jogos avaliados por você com estrelas ou comentários</p>
                </div>
                <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-950 text-amber-400 border border-amber-800/40">
                  {avaliacoesCount} {avaliacoesCount === 1 ? 'avaliação' : 'avaliações'}
                </span>
              </div>

              {allUserEvaluations.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-slate-950/40 border border-slate-800 space-y-3">
                  <Star className="w-12 h-12 text-slate-600 mx-auto" />
                  <h4 className="text-sm font-bold text-white">Nenhuma avaliação registrada ainda</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Abra qualquer jogo no catálogo e clique nas estrelas de 1 a 5 ou deixe seu comentário! Suas avaliações atualizarão suas estatísticas imediatamente.
                  </p>
                  <button
                    onClick={() => onClose()}
                    className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer"
                  >
                    Avaliar Jogos no Catálogo
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {allUserEvaluations.map(item => (
                    <div
                      key={item.gameId}
                      className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={getGameCover(item.game)}
                            alt={item.game.title}
                            referrerPolicy="no-referrer"
                            onError={(e) => handleImageError(e, item.game)}
                            className="w-12 h-16 object-cover rounded-xl border border-slate-800 shrink-0 cursor-pointer"
                            onClick={() => {
                              setActiveGame(item.game);
                              onClose();
                            }}
                          />
                          <div>
                            <h4
                              onClick={() => {
                              setActiveGame(item.game);
                              onClose();
                            }}
                              className="text-sm font-bold text-white hover:text-cyan-400 cursor-pointer font-display"
                            >
                              {item.game.title}
                            </h4>
                            <p className="text-xs text-slate-400 font-mono">
                              {item.game.repackInfo?.repacker || 'Repack'} • {item.game.repackInfo?.repackSize || 'Torrent'}
                            </p>
                            <span className="text-[10px] text-slate-500">{item.date}</span>
                          </div>
                        </div>

                        {/* Interactive Star Vote for this game */}
                        <div className="flex items-center gap-1 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 self-start sm:self-auto">
                          <span className="text-xs font-bold text-amber-300 mr-1.5">{item.score} / 5</span>
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => rateGame(item.game.id, star)}
                              className="p-0.5 hover:scale-125 transition-transform cursor-pointer"
                              title={`Mudar nota para ${star} estrelas`}
                            >
                              <Star
                                className={`w-3.5 h-3.5 ${
                                  item.score >= star
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-600'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Comment text if any */}
                      {item.comment && (
                        <p className="text-xs text-slate-300 bg-slate-900/70 p-3 rounded-xl border border-slate-800/60 leading-relaxed italic">
                          "{item.comment}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PREFERENCES & ACCOUNT (Includes Auto Cloud Sync) */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white font-display">Preferências & Sincronização em Nuvem</h3>
                <p className="text-xs text-slate-400">Configure suas opções de download, idioma e gerencie sua sessão</p>
              </div>

              <div className="space-y-4">
                {/* Automatic Cloud Sync Status Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/30 via-slate-900 to-slate-950 border border-cyan-500/30 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                        <Cloud className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          Sincronização em Nuvem Automática
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black">
                            ATIVA
                          </span>
                        </h4>
                        <p className="text-xs text-slate-400">
                          Seus favoritos, status da biblioteca e avaliações salvam sozinhos ao fazer login
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isSyncing}
                      onClick={async () => {
                        setIsSyncing(true);
                        await syncToCloud();
                        setIsSyncing(false);
                        setSyncStatusMsg('✓ Dados sincronizados com sucesso na nuvem!');
                        setTimeout(() => setSyncStatusMsg(''), 4000);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md transition-all cursor-pointer disabled:opacity-60"
                      title="Forçar envio de dados atuais para a nuvem agora"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}</span>
                    </button>
                  </div>

                  {syncStatusMsg && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{syncStatusMsg}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-800 text-xs text-slate-300 flex items-center justify-between flex-wrap gap-2">
                    <span>
                      Conta Conectada: <strong>{userProfile.name}</strong> ({userProfile.email || 'Identificador Ativo'})
                    </span>
                    <span className="text-slate-400">
                      Multi-dispositivo ativo (PC & Celular sincronizados no mesmo login)
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">Formato de Download Preferido</h4>
                    <p className="text-[11px] text-slate-400">Priorizar arquivos Torrent PC (.torrent / magnet) ou PKG (PlayStation)</p>
                  </div>
                  <select 
                    value={platformInput}
                    onChange={e => {
                      setPlatformInput(e.target.value as any);
                      updateUserProfile({ preferredPlatform: e.target.value as any });
                    }}
                    className="text-xs bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-cyan-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="PC">Torrent PC (.torrent / magnet)</option>
                    <option value="PS4">PKG PlayStation 4</option>
                    <option value="PS5">PlayStation 5</option>
                    <option value="Emulador">Emuladores PC</option>
                  </select>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">Idioma do Sistema & Preferido</h4>
                    <p className="text-[11px] text-slate-400">Alterar idioma de exibição da interface da plataforma</p>
                  </div>
                  <select
                    value={language}
                    onChange={e => setLanguage(e.target.value as any)}
                    className="text-xs bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-cyan-300 focus:outline-none focus:border-cyan-500 cursor-pointer font-semibold"
                  >
                    {supportedLanguages.map(opt => (
                      <option key={opt.code} value={opt.code} className="bg-slate-900 text-white">
                        {opt.flag} {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Account Membership & Session Management */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">Sessão do Jogador</h4>
                    <p className="text-[11px] text-slate-400">
                      {isLoggedIn ? `Conectado como ${userProfile.name} • Downloads ilimitados liberados` : 'Você está navegando como visitante'}
                    </p>
                  </div>
                  {isLoggedIn ? (
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        onClose();
                      }}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sair da Conta</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setIsAuthModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all cursor-pointer"
                    >
                      Fazer Login / Cadastrar
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
