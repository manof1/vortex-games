import React, { useState, useMemo } from 'react';
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
  Maximize2
} from 'lucide-react';
import { PkgGame, getStoredPkgGames, savePkgGames, resetPkgGamesToDefault } from '../data/pkgTestLabGames';

interface PkgTestLabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PkgTestLabModal: React.FC<PkgTestLabModalProps> = ({ isOpen, onClose }) => {
  const [games, setGames] = useState<PkgGame[]>(() => getStoredPkgGames());
  const [selectedPlatform, setSelectedPlatform] = useState<'ALL' | 'PS1' | 'PS2' | 'PS3'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<PkgGame | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // New game form state
  const [newTitle, setNewTitle] = useState('');
  const [newPlatform, setNewPlatform] = useState<'PS1' | 'PS2' | 'PS3'>('PS1');
  const [newTitleId, setNewTitleId] = useState('');
  const [newFileUrl, setNewFileUrl] = useState('');
  const [newFileSize, setNewFileSize] = useState('');
  const [newCoverUrl, setNewCoverUrl] = useState('');
  const [newScreenshots, setNewScreenshots] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newGenres, setNewGenres] = useState('Ação, Aventura');

  if (!isOpen) return null;

  // Filtered games
  const filteredGames = useMemo(() => {
    return games.filter(g => {
      if (selectedPlatform !== 'ALL' && g.platform !== selectedPlatform) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = g.title.toLowerCase().includes(q);
        const matchId = g.titleId.toLowerCase().includes(q);
        const matchGenre = g.genres.some(gen => gen.toLowerCase().includes(q));
        if (!matchTitle && !matchId && !matchGenre) return false;
      }
      return true;
    });
  }, [games, selectedPlatform, searchQuery]);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleAddGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newFileUrl.trim()) return;

    const screenshotsList = newScreenshots
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.startsWith('http'));

    const gameToAdd: PkgGame = {
      id: `pkg-${newPlatform.toLowerCase()}-${Date.now()}`,
      title: newTitle.trim(),
      platform: newPlatform,
      titleId: newTitleId.trim() || `${newPlatform}-00000`,
      fileUrl: newFileUrl.trim(),
      fileSize: newFileSize.trim() || '1.0 GB',
      format: 'PKG',
      firmware: 'PS3 CFW / HEN 4.90+ (PKG)',
      region: 'NTSC-U',
      coverUrl: newCoverUrl.trim() || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
      bannerUrl: newCoverUrl.trim() || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      screenshots: screenshotsList.length >= 3 ? screenshotsList.slice(0, 4) : [
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80'
      ],
      description: newDescription.trim() || `Sinopse GameFAQs: Clássico de ${newPlatform} em formato PKG do TheZukoStore.`,
      releaseYear: new Date().getFullYear(),
      releaseDate: 'Original PlayStation Release',
      developer: 'Sony PlayStation Scene',
      publisher: 'TheZukoStore Archive',
      genres: newGenres.split(',').map(s => s.trim()).filter(Boolean),
      gamefaqsRating: 4.8,
      gamefaqsDifficulty: 'Equilibrado',
      ptBrSupport: true,
      zukoStorePageUrl: 'https://thezukostore.com',
      gamefaqsPageUrl: 'https://gamefaqs.gamespot.com',
      tags: [newPlatform, 'PKG', 'TheZukoStore', 'GameFAQs']
    };

    const updated = [gameToAdd, ...games];
    setGames(updated);
    savePkgGames(updated);
    setShowAddForm(false);
    // Reset form
    setNewTitle('');
    setNewTitleId('');
    setNewFileUrl('');
    setNewFileSize('');
    setNewCoverUrl('');
    setNewScreenshots('');
    setNewDescription('');
  };

  const handleResetCatalog = () => {
    if (window.confirm('Restaurar o catálogo de testes padrão de PS1, PS2 e PS3?')) {
      const def = resetPkgGamesToDefault();
      setGames(def);
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(games, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'thezukostore_gamefaqs_pkg_test.json');
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
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-xl flex flex-col items-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      
      {/* Lightbox Modal */}
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
              Screenshot de Gameplay autêntica do GameFAQs / GameSpot • Clique em qualquer lugar para fechar
            </span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="w-full max-w-7xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto text-slate-100">
        
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
                  LABORATÓRIO PKG • PLAYSTATION (PS1 • PS2 • PS3)
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
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/30 transition-all cursor-pointer"
              title="Adicionar ou testar novo jogo PKG"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Testar Novo Jogo</span>
            </button>

            <button
              onClick={handleExportJson}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Exportar lista de testes em JSON"
            >
              <FileDown className="w-4 h-4" />
            </button>

            <button
              onClick={handleResetCatalog}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Restaurar catálogo inicial de testes"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-400 transition-all cursor-pointer ml-1"
              title="Fechar Laboratório de Testes"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Add New PKG Game Form (Collapsible) */}
        {showAddForm && (
          <form onSubmit={handleAddGame} className="p-5 bg-slate-950/80 border-b border-slate-800 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Cadastrar / Testar Novo Jogo PKG (TheZukoStore + GameFAQs)
              </h3>
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
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
                  placeholder="Ex: Silent Hill 2 (PS2 PKG)"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Plataforma PKG</label>
                <select
                  value={newPlatform}
                  onChange={e => setNewPlatform(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="PS1">PlayStation 1 (PS1 PKG)</option>
                  <option value="PS2">PlayStation 2 (PS2 PKG)</option>
                  <option value="PS3">PlayStation 3 (PS3 PKG)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Title ID (CUSA / SLUS / BLES)</label>
                <input
                  type="text"
                  placeholder="Ex: SLUS-20228 ou BLES-00909"
                  value={newTitleId}
                  onChange={e => setNewTitleId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tamanho do Arquivo</label>
                <input
                  type="text"
                  placeholder="Ex: 3.2 GB ou 450 MB"
                  value={newFileSize}
                  onChange={e => setNewFileSize(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Link do Arquivo PKG (TheZukoStore)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://thezukostore.com/... ou link direto .pkg"
                  value={newFileUrl}
                  onChange={e => setNewFileUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  URL da Capa do Jogo (GameFAQs / GameSpot)
                </label>
                <input
                  type="url"
                  placeholder="https://... capa oficial do GameFAQs"
                  value={newCoverUrl}
                  onChange={e => setNewCoverUrl(e.target.value)}
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
                  value={newScreenshots}
                  onChange={e => setNewScreenshots(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Sinopse / Texto Oficial do Jogo (GameFAQs)
                </label>
                <textarea
                  rows={2}
                  placeholder="Descreva a história, mecânica e detalhes do jogo..."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer"
              >
                Salvar no Catálogo de Testes
              </button>
            </div>
          </form>
        )}

        {/* Selected Game Detail Modal in "Lindo Modelo" */}
        {selectedGame ? (
          <div className="p-4 sm:p-6 md:p-8 space-y-6 animate-fadeIn overflow-y-auto max-h-[80vh]">
            
            {/* Back Button */}
            <button
              onClick={() => setSelectedGame(null)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar para lista de jogos PKG</span>
            </button>

            {/* Hero / Banner Header */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
              <div className="absolute inset-0 z-0">
                <img 
                  src={selectedGame.bannerUrl} 
                  alt={selectedGame.title} 
                  className="w-full h-full object-cover opacity-25 filter blur-sm scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
              </div>

              <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start">
                
                {/* Cover Image */}
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

                {/* Info Block */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                      ID: {selectedGame.titleId}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Região {selectedGame.region}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {selectedGame.firmware}
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

                  {/* Rating & Metadata Badges */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{selectedGame.gamefaqsRating} / 5</span>
                      <span className="text-[10px] text-amber-200/70 uppercase tracking-wider font-normal">
                        (GameFAQs Community)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">
                      <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{selectedGame.fileSize} (TheZukoStore)</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">
                      <span>Ano: <strong>{selectedGame.releaseYear}</strong></span>
                    </div>
                  </div>

                  {/* Genres */}
                  <div className="flex flex-wrap gap-1.5">
                    {selectedGame.genres.map(g => (
                      <span key={g} className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-800/80 text-slate-300 border border-slate-700/60">
                        {g}
                      </span>
                    ))}
                  </div>

                  {/* Quick Action Buttons */}
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

                    <a
                      href={selectedGame.gamefaqsPageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3.5 py-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 text-xs font-bold text-slate-400 hover:text-white transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Ficha GameFAQs</span>
                    </a>
                  </div>

                </div>
              </div>
            </div>

            {/* Screenshots Gallery (3 or 4 Photos from GameFAQs) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-white font-display flex items-center gap-2">
                  <Tv className="w-4 h-4 text-cyan-400" />
                  Galeria de Fotos & Screenshots de Gameplay (GameFAQs / GameSpot)
                </h3>
                <span className="text-[11px] text-slate-400">
                  {selectedGame.screenshots.length} fotos reais • Clique para ampliar em tela cheia
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {selectedGame.screenshots.map((shot, idx) => (
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

            {/* Synopsis & Technical Specifications */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Synopsis from GameFAQs */}
              <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-cyan-400">
                  <Info className="w-4 h-4" />
                  Sinopse & Análise Oficial (GameFAQs.gamespot.com)
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                  {selectedGame.description}
                </p>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Desenvolvedora: <strong className="text-slate-200">{selectedGame.developer}</strong></span>
                  <span>Publicadora: <strong className="text-slate-200">{selectedGame.publisher}</strong></span>
                </div>
              </div>

              {/* Technical PKG Info Card */}
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

                {/* Instructions Box */}
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
          /* Catalog View */
          <div className="p-4 sm:p-6 space-y-6 overflow-y-auto max-h-[80vh]">
            
            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Platform Tabs */}
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
                  PS1 Classics PKG ({games.filter(g => g.platform === 'PS1').length})
                </button>
                <button
                  onClick={() => setSelectedPlatform('PS2')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedPlatform === 'PS2'
                      ? 'bg-indigo-700 text-amber-300 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  PS2 Classics PKG ({games.filter(g => g.platform === 'PS2').length})
                </button>
                <button
                  onClick={() => setSelectedPlatform('PS3')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedPlatform === 'PS3'
                      ? 'bg-rose-700 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  PS3 PKG ({games.filter(g => g.platform === 'PS3').length})
                </button>
              </div>

              {/* Search Bar */}
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

            {/* Games Grid in "Lindo Modelo" */}
            {filteredGames.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-950/40 border border-slate-800 space-y-2">
                <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto" />
                <h4 className="text-sm font-bold text-white">Nenhum jogo PKG encontrado</h4>
                <p className="text-xs text-slate-400">Tente ajustar a busca ou adicionar um novo jogo de teste.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                {filteredGames.map(game => (
                  <div
                    key={game.id}
                    className="group relative rounded-2xl overflow-hidden bg-slate-950/70 border border-slate-800/80 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col"
                  >
                    {/* Cover Box */}
                    <div 
                      onClick={() => setSelectedGame(game)}
                      className="relative aspect-[3/4] overflow-hidden cursor-pointer"
                    >
                      <img
                        src={game.coverUrl}
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Platform Badge */}
                      <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-lg text-[10px] font-black shadow-md border ${getPlatformBadge(game.platform)}`}>
                        {game.platform} PKG
                      </span>

                      {/* Title ID Chip */}
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-slate-900/90 text-cyan-300 border border-slate-700/80 shadow">
                        {game.titleId}
                      </span>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                        <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                          <Maximize2 className="w-3.5 h-3.5" />
                          Ver Detalhes & 4 Fotos
                        </span>
                      </div>
                    </div>

                    {/* Content Box */}
                    <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        {/* Rating & Size */}
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-amber-400 font-bold flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400" />
                            {game.gamefaqsRating}
                          </span>
                          <span className="text-slate-400 font-semibold flex items-center gap-1">
                            <HardDrive className="w-3 h-3 text-cyan-400" />
                            {game.fileSize}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 
                          onClick={() => setSelectedGame(game)}
                          className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2 cursor-pointer leading-tight"
                        >
                          {game.title}
                        </h4>

                        <span className="text-[10px] text-slate-500 block mt-1">
                          {game.genres.slice(0, 2).join(' • ')}
                        </span>
                      </div>

                      {/* Action Buttons */}
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

      </div>
    </div>
  );
};
