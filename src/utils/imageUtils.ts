import React from 'react';

/**
 * Universal Game Image & Cover System
 * 
 * Provides authentic, high-speed Fastly Steam CDN, PlayStation box art,
 * and reliable game covers while preventing anti-hotlinking "GAME OVER"
 * images and avoiding unintended Cyberpunk fallback overrides.
 */

// Official neutral fallback cover - Elegant retro/modern gaming setup (NO game-over, NO Cyberpunk)
export const DEFAULT_GAME_COVER = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80';

// Official neutral fallback banner - Cinematic ultrawide gaming background
export const DEFAULT_GAME_BANNER = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80';

// Authentic high-speed Fastly/Steam & PlayStation CDN portrait covers (600x900 official box-art)
export const KNOWN_AUTHENTIC_COVERS: Record<string, string> = {
  // PlayStation & Top PC blockbusters
  'last of us': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1888930/library_600x900.jpg',
  'tlou': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1888930/library_600x900.jpg',
  'ghost of tsushima': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2215430/library_600x900.jpg',
  'tsushima': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2215430/library_600x900.jpg',
  'uncharted': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1659420/library_600x900.jpg',
  'horizon forbidden west': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2420110/library_600x900.jpg',
  'horizon': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2420110/library_600x900.jpg',
  'bloodborne': 'https://image.api.playstation.com/vulcan/img/rnd/202010/2614/gdaeAUzkfv6efQWfg1bM8U07.png',
  'god of war': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2322010/library_600x900.jpg',
  'ragnarok': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2322010/library_600x900.jpg',
  'spider-man': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1817070/library_600x900.jpg',
  'spiderman': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1817070/library_600x900.jpg',

  // DODI / Supabase Synced games
  'baldur': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/library_600x900.jpg',
  'dead island': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/934700/library_600x900.jpg',
  'stronghold': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2328990/library_600x900.jpg',
  'plague tale': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1182900/library_600x900.jpg',
  'gears of war': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1097840/library_600x900.jpg',
  'gears': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1097840/library_600x900.jpg',
  'forza': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1551360/library_600x900.jpg',
  '007': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1659040/library_600x900.jpg',
  'first light': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1659040/library_600x900.jpg',
  'dead space': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1693980/library_600x900.jpg',
  'retrospace': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2067820/library_600x900.jpg',
  'dinobones': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2635350/library_600x900.jpg',
  'mxgp': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2563770/library_600x900.jpg',

  // Specific PC blockbusters (ONLY matched when title actually corresponds)
  'cyberpunk': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/library_600x900.jpg',
  'elden ring': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/library_600x900.jpg',
  'black myth': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2358720/library_600x900.jpg',
  'wukong': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2358720/library_600x900.jpg',
  'red dead': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/library_600x900.jpg',
  'resident evil': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2050650/library_600x900.jpg',
  'hollow knight': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/367520/library_600x900.jpg',
  'witcher': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/292030/library_600x900.jpg',
  'silent hill': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2124490/library_600x900.jpg',
  'lies of p': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1627720/library_600x900.jpg',
  'helldivers': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/553850/library_600x900.jpg',
  'dragons dogma': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2054970/library_600x900.jpg',
  'space marine': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2183900/library_600x900.jpg',
  'starfield': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1716740/library_600x900.jpg',
  'hogwarts': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/990080/library_600x900.jpg',
  'sekiro': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/814380/library_600x900.jpg',
  'dark souls': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/374320/library_600x900.jpg',
  'gta': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900.jpg',
  'tekken': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1778820/library_600x900.jpg',
  'death stranding': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1850570/library_600x900.jpg',
  'final fantasy': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1462040/library_600x900.jpg',
  'persona': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1687950/library_600x900.jpg',
  'armored core': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1888120/library_600x900.jpg',
  'alan wake': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/108710/library_600x900.jpg'
};

// Authentic high-speed Fastly/Steam wide banners (header.jpg)
export const KNOWN_AUTHENTIC_BANNERS: Record<string, string> = {
  'last of us': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1888930/header.jpg',
  'tlou': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1888930/header.jpg',
  'ghost of tsushima': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2215430/header.jpg',
  'tsushima': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2215430/header.jpg',
  'uncharted': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1659420/header.jpg',
  'horizon': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2420110/header.jpg',
  'god of war': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2322010/header.jpg',
  'baldur': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg',
  'dead island': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/934700/header.jpg',
  'stronghold': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2328990/header.jpg',
  'plague tale': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1182900/header.jpg',
  'gears': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1097840/header.jpg',
  'forza': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1551360/header.jpg',
  '007': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1659040/header.jpg',
  'first light': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1659040/header.jpg',
  'dead space': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1693980/header.jpg',
  'retrospace': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2067820/header.jpg',
  'dinobones': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2635350/header.jpg',
  'mxgp': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2563770/header.jpg',
  'cyberpunk': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg',
  'elden ring': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg',
  'black myth': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2358720/header.jpg',
  'wukong': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2358720/header.jpg',
  'red dead': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg',
  'resident evil': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2050650/header.jpg',
  'hollow knight': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/367520/header.jpg',
  'spider-man': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1817070/header.jpg',
  'spiderman': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1817070/header.jpg'
};

/**
 * Checks whether an image URL is truly broken or is the specific "GAME OVER" photo.
 * Note: Unsplash photos and other valid image services are completely valid.
 */
export function isUnreliableCover(rawUrl?: string | null): boolean {
  if (!rawUrl) return true;
  const trimmed = rawUrl.trim().toLowerCase();
  
  if (trimmed.length < 10) return true;
  // Imagens locais válidas (Data URIs coladas via Clipboard ou SVGs de alta definição gerados) são 100% confiáveis
  if (trimmed.startsWith('data:image/')) return false;
  // Specific Unsplash photo ID that showed "GAME OVER" text
  if (trimmed.includes('1542751371-adc38448a05e')) return true;
  if (trimmed.includes('game-over') || trimmed.includes('game_over') || trimmed.includes('gameover')) return true;

  return false;
}

/**
 * Returns the reliable cover for a game:
 * - Preserves authentic, beautiful game covers.
 * - Reverts games erroneously overwritten with Cyberpunk (1091500) during previous update.
 * - Replaces broken or "GAME OVER" photos.
 * - Falls back to a neutral dark aesthetic gaming cover (DEFAULT_GAME_COVER).
 */
export function getGameCover(game?: { title?: string; coverUrl?: string; genres?: string[] } | null): string {
  if (!game) return DEFAULT_GAME_COVER;

  const rawUrl = (game.coverUrl || '').trim();
  const titleLower = (game.title || '').toLowerCase();

  // If a non-cyberpunk game was accidentally given the Cyberpunk (1091500) cover in localStorage:
  if (rawUrl.includes('1091500') && !titleLower.includes('cyberpunk')) {
    // Look up in authentic box-art dictionary first
    for (const [key, authenticUrl] of Object.entries(KNOWN_AUTHENTIC_COVERS)) {
      if (titleLower.includes(key) && !authenticUrl.includes('1091500')) {
        return authenticUrl;
      }
    }
    return DEFAULT_GAME_COVER;
  }

  // If the cover is literally missing or is the old GAME OVER neon photo:
  if (isUnreliableCover(rawUrl)) {
    // 1. Look up in authentic box-art dictionary first
    for (const [key, authenticUrl] of Object.entries(KNOWN_AUTHENTIC_COVERS)) {
      if (titleLower.includes(key) && (key === 'cyberpunk' || !authenticUrl.includes('1091500'))) {
        return authenticUrl;
      }
    }
    // 2. Fallback to the neutral DEFAULT_GAME_COVER
    return DEFAULT_GAME_COVER;
  }

  // Keep the game's actual, beautiful cover!
  return rawUrl;
}

/**
 * Returns a reliable banner URL for a game
 */
export function getGameBanner(game?: { title?: string; bannerUrl?: string; coverUrl?: string; genres?: string[] } | null): string {
  if (!game) return DEFAULT_GAME_BANNER;
  
  const rawUrl = (game.bannerUrl || '').trim();
  const titleLower = (game.title || '').toLowerCase();

  // If a non-cyberpunk game was accidentally given the Cyberpunk banner in localStorage:
  if (rawUrl.includes('1091500') && !titleLower.includes('cyberpunk')) {
    for (const [key, authenticBanner] of Object.entries(KNOWN_AUTHENTIC_BANNERS)) {
      if (titleLower.includes(key) && !authenticBanner.includes('1091500')) {
        return authenticBanner;
      }
    }
    return DEFAULT_GAME_BANNER;
  }

  if (isUnreliableCover(rawUrl)) {
    // Check known banners first
    for (const [key, authenticBanner] of Object.entries(KNOWN_AUTHENTIC_BANNERS)) {
      if (titleLower.includes(key) && (key === 'cyberpunk' || !authenticBanner.includes('1091500'))) {
        return authenticBanner;
      }
    }

    // Check if the game has an authentic cover we can use as banner
    const cover = getGameCover(game);
    if (cover && !isUnreliableCover(cover) && (titleLower.includes('cyberpunk') || !cover.includes('1091500'))) {
      return cover;
    }
    return DEFAULT_GAME_BANNER;
  }

  return rawUrl;
}

/**
 * Smart image error handler for <img> elements:
 * When an image fails to load in the client browser, this safely recovers
 * using authentic box art or falling back to the neutral DEFAULT_GAME_COVER.
 */
export function handleImageError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  game?: { title?: string; genres?: string[] } | null
): void {
  const target = e.currentTarget;
  const currentStep = Number(target.getAttribute('data-error-step') || '0');

  if (currentStep >= 2) {
    return;
  }

  target.setAttribute('data-error-step', String(currentStep + 1));
  const titleLower = (game?.title || '').toLowerCase();

  // Step 1: Look up in known authentic covers
  if (currentStep === 0) {
    for (const [key, authenticUrl] of Object.entries(KNOWN_AUTHENTIC_COVERS)) {
      if (titleLower.includes(key) && (key === 'cyberpunk' || !authenticUrl.includes('1091500')) && target.src !== authenticUrl) {
        target.src = authenticUrl;
        return;
      }
    }
  }

  // Step 2: Fallback to neutral DEFAULT_GAME_COVER (never Cyberpunk for other games)
  if (target.src !== DEFAULT_GAME_COVER) {
    target.src = DEFAULT_GAME_COVER;
  }
}
