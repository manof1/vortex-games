import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Download, 
  Save, 
  RefreshCw, 
  ShieldCheck, 
  Database, 
  Layers, 
  Sliders, 
  CheckCircle2, 
  ExternalLink,
  HardDrive,
  Copy,
  Check,
  Flame,
  Rss,
  Clock,
  Play,
  Terminal,
  FileCode,
  CheckCheck,
  Gamepad2,
  Disc,
  Volume2,
  FileArchive,
  Upload,
  AlertTriangle
} from 'lucide-react';
import { Game, IgdbSearchResult } from '../types';
import { useGame } from '../context/GameContext';
import { searchIgdbGames, convertIgdbResultToGame } from '../services/igdbService';
import { getFitGirlPresetCatalog, parseFitGirlRssXml, FITGIRL_SUPABASE_SYNC_SCRIPT } from '../services/fitgirlService';
import { GITHUB_ACTIONS_WORKFLOW_YAML, VERCEL_CRON_JSON } from '../services/autoSyncService';
import { ZUKO_TAPOCHEK_PRESETS } from '../data/zukoTapochekPresets';
import { createZukoTapochekGame, ZUKO_TAPOCHEK_SUPABASE_SCRIPT } from '../services/zukoTapochekService';
import { SUPABASE_SCHEMA_SQL } from '../services/supabaseSchemaService';
import { SUPABASE_URL, SUPABASE_ANON_KEY, testSupabaseConnection, upsertGameToSupabase } from '../services/supabaseClient';

interface AdminPanelModalProps {
  onClose: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({ onClose }) => {
  const { 
    games, 
    comments, 
    addGame, 
    updateGame, 
    deleteGame, 
    deleteComment, 
    exportDatabaseJson, 
    importDatabaseJson,
    resetDatabaseToDefault,
    autoSyncConfig,
    syncLogs,
    toggleAutoSync,
    triggerManualSync
  } = useGame();

  const [activeTab, setActiveTab] = useState<'igdb' | 'fitgirl' | 'zukotapochek' | 'manage' | 'comments' | 'backup'>('igdb');

  // IGDB Search state
  const [igdbQuery, setIgdbQuery] = useState('');
  const [isSearchingIgdb, setIsSearchingIgdb] = useState(false);
  const [igdbResults, setIgdbResults] = useState<IgdbSearchResult[]>([]);
  const [selectedIgdb, setSelectedIgdb] = useState<IgdbSearchResult | null>(null);

  // FitGirl Tab states
  const [fitgirlRssText, setFitgirlRssText] = useState('');
  const [importedCount, setImportedCount] = useState<number | null>(null);
  const [copiedSyncScript, setCopiedSyncScript] = useState(false);
  const [copiedGithubYaml, setCopiedGithubYaml] = useState(false);
  const [copiedVercelCron, setCopiedVercelCron] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [isSyncingNow, setIsSyncingNow] = useState(false);

  // TheZukoStore & Tapochek Tab states
  const [zukoTitle, setZukoTitle] = useState('');
  const [zukoTitleId, setZukoTitleId] = useState('CUSA-');
  const [zukoFirmware, setZukoFirmware] = useState('FW 5.05 - 11.00');
  const [zukoPkgUrl, setZukoPkgUrl] = useState('');
  const [zukoTorrentUrl, setZukoTorrentUrl] = useState('');
  const [zukoPatchPtBrUrl, setZukoPatchPtBrUrl] = useState('');
  const [zukoHasAudio, setZukoHasAudio] = useState(true);
  const [zukoHasSubs, setZukoHasSubs] = useState(true);
  const [zukoSize, setZukoSize] = useState('42.0 GB');
  const [zukoGenre, setZukoGenre] = useState('Ação');
  const [zukoCoverUrl, setZukoCoverUrl] = useState('');
  const [zukoImportedCount, setZukoImportedCount] = useState<number | null>(null);
  const [copiedZukoScript, setCopiedZukoScript] = useState(false);

  // Form state for publishing game
  const [repacker, setRepacker] = useState('FitGirl Repack');
  const [repackSize, setRepackSize] = useState('45.0 GB');
  const [crackStatus, setCrackStatus] = useState<'Crackeado' | 'DRM Free' | 'Emulação Steam' | 'Bypass'>('Crackeado');
  const [magnetUrl, setMagnetUrl] = useState('');
  const [pkgUrl, setPkgUrl] = useState('');
  const [titleId, setTitleId] = useState('');
  const [isPtBr, setIsPtBr] = useState(true);
  const [sourceOrigin, setSourceOrigin] = useState<'TheZukoStore' | 'Tapochek.net' | 'FitGirl' | 'Scene'>('TheZukoStore');
  const [publishedSuccess, setPublishedSuccess] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedRlsSql, setCopiedRlsSql] = useState(false);
  const [copiedVarName, setCopiedVarName] = useState<string | null>(null);
  const [supabaseTestStatus, setSupabaseTestStatus] = useState<{ testing: boolean; checked: boolean; success: boolean; message: string; count?: number }>({
    testing: false,
    checked: false,
    success: false,
    message: ''
  });

  const handleTestSupabase = async () => {
    setSupabaseTestStatus({ testing: true, checked: false, success: false, message: '' });
    const result = await testSupabaseConnection();
    setSupabaseTestStatus({
      testing: false,
      checked: true,
      success: result.success,
      message: result.message,
      count: result.count
    });
  };

  const [syncingAllToSupabase, setSyncingAllToSupabase] = useState(false);
  const [syncAllSupabaseResult, setSyncAllSupabaseResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSyncAllToSupabase = async () => {
    setSyncingAllToSupabase(true);
    setSyncAllSupabaseResult(null);
    let count = 0;
    let lastError = '';
    for (const game of games) {
      const res = await upsertGameToSupabase(game);
      if (res.success) {
        count++;
      } else {
        lastError = res.error || 'Erro RLS';
      }
    }
    setSyncingAllToSupabase(false);
    if (count > 0 && !lastError) {
      setSyncAllSupabaseResult({
        success: true,
        message: `${count} jogos enviados com sucesso para o Supabase!`
      });
      handleTestSupabase();
    } else if (count > 0 && lastError) {
      setSyncAllSupabaseResult({
        success: true,
        message: `${count}/${games.length} jogos enviados. Último aviso: ${lastError}`
      });
      handleTestSupabase();
    } else {
      setSyncAllSupabaseResult({
        success: false,
        message: `Falha ao enviar: ${lastError}. Execute o comando SQL de liberação RLS no Supabase primeiro!`
      });
    }
  };

  // Search existing posts
  const [postSearch, setPostSearch] = useState('');

  // Editing existing game modal state
  const [editingGame, setEditingGame] = useState<Game | null>(null);

  // Search IGDB API
  const handleSearchIgdb = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!igdbQuery.trim()) return;

    setIsSearchingIgdb(true);
    try {
      const results = await searchIgdbGames(igdbQuery);
      setIgdbResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchingIgdb(false);
    }
  };

  // Select an IGDB game to prepare publish
  const handleSelectIgdb = (item: IgdbSearchResult) => {
    setSelectedIgdb(item);
    // Auto-generate suggested magnet link
    setMagnetUrl(`magnet:?xt=urn:btih:${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}&dn=${encodeURIComponent(item.name + '-' + repacker)}&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce`);
  };

  // Publish game to store
  const handlePublishGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIgdb) return;

    const newGame = convertIgdbResultToGame(
      selectedIgdb,
      magnetUrl,
      repacker,
      repackSize,
      crackStatus
    );

    newGame.hasPtBrAudio = isPtBr;
    newGame.hasPtBrSubs = isPtBr;
    newGame.sourceOrigin = sourceOrigin;
    if (titleId.trim()) newGame.titleId = titleId.trim();

    if (pkgUrl.trim()) {
      newGame.hasPkgFormat = true;
      newGame.downloadLinks.push({
        id: `dl-pkg-${Date.now()}`,
        type: 'pkg',
        format: 'pkg',
        platform: 'PS4',
        label: `Arquivo PKG Console (${titleId || 'CUSA'} - ${sourceOrigin})`,
        url: pkgUrl.trim(),
        size: repackSize,
        titleId: titleId.trim() || 'CUSA-PKG',
        firmware: 'FW 5.05 - 11.00',
        isPtBrAudio: isPtBr,
        isPtBrSubs: isPtBr,
        hostName: sourceOrigin
      });
    }

    addGame(newGame);
    setPublishedSuccess(true);
    setSelectedIgdb(null);
    setIgdbQuery('');
    setIgdbResults([]);
    setPkgUrl('');
    setTitleId('');

    setTimeout(() => {
      setPublishedSuccess(false);
      setActiveTab('manage');
    }, 1500);
  };

  // Handle Editing Game submit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGame) return;
    updateGame(editingGame);
    setEditingGame(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex justify-center items-start p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div 
        className="relative w-full max-w-5xl my-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white font-display">Painel de Controle Administrativo</h2>
              <p className="text-xs text-slate-400">
                Gerencie postagens, links torrent, puxe dados da IGDB e modere a comunidade
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/60 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('igdb')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
              activeTab === 'igdb'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Puxar Dados da IGDB</span>
          </button>

          <button
            onClick={() => setActiveTab('fitgirl')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
              activeTab === 'fitgirl'
                ? 'bg-pink-500 text-slate-950 shadow-md shadow-pink-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>FitGirl Repacks Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('zukotapochek')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
              activeTab === 'zukotapochek'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-purple-400" />
            <span>TheZukoStore & Tapochek Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('manage')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
              activeTab === 'manage'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Gerenciar Postagens ({games.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('comments')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
              activeTab === 'comments'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Moderar Comentários ({comments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
              activeTab === 'backup'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Publicar no Vercel & Supabase (Guia do Zero)</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6">
          
          {/* TAB 1: IGDB SEARCH & AUTO-PUBLISH */}
          {activeTab === 'igdb' && (
            <div className="space-y-6">
              
              <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      Integração Automática com IGDB API
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Digite o nome de qualquer jogo. O sistema busca capa, sinopse, desenvolvedora, capturas e requisitos de PC automaticamente.
                    </p>
                  </div>
                </div>

                {/* Search input */}
                <form onSubmit={handleSearchIgdb} className="flex gap-2 pt-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={igdbQuery}
                      onChange={e => setIgdbQuery(e.target.value)}
                      placeholder="Ex: Silent Hill 2, GTA VI, Lies of P, The Witcher 3, Dragon's Dogma 2..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                    <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  </div>

                  <button
                    type="submit"
                    disabled={isSearchingIgdb || !igdbQuery.trim()}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 disabled:opacity-50 transition-all flex items-center gap-2"
                  >
                    {isSearchingIgdb ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    <span>Buscar na IGDB</span>
                  </button>
                </form>

                {/* Quick tags to test */}
                <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-400 pt-1">
                  <span>Exemplos rápidos:</span>
                  {['Silent Hill 2 Remake', 'Grand Theft Auto VI', 'Lies of P', 'Helldivers 2'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setIgdbQuery(tag);
                        searchIgdbGames(tag).then(res => setIgdbResults(res));
                      }}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-medium"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* IGDB Search Results */}
              {igdbResults.length > 0 && !selectedIgdb && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Resultados Encontrados na IGDB ({igdbResults.length}):
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {igdbResults.map(item => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex gap-3.5 hover:border-cyan-500/50 transition-all"
                      >
                        <img
                          src={item.coverUrl}
                          alt={item.name}
                          className="w-20 h-28 object-cover rounded-xl border border-slate-800 shrink-0"
                        />

                        <div className="flex-1 space-y-1.5 overflow-hidden flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between text-[11px] text-slate-400">
                              <span>{item.releaseYear}</span>
                              <span className="text-amber-400 font-bold">★ {item.rating}</span>
                            </div>
                            <h5 className="text-sm font-bold text-white truncate font-display">{item.name}</h5>
                            <p className="text-[11px] text-slate-400 line-clamp-2">{item.summary}</p>
                          </div>

                          <button
                            onClick={() => handleSelectIgdb(item)}
                            className="w-full py-1.5 rounded-lg text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all flex items-center justify-center gap-1.5"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Puxar Dados & Configurar Torrent</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Configure Selected Game Form */}
              {selectedIgdb && (
                <form onSubmit={handlePublishGame} className="p-5 rounded-2xl bg-slate-950/90 border-2 border-cyan-500/40 space-y-5 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <img src={selectedIgdb.coverUrl} alt={selectedIgdb.name} className="w-10 h-14 object-cover rounded-lg border border-slate-800" />
                      <div>
                        <h4 className="text-base font-bold text-white font-display">{selectedIgdb.name}</h4>
                        <p className="text-xs text-emerald-400">✓ Dados da IGDB carregados com sucesso!</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedIgdb(null)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Cancelar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Repacker */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Repacker / Grupo:</label>
                      <select
                        value={repacker}
                        onChange={e => setRepacker(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="FitGirl Repack">FitGirl Repack</option>
                        <option value="DODI Repack">DODI Repack</option>
                        <option value="ElAmigos">ElAmigos</option>
                        <option value="Razor1911">Razor1911</option>
                        <option value="RUNE Release">RUNE Release</option>
                      </select>
                    </div>

                    {/* Repack Size */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Tamanho do Torrent:</label>
                      <input
                        type="text"
                        value={repackSize}
                        onChange={e => setRepackSize(e.target.value)}
                        placeholder="Ex: 48.5 GB"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                        required
                      />
                    </div>

                    {/* Crack Status */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Status do Crack:</label>
                      <select
                        value={crackStatus}
                        onChange={e => setCrackStatus(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="Crackeado">Crackeado</option>
                        <option value="DRM Free">DRM Free (GOG)</option>
                        <option value="Emulação Steam">Emulação Steam</option>
                        <option value="Bypass">Bypass</option>
                      </select>
                    </div>
                  </div>

                  {/* Magnet URL (PC) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Link Magnet do Torrent (PC):</label>
                    <input
                      type="text"
                      value={magnetUrl}
                      onChange={e => setMagnetUrl(e.target.value)}
                      placeholder="magnet:?xt=urn:btih:..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                      required
                    />
                  </div>

                  {/* Dual Download Option: Arquivo PKG & Dados Originais */}
                  <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-3">
                    <span className="text-xs font-bold text-purple-300 uppercase tracking-wide flex items-center gap-1.5">
                      <Gamepad2 className="w-3.5 h-3.5" />
                      Opção de Download PKG & Metadados Originais (TheZukoStore / Tapochek)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">Fonte Original da Release:</label>
                        <select
                          value={sourceOrigin}
                          onChange={e => setSourceOrigin(e.target.value as any)}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                        >
                          <option value="TheZukoStore">TheZukoStore (Console PKG)</option>
                          <option value="Tapochek.net">Tapochek.net (Scene Tracker)</option>
                          <option value="FitGirl">FitGirl Repack</option>
                          <option value="Scene">Scene Group Release</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">PlayStation Title ID (opcional):</label>
                        <input
                          type="text"
                          value={titleId}
                          onChange={e => setTitleId(e.target.value)}
                          placeholder="Ex: CUSA-34388, BLES-01807"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-purple-300 font-mono focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">Localização PT-BR:</label>
                        <label className="flex items-center gap-2 mt-1.5 cursor-pointer text-xs text-slate-200">
                          <input
                            type="checkbox"
                            checked={isPtBr}
                            onChange={e => setIsPtBr(e.target.checked)}
                            className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700"
                          />
                          <span>🇧🇷 Inclui Dublagem / Legendas PT-BR</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Link do Arquivo PKG (opcional - cria botão distinto de PKG):</label>
                      <input
                        type="text"
                        value={pkgUrl}
                        onChange={e => setPkgUrl(e.target.value)}
                        placeholder="https://thezukostore.com/... ou link direto do arquivo .pkg"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedIgdb(null)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                    >
                      Voltar
                    </button>

                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20"
                    >
                      <Save className="w-4 h-4" />
                      <span>Publicar Jogo no Portal Vortex</span>
                    </button>
                  </div>
                </form>
              )}

              {publishedSuccess && (
                <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Jogo publicado com sucesso no catálogo e notificação enviada aos usuários!</span>
                </div>
              )}

            </div>
          )}

          {/* TAB: FITGIRL REPACKS HUB */}
          {activeTab === 'fitgirl' && (
            <div className="space-y-6">
              
              {/* Live Daemon / Cron Controller Header */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-pink-950/60 via-purple-950/40 to-slate-950/80 border-2 border-pink-500/40 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="flex h-3 w-3 relative">
                        {autoSyncConfig.enabled ? (
                          <>
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                          </>
                        ) : (
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-slate-500"></span>
                        )}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-pink-300">
                        {autoSyncConfig.enabled ? 'Sincronizador Horário Ativo (Cron Ligado)' : 'Sincronizador Pausado'}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-white font-display mt-1">
                      Robô de Importação Automática da FitGirl
                    </h3>
                    <p className="text-xs text-slate-300 max-w-xl">
                      Monitora o feed oficial a cada 60 minutos. Sempre que a FitGirl publica um novo repack, ele é indexado, magnetizado e publicado no portal com notificação automática aos usuários.
                    </p>
                  </div>

                  {/* Actions & Switch */}
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={toggleAutoSync}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                        autoSyncConfig.enabled
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-slate-800 text-slate-300 border border-slate-700 hover:text-white'
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      <span>{autoSyncConfig.enabled ? 'Pausar Sincronização' : 'Ativar Sincronização (60 min)'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsSyncingNow(true);
                        setTimeout(() => {
                          const res = triggerManualSync();
                          setSyncFeedback(res.message);
                          setIsSyncingNow(false);
                          setTimeout(() => setSyncFeedback(null), 4000);
                        }, 600);
                      }}
                      disabled={isSyncingNow}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-pink-500 hover:bg-pink-400 text-slate-950 flex items-center gap-2 shadow-lg shadow-pink-500/20 disabled:opacity-50 transition-all"
                    >
                      <Play className={`w-3.5 h-3.5 ${isSyncingNow ? 'animate-spin' : ''}`} />
                      <span>{isSyncingNow ? 'Verificando Feed...' : 'Executar Checagem Agora'}</span>
                    </button>
                  </div>
                </div>

                {/* Feedback message */}
                {syncFeedback && (
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-pink-500/40 text-pink-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                    <CheckCheck className="w-4 h-4 text-emerald-400" />
                    <span>{syncFeedback}</span>
                  </div>
                )}

                {/* Live Console Terminal Logs */}
                <div className="rounded-xl bg-slate-950/90 border border-slate-800 p-3 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1.5">
                    <span className="flex items-center gap-1.5 font-mono text-cyan-400">
                      <Terminal className="w-3.5 h-3.5" />
                      Console de Execução do Daemon (Tempo Real)
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {syncLogs.length} eventos registrados
                    </span>
                  </div>

                  <div className="font-mono text-[11px] space-y-1 max-h-28 overflow-y-auto scrollbar-thin">
                    {syncLogs.slice(0, 5).map(log => (
                      <div key={log.id} className="flex items-center gap-2">
                        <span className="text-slate-500">[{log.timestamp}]</span>
                        <span className={
                          log.type === 'success' ? 'text-emerald-400 font-bold' :
                          log.type === 'warning' ? 'text-amber-400' :
                          log.type === 'error' ? 'text-rose-400' : 'text-slate-300'
                        }>
                          {log.message}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Automation in Production: GitHub Actions & Vercel Cron */}
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-sm font-bold text-white">
                    Como Rodar 100% no Servidor (Sem Precisar do Navegador Aberto)
                  </h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Para que o portal busque novos jogos <strong>24 horas por dia automaticamente</strong> mesmo com seu computador desligado, você tem duas opções simples e 100% gratuitas:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* GitHub Actions Card */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <FileCode className="w-4 h-4 text-indigo-400" />
                        Opção 1: GitHub Actions Cron
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(GITHUB_ACTIONS_WORKFLOW_YAML);
                          setCopiedGithubYaml(true);
                          setTimeout(() => setCopiedGithubYaml(false), 2000);
                        }}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1 transition-all"
                      >
                        {copiedGithubYaml ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedGithubYaml ? 'Copiado!' : 'Copiar YAML'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Crie o arquivo <code className="text-indigo-300 bg-slate-950 px-1 py-0.5 rounded">.github/workflows/sync.yml</code> no seu repositório. O GitHub roda a cada 60 minutos sem custos.
                    </p>
                    <pre className="p-2.5 rounded-lg bg-slate-950 text-[10px] text-indigo-300 font-mono overflow-x-auto max-h-32">
                      {GITHUB_ACTIONS_WORKFLOW_YAML}
                    </pre>
                  </div>

                  {/* Vercel Cron Card */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-emerald-400" />
                        Opção 2: Vercel Cron Job
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(VERCEL_CRON_JSON);
                          setCopiedVercelCron(true);
                          setTimeout(() => setCopiedVercelCron(false), 2000);
                        }}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 transition-all"
                      >
                        {copiedVercelCron ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedVercelCron ? 'Copiado!' : 'Copiar vercel.json'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Coloque <code className="text-emerald-300 bg-slate-950 px-1 py-0.5 rounded">vercel.json</code> na raiz do projeto. A Vercel executará sua Serverless Function a cada hora.
                    </p>
                    <pre className="p-2.5 rounded-lg bg-slate-950 text-[10px] text-emerald-300 font-mono overflow-x-auto max-h-32">
                      {VERCEL_CRON_JSON}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Action 1: 1-Click Import Preset FitGirl Games */}
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-pink-400" />
                      Importação Rápida de Clássicos FitGirl (1-Clique)
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Adicione agora grandes títulos já empacotados (*Spider-Man Remastered, Ghost of Tsushima, Hogwarts Legacy, Sekiro, Hades II*) com dados de compressão e magnets testados.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const presets = getFitGirlPresetCatalog();
                      let added = 0;
                      presets.forEach(preset => {
                        if (!games.some(g => g.id === preset.id)) {
                          addGame(preset);
                          added++;
                        }
                      });
                      setImportedCount(added);
                      setTimeout(() => setImportedCount(null), 3000);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-900/40 transition-all shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>Importar Lançamentos FitGirl</span>
                  </button>
                </div>

                {importedCount !== null && (
                  <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{importedCount} novos jogos da FitGirl foram adicionados com sucesso ao seu catálogo!</span>
                  </div>
                )}
              </div>

              {/* Action 2: RSS Feed XML Parser */}
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <Rss className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm font-bold text-white">
                    Importador Manual de Feed RSS XML
                  </h4>
                </div>
                <p className="text-xs text-slate-400">
                  Você também pode colar diretamente o XML obtido em <code className="text-amber-300 font-mono text-xs">https://fitgirl-repacks.site/feed/</code>:
                </p>

                <textarea
                  value={fitgirlRssText}
                  onChange={e => setFitgirlRssText(e.target.value)}
                  rows={3}
                  placeholder="Cole aqui o XML do feed..."
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-pink-500"
                />

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setFitgirlRssText(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0">
<channel>
<item>
<title>Black Myth: Wukong – v1.0.8 + Bonus OST</title>
<link>https://fitgirl-repacks.site/black-myth-wukong/</link>
<pubDate>Mon, 26 Aug 2024 12:00:00 +0000</pubDate>
<description><![CDATA[Repack Size: <strong>88.5 GB</strong> Original Size: <strong>128.0 GB</strong> <a href="magnet:?xt=urn:btih:8821948192847192847192847192847192847192&dn=Black.Myth.Wukong-FitGirl">Magnet Link</a>]]></description>
</item>
<item>
<title>Final Fantasy XVI: Complete Edition</title>
<link>https://fitgirl-repacks.site/final-fantasy-xvi/</link>
<pubDate>Tue, 17 Sep 2024 14:00:00 +0000</pubDate>
<description><![CDATA[Repack Size: <strong>92.1 GB</strong> Original Size: <strong>150.0 GB</strong> <a href="magnet:?xt=urn:btih:9920194810293847102938471029384710293847&dn=FFXVI-FitGirl">Magnet Link</a>]]></description>
</item>
</channel>
</rss>`);
                    }}
                    className="text-xs text-pink-400 hover:text-pink-300 font-medium"
                  >
                    Carregar Exemplo de XML
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!fitgirlRssText.trim()) return;
                      const parsed = parseFitGirlRssXml(fitgirlRssText);
                      if (parsed.length > 0) {
                        parsed.forEach(g => addGame(g));
                        alert(`Sucesso! ${parsed.length} jogos foram processados e adicionados ao catálogo!`);
                        setFitgirlRssText('');
                        setActiveTab('manage');
                      } else {
                        alert('Nenhum item válido encontrado no XML informado.');
                      }
                    }}
                    disabled={!fitgirlRssText.trim()}
                    className="px-4 py-2 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 disabled:opacity-50 transition-all flex items-center gap-1.5"
                  >
                    <Rss className="w-3.5 h-3.5" />
                    <span>Processar XML</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB: THEZUKOSTORE & TAPOCHEK HUB */}
          {activeTab === 'zukotapochek' && (
            <div className="space-y-6">
              
              {/* Header Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/60 border-2 border-purple-500/40 space-y-3 shadow-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-purple-500 text-slate-950">
                        CONSOLE & SCENE INTEGRATION
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-emerald-500 text-slate-950 flex items-center gap-1">
                        <span>🇧🇷</span> 100% PT-BR
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-white font-display">
                      TheZukoStore (PKG) & Tapochek.net (Torrent) Hub
                    </h3>
                    <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                      Gerencie lançamentos com <strong>dados originais</strong> da release. Quando o jogo tiver 
                      versão de console (PKG) e versão de computador (Torrent), o portal exibe <strong>botões distintos</strong> para cada formato, além do destaque imediato quando possuir dublagem ou textos em Português do Brasil (PT-BR).
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-purple-500/30 text-center shrink-0">
                    <span className="block text-[10px] text-slate-400 font-mono">DADOS ORIGINAIS</span>
                    <span className="text-lg font-black text-purple-300 font-display">CUSA & Torrents</span>
                  </div>
                </div>

                {/* Architecture Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="font-bold text-purple-300 flex items-center gap-1.5 mb-1">
                      <Gamepad2 className="w-3.5 h-3.5" /> 1. TheZukoStore (PKG)
                    </span>
                    <p className="text-slate-400 text-[11px]">
                      Arquivos instaláveis para PlayStation (PS3, PS4, PS5) categorizados por Title ID (CUSA-XXXXX) e versão do Firmware.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="font-bold text-cyan-300 flex items-center gap-1.5 mb-1">
                      <Download className="w-3.5 h-3.5" /> 2. Tapochek.net (Torrent)
                    </span>
                    <p className="text-slate-400 text-[11px]">
                      Tracker BitTorrent de alta velocidade especializado em jogos de PC e emuladores completos pré-configurados (ShadPS4 / RPCS3).
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="font-bold text-emerald-300 flex items-center gap-1.5 mb-1">
                      <Volume2 className="w-3.5 h-3.5" /> 3. Dublagem / Legendas PT-BR
                    </span>
                    <p className="text-slate-400 text-[11px]">
                      Detecção automática com botões exclusivos para pacotes de áudio, dubladores oficiais e traduções da comunidade.
                    </p>
                  </div>
                </div>
              </div>

              {/* ACTION 1: 1-Click Import Preset Collection */}
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      Importar Coleção Pronta TheZukoStore & Tapochek (1-Clique)
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Adicione agora ao catálogo títulos consagrados com botões duplos (Torrent PC + PKG Console + Dublagem PT-BR): 
                      <em> The Last of Us Part I, Ghost of Tsushima, Uncharted 4, Horizon Forbidden West</em>.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      let added = 0;
                      ZUKO_TAPOCHEK_PRESETS.forEach(preset => {
                        if (!games.some(g => g.id === preset.id)) {
                          addGame(preset);
                          added++;
                        }
                      });
                      setZukoImportedCount(added);
                      setTimeout(() => setZukoImportedCount(null), 3000);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/40 transition-all shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>Importar Coleção ZukoStore & Tapochek</span>
                  </button>
                </div>

                {zukoImportedCount !== null && (
                  <div className="p-3 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {zukoImportedCount > 0 
                        ? `${zukoImportedCount} novos jogos adicionados com sucesso ao portal!`
                        : 'Todos os títulos desta coleção já constam no catálogo.'}
                    </span>
                  </div>
                )}
              </div>

              {/* ACTION 2: Manual Dual-Format Publisher Form */}
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-400" />
                  Publicar Novo Jogo com Dados Originais (Torrent + PKG + PT-BR)
                </h4>
                <p className="text-xs text-slate-400">
                  Preencha os campos abaixo para criar um post contendo botões distintos para cada formato e destaque de áudio PT-BR:
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!zukoTitle.trim()) {
                      alert('Informe o título do jogo.');
                      return;
                    }

                    const newGame = createZukoTapochekGame({
                      title: zukoTitle.trim(),
                      titleId: zukoTitleId.trim() || undefined,
                      firmware: zukoFirmware.trim() || undefined,
                      size: zukoSize.trim() || '40.0 GB',
                      pkgUrl: zukoPkgUrl.trim() || undefined,
                      torrentUrl: zukoTorrentUrl.trim() || undefined,
                      patchPtBrUrl: zukoPatchPtBrUrl.trim() || undefined,
                      hasPtBrAudio: zukoHasAudio,
                      hasPtBrSubs: zukoHasSubs,
                      genres: [zukoGenre],
                      coverUrl: zukoCoverUrl.trim() || undefined,
                      sourceOrigin: zukoPkgUrl ? 'TheZukoStore' : 'Tapochek.net'
                    });

                    addGame(newGame);
                    alert(`Jogo "${newGame.title}" publicado com sucesso com botões separados para Torrent e PKG!`);
                    
                    // Reset form
                    setZukoTitle('');
                    setZukoPkgUrl('');
                    setZukoTorrentUrl('');
                    setZukoPatchPtBrUrl('');
                    setZukoTitleId('CUSA-');
                    setActiveTab('manage');
                  }}
                  className="space-y-4 pt-2"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[11px] font-bold text-slate-300">Título do Jogo *</label>
                      <input
                        type="text"
                        value={zukoTitle}
                        onChange={e => setZukoTitle(e.target.value)}
                        placeholder="Ex: The Last of Us Part II Remastered"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300">Gênero Principal</label>
                      <select
                        value={zukoGenre}
                        onChange={e => setZukoGenre(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                      >
                        <option value="Ação">Ação</option>
                        <option value="Aventura">Aventura</option>
                        <option value="RPG">RPG</option>
                        <option value="Mundo Aberto">Mundo Aberto</option>
                        <option value="Terror">Terror</option>
                        <option value="Soulslike">Soulslike</option>
                        <option value="Tiro / FPS">Tiro / FPS</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300">PlayStation Title ID (ZukoStore)</label>
                      <input
                        type="text"
                        value={zukoTitleId}
                        onChange={e => setZukoTitleId(e.target.value)}
                        placeholder="Ex: CUSA-30477"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-purple-300 font-mono focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300">Firmware Compatível</label>
                      <input
                        type="text"
                        value={zukoFirmware}
                        onChange={e => setZukoFirmware(e.target.value)}
                        placeholder="Ex: FW 5.05 - 11.00"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300">Tamanho da Release</label>
                      <input
                        type="text"
                        value={zukoSize}
                        onChange={e => setZukoSize(e.target.value)}
                        placeholder="Ex: 68.5 GB"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  {/* Distinct Links Section */}
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <span className="text-xs font-bold text-white uppercase tracking-wider block">
                      Links para os Botões Distintos de Download:
                    </span>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] font-bold text-cyan-400 flex items-center gap-1.5 mb-1">
                          <Download className="w-3.5 h-3.5" /> Botão 1: Torrent Magnet / Link (Tapochek.net)
                        </label>
                        <input
                          type="text"
                          value={zukoTorrentUrl}
                          onChange={e => setZukoTorrentUrl(e.target.value)}
                          placeholder="magnet:?xt=urn:btih:... ou https://tapochek.net/..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-purple-400 flex items-center gap-1.5 mb-1">
                          <FileArchive className="w-3.5 h-3.5" /> Botão 2: Arquivo PKG Console (TheZukoStore)
                        </label>
                        <input
                          type="text"
                          value={zukoPkgUrl}
                          onChange={e => setZukoPkgUrl(e.target.value)}
                          placeholder="https://thezukostore.com/games/cusa-XXXXX.pkg"
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-purple-300 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                          <Volume2 className="w-3.5 h-3.5" /> Botão 3: Pacote / Patch de Dublagem PT-BR
                        </label>
                        <input
                          type="text"
                          value={zukoPatchPtBrUrl}
                          onChange={e => setZukoPatchPtBrUrl(e.target.value)}
                          placeholder="https://thezukostore.com/audio/dublagem-ptbr.pkg"
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* PT-BR Localisation Toggles */}
                  <div className="flex flex-wrap items-center gap-6 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <span>🇧🇷</span> Localização PT-BR:
                    </span>

                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-emerald-300">
                      <input
                        type="checkbox"
                        checked={zukoHasAudio}
                        onChange={e => setZukoHasAudio(e.target.checked)}
                        className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                      />
                      <span>Dublado em Português do Brasil (Vozes)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-emerald-300">
                      <input
                        type="checkbox"
                        checked={zukoHasSubs}
                        onChange={e => setZukoHasSubs(e.target.checked)}
                        className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                      />
                      <span>Legendas e Menus em PT-BR</span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/40"
                    >
                      <Save className="w-4 h-4" />
                      <span>Publicar Jogo com Botões Distintos</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* ACTION 3: Node.js Automation & Supabase Sync Script */}
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-purple-400" />
                      Script Node.js para Indexar TheZukoStore & Tapochek no Supabase
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Estrutura pronta para capturar os dados originais e alimentar automaticamente o banco relacional.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(ZUKO_TAPOCHEK_SUPABASE_SCRIPT);
                      setCopiedZukoScript(true);
                      setTimeout(() => setCopiedZukoScript(false), 2000);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition-all shrink-0"
                  >
                    {copiedZukoScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedZukoScript ? 'Copiado!' : 'Copiar Script'}</span>
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-slate-900 text-purple-300 font-mono text-[11px] overflow-x-auto max-h-60 border border-slate-800">
                  {ZUKO_TAPOCHEK_SUPABASE_SCRIPT}
                </pre>
              </div>

            </div>
          )}

          {/* TAB 2: MANAGE POSTS */}
          {activeTab === 'manage' && (
            <div className="space-y-4">
              
              <div className="flex items-center justify-between gap-4">
                <input
                  type="text"
                  value={postSearch}
                  onChange={e => setPostSearch(e.target.value)}
                  placeholder="Filtrar postagens publicadas..."
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white w-72 focus:outline-none focus:border-cyan-500"
                />

                <span className="text-xs text-slate-400">
                  Total: <strong className="text-white">{games.length}</strong> jogos cadastrados
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/50">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">Capa / Jogo</th>
                      <th className="p-3">Repacker</th>
                      <th className="p-3">Tamanho</th>
                      <th className="p-3">Downloads</th>
                      <th className="p-3">Seeds</th>
                      <th className="p-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {games
                      .filter(g => g.title.toLowerCase().includes(postSearch.toLowerCase()))
                      .map(game => (
                        <tr key={game.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="p-3 flex items-center gap-3">
                            <img src={game.coverUrl} alt={game.title} className="w-8 h-11 object-cover rounded border border-slate-800" />
                            <div>
                              <p className="font-bold text-white truncate max-w-xs">{game.title}</p>
                              <p className="text-[10px] text-slate-400">{game.releaseYear} • {game.developer}</p>
                            </div>
                          </td>
                          <td className="p-3 font-semibold text-cyan-300">{game.repackInfo.repacker}</td>
                          <td className="p-3 font-mono">{game.repackInfo.repackSize}</td>
                          <td className="p-3 font-mono text-slate-300">{game.downloadsCount.toLocaleString()}</td>
                          <td className="p-3 text-emerald-400 font-bold">+{game.downloadLinks[0]?.seeders || 2000}</td>
                          <td className="p-3 text-right space-x-1">
                            <button
                              onClick={() => setEditingGame(game)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 transition-all"
                              title="Editar Postagem"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteGame(game.id)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-rose-400 hover:text-white transition-all"
                              title="Excluir Postagem"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Editing Game Modal overlay */}
              {editingGame && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4">
                    <h4 className="text-base font-bold text-white">Editar Jogo: {editingGame.title}</h4>
                    
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1">Título:</label>
                        <input
                          type="text"
                          value={editingGame.title}
                          onChange={e => setEditingGame({ ...editingGame, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Tamanho Repack:</label>
                        <input
                          type="text"
                          value={editingGame.repackInfo.repackSize}
                          onChange={e => setEditingGame({
                            ...editingGame,
                            repackInfo: { ...editingGame.repackInfo, repackSize: e.target.value }
                          })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Link Magnet Principal:</label>
                        <input
                          type="text"
                          value={editingGame.downloadLinks[0]?.url || ''}
                          onChange={e => {
                            const newLinks = [...editingGame.downloadLinks];
                            if (newLinks[0]) newLinks[0].url = e.target.value;
                            setEditingGame({ ...editingGame, downloadLinks: newLinks });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => setEditingGame(null)}
                        className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950"
                      >
                        Salvar Alterações
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: MODERATE COMMENTS */}
          {activeTab === 'comments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Comentários e Avaliações dos Usuários ({comments.length})
                </h4>
              </div>

              <div className="space-y-3">
                {comments.map(c => {
                  const game = games.find(g => g.id === c.gameId);
                  return (
                    <div key={c.id} className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">{c.authorName}</span>
                          <span className="text-[10px] text-cyan-400 font-medium">no jogo: {game?.title || c.gameId}</span>
                          <span className="text-[10px] text-slate-500">• {c.createdAt}</span>
                        </div>
                        <p className="text-xs text-slate-300">{c.content}</p>
                      </div>

                      <button
                        onClick={() => deleteComment(c.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-rose-400 hover:text-white transition-all shrink-0"
                        title="Deletar Comentário"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: BACKUP & SUPABASE / DEPLOY VERCEL TUTORIAL */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              
              {/* Header Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border border-cyan-800/40 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500 text-slate-950">
                    Tutorial Completo do Zero
                  </span>
                  <span className="text-xs text-cyan-300 font-semibold">100% pelo Navegador • Sem Terminal</span>
                </div>
                <h3 className="text-lg font-black text-white font-display">
                  Como Publicar seu Portal no GitHub, Supabase e Vercel (Gratuito)
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                  Se você travou ou é iniciante, fique tranquilo! Siga as 4 etapas abaixo em ordem cronológica. Você não precisa instalar nada de tela preta e não precisa digitar comandos no terminal: faremos tudo clicando com o mouse!
                </p>
              </div>

              {/* ETAPA 0: DE ONDE TIRO OS ARQUIVOS? */}
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-black flex items-center justify-center text-sm shrink-0 border border-amber-500/30">
                    0
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Download className="w-4 h-4 text-amber-400" />
                      De onde tiro os arquivos? (Baixar o projeto do Google AI Studio)
                    </h4>
                    <p className="text-xs text-slate-400">
                      Você está construindo o projeto dentro do navegador. Para enviá-lo ao GitHub, primeiro precisamos baixar uma cópia para o seu computador.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 space-y-3 text-xs text-slate-300">
                  <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <p className="font-bold text-white text-xs">Opção Imediata (1 Clique):</p>
                      <p className="text-[11px] text-slate-400">Baixe o arquivo ZIP com todo o código do site pronto para enviar ao GitHub.</p>
                    </div>
                    <a
                      href="/vortex-games.zip"
                      download="vortex-games.zip"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-md shadow-amber-500/20 shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      <span>Baixar vortex-games.zip</span>
                    </a>
                  </div>

                  <ol className="list-decimal list-inside space-y-2 leading-relaxed">
                    <li>
                      <strong className="text-white">Baixar o código:</strong> Clique no botão amarelo acima para baixar o <code className="text-amber-400 font-bold">vortex-games.zip</code> ou use o menu do <span className="text-cyan-400 font-semibold">Google AI Studio</span> no canto superior da tela (ícone de Download / Export). O arquivo irá para a sua pasta <em>Downloads</em>.
                    </li>
                    <li>
                      <strong className="text-white">Extrair o arquivo:</strong> Vá na pasta <em>Downloads</em> do seu computador, clique com o <strong>botão direito do mouse</strong> no arquivo ZIP baixado e clique em <strong>"Extrair Tudo"</strong> (no Windows) ou dê dois cliques (no Mac).
                    </li>
                    <li>
                      <strong className="text-white">Pronto:</strong> Agora você tem uma pasta comum no seu computador contendo todos os arquivos do site (como <code className="text-cyan-300 bg-slate-950 px-1 py-0.5 rounded">src</code>, <code className="text-cyan-300 bg-slate-950 px-1 py-0.5 rounded">package.json</code>, etc.). Guarde essa pasta!
                    </li>
                  </ol>
                </div>
              </div>

              {/* ETAPA 1: GITHUB (ENVIO PELO NAVEGADOR) */}
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 font-black flex items-center justify-center text-sm shrink-0 border border-cyan-500/30">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-cyan-400" />
                      Enviar os arquivos para o GitHub (100% pelo Navegador com o Mouse)
                    </h4>
                    <p className="text-xs text-slate-400">
                      O GitHub é onde seus arquivos ficarão guardados na nuvem com segurança.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 space-y-3 text-xs text-slate-300">
                  <ol className="list-decimal list-inside space-y-2 leading-relaxed">
                    <li>
                      Acesse <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline font-semibold">github.com</a> e crie uma conta gratuita (ou faça login se já tiver).
                    </li>
                    <li>
                      No canto superior direito, clique no botão verde <strong>"New"</strong> (ou no símbolo <strong>+</strong> &rarr; <strong>New repository</strong>).
                    </li>
                    <li>
                      Em <strong>Repository name</strong>, digite: <code className="text-emerald-400 bg-slate-950 px-1.5 py-0.5 rounded font-mono font-bold">vortex-games</code>.
                    </li>
                    <li>
                      Deixe marcado como <strong>Public</strong>.
                    </li>
                    <li>
                      <strong className="text-amber-300">Ponto Chave:</strong> Marque a caixinha <strong className="text-white font-bold">"Add a README file"</strong>. <em>(Isso é fundamental, pois faz o GitHub abrir o botão de upload de arquivos imediatamente!)</em>
                    </li>
                    <li>
                      Role até o final da página e clique no botão verde <strong>"Create repository"</strong>.
                    </li>
                    <li>
                      Agora, dentro da página do seu repositório, clique no botão <strong>"Add file"</strong> (fica perto do botão verde 'Code') e selecione <strong>"Upload files"</strong>.
                    </li>
                    <li>
                      Abra a pasta do projeto que você descompactou no seu computador no Passo 0. Selecione todos os arquivos e pastas de dentro dela e <strong>arraste com o mouse para dentro do quadrado na página do GitHub</strong>.
                    </li>
                    <li>
                      Espere o envio terminar (você verá a listinha de arquivos carregando). Depois, clique no botão verde no rodapé: <strong>"Commit changes"</strong>.
                    </li>
                  </ol>
                  <div className="flex items-center gap-2 p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-lg text-emerald-300 text-[11px]">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Pronto! Todos os arquivos do projeto agora estão salvos no seu GitHub.</span>
                  </div>
                </div>
              </div>

              {/* ETAPA 2: SUPABASE (BANCO DE DADOS GRATUITO) */}
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center text-sm shrink-0 border border-emerald-500/30">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Database className="w-4 h-4 text-emerald-400" />
                      Criar o Banco de Dados no Supabase & Rodar o Script SQL
                    </h4>
                    <p className="text-xs text-slate-400">
                      O Supabase armazena seus jogos, downloads, avaliações e comentários com PostgreSQL em nuvem.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 space-y-3 text-xs text-slate-300">
                  {/* Status Banner do Supabase Conectado */}
                  <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <strong className="text-emerald-300 text-xs">Supabase Configurado & Detectado:</strong>
                      </div>
                      <button
                        onClick={handleTestSupabase}
                        disabled={supabaseTestStatus.testing}
                        className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-[11px] transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                      >
                        {supabaseTestStatus.testing ? 'Testando...' : 'Testar Conexão Agora'}
                      </button>
                    </div>

                    <div className="font-mono text-[11px] text-emerald-200 bg-slate-950/80 px-2.5 py-1 rounded border border-emerald-900/50 break-all select-all">
                      {SUPABASE_URL}
                    </div>

                    {supabaseTestStatus.checked && (
                      <div className={`p-2 rounded-lg text-[11px] font-medium flex items-center gap-2 ${
                        supabaseTestStatus.success ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-700/50' : 'bg-red-950/60 text-red-200 border border-red-800/50'
                      }`}>
                        {supabaseTestStatus.success ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <X className="w-4 h-4 text-red-400 shrink-0" />}
                        <span>{supabaseTestStatus.message} {supabaseTestStatus.count !== undefined && `(${supabaseTestStatus.count} jogos encontrados)`}</span>
                      </div>
                    )}
                  </div>

                  <ol className="list-decimal list-inside space-y-2 leading-relaxed">
                    <li>
                      Acesse <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline font-semibold">supabase.com</a> e acesse o seu projeto criado.
                    </li>
                    <li>
                      No menu lateral esquerdo do Supabase, clique no ícone <strong>"SQL Editor"</strong> (o ícone com <code className="text-cyan-300">&gt;_</code>).
                    </li>
                    <li>
                      Clique no botão <strong>"New query"</strong>.
                    </li>
                    <li>
                      Copie o script SQL completo clicando no botão abaixo:
                    </li>
                  </ol>

                  {/* Botão de Copiar SQL */}
                  <div className="pt-1 pb-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
                        setCopiedSql(true);
                        setTimeout(() => setCopiedSql(false), 3000);
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20"
                    >
                      {copiedSql ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Script SQL Copiado para a Área de Transferência!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copiar Script SQL Completo do Supabase</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Dica de Liberação de Escrita (RLS) e Correção de Erros */}
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-cyan-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-cyan-300 text-xs">Comando SQL Rápido (Corrige erro release_date e RLS Policy):</span>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Rode isto no SQL Editor do Supabase se der erro de coluna faltando ou política já existente.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          const quickSql = `-- 1. Garante que a coluna release_date exista
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS release_date TEXT;

-- 2. Atualiza a política de leitura
DROP POLICY IF EXISTS "Jogos públicos para leitura anônima" ON public.games;
CREATE POLICY "Jogos públicos para leitura anônima" ON public.games FOR SELECT TO public USING (true);

-- 3. Atualiza a política de escrita/inserção
DROP POLICY IF EXISTS "Admin pode inserir e atualizar jogos" ON public.games;
CREATE POLICY "Admin pode inserir e atualizar jogos" ON public.games FOR ALL TO public USING (true) WITH CHECK (true);`;
                          navigator.clipboard.writeText(quickSql);
                          setCopiedRlsSql(true);
                          setTimeout(() => setCopiedRlsSql(false), 2500);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold transition-all flex items-center gap-1.5 shrink-0"
                      >
                        {copiedRlsSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedRlsSql ? 'SQL Copiado!' : 'Copiar SQL de Correção'}</span>
                      </button>
                    </div>

                    <pre className="text-[10px] font-mono text-cyan-200/90 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 overflow-x-auto whitespace-pre">
{`ALTER TABLE public.games ADD COLUMN IF NOT EXISTS release_date TEXT;
DROP POLICY IF EXISTS "Jogos públicos para leitura anônima" ON public.games;
CREATE POLICY "Jogos públicos para leitura anônima" ON public.games FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Admin pode inserir e atualizar jogos" ON public.games;
CREATE POLICY "Admin pode inserir e atualizar jogos" ON public.games FOR ALL TO public USING (true) WITH CHECK (true);`}
                    </pre>

                    {/* Botão de Enviar Catálogo Completo para o Supabase */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        <div className="text-xs font-bold text-white">Enviar Catálogo Local para o Supabase:</div>
                        <div className="text-[11px] text-slate-400">Faz upload direto de todos os {games.length} jogos para o banco em nuvem.</div>
                      </div>
                      <button
                        onClick={handleSyncAllToSupabase}
                        disabled={syncingAllToSupabase}
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-md shadow-purple-600/30 flex items-center gap-2 disabled:opacity-50"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{syncingAllToSupabase ? 'Enviando Jogos...' : `Enviar Todos os ${games.length} Jogos para Supabase`}</span>
                      </button>
                    </div>

                    {syncAllSupabaseResult && (
                      <div className={`p-2.5 rounded-lg text-xs font-medium flex items-center gap-2 ${
                        syncAllSupabaseResult.success ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-700/60' : 'bg-amber-950/80 text-amber-200 border border-amber-700/60'
                      }`}>
                        {syncAllSupabaseResult.success ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
                        <span>{syncAllSupabaseResult.message}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ETAPA 3: VERCEL (PUBLICAR NA INTERNET) */}
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 font-black flex items-center justify-center text-sm shrink-0 border border-purple-500/30">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Play className="w-4 h-4 text-purple-400" />
                      Publicar na Vercel (Seu Portal no ar com link público .vercel.app)
                    </h4>
                    <p className="text-xs text-slate-400">
                      A Vercel hospeda seu site de graça na nuvem global de alta velocidade com HTTPS.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 space-y-3 text-xs text-slate-300">
                  <ol className="list-decimal list-inside space-y-2 leading-relaxed">
                    <li>
                      Acesse <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline font-semibold">vercel.com</a> e clique em <strong>"Sign Up"</strong> (ou Log in com seu GitHub).
                    </li>
                    <li>
                      No painel da Vercel, clique no botão <strong>"Add New..."</strong> &rarr; <strong>"Project"</strong>.
                    </li>
                    <li>
                      Você verá seu repositório <strong className="text-white">vortex-games</strong> listado. Clique no botão azul <strong>"Import"</strong> ao lado dele.
                    </li>
                    <li>
                      Na tela de configuração, abra a seção <strong>"Environment Variables"</strong> e adicione as 2 variáveis com as suas chaves prontas abaixo:
                    </li>
                  </ol>

                  {/* Card com os valores exatos e botões de copiar */}
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                    {/* Variável 1 */}
                    <div className="space-y-1 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-400 text-[11px]">Nome da Variável 1:</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText('VITE_SUPABASE_URL');
                            setCopiedVarName('name1');
                            setTimeout(() => setCopiedVarName(null), 2000);
                          }}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-bold transition-all flex items-center gap-1"
                        >
                          {copiedVarName === 'name1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedVarName === 'name1' ? 'Copiado!' : 'Copiar Nome'}</span>
                        </button>
                      </div>
                      <div className="text-cyan-400 font-bold select-all text-xs">VITE_SUPABASE_URL</div>

                      <div className="pt-1.5 flex items-center justify-between gap-2 border-t border-slate-800/60">
                        <span className="text-slate-400 text-[11px]">Valor:</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(SUPABASE_URL);
                            setCopiedVarName('val1');
                            setTimeout(() => setCopiedVarName(null), 2000);
                          }}
                          className="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[10px] font-bold transition-all flex items-center gap-1"
                        >
                          {copiedVarName === 'val1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedVarName === 'val1' ? 'Copiado!' : 'Copiar Valor'}</span>
                        </button>
                      </div>
                      <div className="text-slate-200 select-all text-[11px] break-all bg-slate-950 px-2 py-1 rounded">
                        {SUPABASE_URL}
                      </div>
                    </div>

                    {/* Variável 2 */}
                    <div className="space-y-1 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-400 text-[11px]">Nome da Variável 2:</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText('VITE_SUPABASE_ANON_KEY');
                            setCopiedVarName('name2');
                            setTimeout(() => setCopiedVarName(null), 2000);
                          }}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-bold transition-all flex items-center gap-1"
                        >
                          {copiedVarName === 'name2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedVarName === 'name2' ? 'Copiado!' : 'Copiar Nome'}</span>
                        </button>
                      </div>
                      <div className="text-cyan-400 font-bold select-all text-xs">VITE_SUPABASE_ANON_KEY</div>

                      <div className="pt-1.5 flex items-center justify-between gap-2 border-t border-slate-800/60">
                        <span className="text-slate-400 text-[11px]">Valor:</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(SUPABASE_ANON_KEY);
                            setCopiedVarName('val2');
                            setTimeout(() => setCopiedVarName(null), 2000);
                          }}
                          className="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[10px] font-bold transition-all flex items-center gap-1"
                        >
                          {copiedVarName === 'val2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedVarName === 'val2' ? 'Copiado!' : 'Copiar Valor'}</span>
                        </button>
                      </div>
                      <div className="text-slate-200 select-all text-[10px] break-all bg-slate-950 px-2 py-1 rounded max-h-16 overflow-y-auto">
                        {SUPABASE_ANON_KEY}
                      </div>
                    </div>
                  </div>

                  <ol start={5} className="list-decimal list-inside space-y-2 leading-relaxed">
                    <li>
                      Clique no botão azul <strong>"Deploy"</strong> no rodapé da página!
                    </li>
                    <li>
                      Aguarde cerca de 1 a 2 minutos. A Vercel compilará seu site e mostrará uma tela comemorativa com o link público definitivo (ex: <code className="text-purple-300 font-bold">https://vortex-games.vercel.app</code>).
                    </li>
                    <li>
                      <strong>Pronto!</strong> Seu portal de jogos está 100% online, com banco de dados conectado e links funcionando em qualquer computador ou celular.
                    </li>
                  </ol>
                </div>
              </div>

              {/* ETAPA 4: AUTOMAÇÃO */}
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 font-black flex items-center justify-center text-sm shrink-0 border border-cyan-500/30">
                    4
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      Como Funciona a Automação a Cada Hora?
                    </h4>
                    <p className="text-xs text-slate-400">
                      O arquivo <code className="text-cyan-400">vercel.json</code> já está configurado no projeto com um <strong>Cron Job</strong> que roda a cada hora (<code className="text-amber-400">0 * * * *</code>) e chama a rota <code className="text-cyan-400">/api/cron-sync</code> para buscar novos jogos automaticamente, sem que você precise fazer nada!
                    </p>
                  </div>
                </div>
              </div>

              {/* SEÇÃO ORIGINAL DE BACKUP / RESTAURAÇÃO */}
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  Backup e Exportação dos Dados Locais (JSON)
                </h4>
                <p className="text-xs text-slate-400">
                  Você pode exportar todo o catálogo de jogos, avaliações, links magnet e comentários em formato JSON para restaurar a qualquer momento.
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      const json = exportDatabaseJson();
                      const blob = new Blob([json], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `vortex-games-backup-${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Baixar Backup Completo (JSON)</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Deseja realmente restaurar o catálogo padrão de jogos?')) {
                        resetDatabaseToDefault();
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-rose-400 transition-all"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Restaurar Catálogo Padrão</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
