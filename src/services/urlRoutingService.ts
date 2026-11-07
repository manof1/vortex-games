import { Game } from '../types';

export type GameModalTab = 'downloads' | 'specs' | 'screenshots' | 'instructions' | 'cheats' | 'mods' | 'localizations';

export interface ParsedRoute {
  type: 'home' | 'game' | 'library' | 'category';
  gameSlug?: string;
  tab?: GameModalTab;
  category?: string;
}

const VALID_TABS: Record<string, GameModalTab> = {
  downloads: 'downloads',
  download: 'downloads',
  specs: 'specs',
  requisitos: 'specs',
  screenshots: 'screenshots',
  fotos: 'screenshots',
  videos: 'screenshots',
  instructions: 'instructions',
  instalacao: 'instructions',
  como_instalar: 'instructions',
  cheats: 'cheats',
  dicas: 'cheats',
  codigos: 'cheats',
  mods: 'mods',
  modificacoes: 'mods',
  localizations: 'localizations',
  idiomas: 'localizations',
  dublagens: 'localizations',
  traducoes: 'localizations'
};

const DEFAULT_TITLE = 'Vortex Games – Portal Oficial de Torrents & Repacks PC';
const DEFAULT_DESC = 'Portal completo de download de jogos via torrent com avaliações da comunidade, busca avançada por gêneros, painel administrativo, integração com IGDB e biblioteca personalizada.';

/**
 * Normaliza uma string para slug limpo (ex: "God of War: Ragnarök" -> "god-of-war-ragnarok")
 */
export function normalizeTitleToSlug(title: string): string {
  if (!title) return '';
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Analisa a URL atual do navegador e retorna os dados da rota
 */
export function parseCurrentRoute(): ParsedRoute {
  if (typeof window === 'undefined') {
    return { type: 'home' };
  }

  const pathname = window.location.pathname;

  // Formato: /game/:slug ou /game/:slug/:tab
  const gameMatch = pathname.match(/^\/game\/([a-zA-Z0-9_-]+)(?:\/([a-zA-Z0-9_-]+))?\/?$/i);
  if (gameMatch) {
    const slug = gameMatch[1];
    const rawTab = gameMatch[2]?.toLowerCase();
    const tab: GameModalTab = (rawTab && VALID_TABS[rawTab]) ? VALID_TABS[rawTab] : 'downloads';

    return {
      type: 'game',
      gameSlug: slug,
      tab
    };
  }

  // Suporte a rotas com hash caso alguém compartilhe /#/game/:slug
  const hash = window.location.hash;
  if (hash.startsWith('#/game/') || hash.startsWith('#game/')) {
    const hashParts = hash.replace(/^#\/?game\//, '').split('/');
    const slug = hashParts[0];
    const rawTab = hashParts[1]?.toLowerCase();
    const tab: GameModalTab = (rawTab && VALID_TABS[rawTab]) ? VALID_TABS[rawTab] : 'downloads';
    return {
      type: 'game',
      gameSlug: slug,
      tab
    };
  }

  // Suporte a parâmetro de busca ?game=:slug
  const searchParams = new URLSearchParams(window.location.search);
  const paramGame = searchParams.get('game') || searchParams.get('g');
  if (paramGame) {
    const rawTab = searchParams.get('tab')?.toLowerCase();
    const tab: GameModalTab = (rawTab && VALID_TABS[rawTab]) ? VALID_TABS[rawTab] : 'downloads';
    return {
      type: 'game',
      gameSlug: paramGame,
      tab
    };
  }

  // Formato: /category/:category
  const catMatch = pathname.match(/^\/category\/([a-zA-Z0-9_-]+)\/?$/i);
  if (catMatch) {
    return {
      type: 'category',
      category: decodeURIComponent(catMatch[1])
    };
  }

  // Formato: /library
  if (pathname === '/library' || pathname === '/biblioteca') {
    return { type: 'library' };
  }

  return { type: 'home' };
}

/**
 * Localiza um jogo no catálogo a partir de um slug fornecido
 */
export function findGameBySlug(games: Game[], slug: string): Game | undefined {
  if (!slug || !games || games.length === 0) return undefined;
  const clean = slug.toLowerCase().trim();

  // 1. Busca exata por slug
  const exact = games.find(g => (g.slug && g.slug.toLowerCase() === clean));
  if (exact) return exact;

  // 2. Busca por ID
  const byId = games.find(g => g.id.toLowerCase() === clean);
  if (byId) return byId;

  // 3. Busca por slug normalizado do título
  const byNormalized = games.find(g => normalizeTitleToSlug(g.title) === clean);
  if (byNormalized) return byNormalized;

  // 4. Busca por prefixo/sufixo sem 'bg-', 'fg-', 'dodi-'
  const cleanWithoutPrefix = clean.replace(/^(bg-|fg-|dodi-)/, '').replace(/-(brothergame|fitgirl|dodi)$/, '');
  const byStripped = games.find(g => {
    const gameSlugClean = (g.slug || '').toLowerCase().replace(/^(bg-|fg-|dodi-)/, '').replace(/-(brothergame|fitgirl|dodi)$/, '');
    return gameSlugClean === cleanWithoutPrefix || normalizeTitleToSlug(g.title) === cleanWithoutPrefix;
  });
  if (byStripped) return byStripped;

  return undefined;
}

/**
 * Gera a URL canônica para um jogo e aba opcional
 */
export function getGamePath(gameOrSlug: Game | string, tab?: GameModalTab): string {
  const slug = typeof gameOrSlug === 'string' ? gameOrSlug : (gameOrSlug.slug || normalizeTitleToSlug(gameOrSlug.title));
  if (tab && tab !== 'downloads') {
    return `/game/${slug}/${tab}`;
  }
  return `/game/${slug}`;
}

/**
 * Gera o link completo (incluindo https://...) para compartilhamento direto
 */
export function getFullShareUrl(gameOrSlug: Game | string, tab?: GameModalTab): string {
  const path = getGamePath(gameOrSlug, tab);
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://vortex-games-seven.vercel.app';
  return `${origin}${path}`;
}

/**
 * Atualiza o endereço na barra do navegador (HTML5 History API) sem recarregar a página
 */
export function updateBrowserUrlForGame(game: Game, tab: GameModalTab = 'downloads', replace: boolean = false): void {
  if (typeof window === 'undefined') return;

  const path = getGamePath(game, tab);
  const state = { gameSlug: game.slug, tab, title: game.title };

  if (window.location.pathname !== path) {
    if (replace) {
      window.history.replaceState(state, '', path);
    } else {
      window.history.pushState(state, '', path);
    }
  }

  updateGameSeoMetadata(game, tab);
}

/**
 * Restaura o endereço da página inicial (/) no navegador
 */
export function updateBrowserUrlForHome(replace: boolean = false): void {
  if (typeof window === 'undefined') return;

  if (window.location.pathname !== '/') {
    if (replace) {
      window.history.replaceState(null, '', '/');
    } else {
      window.history.pushState(null, '', '/');
    }
  }

  resetDefaultSeoMetadata();
}

/**
 * Atualiza dinamicamente as tags de SEO, OpenGraph e Twitter no <head>
 */
export function updateGameSeoMetadata(game: Game, tab: GameModalTab = 'downloads'): void {
  if (typeof document === 'undefined') return;

  let tabSuffix = '';
  if (tab === 'cheats') tabSuffix = ' – Dicas, Cheats e Comandos';
  else if (tab === 'mods') tabSuffix = ' – Mods, 60 FPS & Gráficos';
  else if (tab === 'specs') tabSuffix = ' – Requisitos de Sistema PC';
  else if (tab === 'screenshots') tabSuffix = ' – Screenshots & Mídia';
  else if (tab === 'localizations') tabSuffix = ' – Dublagem e Tradução PT-BR';
  else if (tab === 'instructions') tabSuffix = ' – Como Instalar';

  const repacker = game.repackInfo?.repacker ? ` [${game.repackInfo.repacker}]` : '';
  const pageTitle = `${game.title}${tabSuffix}${repacker} – Vortex Games`;
  document.title = pageTitle;

  const desc = game.shortDescription || game.description?.slice(0, 160) || DEFAULT_DESC;
  const shareUrl = getFullShareUrl(game, tab);
  const coverImage = game.coverUrl || game.bannerUrl || '';

  // Atualiza meta tags existentes
  setMetaTag('description', desc);
  setMetaProperty('og:title', pageTitle);
  setMetaProperty('og:description', desc);
  setMetaProperty('og:image', coverImage);
  setMetaProperty('og:url', shareUrl);
  setMetaProperty('og:type', 'website');
  setMetaTag('twitter:title', pageTitle);
  setMetaTag('twitter:description', desc);
  setMetaTag('twitter:image', coverImage);

  // Link Canonical
  let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', shareUrl);

  // Schema.org JSON-LD para VideoGame / SoftwareApplication
  injectSchemaJsonLd({
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    'name': game.title,
    'description': desc,
    'image': coverImage,
    'genre': game.genres || [],
    'gamePlatform': ['PC', 'Windows'],
    'operatingSystem': 'Windows 10, Windows 11 64-bit',
    'author': {
      '@type': 'Organization',
      'name': game.developer || game.publisher || 'Vortex Games'
    },
    'publisher': {
      '@type': 'Organization',
      'name': game.publisher || game.repackInfo?.repacker || 'Vortex Games'
    },
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'BRL',
      'availability': 'https://schema.org/InStock'
    }
  });
}

/**
 * Restaura o título e metadados padrão do portal
 */
export function resetDefaultSeoMetadata(): void {
  if (typeof document === 'undefined') return;

  document.title = DEFAULT_TITLE;
  setMetaTag('description', DEFAULT_DESC);
  setMetaProperty('og:title', DEFAULT_TITLE);
  setMetaProperty('og:description', DEFAULT_DESC);
  setMetaProperty('og:url', typeof window !== 'undefined' ? window.location.origin : 'https://vortex-games-seven.vercel.app');
  setMetaTag('twitter:title', DEFAULT_TITLE);
  setMetaTag('twitter:description', DEFAULT_DESC);

  const canonicalEl = document.querySelector('link[rel="canonical"]');
  if (canonicalEl) {
    canonicalEl.setAttribute('href', typeof window !== 'undefined' ? window.location.origin : 'https://vortex-games-seven.vercel.app');
  }

  const script = document.getElementById('vortex-schema-jsonld');
  if (script) {
    script.remove();
  }
}

/**
 * Função utilitária para copiar link e abrir o compartilhamento nativo do dispositivo
 */
export async function shareGame(game: Game, tab?: GameModalTab): Promise<{ success: boolean; sharedNatively: boolean; url: string }> {
  const url = getFullShareUrl(game, tab);
  const title = `${game.title} no Vortex Games`;
  const text = `Confira ${game.title} no Vortex Games (Torrents PC, Dicas e PT-BR):`;

  let sharedNatively = false;

  // 1. Tenta compartilhamento nativo em smartphones e navegadores modernos
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title,
        text,
        url
      });
      sharedNatively = true;
      return { success: true, sharedNatively, url };
    } catch (err: any) {
      // Se o usuário cancelou o menu nativo, não faz nada
      if (err?.name === 'AbortError') {
        return { success: true, sharedNatively: false, url };
      }
    }
  }

  // 2. Copia para a área de transferência
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
    } else {
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    return { success: true, sharedNatively, url };
  } catch {
    return { success: false, sharedNatively: false, url };
  }
}

function setMetaTag(name: string, content: string): void {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setMetaProperty(property: string, content: string): void {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function injectSchemaJsonLd(schema: Record<string, any>): void {
  let script = document.getElementById('vortex-schema-jsonld') as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = 'vortex-schema-jsonld';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schema);
}
