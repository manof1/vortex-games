import { Game, SiteNotification } from '../types';

export interface SyncLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  gamesAdded?: number;
}

export interface AutoSyncConfig {
  enabled: boolean;
  intervalMinutes: number; // e.g. 60
  lastSyncTimestamp: string | null;
  totalSyncedCount: number;
}

// Default config
export const DEFAULT_SYNC_CONFIG: AutoSyncConfig = {
  enabled: true,
  intervalMinutes: 60,
  lastSyncTimestamp: new Date().toISOString(),
  totalSyncedCount: 8
};

// Simulation pool of dynamic new releases that FitGirl posts over time
const FITGIRL_DYNAMIC_FEED_POOL: Array<Omit<Game, 'id' | 'createdAt'>> = [
  {
    title: 'Silent Hill 2 Remake (Day 1 Update)',
    slug: 'silent-hill-2-remake-fitgirl',
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    shortDescription: 'O aclamado terror psicológico renascido com áudio 3D e Unreal Engine 5. Repack FitGirl com áudio e vídeo intactos.',
    description: 'James Sunderland chega a Silent Hill após receber uma carta misteriosa de sua falecida esposa Mary. Repack oficial com otimização de CPU para reduzir stutterings de carregamento.',
    genres: ['Terror', 'Sobrevivência', 'Suspense'],
    categories: ['Lançamentos', 'Repacks', 'AAA'],
    releaseYear: 2024,
    releaseDate: '08/10/2024',
    developer: 'Bloober Team',
    publisher: 'KONAMI',
    repackInfo: {
      repacker: 'FitGirl Repack',
      version: 'v1.1.248.601 + Deluxe DLCs',
      repackSize: '31.4 GB',
      originalSize: '50.0 GB',
      crackStatus: 'Crackeado',
      crackGroup: 'RUNE'
    },
    downloadLinks: [
      {
        id: 'dl-sh2-1',
        type: 'magnet',
        label: 'Torrent Magnet FitGirl (4.500 Seeds)',
        url: 'magnet:?xt=urn:btih:9938192038471029384710293847102938471029&dn=Silent.Hill.2.Remake-FitGirl&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce',
        seeders: 4500,
        leechers: 610,
        size: '31.4 GB'
      }
    ],
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit',
        processor: 'Intel Core i7-6700K ou AMD Ryzen 5 3600',
        memory: '16 GB RAM',
        graphics: 'NVIDIA GeForce GTX 1070 Ti ou AMD Radeon RX 5700',
        storage: '50 GB SSD requerido',
        directx: 'Versão 12'
      },
      recommended: {
        os: 'Windows 10/11 64-bit',
        processor: 'Intel Core i7-8700K ou AMD Ryzen 5 3600X',
        memory: '16 GB RAM',
        graphics: 'NVIDIA GeForce RTX 2080 ou AMD Radeon RX 6800XT',
        storage: '50 GB SSD',
        directx: 'Versão 12'
      }
    },
    rating: 4.8,
    totalVotes: 890,
    screenshots: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80'
    ],
    trailerYoutubeId: '7Q3Zf3n3zE4',
    tags: ['Terror', 'Unreal Engine 5', 'FitGirl Repack', 'Legendas PT-BR'],
    downloadsCount: 38200,
    viewsCount: 120000,
    isFeatured: true,
    isTrending: true,
    languages: ['Português (Brasil)', 'Inglês', 'Japonês']
  },
  {
    title: 'Dragon’s Dogma 2: Deluxe Edition',
    slug: 'dragons-dogma-2-deluxe-fitgirl',
    coverUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    shortDescription: 'O grande RPG de ação e fantasia da Capcom. Aventure-se como o Nascido ao lado de seus Peões leais.',
    description: 'Dragon\'s Dogma 2 é um RPG de ação em mundo aberto com física interativa e companheiros de inteligência artificial exclusivos. Versão compactada sem perdas com o patch de desempenho de CPU aplicado.',
    genres: ['RPG', 'Fantasia', 'Mundo Aberto', 'Ação'],
    categories: ['AAA', 'Repacks'],
    releaseYear: 2024,
    releaseDate: '22/03/2024',
    developer: 'CAPCOM Co., Ltd.',
    publisher: 'CAPCOM Co., Ltd.',
    repackInfo: {
      repacker: 'FitGirl Repack',
      version: 'v1.0.0.12 + A Boon for Adventurers DLC Pack',
      repackSize: '41.8 GB',
      originalSize: '65.0 GB',
      crackStatus: 'Crackeado',
      crackGroup: 'Bypass / Rune'
    },
    downloadLinks: [
      {
        id: 'dl-dd2-1',
        type: 'magnet',
        label: 'Torrent Magnet FitGirl (Mais de 3.800 Seeds)',
        url: 'magnet:?xt=urn:btih:7738192038471029384710293847102938471029&dn=Dragons.Dogma.2.Deluxe-FitGirl&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce',
        seeders: 3800,
        leechers: 420,
        size: '41.8 GB'
      }
    ],
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit',
        processor: 'Intel Core i5-10600 ou AMD Ryzen 5 3600',
        memory: '16 GB RAM',
        graphics: 'NVIDIA GeForce GTX 1070 ou AMD Radeon RX 5500 XT',
        storage: '65 GB livres',
        directx: 'Versão 12'
      },
      recommended: {
        os: 'Windows 10/11 64-bit',
        processor: 'Intel Core i7-10700 ou AMD Ryzen 5 5600X',
        memory: '16 GB RAM',
        graphics: 'NVIDIA GeForce RTX 2080 ou AMD Radeon RX 6700',
        storage: '65 GB SSD',
        directx: 'Versão 12'
      }
    },
    rating: 4.6,
    totalVotes: 640,
    screenshots: [
      'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80'
    ],
    trailerYoutubeId: '1w_eTf1mF_Y',
    tags: ['Capcom', 'RE Engine', 'Peões', 'Dragões', 'Legendas PT-BR'],
    downloadsCount: 29400,
    viewsCount: 95000,
    languages: ['Português (Brasil)', 'Inglês', 'Japonês']
  }
];

/**
 * Checks for new releases not yet in the catalog
 */
export function checkForNewFitGirlReleases(existingGames: Game[]): Game[] {
  const existingSlugs = new Set(existingGames.map(g => g.slug));
  const newGames: Game[] = [];

  for (const item of FITGIRL_DYNAMIC_FEED_POOL) {
    if (!existingSlugs.has(item.slug)) {
      newGames.push({
        ...item,
        id: `fg-auto-${item.slug}-${Date.now().toString(36)}`,
        createdAt: new Date().toISOString()
      });
    }
  }

  return newGames;
}

/**
 * Drop-in GitHub Actions Cron Workflow YAML (Runs automatically every hour)
 */
export const GITHUB_ACTIONS_WORKFLOW_YAML = `name: FitGirl Hourly Auto-Sync

on:
  schedule:
    # Executa a cada hora cheia (às 00:00, 01:00, 02:00, etc.)
    - cron: '0 * * * *'
  workflow_dispatch: # Permite disparar manualmente pelo painel do GitHub

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repositório
        uses: actions/checkout@v4

      - name: Configurar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Instalar Dependências de Sincronização
        run: npm install rss-parser @supabase/supabase-js

      - name: Executar Sincronizador com Supabase
        env:
          SUPABASE_URL: \${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: \${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
        run: node scripts/sync-fitgirl.js
`;

/**
 * Drop-in Vercel Cron Configuration (vercel.json)
 */
export const VERCEL_CRON_JSON = `{
  "crons": [
    {
      "path": "/api/cron/sync-fitgirl",
      "schedule": "0 * * * *"
    }
  ]
}`;
