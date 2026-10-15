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
import { fetchGamesFromSupabase, saveCloudSyncData, getCloudSyncData } from '../services/supabaseClient';
import { sanitizeMagnetLink } from '../utils/magnetUtils';
import { getGameCover, getGameBanner, DEFAULT_GAME_COVER, DEFAULT_GAME_BANNER } from '../utils/imageUtils';

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
  isPkgLabOpen: boolean;
  setIsPkgLabOpen: (open: boolean) => void;
  isCreatorAuthOpen: boolean;
  setIsCreatorAuthOpen: (open: boolean) => void;
  openCreatorLab: () => void;
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  // Member authentication system
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  login: (usernameOrEmail: string, password?: string) => boolean;
  register: (name: string, email: string, password?: string) => boolean;
  logout: () => void;
  requireAuth: () => boolean;
  // Multi-Device Cloud Sync
  cloudSyncCode: string;
  syncToCloud: () => Promise<{ success: boolean; syncCode: string; message: string }>;
  restoreFromCloudCode: (code: string) => Promise<{ success: boolean; message: string }>;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  // Auto-Sync
  autoSyncConfig: AutoSyncConfig;
  syncLogs: SyncLog[];
  toggleAutoSync: () => void;
  triggerManualSync: () => { addedCount: number; message: string };
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
  yearRange: 'all'
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('vortex_theme') as 'dark' | 'light') || 'dark';
  });

  // Games state
  const [games, setGames] = useState<Game[]>(() => {
    let baseList = INITIAL_GAMES;
    const initialMap = new Map<string, Game>(INITIAL_GAMES.map(g => [g.id, g]));
    const saved = localStorage.getItem('vortex_games');

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If cached game is a preset, keep authentic cover/banner from INITIAL_GAMES
          // to fix any old cached SVG/gameover/imageban covers on Vercel/GitHub
          const sanitizedSaved = parsed.map((pg: Game) => {
            const preset = initialMap.get(pg.id);
            if (preset) {
              return {
                ...pg,
                coverUrl: preset.coverUrl,
                bannerUrl: preset.bannerUrl
              };
            }
            if (pg.coverUrl?.includes('1091500') && !pg.title?.toLowerCase().includes('cyberpunk')) {
              return {
                ...pg,
                coverUrl: DEFAULT_GAME_COVER,
                bannerUrl: DEFAULT_GAME_BANNER
              };
            }
            return pg;
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

    // Sanitize real votes: only keep votes that real users submitted via vortex_user_votes
    let userVotesMap: Record<string, number> = {};
    try {
      userVotesMap = JSON.parse(localStorage.getItem('vortex_user_votes') || '{}');
    } catch {
      userVotesMap = {};
    }

    return baseList.map(g => {
      const realVote = userVotesMap[g.id];
      const sanitizedLinks = (g.downloadLinks || []).map(dl => {
        if (dl.url && (dl.type === 'magnet' || dl.url.startsWith('magnet:?'))) {
          return {
            ...dl,
            url: sanitizeMagnetLink(dl.url, `${g.title} [${g.repackInfo?.repacker || 'Vortex'}]`)
          };
        }
        return dl;
      });

      return {
        ...g,
        coverUrl: getGameCover(g),
        bannerUrl: getGameBanner(g),
        downloadLinks: sanitizedLinks,
        rating: realVote ? realVote : 0,
        totalVotes: realVote ? 1 : 0
      };
    });
  });

  // Comments state
  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('vortex_comments');
    if (saved) {
      try {
        return JSON.parse(saved);
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
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved library', e);
      }
    }
    // Default initial game in library for demo experience
    return [
      { gameId: 'cyberpunk-2077', status: 'playing', userRating: 5, addedAt: new Date().toISOString() },
      { gameId: 'elden-ring', status: 'completed', userRating: 5, addedAt: new Date().toISOString() }
    ];
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
    localStorage.setItem('vortex_sync_config', JSON.stringify(autoSyncConfig));
  }, [autoSyncConfig]);

  useEffect(() => {
    localStorage.setItem('vortex_sync_logs', JSON.stringify(syncLogs));
  }, [syncLogs]);

  // Carregar jogos do Supabase ao iniciar caso o banco contenha registros
  useEffect(() => {
    let isMounted = true;
    fetchGamesFromSupabase().then(remoteGames => {
      if (isMounted && remoteGames && remoteGames.length > 0) {
        setGames(prev => {
          let userVotesMap: Record<string, number> = {};
          try {
            userVotesMap = JSON.parse(localStorage.getItem('vortex_user_votes') || '{}');
          } catch {
            userVotesMap = {};
          }
          const sanitizedRemote = remoteGames.map(g => {
            const realVote = userVotesMap[g.id];
            if (realVote) {
              return { ...g, rating: realVote, totalVotes: 1 };
            }
            return { ...g, rating: 0, totalVotes: 0 };
          });

          const remoteIds = new Set(sanitizedRemote.map(g => g.id));
          const merged = [...sanitizedRemote, ...prev.filter(g => !remoteIds.has(g.id))];
          return merged;
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
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSupabaseGuideOpen, setIsSupabaseGuideOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPkgLabOpen, setIsPkgLabOpen] = useState(false);
  const [isCreatorAuthOpen, setIsCreatorAuthOpen] = useState(false);
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
      totalDownloads: 14
    };
  });

  const updateUserProfile = (newAttrs: Partial<UserProfile>) => {
    setUserProfile(prev => {
      const updated = { ...prev, ...newAttrs };
      localStorage.setItem('vortex_user_profile', JSON.stringify(updated));
      return updated;
    });
  };

  const openCreatorLab = () => {
    const isVerified = localStorage.getItem('vortex_creator_verified') === 'true';
    const email = (userProfile.email || '').toLowerCase().trim();
    const name = (userProfile.name || '').toLowerCase().trim();
    const isManof = isVerified || 
                    email === 'manof1@gmail.com' || 
                    email === 'vigilanciabcu@gmail.com' || 
                    name.includes('manof1');

    if (isManof) {
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
      localStorage.setItem('vortex_creator_verified', 'true');
      localStorage.setItem('vortex_creator_email', 'manof1@gmail.com');
    }

    setUserProfile(updatedProfile);
    localStorage.setItem('vortex_user_profile', JSON.stringify(updatedProfile));
    setIsLoggedIn(true);
    localStorage.setItem('vortex_is_logged_in', 'true');
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
    localStorage.setItem('vortex_registered_accounts', JSON.stringify(accounts));

    const updatedProfile: UserProfile = {
      ...userProfile,
      ...newAccount,
      bio: `Membro cadastrado da comunidade Vortex Games!`,
      totalDownloads: 0
    };

    setUserProfile(updatedProfile);
    localStorage.setItem('vortex_user_profile', JSON.stringify(updatedProfile));
    setIsLoggedIn(true);
    localStorage.setItem('vortex_is_logged_in', 'true');
    setIsAuthModalOpen(false);
    return true;
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('vortex_is_logged_in');
  };

  const requireAuth = () => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return false;
    }
    return true;
  };

  // Game Request Modal State
  const [isGameRequestOpen, setIsGameRequestOpen] = useState(false);

  // Cloud Sync Code & Multi-Device Sync
  const [cloudSyncCode, setCloudSyncCode] = useState<string>(() => {
    const saved = localStorage.getItem('vortex_cloud_sync_code');
    if (saved) return saved;
    const newCode = `VX-${Math.floor(1000 + Math.random() * 9000)}-BR`;
    localStorage.setItem('vortex_cloud_sync_code', newCode);
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
        localStorage.setItem('vortex_user_profile', JSON.stringify(res.data.profile));
      }
      if (Array.isArray(res.data.library)) {
        setLibrary(res.data.library);
        localStorage.setItem('vortex_library', JSON.stringify(res.data.library));
      }
      if (res.data.votes) {
        localStorage.setItem('vortex_user_votes', JSON.stringify(res.data.votes));
      }
      setCloudSyncCode(clean);
      localStorage.setItem('vortex_cloud_sync_code', clean);
      setIsLoggedIn(true);
      localStorage.setItem('vortex_is_logged_in', 'true');
      return { success: true, message: 'Dados e favoritos restaurados da nuvem!' };
    }
    return { success: false, message: res.error || 'Código de nuvem não encontrado ou inválido.' };
  };

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('vortex_games', JSON.stringify(games));
  }, [games]);

  useEffect(() => {
    localStorage.setItem('vortex_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('vortex_library', JSON.stringify(library));
  }, [library]);

  useEffect(() => {
    localStorage.setItem('vortex_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('vortex_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Game management actions
  const addGame = (newGame: Game) => {
    setGames(prev => [newGame, ...prev]);

    // Send a new notification to users!
    const notif: SiteNotification = {
      id: `notif-${Date.now()}`,
      title: 'Novo Jogo Adicionado!',
      message: `${newGame.title} já está pronto para download via Torrent!`,
      gameId: newGame.id,
      type: 'new_game',
      timestamp: 'Agora mesmo',
      read: false,
      coverUrl: newGame.coverUrl
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const updateGame = (updatedGame: Game) => {
    setGames(prev => prev.map(g => (g.id === updatedGame.id ? updatedGame : g)));
    if (activeGame?.id === updatedGame.id) {
      setActiveGame(updatedGame);
    }
  };

  const deleteGame = (gameId: string) => {
    setGames(prev => prev.filter(g => g.id !== gameId));
    if (activeGame?.id === gameId) {
      setActiveGame(null);
    }
  };

  const incrementDownload = (gameId: string) => {
    setGames(prev =>
      prev.map(g => (g.id === gameId ? { ...g, downloadsCount: (g.downloadsCount || 0) + 1 } : g))
    );

    // Registra o download no perfil do usuário
    setUserProfile(prev => {
      const updated = {
        ...prev,
        totalDownloads: (prev.totalDownloads || 0) + 1
      };
      localStorage.setItem('vortex_user_profile', JSON.stringify(updated));
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
        localStorage.setItem('vortex_downloaded_ids', JSON.stringify(downloadedIds));
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
    let currentVotesMap: Record<string, number> = {};
    try {
      currentVotesMap = JSON.parse(localStorage.getItem('vortex_user_votes') || '{}');
    } catch {
      currentVotesMap = {};
    }
    const previousScore = currentVotesMap[gameId];
    currentVotesMap[gameId] = score;
    localStorage.setItem('vortex_user_votes', JSON.stringify(currentVotesMap));

    setGames(prev =>
      prev.map(g => {
        if (g.id === gameId) {
          const currentVotes = g.totalVotes || 0;
          const currentRating = g.rating || 0;
          let newVotes = currentVotes;
          let newRating = currentRating;

          if (previousScore) {
            // User updating their vote
            const totalSum = currentRating * currentVotes - previousScore + score;
            newRating = Number((totalSum / (newVotes || 1)).toFixed(1));
          } else {
            // First real vote
            newVotes = currentVotes + 1;
            const totalSum = currentRating * currentVotes + score;
            newRating = Number((totalSum / newVotes).toFixed(1));
          }

          const updated = { ...g, rating: newRating, totalVotes: newVotes };
          if (activeGame?.id === gameId) {
            setActiveGame(updated);
          }
          return updated;
        }
        return g;
      })
    );

    // Update reviewsCount in userProfile
    const totalVotesCount = Object.keys(currentVotesMap).length;
    setUserProfile(prev => {
      const updated = {
        ...prev,
        reviewsCount: totalVotesCount
      };
      localStorage.setItem('vortex_user_profile', JSON.stringify(updated));
      return updated;
    });

    // Also update in library if exists, or add with userRating
    setLibrary(prev => {
      const existing = prev.find(e => e.gameId === gameId);
      if (existing) {
        return prev.map(entry => (entry.gameId === gameId ? { ...entry, userRating: score } : entry));
      }
      return [...prev, { gameId, status: 'wishlist', userRating: score, addedAt: new Date().toISOString() }];
    });
  };

  // Comments management
  const addComment = (gameId: string, authorName: string, content: string, rating?: number) => {
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      gameId,
      authorName: authorName.trim() || 'Jogador Anônimo',
      authorAvatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(authorName)}`,
      authorRole: authorName.toLowerCase().includes('admin') ? 'admin' : 'user',
      content,
      rating: rating || 5,
      createdAt: 'Agora mesmo',
      likes: 0,
      userLiked: false,
      verifiedDownload: true
    };
    setComments(prev => [newComment, ...prev]);

    if (rating) {
      rateGame(gameId, rating);
    }
  };

  const likeComment = (commentId: string) => {
    setComments(prev =>
      prev.map(c => {
        if (c.id === commentId) {
          const isLiked = !!c.userLiked;
          return {
            ...c,
            likes: isLiked ? c.likes - 1 : c.likes + 1,
            userLiked: !isLiked
          };
        }
        return c;
      })
    );
  };

  const deleteComment = (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
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
    setComments(INITIAL_COMMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.removeItem('vortex_games');
    localStorage.removeItem('vortex_comments');
    localStorage.removeItem('vortex_notifications');
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
        openCreatorLab,
        userProfile,
        updateUserProfile,
        isLoggedIn,
        isAuthModalOpen,
        setIsAuthModalOpen,
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
