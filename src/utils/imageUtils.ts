import React from 'react';

/**
 * Universal Game Image & Cover System
 * 
 * Provides fallback constants, automatic Steam CDN art resolution for authentic box-art,
 * genre-based posters, and self-contained SVG fallback generation so games never have broken covers.
 */

// Official default fallback cover - High-tech gaming poster with dark neon aesthetic
export const DEFAULT_GAME_COVER = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80';

// Official default fallback banner - Cinematic ultrawide background
export const DEFAULT_GAME_BANNER = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80';

// Curated high-resolution covers by genre if specific game cover is unavailable
export const GENRE_FALLBACK_COVERS: Record<string, string> = {
  'Ação': 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=800&q=80',
  'Aventura': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
  'RPG': 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
  'Terror': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
  'Corrida': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
  'Ficção Científica': 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
  'Estratégia': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
  'Indie': 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=800&q=80',
  'Esporte': 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80'
};

// Authentic high-speed global Fastly/Steam CDN portrait covers (600x900 standard box-art)
export const KNOWN_AUTHENTIC_COVERS: Record<string, string> = {
  'baldur': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/library_600x900.jpg',
  'dead space': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1693980/library_600x900.jpg',
  'dead island': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/934700/library_600x900.jpg',
  'stronghold': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/40970/library_600x900.jpg',
  'cyberpunk': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/library_600x900.jpg',
  'witcher': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/292030/library_600x900.jpg',
  'elden ring': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/library_600x900.jpg',
  'red dead': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/library_600x900.jpg',
  'god of war': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1593500/library_600x900.jpg',
  'spider-man': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1817070/library_600x900.jpg',
  'spiderman': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1817070/library_600x900.jpg',
  'silent hill': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2124490/library_600x900.jpg',
  'black myth': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2358720/library_600x900.jpg',
  'wukong': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2358720/library_600x900.jpg',
  'hollow knight': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/367520/library_600x900.jpg',
  'forza': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1551360/library_600x900.jpg',
  'plague tale': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1182900/library_600x900.jpg',
  'resonance': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1182900/library_600x900.jpg',
  'lies of p': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1627720/library_600x900.jpg',
  'resident evil': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2050650/library_600x900.jpg',
  'last of us': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1888930/library_600x900.jpg',
  'retrospace': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2067820/library_600x900.jpg',
  'dinobones': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2635350/library_600x900.jpg',
  'mxgp': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2563770/library_600x900.jpg',
  'gears of war': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
  'halloween': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
  '007': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
  'false hero': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
  'land of glarefall': 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
  'beast of reincarnation': 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=800&q=80',
  'ghost of tsushima': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2215430/library_600x900.jpg',
  'helldivers': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/553850/library_600x900.jpg'
};

/**
 * Generates an elegant SVG Data URL game cover with title and styling
 * Guaranteed to never fail, requires zero external network requests.
 */
export function generateSvgCover(title: string, subtitle?: string): string {
  const safeTitle = (title || 'Vortex Game')
    .replace(/\[.*?\]|\(.*?\)|repack|v\d+.*$/gi, '')
    .trim()
    .slice(0, 40);
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="900" viewBox="0 0 600 900">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#090d16" />
        <stop offset="50%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#020617" />
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="30%" r="60%">
        <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#06b6d4" stop-opacity="0" />
      </radialGradient>
      <linearGradient id="neon" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#06b6d4" />
        <stop offset="100%" stop-color="#3b82f6" />
      </linearGradient>
    </defs>
    <rect width="600" height="900" fill="url(#bg)" />
    <rect width="600" height="900" fill="url(#glow)" />
    
    <!-- Neon grid decoration -->
    <path d="M0 700 L600 700 M0 750 L600 750 M0 800 L600 800" stroke="#1e293b" stroke-width="1.5" />
    <path d="M100 650 L50 900 M300 650 L300 900 M500 650 L550 900" stroke="#1e293b" stroke-width="1.5" />
    
    <!-- Top badge -->
    <rect x="40" y="40" width="120" height="32" rx="8" fill="#06b6d4" fill-opacity="0.2" stroke="#06b6d4" stroke-width="1.5" />
    <text x="100" y="62" font-family="system-ui, sans-serif" font-weight="900" font-size="14" fill="#22d3ee" text-anchor="middle" letter-spacing="2">VORTEX</text>
    
    <!-- Gamepad Icon Center -->
    <g transform="translate(230, 260) scale(2.8)" stroke="#38bdf8" stroke-width="2" fill="none">
      <rect x="2" y="6" width="38" height="24" rx="8" />
      <line x1="8" y1="18" x2="18" y2="18" />
      <line x1="13" y1="13" x2="13" y2="23" />
      <circle cx="28" cy="15" r="1.5" fill="#38bdf8" />
      <circle cx="34" cy="20" r="1.5" fill="#38bdf8" />
    </g>
    
    <!-- Game Title -->
    <text x="300" y="520" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="34" fill="#ffffff" text-anchor="middle">
      ${safeTitle.length > 22 ? safeTitle.slice(0, 20) + '...' : safeTitle}
    </text>
    <text x="300" y="565" font-family="system-ui, sans-serif" font-weight="700" font-size="16" fill="#94a3b8" text-anchor="middle" letter-spacing="3">
      ${(subtitle || 'EDIÇÃO COMPLETA').toUpperCase()}
    </text>
    
    <!-- Bottom line -->
    <rect x="60" y="620" width="480" height="2" fill="url(#neon)" opacity="0.6" />
    <text x="300" y="850" font-family="system-ui, sans-serif" font-weight="700" font-size="13" fill="#64748b" text-anchor="middle" letter-spacing="4">VORTEX GAMES CATALOG</text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Returns a reliable, high-resolution cover for any game.
 * Automatically checks and replaces broken/unreliable domains (like imageban.ru),
 * matches known games with authentic box art, and falls back to genre covers or DEFAULT_GAME_COVER.
 */
export function getGameCover(game?: { title?: string; coverUrl?: string; genres?: string[] } | null): string {
  if (!game) return DEFAULT_GAME_COVER;

  const rawUrl = (game.coverUrl || '').trim();
  const titleLower = (game.title || '').toLowerCase();

  // If URL is missing, placeholder, or from unreliable image hosts (imageban.ru often fails/is blocked)
  const isUnreliable = !rawUrl || 
    rawUrl.includes('imageban.ru') || 
    rawUrl.includes('placeholder') ||
    rawUrl.length < 10;

  // If unreliable or missing, check authentic box-art dictionary first
  if (isUnreliable) {
    for (const [key, authenticUrl] of Object.entries(KNOWN_AUTHENTIC_COVERS)) {
      if (titleLower.includes(key)) {
        return authenticUrl;
      }
    }

    // Try genre fallback
    if (game.genres && game.genres.length > 0) {
      for (const genre of game.genres) {
        if (GENRE_FALLBACK_COVERS[genre]) {
          return GENRE_FALLBACK_COVERS[genre];
        }
      }
    }

    // Generate beautiful custom SVG poster with the game title
    if (game.title) {
      return generateSvgCover(game.title);
    }

    return DEFAULT_GAME_COVER;
  }

  return rawUrl;
}

/**
 * Returns a reliable banner URL for a game
 */
export function getGameBanner(game?: { title?: string; bannerUrl?: string; coverUrl?: string; genres?: string[] } | null): string {
  if (!game) return DEFAULT_GAME_BANNER;
  
  const rawUrl = (game.bannerUrl || '').trim();
  if (rawUrl && !rawUrl.includes('imageban.ru') && rawUrl.length > 10) {
    return rawUrl;
  }
  
  // Use reliable cover or default banner
  const cover = getGameCover(game);
  if (cover && !cover.startsWith('data:image/svg+xml')) {
    return cover;
  }
  
  return DEFAULT_GAME_BANNER;
}

/**
 * Smart image error handler for <img> elements:
 * Switches step-by-step to authentic box art -> genre poster -> SVG cover,
 * preventing infinite reload loops.
 */
export function handleImageError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  game?: { title?: string; genres?: string[] } | null
): void {
  const target = e.currentTarget;
  const currentStep = Number(target.getAttribute('data-error-step') || '0');

  if (currentStep >= 3) {
    // Already reached ultimate fallback, do not loop
    return;
  }

  target.setAttribute('data-error-step', String(currentStep + 1));

  const titleLower = (game?.title || '').toLowerCase();

  // Step 1: Look up in known authentic covers
  if (currentStep === 0) {
    for (const [key, authenticUrl] of Object.entries(KNOWN_AUTHENTIC_COVERS)) {
      if (titleLower.includes(key) && target.src !== authenticUrl) {
        target.src = authenticUrl;
        return;
      }
    }
  }

  // Step 2: Look up genre cover
  if (currentStep <= 1 && game?.genres && game.genres.length > 0) {
    for (const genre of game.genres) {
      const genreUrl = GENRE_FALLBACK_COVERS[genre];
      if (genreUrl && target.src !== genreUrl) {
        target.src = genreUrl;
        return;
      }
    }
  }

  // Step 3: Self-contained SVG poster (always works, 100% offline)
  if (game?.title) {
    target.src = generateSvgCover(game.title);
  } else {
    target.src = DEFAULT_GAME_COVER;
  }
}
