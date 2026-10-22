export interface DownloadLink {
  id: string;
  type: 'magnet' | 'torrent' | 'direct' | 'mirror' | 'pkg' | 'pt_br_patch';
  format?: 'torrent' | 'pkg' | 'direct' | 'magnet' | 'pt_br_patch' | 'iso' | 'rom' | 'nsp' | 'xci' | 'bin/cue';
  platform?: 'PC' | 'PS4' | 'PS3' | 'PS5' | 'PS1' | 'PS2' | 'PSP' | 'PS Vita' | 'Switch' | 'Nintendo Switch' | 'N64' | 'GBA' | 'GameCube' | 'Wii' | 'Emulador';
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

export interface CriticReviewData {
  metacritic: number; // 0 to 100
  metacriticUser: number; // 0.0 to 10.0
  metacriticVerdict: string;
  opencritic: number; // 0 to 100
  opencriticTier: 'Mighty' | 'Strong' | 'Fair' | 'Weak';
  opencriticRecommendPercent: number; // 0 to 100
  gamefaqs: number; // 0.0 to 5.0
  gamefaqsVotesCount: number;
  metacriticUrl: string;
  opencriticUrl: string;
  gamefaqsUrl: string;
}

export interface GameCheat {
  id: string;
  title: string;
  codeOrEffect: string; // Ex: Códigos de botões, comandos de console ou trapaças
  category?: 'Geral' | 'Armas' | 'Veículos' | 'Vidas/Energia' | 'Dinheiro' | 'Segredos' | 'Desbloqueáveis' | 'Glitches' | 'Senhas' | string;
  description?: string;
  source?: 'GameFAQs' | 'Manual' | 'Comunidade';
}

export interface GameMod {
  id: string;
  title: string;
  description: string;
  nexusUrl: string; // URL oficial do mod no Nexus Mods: https://www.nexusmods.com/...
  author?: string;
  category?: 'Tradução' | 'Gráficos/4K' | 'Gameplay' | 'Fix/FPS' | 'Skins' | 'ReShade' | 'Total Conversion' | 'Utilitário' | 'QoL' | 'Classes/Gameplay' | 'Áudio' | string;
  downloadsCount?: string;
  likesCount?: string;
  imageUrl?: string;
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
  imdbRating?: number; // 0 to 10 (legado)
  criticScores?: CriticReviewData; // Metacritic, OpenCritic, GameFAQs
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
  cheats?: GameCheat[]; // Códigos e cheats puxados do GameFAQs
  mods?: GameMod[]; // Mods populares do Nexus Mods (https://www.nexusmods.com/)
  gamefaqsCheatsUrl?: string; // Link direto para a página de cheats do GameFAQs
  nexusModsUrl?: string; // Link da central do jogo no Nexus Mods
  platform?: string; // Plataforma principal / tag canônica (ex: PC, PS2, Switch)
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
  reviewsCount?: number;
  email?: string;
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
  sortBy: 'latest' | 'popular' | 'rating' | 'downloads' | 'sizeAsc' | 'sizeDesc' | 'top_rating' | 'top_critic' | 'top_user' | 'top_views' | 'top_downloads';
  onlyPtBr?: boolean; // Exibir apenas jogos dublados ou legendados em PT-BR
  formatFilter?: 'all' | 'torrent' | 'pkg' | 'iso_rom'; // Filtrar por formato específico (Torrent PC vs PKG Console vs ISO/ROM)
  yearRange?: 'all' | '2024-2026' | '2020-2023' | '2015-2019' | 'retro'; // Filtro por Faixa de Ano
  platform?: 'all' | 'pc' | 'playstation' | 'nintendo' | 'retro'; // Filtro por Plataforma / Console
  minRating?: number; // Filtro de nota mínima (ex: 4.5+)
}

export interface GameRequest {
  id: string;
  gameTitle: string;
  platform: 'PC' | 'PS4' | 'PS5' | 'Emulador' | 'Qualquer';
  formatPreference: 'Torrent PC' | 'PKG Console' | 'Dublado PT-BR' | 'Qualquer';
  requestedBy: string;
  userEmail?: string;
  notes?: string;
  status: 'analise' | 'buscando' | 'testando_seeds' | 'adicionado';
  votesCount: number;
  hasVoted?: boolean;
  createdAt: string;
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

