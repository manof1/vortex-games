import React, { useState } from 'react';
import { 
  X, 
  ArrowLeft,
  Bookmark, 
  Trash2, 
  Star, 
  Download, 
  ExternalLink, 
  FileEdit, 
  Check, 
  Gamepad2,
  HardDrive
} from 'lucide-react';
import { LibraryStatus } from '../types';
import { useGame } from '../context/GameContext';

interface UserLibraryViewProps {
  onClose: () => void;
}

export const UserLibraryView: React.FC<UserLibraryViewProps> = ({ onClose }) => {
  const { 
    library, 
    games, 
    removeFromLibrary, 
    updateLibraryStatus, 
    rateGame, 
    setActiveGame,
    incrementDownload 
  } = useGame();

  const [activeTab, setActiveTab] = useState<'all' | LibraryStatus>('all');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  // Map library entries with full game info
  const libraryGames = library.map(entry => {
    const game = games.find(g => g.id === entry.gameId);
    return { entry, game };
  }).filter((item): item is { entry: typeof item.entry; game: NonNullable<typeof item.game> } => !!item.game);

  // Filter based on selected tab
  const filteredItems = activeTab === 'all' 
    ? libraryGames 
    : libraryGames.filter(item => item.entry.status === activeTab);

  const getStatusLabel = (status: LibraryStatus) => {
    switch (status) {
      case 'playing': return { text: 'Jogando', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'completed': return { text: 'Zerado', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      case 'wishlist': return { text: 'Quero Jogar', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' };
      case 'backlog': return { text: 'Na Fila', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'downloaded': return { text: 'Baixado', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
    }
  };

  const handleDownload = (game: any) => {
    const magnet = game.downloadLinks.find((l: any) => l.type === 'magnet');
    if (magnet) {
      incrementDownload(game.id);
      window.location.href = magnet.url;
    } else {
      setActiveGame(game);
    }
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
          <span className="text-cyan-400 font-semibold">Minha Biblioteca Gamer</span>
        </div>
      </div>

      <div 
        className="relative w-full rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white font-display">Minha Biblioteca Gamer</h2>
              <p className="text-xs text-slate-400">
                Seus títulos favoritados, status de progresso e notas pessoais ({library.length} jogos)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Fechar e Voltar ao Catálogo"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="px-6 py-3 border-b border-slate-800/80 bg-slate-900/60 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-cyan-500 text-slate-950'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Todos ({library.length})
          </button>
          <button
            onClick={() => setActiveTab('playing')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'playing'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            🎮 Jogando ({library.filter(l => l.status === 'playing').length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'completed'
                ? 'bg-purple-500 text-slate-950'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            🏆 Zerados ({library.filter(l => l.status === 'completed').length})
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'wishlist'
                ? 'bg-cyan-500 text-slate-950'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            📌 Quero Jogar ({library.filter(l => l.status === 'wishlist').length})
          </button>
        </div>

        {/* Content list */}
        <div className="p-6">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-300">Nenhum jogo nesta categoria</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore os jogos no portal e clique no ícone de marcador para organizá-los na sua biblioteca pessoal.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map(({ entry, game }) => {
                const statusMeta = getStatusLabel(entry.status);
                return (
                  <div
                    key={entry.gameId}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between gap-3"
                  >
                    <div className="flex gap-4">
                      {/* Cover Thumbnail */}
                      <img
                        src={game.coverUrl}
                        alt={game.title}
                        className="w-20 h-28 object-cover rounded-xl border border-slate-800 shrink-0 cursor-pointer hover:opacity-90"
                        onClick={() => {
                          setActiveGame(game);
                          onClose();
                        }}
                      />

                      {/* Info & Status */}
                      <div className="flex-1 space-y-2 overflow-hidden">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${statusMeta.color}`}>
                            {statusMeta.text}
                          </span>
                          
                          <button
                            onClick={() => removeFromLibrary(game.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                            title="Remover da Biblioteca"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <h4 
                          onClick={() => {
                            setActiveGame(game);
                            onClose();
                          }}
                          className="text-sm font-bold text-white hover:text-cyan-400 transition-colors cursor-pointer truncate font-display"
                        >
                          {game.title}
                        </h4>

                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{game.repackInfo.repackSize}</span>
                          <span>•</span>
                          <span>{game.repackInfo.repacker}</span>
                        </div>

                        {/* Interactive Status Changer */}
                        <div className="flex items-center gap-1.5 pt-1">
                          <select
                            value={entry.status}
                            onChange={(e) => updateLibraryStatus(game.id, e.target.value as LibraryStatus)}
                            className="text-[11px] bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
                          >
                            <option value="playing">🎮 Jogando</option>
                            <option value="completed">🏆 Zerado</option>
                            <option value="wishlist">📌 Quero Jogar</option>
                            <option value="backlog">⏳ Na Fila</option>
                            <option value="downloaded">💾 Baixado</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      {/* Personal Rating */}
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-slate-400 mr-1">Sua Nota:</span>
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            onClick={() => rateGame(game.id, star)}
                            className="p-0.5 hover:scale-110 transition-transform"
                            title={`${star} Estrelas`}
                          >
                            <Star 
                              className={`w-3.5 h-3.5 ${
                                (entry.userRating || 0) >= star
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-600'
                              }`}
                            />
                          </button>
                        ))}
                      </div>

                      {/* Download Magnet Button */}
                      <button
                        onClick={() => handleDownload(game)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 border border-cyan-500/30 transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Baixar Magnet</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
