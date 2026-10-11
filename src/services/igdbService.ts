import { IgdbSearchResult, Game } from '../types';

// Curated comprehensive database for instant online lookup simulation & fallback
const POPULAR_GAMES_DATABASE: IgdbSearchResult[] = [
  {
    id: 119277,
    name: "Grand Theft Auto VI",
    coverUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80",
    summary: "Grand Theft Auto VI viaja até o estado de Leonida, lar das ruas banhadas em neon de Vice City e arredores, na maior e mais envolvente evolução da série Grand Theft Auto até hoje.",
    genres: ["Ação", "Mundo Aberto", "Aventura", "Crime"],
    releaseYear: 2025,
    releaseDate: "2025",
    developer: "Rockstar Studios",
    publisher: "Rockstar Games",
    screenshots: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80"
    ],
    rating: 4.9
  },
  {
    id: 114283,
    name: "Silent Hill 2 Remake",
    coverUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80",
    summary: "Tendo recebido uma carta de sua falecida esposa, James ruma até o lugar onde compartilharam tantas memórias, na esperança de vê-la mais uma vez: Silent Hill.",
    genres: ["Terror", "Sobrevivência", "Suspense", "Aventura"],
    releaseYear: 2024,
    releaseDate: "08/10/2024",
    developer: "Bloober Team",
    publisher: "KONAMI",
    screenshots: [
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80"
    ],
    rating: 4.8
  },
  {
    id: 19560,
    name: "God of War (2018)",
    coverUrl: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=800&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80",
    summary: "Com a vingança contra os deuses do Olimpo no passado, Kratos agora vive no reino das divindades e monstros nórdicos com seu filho Atreus.",
    genres: ["Ação", "Aventura", "Mitologia", "Hack and Slash"],
    releaseYear: 2022,
    releaseDate: "14/01/2022",
    developer: "Santa Monica Studio",
    publisher: "PlayStation Publishing LLC",
    screenshots: [
      "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=1200&q=80"
    ],
    rating: 4.9
  },
  {
    id: 1020,
    name: "The Witcher 3: Wild Hunt - Complete Edition",
    coverUrl: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80",
    summary: "Você é Geralt de Rívia, um caçador de monstros mercenário. Sua missão é encontrar Ciri, a Criança da Profecia, uma arma viva capaz de alterar a forma do mundo.",
    genres: ["RPG", "Mundo Aberto", "Fantasia", "Aventura"],
    releaseYear: 2022,
    releaseDate: "14/12/2022",
    developer: "CD Projekt RED",
    publisher: "CD Projekt RED",
    screenshots: [
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80"
    ],
    rating: 5.0
  },
  {
    id: 114795,
    name: "Dragon's Dogma 2",
    coverUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80",
    summary: "Dragon's Dogma 2 é um RPG de ação narrativo que desafia os jogadores a escolherem sua própria experiência – desde a aparência de seu Nascido até sua vocação e seus Peões.",
    genres: ["RPG", "Ação", "Fantasia", "Mundo Aberto"],
    releaseYear: 2024,
    releaseDate: "22/03/2024",
    developer: "CAPCOM Co., Ltd.",
    publisher: "CAPCOM Co., Ltd.",
    screenshots: [
      "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80"
    ],
    rating: 4.5
  },
  {
    id: 119402,
    name: "Lies of P",
    coverUrl: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=800&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80",
    summary: "Lies of P é um soulslike emocionante que pega a história de Pinóquio, vira-a de cabeça para baixo e coloca-a no cenário sombrio e elegante da era da Belle Époque.",
    genres: ["Soulslike", "Ação", "RPG", "Sombrio"],
    releaseYear: 2023,
    releaseDate: "19/09/2023",
    developer: "NEOWIZ / Round8 Studio",
    publisher: "NEOWIZ",
    screenshots: [
      "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1200&q=80"
    ],
    rating: 4.8
  },
  {
    id: 151665,
    name: "Hollow Knight: Silksong",
    coverUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80",
    summary: "Descubra um vasto reino assombrado em Hollow Knight: Silksong! A tão esperada sequência da aclamada aventura de ação. Jogue como Hornet, princesa e protetora de Hallownest.",
    genres: ["Metroidvania", "Ação", "Aventura", "Indie"],
    releaseYear: 2025,
    releaseDate: "2025",
    developer: "Team Cherry",
    publisher: "Team Cherry",
    screenshots: [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80"
    ],
    rating: 5.0
  },
  {
    id: 144053,
    name: "Helldivers 2",
    coverUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1600&q=80",
    summary: "A última linha de ataque da Galáxia. Aliste-se nos Helldivers e junte-se à luta pela liberdade em uma galáxia hostil em um frenético jogo de tiro em terceira pessoa.",
    genres: ["Tiro", "Ação", "Co-op", "Ficção Científica"],
    releaseYear: 2024,
    releaseDate: "08/02/2024",
    developer: "Arrowhead Game Studios",
    publisher: "PlayStation Publishing LLC",
    screenshots: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80"
    ],
    rating: 4.7
  }
];

export async function searchIgdbGames(query: string, apiKey?: string): Promise<IgdbSearchResult[]> {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  // If the user provided a real IGDB / RAWG API key in the admin settings, we can make a real fetch
  if (apiKey && apiKey.length > 10) {
    try {
      // Free RAWG fallback endpoint if apiKey is supplied
      const response = await fetch(`https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(query)}&page_size=6`);
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          return data.results.map((item: any) => ({
            id: item.id,
            name: item.name,
            coverUrl: item.background_image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
            bannerUrl: item.background_image || "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80",
            summary: item.description_raw || `Um emocionante jogo de ${item.genres?.map((g: any) => g.name).join(', ') || 'Ação'} repleto de desafios e alta imersão.`,
            genres: item.genres?.map((g: any) => g.name) || ['Ação', 'Aventura'],
            releaseYear: item.released ? new Date(item.released).getFullYear() : 2024,
            releaseDate: item.released || '2024',
            developer: item.developers?.[0]?.name || 'Desenvolvedora Independente',
            publisher: item.publishers?.[0]?.name || 'Editora Global',
            screenshots: item.short_screenshots?.map((s: any) => s.image) || [item.background_image],
            rating: item.rating ? Number(item.rating.toFixed(1)) : 4.5
          }));
        }
      }
    } catch (e) {
      console.warn('External gaming API lookup failed, falling back to local database:', e);
    }
  }

  // Simulated latency for authentic API feeling
  await new Promise((resolve) => setTimeout(resolve, 350));

  // Filter against curated database
  const matches = POPULAR_GAMES_DATABASE.filter(g =>
    g.name.toLowerCase().includes(cleanQuery) ||
    g.genres.some(gen => gen.toLowerCase().includes(cleanQuery))
  );

  // If no exact match, dynamically construct a realistic IGDB record for any search query
  if (matches.length === 0) {
    const formattedTitle = query.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const fallbackResult: IgdbSearchResult = {
      id: Math.floor(Math.random() * 900000) + 100000,
      name: formattedTitle,
      coverUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80",
      summary: `${formattedTitle} é uma grande experiência com mecânicas modernas de jogabilidade, narrativa envolvente e gráficos otimizados para PC com suporte a múltiplos idiomas e controles.`,
      genres: ["Ação", "Aventura", "RPG"],
      releaseYear: 2024,
      releaseDate: "2024",
      developer: "Studio Games",
      publisher: "Publishing Corp",
      screenshots: [
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80"
      ],
      rating: 4.7
    };
    return [fallbackResult];
  }

  return matches;
}

export function convertIgdbResultToGame(
  result: IgdbSearchResult,
  torrentMagnetUrl: string = '',
  repacker: string = 'FitGirl Repack',
  repackSize: string = '45.0 GB',
  crackStatus: 'Crackeado' | 'DRM Free' | 'Emulação Steam' | 'Bypass' = 'Crackeado'
): Game {
  const slug = result.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const id = `game-${slug}-${Date.now().toString(36)}`;
  
  const defaultMagnet = torrentMagnetUrl || `magnet:?xt=urn:btih:${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}&dn=${encodeURIComponent(result.name + '-' + repacker)}&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce`;

  return {
    id,
    title: result.name,
    slug,
    coverUrl: result.coverUrl,
    bannerUrl: result.bannerUrl,
    shortDescription: result.summary.slice(0, 140) + '...',
    description: result.summary,
    genres: result.genres.length > 0 ? result.genres : ['Ação', 'Aventura'],
    categories: ['Lançamentos', 'Repacks'],
    releaseYear: result.releaseYear,
    releaseDate: result.releaseDate,
    developer: result.developer,
    publisher: result.publisher,
    repackInfo: {
      repacker,
      version: 'v1.0.0 Oficial Completo',
      repackSize,
      originalSize: `${(parseFloat(repackSize) * 1.5).toFixed(1)} GB`,
      crackStatus,
      crackGroup: 'RUNE / TENOKE'
    },
    downloadLinks: [
      {
        id: `dl-${Date.now()}-1`,
        type: 'magnet',
        label: `Torrent Magnet (${repacker} - Alta Velocidade)`,
        url: defaultMagnet,
        seeders: 1850,
        leechers: 340,
        size: repackSize
      },
      {
        id: `dl-${Date.now()}-2`,
        type: 'torrent',
        label: 'Baixar Arquivo .torrent Direto',
        url: '#torrent-download',
        seeders: 1400,
        leechers: 220,
        size: repackSize
      }
    ],
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit',
        processor: 'Intel Core i5-6600K ou AMD Ryzen 5 1600',
        memory: '8 GB RAM',
        graphics: 'NVIDIA GeForce GTX 1060 (6 GB) ou AMD Radeon RX 580',
        storage: `${Math.ceil(parseFloat(repackSize) * 1.6)} GB livres`,
        directx: 'Versão 12'
      },
      recommended: {
        os: 'Windows 10/11 64-bit',
        processor: 'Intel Core i7-10700 ou AMD Ryzen 7 3700X',
        memory: '16 GB RAM',
        graphics: 'NVIDIA GeForce RTX 2070 Super ou AMD Radeon RX 6700 XT',
        storage: `${Math.ceil(parseFloat(repackSize) * 1.6)} GB SSD`,
        directx: 'Versão 12'
      }
    },
    rating: result.rating || 4.8,
    totalVotes: 120,
    screenshots: result.screenshots,
    trailerYoutubeId: 'dQw4w9WgXcQ',
    tags: ['Lançamento', 'Dublado PT-BR', 'Torrent Rápido', 'Testado sem Erros'],
    downloadsCount: 1540,
    viewsCount: 4200,
    createdAt: new Date().toISOString(),
    isFeatured: false,
    isTrending: true,
    languages: ['Português (Brasil)', 'Inglês']
  };
}
