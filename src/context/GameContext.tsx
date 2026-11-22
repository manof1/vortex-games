import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Game, Comment, UserLibraryEntry, SiteNotification, FilterState, LibraryStatus, UserProfile } from '../types';
import { INITIAL_GAMES } from '../data/mockGames';
import { INITIAL_COMMENTS } from '../data/mockComments';
import { INITIAL_NOTIFICATIONS } from '../data/mockNotifications';
import { 
  AutoSyncConfig, 
  SyncLog, 
  DEFAULT_SYNC_CONFIG, 
  checkForNewFitGirlReleases 
} from '../services/autoSyncService';
import {
  fetchGamesFromSupabase,
  upsertGameToSupabase,
  updateGameStatsInSupabase,
  deleteGameFromSupabase,
  fetchCommentsFromSupabase,
  insertCommentToSupabase,
  updateCommentLikesInSupabase,
  deleteCommentFromSupabase,
  saveCloudSyncData,
  getCloudSyncData
} from '../services/supabaseClient';
import { sanitizeMagnetLink } from '../utils/magnetUtils';
import { getGameCover, getGameBanner, DEFAULT_GAME_COVER, DEFAULT_GAME_BANNER } from '../utils/imageUtils';
import { filterOutRiotPixels, isRiotPixelsLink } from '../utils/linkFilters';
import { updateBrowserUrlForHome } from '../services/urlRoutingService';

interface GameContextType {
  games: Game[];
  comments: Comment[];
  library: UserLibraryEntry[];
  notifications: SiteNotification[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  activeGame: Game | null;
  setActiveGame: (game: Game | null) => void;
  isLibraryOpen: boolean;
  setIsLibraryOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isSupabaseGuideOpen: boolean;
  setIsSupabaseGuideOpen: (open: boolean) => void;
  isUserMenuOpen: boolean;
  setIsUserMenuOpen: (open: boolean) => void;
  isGameRequestOpen: boolean;
  setIsGameRequestOpen: (open: boolean) => void;
  // Creator PKG Test Lab (manof1@gmail.com)
  isCreator: boolean;
  isPkgLabOpen: boolean;
  setIsPkgLabOpen: (open: boolean) => void;
  isCreatorAuthOpen: boolean;
  setIsCreatorAuthOpen: (open: boolean) => void;
  openCreatorLab: () => void;
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  authModalNotice: string;
  setAuthModalNotice: (notice: string) => void;
  openAuthModal: (mode?: 'login' | 'register', notice?: string) => void;
  login: (usernameOrEmail: string, password?: string) => boolean;
  register: (name: string, email: string, password?: string) => boolean;
  logout: () => void;
  requireAuth: (notice?: string) => boolean;
  // Multi-Device Cloud Sync
  cloudSyncCode: string;
  syncToCloud: () => Promise<{ success: boolean; syncCode: string; message: string }>;
  restoreFromCloudCode: (code: string) => Promise<{ success: boolean; message: string }>;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  // Auto-Sync FitGirl
  autoSyncConfig: AutoSyncConfig;
  syncLogs: SyncLog[];
  toggleAutoSync: () => void;
  triggerManualSync: () => { addedCount: number; message: string };
  activeGameInitialTab: 'downloads' | 'instructions' | 'specs' | 'screenshots' | 'localizations';
  openGameWithTab: (game: Game, tab?: 'downloads' | 'instructions' | 'specs' | 'screenshots' | 'localizations') => void;
  // Can You Run It (Meu PC Roda?)
  isCanIRunItOpen: boolean;
  setIsCanIRunItOpen: (open: boolean) => void;
  canIRunItGame: Game | null;
  openCanIRunIt: (game?: Game | null) => void;
  // Gamer Utilities (Utilitários Essenciais)
  isUtilitiesOpen: boolean;
  setIsUtilitiesOpen: (open: boolean) => void;
  openUtilities: () => void;
  // Thematic Lists (Listas Temáticas)
  activeThematicListId: string | null;
  setActiveThematicListId: (listId: string | null) => void;
  // Actions
  addGame: (game: Game) => void;
  updateGame: (game: Game) => void;
  deleteGame: (gameId: string) => void;
  rateGame: (gameId: string, score: number) => void;
  getUserVote: (gameId: string) => number | null;
  addComment: (gameId: string, authorName: string, content: string, rating?: number) => void;
  likeComment: (commentId: string) => void;
  deleteComment: (commentId: string) => void;
  addToLibrary: (gameId: string, status: LibraryStatus) => void;
  removeFromLibrary: (gameId: string) => void;
  updateLibraryStatus: (gameId: string, status: LibraryStatus) => void;
  isInLibrary: (gameId: string) => LibraryStatus | null;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  incrementView: (gameId: string) => void;
  incrementDownload: (gameId: string) => void;
  resetDatabaseToDefault: () => void;
  exportDatabaseJson: () => string;
  importDatabaseJson: (json: string) => boolean;
}

const DEFAULT_FILTERS: FilterState = {
  search: '',
  genre: 'Todos',
  category: 'Todos',
  year: 'Todos',
  repacker: 'Todos',
  sizeRange: 'Todos',
  sortBy: 'latest',
  minRating: 0,
  onlyPtBr: false,
  formatFilter: 'all',
  yearRange: 'all',
  platform: 'all'
};

interface StoredGameStats {
  viewsCount?: number;
  downloadsCount?: number;
  rating?: number;
  totalVotes?: number;
}

const GAME_STATS_STORAGE_KEY = 'vortex_game_stats';

function loadStoredGameStats(): Record<string, StoredGameStats> {
  try {
    const raw = localStorage.getItem(GAME_STATS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function safeSetLocalStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    try {
      // Libera espaço removendo caches pesados legados e tenta novamente uma vez
      localStorage.removeItem('vortex_games');
      localStorage.setItem(key, value);
    } catch {
      // Ignora silenciosamente caso o armazenamento local esteja bloqueado ou cheio
    }
  }
}

function saveStoredGameStat(gameId: string, patch: StoredGameStats) {
  try {
    const current = loadStoredGameStats();
    current[gameId] = { ...(current[gameId] || {}), ...patch };
    safeSetLocalStorage(GAME_STATS_STORAGE_KEY, JSON.stringify(current));
  } catch {
    // ignore
  }
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state com suporte à preferência nativa do sistema e persistência
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('vortex_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    } catch {
      // fallback
    }
    return 'dark';
  });

  // Games state
  const [games, setGames] = useState<Game[]>(() => {
    let needsStatsReset = false;
    try {
      if (localStorage.getItem('vortex_stats_reset_v2') !== '1') {
        needsStatsReset = true;
        localStorage.removeItem(GAME_STATS_STORAGE_KEY);
        localStorage.removeItem('vortex_user_votes');
        localStorage.removeItem('vortex_liked_comments');

        // Remove comentários falsos de demonstração legados (c-1..c-5), mantendo comentários reais
        const rawComments = localStorage.getItem('vortex_comments');
        if (rawComments) {
          try {
            const parsedComments = JSON.parse(rawComments);
            if (Array.isArray(parsedComments)) {
              const fakeIds = new Set(['c-1', 'c-2', 'c-3', 'c-4', 'c-5']);
              const realOnly = parsedComments.filter((c: any) => !fakeIds.has(c?.id));
              localStorage.setItem('vortex_comments', JSON.stringify(realOnly));
            }
          } catch {
            localStorage.removeItem('vortex_comments');
          }
        }

        // Remove notas falsas de demonstração da biblioteca padrão
        const rawLibrary = localStorage.getItem('vortex_library');
        if (rawLibrary) {
          try {
            const parsedLib = JSON.parse(rawLibrary);
            if (Array.isArray(parsedLib)) {
              const cleanedLib = parsedLib.filter((entry: any) => {
                const isDefaultDemo =
                  (entry?.gameId === 'cyberpunk-2077' && entry?.status === 'playing' && entry?.userRating === 5 && !entry?.downloadCount) ||
                  (entry?.gameId === 'elden-ring' && entry?.status === 'completed' && entry?.userRating === 5 && !entry?.downloadCount);
                return !isDefaultDemo;
              }).map((entry: any) => {
                const { userRating: _drop, ...rest } = entry || {};
                return rest;
              });
              localStorage.setItem('vortex_library', JSON.stringify(cleanedLib));
            }
          } catch {
            localStorage.removeItem('vortex_library');
          }
        }

        // Zera contadores de avaliação de demonstração no perfil local
        const rawProfile = localStorage.getItem('vortex_user_profile');
        if (rawProfile) {
          try {
            const parsedProfile = JSON.parse(rawProfile);
            if (parsedProfile && typeof parsedProfile === 'object') {
              parsedProfile.reviewsCount = 0;
              const dlIds = JSON.parse(localStorage.getItem('vortex_downloaded_ids') || '[]');
              if (parsedProfile.totalDownloads === 14 && (!Array.isArray(dlIds) || dlIds.length === 0)) {
                parsedProfile.totalDownloads = 0;
              }
              localStorage.setItem('vortex_user_profile', JSON.stringify(parsedProfile));
            }
          } catch {
            // ignore
          }
        }

        localStorage.setItem('vortex_stats_reset_v1', '1');
        localStorage.setItem('vortex_stats_reset_v2', '1');
      }
    } catch {
      // ignore
    }

    let baseList = INITIAL_GAMES;
    const initialMap = new Map<string, Game>(INITIAL_GAMES.map(g => [g.id, g]));
    let saved: string | null = null;
    try {
      saved = localStorage.getItem('vortex_games');
      // Remove o cache legado pesado para não estourar a cota de 5MB do navegador;
      // o catálogo completo é carregado diretamente do Supabase ao iniciar.
      if (saved) {
        localStorage.removeItem('vortex_games');
      }
    } catch {
      saved = null;
    }

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If cached game is a preset, keep authentic cover/banner from INITIAL_GAMES
          // to fix any old cached SVG/gameover/imageban covers on Vercel/GitHub
          const sanitizedSaved = parsed.map((pg: Game) => {
            const preset = initialMap.get(pg.id);
            const resetPatch = needsStatsReset
              ? { viewsCount: 0, downloadsCount: 0, rating: 0, totalVotes: 0 }
              : {};
            if (preset) {
              return {
                ...preset,
                ...pg,
                ...resetPatch,
                // Preserve user-chosen coverUrl if present; otherwise fallback to preset cover
                coverUrl: pg.coverUrl || preset.coverUrl,
                bannerUrl: pg.bannerUrl || preset.bannerUrl
              };
            }
            if (pg.coverUrl?.includes('1091500') && !pg.title?.toLowerCase().includes('cyberpunk')) {
              return {
                ...pg,
                ...resetPatch,
                coverUrl: DEFAULT_GAME_COVER,
                bannerUrl: DEFAULT_GAME_BANNER
              };
            }
            return { ...pg, ...resetPatch };
          });

          const savedIds = new Set(sanitizedSaved.map((g: Game) => g.id));
          const missingPresets = INITIAL_GAMES.filter(g => !savedIds.has(g.id));
          baseList = [...missingPresets, ...sanitizedSaved];
        }
      } catch (e) {
        console.error('Failed to parse saved games', e);
      }
    }

    try {
      localStorage.setItem('vortex_cover_version', 'v6_steam_cdn');
    } catch {
      // ignore
    }

    // Sanitize real votes & merge persisted local stats
    let userVotesMap: Record<string, number> = {};
    try {
      userVotesMap = JSON.parse(localStorage.getItem('vortex_user_votes') || '{}');
    } catch {
      userVotesMap = {};
    }
    const localStats = loadStoredGameStats();

    // Deduplicate by id, keeping highest views/downloads when presets collide
    const dedupMap = new Map<string, Game>();
    for (const g of baseList) {
      const existing = dedupMap.get(g.id);
      if (!existing || (g.viewsCount || 0) > (existing.viewsCount || 0)) {
        dedupMap.set(g.id, g);
      }
    }

    const cleanedList = Array.from(dedupMap.values()).map(g => {
      const realVote = userVotesMap[g.id];
      const stat = localStats[g.id];
      const withoutRiotPixels = filterOutRiotPixels(g.downloadLinks || []);
      const sanitizedLinks = withoutRiotPixels.map(dl => {
        if (dl.url && (dl.type === 'magnet' || dl.url.startsWith('magnet:?'))) {
          return {
            ...dl,
            url: sanitizeMagnetLink(dl.url, `${g.title} [${g.repackInfo?.repacker || 'Vortex'}]`)
          };
        }
        return dl;
      });

      const resolvedViews = Math.max(g.viewsCount || 0, stat?.viewsCount || 0);
      const resolvedDownloads = Math.max(g.downloadsCount || 0, stat?.downloadsCount || 0);
      const resolvedVotes = stat?.totalVotes && stat.totalVotes > 0 ? stat.totalVotes : (realVote ? 1 : 0);
      const resolvedRating = stat?.totalVotes && stat.totalVotes > 0 && typeof stat.rating === 'number'
        ? stat.rating
        : (realVote ? realVote : 0);

      return {
        ...g,
        coverUrl: getGameCover(g),
        bannerUrl: getGameBanner(g),
        downloadLinks: sanitizedLinks,
        viewsCount: resolvedViews,
        downloadsCount: resolvedDownloads,
        rating: resolvedRating,
        totalVotes: resolvedVotes
      };
    });

    return cleanedList;
  });

  // Comments state
  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('vortex_comments');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const fakeIds = new Set(['c-1', 'c-2', 'c-3', 'c-4', 'c-5']);
          return parsed.filter((c: any) => c && !fakeIds.has(c.id));
        }
      } catch (e) {
        console.error('Failed to parse saved comments', e);
      }
    }
    return INITIAL_COMMENTS;
  });

  // Library state
  const [library, setLibrary] = useState<UserLibraryEntry[]>(() => {
    const saved = localStorage.getItem('vortex_library');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error('Failed to parse saved library', e);
      }
    }
    return [];
  });

  // Notifications state
  const [notifications, setNotifications] = useState<SiteNotification[]>(() => {
    const saved = localStorage.getItem('vortex_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved notifications', e);
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Auto-Sync state (FitGirl hourly check)
  const [autoSyncConfig, setAutoSyncConfig] = useState<AutoSyncConfig>(() => {
    const saved = localStorage.getItem('vortex_sync_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse sync config', e);
      }
    }
    return DEFAULT_SYNC_CONFIG;
  });

  const [syncLogs, setSyncLogs] = useState<SyncLog[]>(() => {
    const saved = localStorage.getItem('vortex_sync_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse sync logs', e);
      }
    }
    return [
      {
        id: 'log-1',
        timestamp: '11:00:00',
        message: 'Monitoramento FitGirl iniciado com sucesso.',
        type: 'info'
      },
      {
        id: 'log-2',
        timestamp: '11:30:15',
        message: 'Checagem de rotina no Feed RSS (fitgirl-repacks.site/feed/).',
        type: 'info'
      }
    ];
  });

  useEffect(() => {
    safeSetLocalStorage('vortex_sync_config', JSON.stringify(autoSyncConfig));
  }, [autoSyncConfig]);

  useEffect(() => {
    safeSetLocalStorage('vortex_sync_logs', JSON.stringify(syncLogs.slice(0, 50)));
  }, [syncLogs]);

  // Carregar jogos e comentários reais do Supabase ao iniciar
  useEffect(() => {
    let isMounted = true;
    fetchGamesFromSupabase().then(remoteGames => {
      if (isMounted && remoteGames && remoteGames.length > 0) {
        let latestMerged: Game[] = [];
        setGames(prev => {
          let userVotesMap: Record<string, number> = {};
          try {
            userVotesMap = JSON.parse(localStorage.getItem('vortex_user_votes') || '{}');
          } catch {
            userVotesMap = {};
          }
          const localStats = loadStoredGameStats();
          const prevMap = new Map<string, Game>(prev.map(pg => [pg.id, pg]));

          const sanitizedRemote = remoteGames.map(g => {
            const realVote = userVotesMap[g.id];
            const stat = localStats[g.id];
            const prevGame = prevMap.get(g.id);
            const cleanLinks = filterOutRiotPixels(g.downloadLinks || []);

            const mergedViews = Math.max(g.viewsCount || 0, prevGame?.viewsCount || 0, stat?.viewsCount || 0);
            const mergedDownloads = Math.max(g.downloadsCount || 0, prevGame?.downloadsCount || 0, stat?.downloadsCount || 0);

            let resolvedRating = g.rating || 0;
            let resolvedVotes = g.totalVotes || 0;
            if (stat?.totalVotes && stat.totalVotes > resolvedVotes) {
              resolvedRating = stat.rating || realVote || 0;
              resolvedVotes = stat.totalVotes;
            } else if (resolvedVotes === 0 && realVote) {
              resolvedRating = realVote;
              resolvedVotes = 1;
            }

            return {
              ...g,
              downloadLinks: cleanLinks,
              viewsCount: mergedViews,
              downloadsCount: mergedDownloads,
              rating: resolvedRating,
              totalVotes: resolvedVotes
            };
          });

          const remoteIds = new Set(sanitizedRemote.map(g => g.id));
          latestMerged = [...sanitizedRemote, ...prev.filter(g => !remoteIds.has(g.id))];
          gamesRef.current = latestMerged;
          return latestMerged;
        });

        setActiveGameState(cur => {
          if (!cur || latestMerged.length === 0) return cur;
          return latestMerged.find(m => m.id === cur.id) || cur;
        });

        // Add notifications for newly detected FitGirl & DODI games
        const automatedGames = remoteGames.filter(g => g.id.startsWith('fg-') || g.id.startsWith('dodi-'));
        if (automatedGames.length > 0) {
          setNotifications(prev => {
            const existingNotifIds = new Set(prev.map(n => n.gameId));
            const newNotifs: SiteNotification[] = [];
            for (const g of automatedGames) {
              if (!existingNotifIds.has(g.id)) {
                const isDodi = g.repackInfo?.repacker?.includes('DODI') || g.id.startsWith('dodi-');
                newNotifs.push({
                  id: `notif-bot-${g.id}`,
                  title: isDodi ? '🔥 Novo Repack DODI (Dual Torrent)' : '⚡ Novo Repack FitGirl (Auto-Bot)',
                  message: `${g.title} (${g.repackInfo.repackSize}) indexado com torrents de alta velocidade!`,
                  gameId: g.id,
                  type: 'new_game',
                  timestamp: 'Recentemente',
                  read: false,
                  coverUrl: g.coverUrl
                });
              }
            }
            return newNotifs.length > 0 ? [...newNotifs, ...prev] : prev;
          });
        }
      }
    });

    let likedSet = new Set<string>();
    try {
      const savedLikes = JSON.parse(localStorage.getItem('vortex_liked_comments') || '[]');
      if (Array.isArray(savedLikes)) likedSet = new Set(savedLikes);
    } catch {
      likedSet = new Set<string>();
    }

    fetchCommentsFromSupabase(likedSet).then(remoteComments => {
      if (isMounted && Array.isArray(remoteComments)) {
        setComments(prev => {
          const fakeIds = new Set(['c-1', 'c-2', 'c-3', 'c-4', 'c-5']);
          const remoteIds = new Set(remoteComments.map(c => c.id));
          const localPending = prev.filter(c => c.id.startsWith('local-') && !remoteIds.has(c.id) && !fakeIds.has(c.id));
          return [...localPending, ...remoteComments];
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Toggle Auto-sync
  const toggleAutoSync = () => {
    setAutoSyncConfig(prev => {
      const nextEnabled = !prev.enabled;
      const newLog: SyncLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('pt-BR'),
        message: nextEnabled 
          ? 'Sincronização automática horária ATIVADA.' 
          : 'Sincronização automática PAUSADA pelo administrador.',
        type: nextEnabled ? 'success' : 'warning'
      };
      setSyncLogs(logs => [newLog, ...logs.slice(0, 49)]);
      return { ...prev, enabled: nextEnabled };
    });
  };

  // Trigger manual sync or simulated hourly cron run
  const triggerManualSync = (): { addedCount: number; message: string } => {
    const newReleases = checkForNewFitGirlReleases(games);
    const nowTime = new Date().toLocaleTimeString('pt-BR');

    if (newReleases.length > 0) {
      setGames(prev => [...newReleases, ...prev]);

      // Add notification for each new game
      const notifs: SiteNotification[] = newReleases.map(g => ({
        id: `notif-auto-${Date.now()}-${g.slug}`,
        title: 'Novo Repack FitGirl Detectado!',
        message: `${g.title} (${g.repackInfo.repackSize}) acaba de ser indexado automaticamente e publicado!`,
        gameId: g.id,
        type: 'new_game',
        timestamp: 'Agora mesmo',
        read: false,
        coverUrl: g.coverUrl
      }));
      setNotifications(prev => [...notifs, ...prev]);

      const logMsg = `Cron Executado: ${newReleases.length} novo(s) jogo(s) detectado(s) e publicado(s) no portal!`;
      setSyncLogs(prev => [
        {
          id: `log-${Date.now()}`,
          timestamp: nowTime,
          message: logMsg,
          type: 'success',
          gamesAdded: newReleases.length
        },
        ...prev.slice(0, 49)
      ]);

      setAutoSyncConfig(prev => ({
        ...prev,
        lastSyncTimestamp: new Date().toISOString(),
        totalSyncedCount: prev.totalSyncedCount + newReleases.length
      }));

      return { addedCount: newReleases.length, message: logMsg };
    } else {
      const logMsg = 'Cron Executado: Feed verificado. Nenhum novo jogo pendente (catálogo atualizado).';
      setSyncLogs(prev => [
        {
          id: `log-${Date.now()}`,
          timestamp: nowTime,
          message: logMsg,
          type: 'info'
        },
        ...prev.slice(0, 49)
      ]);

      setAutoSyncConfig(prev => ({
        ...prev,
        lastSyncTimestamp: new Date().toISOString()
      }));

      return { addedCount: 0, message: logMsg };
    }
  };

  // Background Auto-Sync Interval (simulates hourly checks in frontend)
  useEffect(() => {
    if (!autoSyncConfig.enabled) return;

    // Check once on load if needed, and interval every 3 minutes (simulating fast daemon in browser)
    const interval = setInterval(() => {
      triggerManualSync();
    }, 180000); // 3 minutes for rich live demonstration

    return () => clearInterval(interval);
  }, [autoSyncConfig.enabled, games]);

  // Navigation & Modals
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [activeGame, setActiveGameState] = useState<Game | null>(null);
  const [isLibraryOpen, setIsLibraryOpenState] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSupabaseGuideOpen, setIsSupabaseGuideOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpenState] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [authModalNotice, setAuthModalNotice] = useState<string>('');
  const [isPkgLabOpen, setIsPkgLabOpen] = useState(false);
  const [isCreatorAuthOpen, setIsCreatorAuthOpen] = useState(false);
  const [activeGameInitialTab, setActiveGameInitialTab] = useState<'downloads' | 'instructions' | 'specs' | 'screenshots' | 'localizations'>('downloads');

  // Game Request, Can I Run It, Utilities (Page Views inside <main>)
  const [isGameRequestOpen, setIsGameRequestOpenState] = useState(false);
  const [isCanIRunItOpen, setIsCanIRunItOpenState] = useState(false);
  const [canIRunItGame, setCanIRunItGame] = useState<Game | null>(null);
  const [isUtilitiesOpen, setIsUtilitiesOpenState] = useState(false);

  const resetOtherMainViews = () => {
    setIsLibraryOpenState(false);
    setIsUserMenuOpenState(false);
    setIsGameRequestOpenState(false);
    setIsCanIRunItOpenState(false);
    setIsUtilitiesOpenState(false);
  };

  const setActiveGame = (game: Game | null) => {
    if (game) {
      resetOtherMainViews();
    }
    setActiveGameState(game);
  };

  const setIsLibraryOpen = (open: boolean) => {
    if (open) {
      if (activeGame) updateBrowserUrlForHome();
      setActiveGameState(null);
      setIsUserMenuOpenState(false);
      setIsGameRequestOpenState(false);
      setIsCanIRunItOpenState(false);
      setIsUtilitiesOpenState(false);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    setIsLibraryOpenState(open);
  };

  const setIsUserMenuOpen = (open: boolean) => {
    if (open) {
      if (activeGame) updateBrowserUrlForHome();
      setActiveGameState(null);
      setIsLibraryOpenState(false);
      setIsGameRequestOpenState(false);
      setIsCanIRunItOpenState(false);
      setIsUtilitiesOpenState(false);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    setIsUserMenuOpenState(open);
  };

  const setIsGameRequestOpen = (open: boolean) => {
    if (open) {
      if (activeGame) updateBrowserUrlForHome();
      setActiveGameState(null);
      setIsLibraryOpenState(false);
      setIsUserMenuOpenState(false);
      setIsCanIRunItOpenState(false);
      setIsUtilitiesOpenState(false);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    setIsGameRequestOpenState(open);
  };

  const setIsCanIRunItOpen = (open: boolean) => {
    if (open) {
      if (activeGame) updateBrowserUrlForHome();
      setActiveGameState(null);
      setIsLibraryOpenState(false);
      setIsUserMenuOpenState(false);
      setIsGameRequestOpenState(false);
      setIsUtilitiesOpenState(false);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    setIsCanIRunItOpenState(open);
  };

  const setIsUtilitiesOpen = (open: boolean) => {
    if (open) {
      if (activeGame) updateBrowserUrlForHome();
      setActiveGameState(null);
      setIsLibraryOpenState(false);
      setIsUserMenuOpenState(false);
      setIsGameRequestOpenState(false);
      setIsCanIRunItOpenState(false);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    setIsUtilitiesOpenState(open);
  };

  const openGameWithTab = (game: Game, tab: 'downloads' | 'instructions' | 'specs' | 'screenshots' | 'localizations' = 'downloads') => {
    resetOtherMainViews();
    setActiveGameInitialTab(tab);
    setActiveGameState(game);
  };
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('vortex_is_logged_in') === 'true';
  });

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('vortex_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse user profile', e);
      }
    }
    return {
      id: 'usr-1',
      name: 'Vigilancia Gamer',
      tag: 'BR99',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=GamerPro',
      bio: 'Apaixonado por Repacks FitGirl, RPGs, Mundo Aberto e jogos em Português!',
      joinedDate: 'Outubro de 2024',
      preferredPlatform: 'PC',
      favoriteGenre: 'Ação / RPG',
      totalDownloads: 0,
      reviewsCount: 0
    };
  });

  const updateUserProfile = (newAttrs: Partial<UserProfile>) => {
    setUserProfile(prev => {
      const updated = { ...prev, ...newAttrs };
      safeSetLocalStorage('vortex_user_profile', JSON.stringify(updated));
      return updated;
    });
  };

  const isCreator = Boolean(
    (isLoggedIn && (
      userProfile?.email?.toLowerCase() === 'manof1@gmail.com' ||
      userProfile?.email?.toLowerCase() === 'vigilanciabcu@gmail.com' ||
      userProfile?.name?.toLowerCase().includes('manof1')
    )) ||
    (typeof window !== 'undefined' && (
      localStorage.getItem('vortex_creator_verified') === 'true' ||
      localStorage.getItem('vortex_creator_email') === 'manof1@gmail.com' ||
      localStorage.getItem('vortex_creator_email') === 'vigilanciabcu@gmail.com'
    ))
  );

  const openCreatorLab = () => {
    if (isCreator) {
      setIsPkgLabOpen(true);
    } else {
      setIsCreatorAuthOpen(true);
    }
  };

  const login = (usernameOrEmail: string, _password?: string) => {
    const clean = usernameOrEmail.trim();
    if (!clean) return false;
    
    const savedUsersRaw = localStorage.getItem('vortex_registered_accounts');
    let accounts: any[] = [];
    if (savedUsersRaw) {
      try { accounts = JSON.parse(savedUsersRaw); } catch {}
    }
    const found = accounts.find((a: any) => 
      a.email?.toLowerCase() === clean.toLowerCase() || 
      a.name?.toLowerCase() === clean.toLowerCase()
    );

    const isManof = clean.toLowerCase() === 'manof1' || 
                    clean.toLowerCase() === 'manof1@gmail.com' || 
                    found?.email?.toLowerCase() === 'manof1@gmail.com' ||
                    found?.name?.toLowerCase() === 'manof1';

    const userName = found ? found.name : (isManof ? 'manof1 (Criador)' : clean.split('@')[0]);
    const userTag = found ? found.tag : `BR${Math.floor(10 + Math.random() * 89)}`;
    const userEmail = found?.email || (clean.includes('@') ? clean : (isManof ? 'manof1@gmail.com' : `${clean.toLowerCase()}@vortex.gg`));
    
    const updatedProfile: UserProfile = {
      ...userProfile,
      id: found?.id || (isManof ? 'usr-manof1-creator' : `usr-${Date.now()}`),
      name: userName,
      email: userEmail,
      tag: userTag,
      joinedDate: found?.joinedDate || (isManof ? 'Criador do Vortex Games' : 'Membro Ativo'),
      totalDownloads: userProfile.totalDownloads || 0
    };

    if (isManof) {
      safeSetLocalStorage('vortex_creator_verified', 'true');
      safeSetLocalStorage('vortex_creator_email', 'manof1@gmail.com');
    }

    setUserProfile(updatedProfile);
    safeSetLocalStorage('vortex_user_profile', JSON.stringify(updatedProfile));
    setIsLoggedIn(true);
    safeSetLocalStorage('vortex_is_logged_in', 'true');
    setIsAuthModalOpen(false);
    return true;
  };

  const register = (name: string, email: string, _password?: string) => {
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    if (!cleanName) return false;

    const newAccount = {
      id: `usr-${Date.now()}`,
      name: cleanName,
      email: cleanEmail || `${cleanName.toLowerCase().replace(/\s+/g, '')}@vortex.gg`,
      tag: `BR${Math.floor(10 + Math.random() * 89)}`,
      joinedDate: 'Hoje',
      preferredPlatform: 'PC' as const,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanName}`
    };

    const savedUsersRaw = localStorage.getItem('vortex_registered_accounts');
    let accounts: any[] = [];
    if (savedUsersRaw) {
      try { accounts = JSON.parse(savedUsersRaw); } catch {}
    }
    accounts.push(newAccount);
    safeSetLocalStorage('vortex_registered_accounts', JSON.stringify(accounts));

    const updatedProfile: UserProfile = {
      ...userProfile,
      ...newAccount,
      bio: `Membro cadastrado da comunidade Vortex Games!`,
      totalDownloads: 0
    };

    setUserProfile(updatedProfile);
    safeSetLocalStorage('vortex_user_profile', JSON.stringify(updatedProfile));
    setIsLoggedIn(true);
    safeSetLocalStorage('vortex_is_logged_in', 'true');
    setIsAuthModalOpen(false);
    return true;
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('vortex_is_logged_in');
  };

  const openAuthModal = (mode: 'login' | 'register' = 'register', notice: string = '') => {
    setAuthModalMode(mode);
    setAuthModalNotice(notice);
    setIsAuthModalOpen(true);
  };

  const requireAuth = (notice: string = 'Crie sua conta gratuita ou faça login para acessar este recurso.') => {
    if (!isLoggedIn) {
      openAuthModal('register', notice);
      return false;
    }
    return true;
  };

  const openCanIRunIt = (game?: Game | null) => {
    if (game) {
      setCanIRunItGame(game);
    } else if (activeGame) {
      setCanIRunItGame(activeGame);
    } else {
      setCanIRunItGame(null);
    }
    setIsCanIRunItOpen(true);
  };

  // Gamer Utilities (Utilitários Essenciais)
  const openUtilities = () => setIsUtilitiesOpen(true);

  // Thematic Lists State (Listas Temáticas)
  const [activeThematicListId, setActiveThematicListId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('list') || null;
    }
    return null;
  });

  // Cloud Sync Code & Multi-Device Sync
  const [cloudSyncCode, setCloudSyncCode] = useState<string>(() => {
    const saved = localStorage.getItem('vortex_cloud_sync_code');
    if (saved) return saved;
    const newCode = `VX-${Math.floor(1000 + Math.random() * 9000)}-BR`;
    safeSetLocalStorage('vortex_cloud_sync_code', newCode);
    return newCode;
  });

  const syncToCloud = async (): Promise<{ success: boolean; syncCode: string; message: string }> => {
    const currentCode = cloudSyncCode || `VX-${Math.floor(1000 + Math.random() * 9000)}-BR`;
    const payload = {
      profile: userProfile,
      library,
      votes: JSON.parse(localStorage.getItem('vortex_user_votes') || '{}'),
      savedAccounts: JSON.parse(localStorage.getItem('vortex_registered_accounts') || '[]'),
      syncedAt: new Date().toISOString()
    };
    
    const res = await saveCloudSyncData(currentCode, payload);
    return { success: res.success, syncCode: currentCode, message: res.message };
  };

  const restoreFromCloudCode = async (code: string): Promise<{ success: boolean; message: string }> => {
    const clean = code.toUpperCase().trim();
    if (!clean) return { success: false, message: 'Por favor, digite o código de sincronização.' };

    const res = await getCloudSyncData(clean);
    if (res.success && res.data) {
      if (res.data.profile) {
        setUserProfile(res.data.profile);
        safeSetLocalStorage('vortex_user_profile', JSON.stringify(res.data.profile));
      }
      if (Array.isArray(res.data.library)) {
        setLibrary(res.data.library);
        safeSetLocalStorage('vortex_library', JSON.stringify(res.data.library));
      }
      if (res.data.votes) {
        safeSetLocalStorage('vortex_user_votes', JSON.stringify(res.data.votes));
      }
      setCloudSyncCode(clean);
      safeSetLocalStorage('vortex_cloud_sync_code', clean);
      setIsLoggedIn(true);
      safeSetLocalStorage('vortex_is_logged_in', 'true');
      return { success: true, message: 'Dados e favoritos restaurados da nuvem!' };
    }
    return { success: false, message: res.error || 'Código de nuvem não encontrado ou inválido.' };
  };

  // Sync lightweight user data to LocalStorage (catalog itself stays in memory & Supabase)
  useEffect(() => {
    safeSetLocalStorage('vortex_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    safeSetLocalStorage('vortex_library', JSON.stringify(library));
  }, [library]);

  useEffect(() => {
    safeSetLocalStorage('vortex_notifications', JSON.stringify(notifications.slice(0, 50)));
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem('vortex_theme', theme);
    } catch {
      // ignore
    }
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.colorScheme = 'light';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Game management actions
  const addGame = (newGame: Game) => {
    const finalizedGame: Game = {
      ...newGame,
      downloadLinks: filterOutRiotPixels(newGame.downloadLinks || [])
    };

    setGames(prev => [finalizedGame, ...prev]);

    // Persistir automaticamente no banco de dados Supabase (Nuvem)
    upsertGameToSupabase(finalizedGame).catch(err => {
      console.warn('Falha ao sincronizar novo jogo com Supabase:', err);
    });

    // Send a new notification to users!
    const notif: SiteNotification = {
      id: `notif-${Date.now()}`,
      title: 'Novo Jogo Adicionado!',
      message: `${finalizedGame.title} já está disponível para download com guia de instalação no portal!`,
      gameId: finalizedGame.id,
      type: 'new_game',
      timestamp: 'Agora mesmo',
      read: false,
      coverUrl: finalizedGame.coverUrl
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const updateGame = (updatedGame: Game) => {
    const cleaned = {
      ...updatedGame,
      downloadLinks: filterOutRiotPixels(updatedGame.downloadLinks || [])
    };
    setGames(prev => prev.map(g => (g.id === cleaned.id ? cleaned : g)));
    if (activeGame?.id === cleaned.id) {
      setActiveGameState(cleaned);
    }
    // Persistir atualização imediatamente no banco Supabase
    upsertGameToSupabase(cleaned).catch(err => {
      console.warn('Falha ao atualizar jogo no Supabase:', err);
    });
  };

  const deleteGame = (gameId: string) => {
    setGames(prev => prev.filter(g => g.id !== gameId));
    if (activeGame?.id === gameId) {
      setActiveGameState(null);
    }
    // Remover do banco de dados Supabase
    deleteGameFromSupabase(gameId).catch(err => {
      console.warn('Falha ao excluir jogo do Supabase:', err);
    });
  };

  const gamesRef = useRef<Game[]>(games);
  useEffect(() => {
    gamesRef.current = games;
  }, [games]);

  const lastViewedTimestampRef = useRef<Record<string, number>>({});

  const incrementView = (gameId: string) => {
    if (!gameId) return;
    const now = Date.now();
    const lastTs = lastViewedTimestampRef.current[gameId] || 0;
    // Evita contagem dupla por StrictMode em montagens imediatas (< 1.5s)
    if (now - lastTs < 1500) return;
    lastViewedTimestampRef.current[gameId] = now;

    const target = gamesRef.current.find(g => g.id === gameId);
    if (!target) return;

    const nextViews = (target.viewsCount || 0) + 1;
    saveStoredGameStat(gameId, { viewsCount: nextViews });

    const updatedGames = gamesRef.current.map(g =>
      g.id === gameId ? { ...g, viewsCount: nextViews } : g
    );
    gamesRef.current = updatedGames;
    setGames(updatedGames);
    setActiveGameState(cur => (cur?.id === gameId ? { ...cur, viewsCount: nextViews } : cur));

    updateGameStatsInSupabase(gameId, { views_count: nextViews }).catch(() => {});
  };

  const incrementDownload = (gameId: string) => {
    const target = gamesRef.current.find(g => g.id === gameId);
    if (target) {
      const nextDownloads = (target.downloadsCount || 0) + 1;
      saveStoredGameStat(gameId, { downloadsCount: nextDownloads });

      const updatedGames = gamesRef.current.map(g =>
        g.id === gameId ? { ...g, downloadsCount: nextDownloads } : g
      );
      gamesRef.current = updatedGames;
      setGames(updatedGames);
      setActiveGameState(cur => (cur?.id === gameId ? { ...cur, downloadsCount: nextDownloads } : cur));

      updateGameStatsInSupabase(gameId, { downloads_count: nextDownloads }).catch(() => {});
    }

    // Registra o download no perfil do usuário
    setUserProfile(prev => {
      const updated = {
        ...prev,
        totalDownloads: (prev.totalDownloads || 0) + 1
      };
      safeSetLocalStorage('vortex_user_profile', JSON.stringify(updated));
      return updated;
    });

    // Registra o jogo na biblioteca do usuário
    setLibrary(prev => {
      const existing = prev.find(e => e.gameId === gameId);
      if (existing) {
        return prev.map(e => (e.gameId === gameId ? { ...e, downloadCount: (e.downloadCount || 0) + 1 } : e));
      }
      return [...prev, { gameId, status: 'downloaded', downloadCount: 1, addedAt: new Date().toISOString() }];
    });

    try {
      const downloadedIds: string[] = JSON.parse(localStorage.getItem('vortex_downloaded_ids') || '[]');
      if (!downloadedIds.includes(gameId)) {
        downloadedIds.push(gameId);
        safeSetLocalStorage('vortex_downloaded_ids', JSON.stringify(downloadedIds));
      }
    } catch {}
  };

  const getUserVote = (gameId: string): number | null => {
    try {
      const votesMap = JSON.parse(localStorage.getItem('vortex_user_votes') || '{}');
      return votesMap[gameId] || null;
    } catch {
      return null;
    }
  };

  const rateGame = (gameId: string, score: number) => {
    const cleanScore = Math.max(1, Math.min(5, Math.round(score)));
    let currentVotesMap: Record<string, number> = {};
    try {
      currentVotesMap = JSON.parse(localStorage.getItem('vortex_user_votes') || '{}');
    } catch {
      currentVotesMap = {};
    }
    const previousScore = currentVotesMap[gameId];
    currentVotesMap[gameId] = cleanScore;
    safeSetLocalStorage('vortex_user_votes', JSON.stringify(currentVotesMap));

    const target = gamesRef.current.find(g => g.id === gameId);
    if (target) {
      const currentVotes = target.totalVotes || 0;
      const currentRating = target.rating || 0;
      let newVotes = currentVotes;
      let newRating = currentRating;

      if (previousScore && currentVotes > 0) {
        const totalSum = currentRating * currentVotes - previousScore + cleanScore;
        newRating = Number(Math.max(1, Math.min(5, totalSum / currentVotes)).toFixed(1));
      } else {
        newVotes = currentVotes + 1;
        const totalSum = currentRating * currentVotes + cleanScore;
        newRating = Number(Math.max(1, Math.min(5, totalSum / newVotes)).toFixed(1));
      }

      saveStoredGameStat(gameId, { rating: newRating, totalVotes: newVotes });

      const updatedGames = gamesRef.current.map(g =>
        g.id === gameId ? { ...g, rating: newRating, totalVotes: newVotes } : g
      );
      gamesRef.current = updatedGames;
      setGames(updatedGames);
      setActiveGameState(cur => (cur?.id === gameId ? { ...cur, rating: newRating, totalVotes: newVotes } : cur));

      updateGameStatsInSupabase(gameId, {
        rating: newRating,
        total_votes: newVotes
      }).catch(() => {});
    }

    // Update reviewsCount in userProfile
    const totalVotesCount = Object.keys(currentVotesMap).length;
    setUserProfile(prev => {
      const updated = {
        ...prev,
        reviewsCount: totalVotesCount
      };
      safeSetLocalStorage('vortex_user_profile', JSON.stringify(updated));
      return updated;
    });

    // Also update in library if exists, or add with userRating
    setLibrary(prev => {
      const existing = prev.find(e => e.gameId === gameId);
      if (existing) {
        return prev.map(entry => (entry.gameId === gameId ? { ...entry, userRating: cleanScore } : entry));
      }
      return [...prev, { gameId, status: 'wishlist', userRating: cleanScore, addedAt: new Date().toISOString() }];
    });
  };

  // Comments management
  const addComment = (gameId: string, authorName: string, content: string, rating?: number) => {
    const cleanAuthor = authorName.trim() || 'Jogador Anônimo';
    const cleanRating = typeof rating === 'number' ? Math.max(1, Math.min(5, Math.round(rating))) : 5;
    const tempId = `local-${Date.now()}`;
    const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanAuthor)}`;
    const role: 'admin' | 'vip' | 'user' = cleanAuthor.toLowerCase().includes('admin') ? 'admin' : 'user';
    let hasDownloaded = false;
    try {
      const dlIds: string[] = JSON.parse(localStorage.getItem('vortex_downloaded_ids') || '[]');
      hasDownloaded = dlIds.includes(gameId);
    } catch {
      hasDownloaded = false;
    }

    const newComment: Comment = {
      id: tempId,
      gameId,
      authorName: cleanAuthor,
      authorAvatar: avatar,
      authorRole: role,
      content,
      rating: cleanRating,
      createdAt: 'Agora mesmo',
      likes: 0,
      userLiked: false,
      verifiedDownload: hasDownloaded
    };
    setComments(prev => [newComment, ...prev]);

    if (typeof rating === 'number') {
      rateGame(gameId, cleanRating);
    }

    insertCommentToSupabase({
      gameId,
      authorName: cleanAuthor,
      authorAvatar: avatar,
      authorRole: role,
      content,
      rating: cleanRating,
      verifiedDownload: hasDownloaded
    }).then(res => {
      if (res.success && res.comment) {
        const persisted = res.comment;
        setComments(prev => prev.map(c => (c.id === tempId ? persisted : c)));
      }
    }).catch(() => {});
  };

  const likeComment = (commentId: string) => {
    const target = comments.find(c => c.id === commentId);
    if (!target) return;

    const isLiked = !!target.userLiked;
    const nextLikes = Math.max(0, isLiked ? target.likes - 1 : target.likes + 1);

    try {
      const savedLikes: string[] = JSON.parse(localStorage.getItem('vortex_liked_comments') || '[]');
      const nextSet = new Set(Array.isArray(savedLikes) ? savedLikes : []);
      if (isLiked) {
        nextSet.delete(commentId);
      } else {
        nextSet.add(commentId);
      }
      localStorage.setItem('vortex_liked_comments', JSON.stringify(Array.from(nextSet)));
    } catch {
      // ignore
    }

    setComments(prev =>
      prev.map(c =>
        c.id === commentId
          ? { ...c, likes: nextLikes, userLiked: !isLiked }
          : c
      )
    );

    if (!commentId.startsWith('local-')) {
      updateCommentLikesInSupabase(commentId, nextLikes).catch(() => {});
    }
  };

  const deleteComment = (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
    if (!commentId.startsWith('local-')) {
      deleteCommentFromSupabase(commentId).catch(() => {});
    }
  };

  // Library actions
  const addToLibrary = (gameId: string, status: LibraryStatus) => {
    setLibrary(prev => {
      const existing = prev.find(e => e.gameId === gameId);
      if (existing) {
        return prev.map(e => (e.gameId === gameId ? { ...e, status } : e));
      }
      return [...prev, { gameId, status, addedAt: new Date().toISOString() }];
    });
  };

  const removeFromLibrary = (gameId: string) => {
    setLibrary(prev => prev.filter(e => e.gameId !== gameId));
  };

  const updateLibraryStatus = (gameId: string, status: LibraryStatus) => {
    setLibrary(prev =>
      prev.map(e => (e.gameId === gameId ? { ...e, status } : e))
    );
  };

  const isInLibrary = (gameId: string): LibraryStatus | null => {
    const entry = library.find(e => e.gameId === gameId);
    return entry ? entry.status : null;
  };

  // Notification actions
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // DB Backup & Restore
  const resetDatabaseToDefault = () => {
    setGames(INITIAL_GAMES);
    gamesRef.current = INITIAL_GAMES;
    setComments(INITIAL_COMMENTS);
    setLibrary([]);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.removeItem('vortex_games');
    localStorage.removeItem('vortex_comments');
    localStorage.removeItem('vortex_library');
    localStorage.removeItem('vortex_notifications');
    localStorage.removeItem(GAME_STATS_STORAGE_KEY);
    localStorage.removeItem('vortex_user_votes');
    localStorage.removeItem('vortex_liked_comments');
  };

  const exportDatabaseJson = () => {
    const data = {
      games,
      comments,
      library,
      notifications,
      exportedAt: new Date().toISOString(),
      app: 'VortexGames'
    };
    return JSON.stringify(data, null, 2);
  };

  const importDatabaseJson = (json: string): boolean => {
    try {
      const data = JSON.parse(json);
      if (Array.isArray(data.games)) {
        setGames(data.games);
        if (Array.isArray(data.comments)) setComments(data.comments);
        if (Array.isArray(data.library)) setLibrary(data.library);
        if (Array.isArray(data.notifications)) setNotifications(data.notifications);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  };

  return (
    <GameContext.Provider
      value={{
        games,
        comments,
        library,
        notifications,
        filters,
        setFilters,
        activeGame,
        setActiveGame,
        isLibraryOpen,
        setIsLibraryOpen,
        isAdminOpen,
        setIsAdminOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isSupabaseGuideOpen,
        setIsSupabaseGuideOpen,
        isUserMenuOpen,
        setIsUserMenuOpen,
        isGameRequestOpen,
        setIsGameRequestOpen,
        isPkgLabOpen,
        setIsPkgLabOpen,
        isCreatorAuthOpen,
        setIsCreatorAuthOpen,
        isCreator,
        openCreatorLab,
        userProfile,
        updateUserProfile,
        isLoggedIn,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        authModalNotice,
        setAuthModalNotice,
        openAuthModal,
        login,
        register,
        logout,
        requireAuth,
        cloudSyncCode,
        syncToCloud,
        restoreFromCloudCode,
        theme,
        toggleTheme,
        autoSyncConfig,
        syncLogs,
        toggleAutoSync,
        triggerManualSync,
        activeGameInitialTab,
        openGameWithTab,
        isCanIRunItOpen,
        setIsCanIRunItOpen,
        canIRunItGame,
        openCanIRunIt,
        isUtilitiesOpen,
        setIsUtilitiesOpen,
        openUtilities,
        activeThematicListId,
        setActiveThematicListId,
        addGame,
        updateGame,
        deleteGame,
        rateGame,
        getUserVote,
        addComment,
        likeComment,
        deleteComment,
        addToLibrary,
        removeFromLibrary,
        updateLibraryStatus,
        isInLibrary,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        incrementView,
        incrementDownload,
        resetDatabaseToDefault,
        exportDatabaseJson,
        importDatabaseJson
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
