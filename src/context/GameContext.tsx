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
import { fetchGamesFromSupabase } from '../services/supabaseClient';

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
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
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
  formatFilter: 'all'
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('vortex_theme') as 'dark' | 'light') || 'dark';
  });

  // Games state
  const [games, setGames] = useState<Game[]>(() => {
    const saved = localStorage.getItem('vortex_games');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved games', e);
      }
    }
    return INITIAL_GAMES;
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
          const remoteIds = new Set(remoteGames.map(g => g.id));
          // Merge: remote games first (the 6 FitGirl games from Supabase),
          // followed by any preset games that aren't already in Supabase
          const merged = [...remoteGames, ...prev.filter(g => !remoteIds.has(g.id))];
          return merged;
        });

        // Add notifications for newly detected FitGirl games
        const fitgirlGames = remoteGames.filter(g => g.id.startsWith('fg-'));
        if (fitgirlGames.length > 0) {
          setNotifications(prev => {
            const existingNotifIds = new Set(prev.map(n => n.gameId));
            const newNotifs: SiteNotification[] = [];
            for (const g of fitgirlGames) {
              if (!existingNotifIds.has(g.id)) {
                newNotifs.push({
                  id: `notif-fg-${g.id}`,
                  title: '⚡ Novo Repack FitGirl (Auto-Bot)',
                  message: `${g.title} (${g.repackInfo.repackSize}) indexado e publicado direto do Feed oficial!`,
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
      prev.map(g => (g.id === gameId ? { ...g, downloadsCount: g.downloadsCount + 1 } : g))
    );
  };

  const rateGame = (gameId: string, score: number) => {
    setGames(prev =>
      prev.map(g => {
        if (g.id === gameId) {
          const newVotes = g.totalVotes + 1;
          const newRating = Number(((g.rating * g.totalVotes + score) / newVotes).toFixed(1));
          return { ...g, rating: newRating, totalVotes: newVotes };
        }
        return g;
      })
    );

    // Also update in library if exists
    setLibrary(prev =>
      prev.map(entry => (entry.gameId === gameId ? { ...entry, userRating: score } : entry))
    );
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
        userProfile,
        updateUserProfile,
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
