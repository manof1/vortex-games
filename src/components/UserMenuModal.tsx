import React, { useState } from 'react';
import { 
  X, 
  User, 
  Bookmark, 
  Download, 
  Star, 
  MessageSquare, 
  Flame, 
  CheckCircle2, 
  Clock, 
  Trophy, 
  HardDrive, 
  Settings, 
  Sparkles, 
  ExternalLink,
  Edit3,
  LogOut,
  Sliders,
  ShieldCheck,
  Gamepad2
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { LibraryStatus, UserProfile } from '../types';

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
    setIsAdminOpen 
  } = useGame();

  const [activeTab, setActiveTab] = useState<'profile' | 'downloads' | 'library' | 'reviews' | 'settings'>('profile');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [nameInput, setNameInput] = useState(userProfile.name);
  const [tagInput, setTagInput] = useState(userProfile.tag);
  const [bioInput, setBioInput] = useState(userProfile.bio);
  const [favGenreInput, setFavGenreInput] = useState(userProfile.favoriteGenre);
  const [platformInput, setPlatformInput] = useState(userProfile.preferredPlatform);
  const [avatarIndex, setAvatarIndex] = useState(0);

  // Available Avatar Seeds
  const avatarSeeds = ['GamerPro', 'CyberVortex', 'ShadowKnight', 'PixelWarrior', 'FitGirlFan', 'RetroMaster'];

  // User comments & reviews
  const userReviews = comments.filter(c => 
    c.authorName.toLowerCase() === userProfile.name.toLowerCase() || 
    c.authorName.toLowerCase() === 'vigilancia' ||
    c.authorName.toLowerCase() === 'jogador gamer' ||
    c.authorName.toLowerCase() === 'jogador anônimo'
  );

  // Games in user's library with metadata
  const libraryGames = library.map(entry => {
    const game = games.find(g => g.id === entry.gameId);
    return { entry, game };
  }).filter((item): item is { entry: typeof item.entry; game: NonNullable<typeof item.game> } => !!item.game);

  // Downloaded games
  const downloadedGames = libraryGames.filter(item => 
    item.entry.status === 'downloaded' || (item.entry.downloadCount && item.entry.downloadCount > 0)
  );

  // Library stats
  const totalInLibrary = library.length;
  const playingCount = library.filter(e => e.status === 'playing').length;
  const completedCount = library.filter(e => e.status === 'completed').length;
  const wishlistCount = library.filter(e => e.status === 'wishlist').length;
  const downloadedCount = downloadedGames.length || userProfile.totalDownloads;

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
      if (link.type === 'magnet') {
        window.location.href = link.url;
      } else {
        window.open(link.url, '_blank');
      }
    } else {
      setActiveGame(game);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex justify-center items-start p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl my-4 sm:my-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[580px]"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button Mobile / Desktop */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-slate-800/80 hover:bg-rose-600 text-slate-400 hover:text-white transition-all shadow-md"
          title="Fechar Menu"
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
              </div>
            </div>

            {/* Menu Items */}
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
                onClick={() => setActiveTab('downloads')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === 'downloads'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Download className="w-4 h-4" />
                  <span>Meus Downloads</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                  activeTab === 'downloads' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-cyan-400'
                }`}>
                  {downloadedCount}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('library')}
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
                  activeTab === 'reviews' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-cyan-400'
                }`}>
                  {userReviews.length}
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
                <span>Preferências de Jogos</span>
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
          
          {/* TAB: PROFILE & STATS */}
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
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all shrink-0"
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
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-md shadow-cyan-500/20"
                    >
                      Salvar Alterações
                    </button>
                  </form>
                )}
              </div>

              {/* Gamer Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 w-fit mx-auto mb-2">
                    <Download className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-black text-white font-display">{downloadedCount}</div>
                  <div className="text-xs text-slate-400 font-medium">Jogos Baixados</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit mx-auto mb-2">
                    <Gamepad2 className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-black text-white font-display">{playingCount}</div>
                  <div className="text-xs text-slate-400 font-medium">Jogando Agora</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 w-fit mx-auto mb-2">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-black text-white font-display">{completedCount}</div>
                  <div className="text-xs text-slate-400 font-medium">Jogos Zerados</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 w-fit mx-auto mb-2">
                    <Star className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-black text-white font-display">{userReviews.length}</div>
                  <div className="text-xs text-slate-400 font-medium">Avaliações Feitas</div>
                </div>
              </div>

              {/* Quick Jump Sections */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div 
                  onClick={() => setActiveTab('downloads')}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                      <Download className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">Gerenciar Downloads</h4>
                      <p className="text-xs text-slate-400">Acesse links magnéticos e torrents salvos</p>
                    </div>
                  </div>
                  <span className="text-cyan-400 text-lg">→</span>
                </div>

                <div 
                  onClick={() => setActiveTab('reviews')}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                      <Star className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">Avaliar Jogos do Catálogo</h4>
                      <p className="text-xs text-slate-400">Dê notas de 1 a 5 estrelas e comente</p>
                    </div>
                  </div>
                  <span className="text-amber-400 text-lg">→</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB: MY DOWNLOADS */}
          {activeTab === 'downloads' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white font-display">Histórico de Downloads & Torrent</h3>
                  <p className="text-xs text-slate-400">Todos os repacks e jogos que você baixou ou marcou como baixado</p>
                </div>
                <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                  {downloadedGames.length} títulos
                </span>
              </div>

              {downloadedGames.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-slate-950/40 border border-slate-800 space-y-3">
                  <Download className="w-12 h-12 text-slate-600 mx-auto" />
                  <h4 className="text-sm font-bold text-white">Nenhum download registrado ainda</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Quando você clicar em "Baixar Torrent" ou "PKG" em qualquer jogo, ele aparecerá aqui com acesso rápido!
                  </p>
                  <button
                    onClick={() => onClose()}
                    className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                  >
                    Navegar pelo Catálogo
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {downloadedGames.map(({ entry, game }) => (
                    <div 
                      key={entry.gameId}
                      className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
                    >
                      <div className="flex items-center gap-3.5">
                        <img 
                          src={game.coverUrl} 
                          alt={game.title} 
                          className="w-14 h-18 object-cover rounded-xl border border-slate-800 shrink-0 cursor-pointer"
                          onClick={() => {
                            setActiveGame(game);
                            onClose();
                          }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] px-2 py-0.5 rounded-md font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                              Baixado
                            </span>
                            <span className="text-xs text-slate-400 font-mono">{game.repackInfo.repackSize}</span>
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
                          <p className="text-xs text-slate-400">Repack: {game.repackInfo.repacker} • {game.repackInfo.crackStatus}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                        <button
                          onClick={() => handleQuickDownload(game)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Baixar Novamente</span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveGame(game);
                            onClose();
                          }}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                          title="Ver Ficha Completa"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: MY LIBRARY & PROGRESS */}
          {activeTab === 'library' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white font-display">Minha Biblioteca Gamer</h3>
                  <p className="text-xs text-slate-400">Mude o status de progresso, dê notas ou remova títulos</p>
                </div>
                <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                  {libraryGames.length} jogos
                </span>
              </div>

              {libraryGames.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-slate-950/40 border border-slate-800 space-y-3">
                  <Bookmark className="w-12 h-12 text-slate-600 mx-auto" />
                  <h4 className="text-sm font-bold text-white">Sua biblioteca está vazia</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Clique no botão de marcador nos cards de jogos do catálogo para adicioná-los aqui!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {libraryGames.map(({ entry, game }) => (
                    <div
                      key={entry.gameId}
                      className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={game.coverUrl}
                          alt={game.title}
                          className="w-14 h-18 object-cover rounded-xl border border-slate-800 shrink-0 cursor-pointer"
                          onClick={() => {
                            setActiveGame(game);
                            onClose();
                          }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
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
                            <span className="text-xs text-slate-400 font-mono">{game.repackInfo.repackSize}</span>
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

                          {/* Quick Rating Stars */}
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-[11px] text-slate-400 mr-1">Sua nota:</span>
                            {[1, 2, 3, 4, 5].map(star => (
                              <button
                                key={star}
                                onClick={() => rateGame(game.id, star)}
                                className="p-0.5 hover:scale-110 transition-transform"
                              >
                                <Star
                                  className={`w-3 h-3 ${
                                    (entry.userRating || 0) >= star
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-slate-600'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                        <button
                          onClick={() => handleQuickDownload(game)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 border border-cyan-500/30 transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Baixar</span>
                        </button>

                        <button
                          onClick={() => removeFromLibrary(game.id)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-400 transition-colors"
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

          {/* TAB: MY REVIEWS & COMMENTS */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white font-display">Minhas Avaliações & Comentários</h3>
                  <p className="text-xs text-slate-400">Opiniões e notas que você deixou nos jogos da plataforma</p>
                </div>
                <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-950 text-amber-400 border border-amber-800/40">
                  {userReviews.length} avaliações
                </span>
              </div>

              {userReviews.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-slate-950/40 border border-slate-800 space-y-3">
                  <Star className="w-12 h-12 text-slate-600 mx-auto" />
                  <h4 className="text-sm font-bold text-white">Nenhuma avaliação publicada</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Abra a página de qualquer jogo e deixe sua nota e comentário para ajudar outros gamers!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userReviews.map(review => {
                    const game = games.find(g => g.id === review.gameId);
                    return (
                      <div
                        key={review.id}
                        className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {game && (
                              <span 
                                onClick={() => {
                                  setActiveGame(game);
                                  onClose();
                                }}
                                className="text-xs font-bold text-cyan-400 hover:underline cursor-pointer"
                              >
                                {game.title}
                              </span>
                            )}
                            <span className="text-slate-600">•</span>
                            <span className="text-[11px] text-slate-400">{review.createdAt}</span>
                          </div>

                          {/* Rating Stars */}
                          {review.rating && (
                            <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span className="text-xs font-bold text-amber-300">{review.rating} / 5</span>
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-slate-200 bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
                          "{review.content}"
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB: PREFERENCES & SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white font-display">Preferências de Acesso & Download</h3>
                <p className="text-xs text-slate-400">Configure suas opções favoritas de reprodução, formato e notificações</p>
              </div>

              <div className="space-y-4">
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
                    className="text-xs bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-cyan-300 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="PC">Torrent PC (.torrent / magnet)</option>
                    <option value="PS4">PKG PlayStation 4</option>
                    <option value="PS5">PlayStation 5</option>
                    <option value="Emulador">Emuladores PC</option>
                  </select>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">Notificações de Novos Lançamentos</h4>
                    <p className="text-[11px] text-slate-400">Receber alertas automáticos quando o robô da FitGirl indexar jogos</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Ativo
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">Idioma Preferido</h4>
                    <p className="text-[11px] text-slate-400">Destacar jogos com Dublagem ou Legenda PT-BR</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    Português (Brasil) 🇧🇷
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
