export interface DownloadLink {
  id: string;
  type: 'magnet' | 'torrent' | 'direct' | 'mirror' | 'pkg' | 'pt_br_patch';
  format?: 'torrent' | 'pkg' | 'direct' | 'magnet' | 'pt_br_patch';
  platform?: 'PC' | 'PS4' | 'PS3' | 'PS5' | 'Emulador';
  label: string;
  url: string;
  seeders?: number;
  leechers?: number;
  size: string;
  hostName?: string;
  titleId?: string; // Ex: CUSA-34388, BLES-01807 (TheZukoStore/Tapochek)
  firmware?: string; // Ex: FW 5.05 - 11.00 ou RPCS3 / ShadPS4
  isPtBrAudio?: boolean; // Dublado em Português
  isPtBrSubs?: boolean; // Legendado em Português
}

export interface SystemSpec {
  os: string;
  processor: string;
  memory: string;
  graphics: string;
  storage: string;
  directx: string;
}

export interface SystemRequirements {
  minimum: SystemSpec;
  recommended: SystemSpec;
}

export interface RepackInfo {
  repacker: string;
  version: string;
  repackSize: string;
  originalSize: string;
  crackStatus: 'Crackeado' | 'Emulação Steam' | 'Bypass' | 'DRM Free';
  crackGroup: string;
}

export interface CommentReply {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorRole: 'user' | 'admin' | 'moderator';
  content: string;
  createdAt: string;
  likes: number;
}

export interface Comment {
  id: string;
  gameId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: 'user' | 'admin' | 'moderator' | 'vip';
  content: string;
  rating?: number;
  createdAt: string;
  likes: number;
  userLiked?: boolean;
  verifiedDownload?: boolean;
  replies?: CommentReply[];
}

export interface Game {
  id: string;
  title: string;
  slug: string;
  coverUrl: string;
  bannerUrl: string;
  description: string;
  shortDescription: string;
  genres: string[];
  categories: string[];
  releaseYear: number;
  releaseDate: string;
  developer: string;
  publisher: string;
  repackInfo: RepackInfo;
  downloadLinks: DownloadLink[];
  systemRequirements: SystemRequirements;
  rating: number; // 0 to 5 (avaliação dos usuários)
  totalVotes: number;
  imdbRating?: number; // 0 to 10 (nota IMDb / Metacritic)
  screenshots: string[];
  trailerYoutubeId?: string;
  tags: string[];
  downloadsCount: number;
  viewsCount: number;
  createdAt: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  dlcIncluded?: string[];
  languages?: string[];
  hasPtBrAudio?: boolean; // Dublado em Português do Brasil
  hasPtBrSubs?: boolean; // Legendado em Português do Brasil
  hasPkgFormat?: boolean; // Possui versão instalável PKG (TheZukoStore/PlayStation)
  hasPcTorrent?: boolean; // Possui versão Torrent PC (FitGirl/Tapochek)
  titleId?: string; // Ex: CUSA-34388 (ZukoStore CUSA ID)
  sourceOrigin?: 'TheZukoStore' | 'Tapochek.net' | 'FitGirl' | 'Scene' | 'Multi-Tracker';
  originalTrackerUrl?: string; // Link da fonte original (Tapochek / ZukoStore)
}

export type LibraryStatus = 'wishlist' | 'playing' | 'completed' | 'backlog' | 'downloaded';

export interface UserReview {
  id: string;
  gameId: string;
  gameTitle: string;
  rating: number;
  comment?: string;
  date: string;
}

export interface UserProfile {
  id: string;
  name: string;
  tag: string;
  avatar: string;
  bio: string;
  joinedDate: string;
  preferredPlatform: 'PC' | 'PS4' | 'PS5' | 'Emulador';
  favoriteGenre: string;
  totalDownloads: number;
}

export interface UserLibraryEntry {
  gameId: string;
  status: LibraryStatus;
  userRating?: number;
  personalNotes?: string;
  addedAt: string;
  downloadCount?: number;
}

export interface SiteNotification {
  id: string;
  title: string;
  message: string;
  gameId?: string;
  type: 'new_game' | 'update' | 'announcement';
  timestamp: string;
  read: boolean;
  coverUrl?: string;
}

export interface FilterState {
  search: string;
  genre: string;
  category: string;
  year: string;
  repacker: string;
  sizeRange: string;
  sortBy: 'latest' | 'popular' | 'rating' | 'downloads' | 'sizeAsc' | 'sizeDesc';
  minRating: number;
  onlyPtBr?: boolean; // Exibir apenas jogos dublados ou legendados em PT-BR
  formatFilter?: 'all' | 'torrent' | 'pkg'; // Filtrar por formato específico (Torrent PC vs PKG Console)
}

export interface IgdbSearchResult {
  id: string | number;
  name: string;
  coverUrl: string;
  bannerUrl: string;
  summary: string;
  genres: string[];
  releaseYear: number;
  releaseDate: string;
  developer: string;
  publisher: string;
  screenshots: string[];
  rating: number;
}
