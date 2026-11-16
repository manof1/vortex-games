import { Game, DownloadLink } from '../types';
import { FOURFNET_PRESET_GAMES } from '../data/fourFNetPresets';
import { getImdbRating } from '../utils/ratingUtils';
import { getGameCover, getGameBanner } from '../utils/imageUtils';
import { filterOutRiotPixels } from '../utils/linkFilters';

export const FOURFNET_API_BASE = 'https://www.4fnet.org/wp-json/wp/v2/posts';

export interface FourFNetPostRaw {
  id: number;
  date: string;
  slug: string;
  link: string;
  title?: { rendered?: string };
  content?: { rendered?: string };
  excerpt?: { rendered?: string };
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url?: string }>;
    'wp:term'?: Array<Array<{ id?: number; name?: string; slug?: string }>>;
  };
}

export function getFourFNetPresetCatalog(): Game[] {
  return FOURFNET_PRESET_GAMES;
}

export function decodeFourFNetHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function mapFourFNetGenres(termNames: string[]): string[] {
  const mapped = new Set<string>();
  const lowerAll = termNames.join(' ').toLowerCase();

  if (lowerAll.includes('action')) mapped.add('Ação');
  if (lowerAll.includes('adventure')) mapped.add('Aventura');
  if (lowerAll.includes('rpg')) mapped.add('RPG');
  if (lowerAll.includes('strategy') || lowerAll.includes('puzzle')) mapped.add('Estratégia');
  if (lowerAll.includes('racing') || lowerAll.includes('driving')) mapped.add('Corrida');
  if (lowerAll.includes('simulation') || lowerAll.includes('simulator')) mapped.add('Simulação');
  if (lowerAll.includes('horror')) mapped.add('Terror');
  if (lowerAll.includes('sport')) mapped.add('Esportes');
  if (lowerAll.includes('indie')) mapped.add('Indie');
  if (lowerAll.includes('shooter') || lowerAll.includes('fps')) mapped.add('FPS');

  if (mapped.size === 0) {
    mapped.add('Ação');
    mapped.add('Aventura');
  }
  return Array.from(mapped);
}

function detectMirrorHost(url: string): { hostName: string; label: string } {
  const lower = url.toLowerCase();
  if (lower.includes('megaup.net')) return { hostName: 'MegaUp', label: 'Mirror Direto: MegaUp' };
  if (lower.includes('pixeldrain.com')) return { hostName: 'PixelDrain', label: 'Mirror Direto: PixelDrain (Alta Velocidade)' };
  if (lower.includes('akirabox.')) return { hostName: 'Akirabox', label: 'Mirror Direto: Akirabox' };
  if (lower.includes('filekeeper.')) return { hostName: 'FileKeeper', label: 'Mirror Direto: FileKeeper' };
  if (lower.includes('gofile.io')) return { hostName: 'Gofile', label: 'Mirror Direto: Gofile (Sem Limites)' };
  if (lower.includes('buzzheavier.')) return { hostName: 'Buzzheavier', label: 'Mirror Direto: Buzzheavier' };
  if (lower.includes('datanodes.')) return { hostName: 'DataNodes', label: 'Mirror Direto: DataNodes' };
  if (lower.includes('mediafire.com')) return { hostName: 'MediaFire', label: 'Mirror Direto: MediaFire' };
  if (lower.includes('drive.google.com')) return { hostName: 'Google Drive', label: 'Mirror Direto: Google Drive' };
  if (lower.includes('1fichier.com')) return { hostName: '1Fichier', label: 'Mirror Direto: 1Fichier' };
  if (lower.includes('vikingfile')) return { hostName: 'VikingFile', label: 'Mirror Direto: VikingFile' };
  if (lower.includes('mega.nz')) return { hostName: 'MEGA', label: 'Mirror Direto: MEGA' };
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '');
    return { hostName: hostname, label: `Mirror Direto: ${hostname}` };
  } catch {
    return { hostName: '4FNet Mirror', label: 'Download Direto 4FNet' };
  }
}

export function parseFourFNetPost(post: FourFNetPostRaw): Game | null {
  const rawTitle = decodeFourFNetHtml(post.title?.rendered || '');
  if (!rawTitle) return null;

  const content = post.content?.rendered || '';
  const pubDate = post.date ? new Date(post.date) : new Date();

  // Extract version/edition tags from brackets before stripping [PC] / Download suffixes
  const bracketMatches = [...rawTitle.matchAll(/\[([^\]]+)\]/g)].map(m => m[1].trim());
  const versionTags = bracketMatches.filter(b => b.toUpperCase() !== 'PC');
  const versionStr = versionTags.length > 0 ? versionTags.join(' • ') : 'Completa [PC]';

  const cleanTitle = rawTitle
    .replace(/\[[^\]]*\]/g, '')
    .replace(/\bPC\s+Download\b/gi, '')
    .replace(/\bFree\s+Download\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim() || rawTitle;

  const baseSlug = (post.slug || cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')).slice(0, 75);
  const gameId = `4fnet-${baseSlug.slice(0, 40)}`;
  const gameSlug = `${baseSlug}-4fnet`;

  // Extract [vc_btn ...] shortcodes (Steam URL + direct mirrors + file size)
  const vcBtns = [...content.matchAll(/\[vc_btn\s+([^\]]+)\]/gi)];
  let steamAppId: string | null = null;
  let detectedSize = '';
  const extractedLinks: DownloadLink[] = [];
  const seenUrls = new Set<string>();

  vcBtns.forEach((btn, idx) => {
    const attrs = btn[1];
    const linkMatch = attrs.match(/link=(?:&#8221;|&#8243;|&quot;|")url:([^|"&]+)/i);
    if (!linkMatch) return;

    let decodedUrl = '';
    try {
      decodedUrl = decodeURIComponent(linkMatch[1]).trim();
    } catch {
      decodedUrl = linkMatch[1].trim();
    }
    if (!decodedUrl.startsWith('http')) return;

    const steamMatch = decodedUrl.match(/store\.steampowered\.com\/app\/(\d+)/i);
    if (steamMatch) {
      steamAppId = steamMatch[1];
      return;
    }

    const titleAttrMatch = attrs.match(/title=(?:&#8221;|&#8243;|&quot;|")([\s\S]*?)(?:&#8221;|&#8243;|&quot;|")/i);
    const titleRaw = titleAttrMatch ? decodeFourFNetHtml(titleAttrMatch[1]) : '';
    const sizeMatch = titleRaw.match(/([\d.,]+\s*(?:GB|MB))/i);
    const btnSize = sizeMatch ? sizeMatch[1].toUpperCase() : detectedSize || 'Download Direto';
    if (sizeMatch && !detectedSize) {
      detectedSize = sizeMatch[1].toUpperCase();
    }

    if (seenUrls.has(decodedUrl)) return;
    seenUrls.add(decodedUrl);

    const isTorrent = decodedUrl.startsWith('magnet:') || decodedUrl.toLowerCase().endsWith('.torrent');
    const { hostName, label } = detectMirrorHost(decodedUrl);

    extractedLinks.push({
      id: `dl-4fnet-${baseSlug}-${idx + 1}`,
      type: isTorrent ? 'magnet' : 'direct',
      format: isTorrent ? 'torrent' : 'direct',
      platform: 'PC',
      label: `${label} (${btnSize})`,
      url: decodedUrl,
      size: btnSize,
      hostName
    });
  });

  // Also scan any standard anchor links to known direct hosts if vc_btn matched nothing
  if (extractedLinks.length === 0) {
    const anchorMatches = [...content.matchAll(/href=["'](https?:\/\/[^"']+)["']/gi)];
    anchorMatches.forEach((m, idx) => {
      const url = m[1];
      const lower = url.toLowerCase();
      if (
        lower.includes('megaup.net') ||
        lower.includes('pixeldrain.com') ||
        lower.includes('akirabox.') ||
        lower.includes('filekeeper.') ||
        lower.includes('gofile.io') ||
        lower.includes('buzzheavier.') ||
        lower.includes('datanodes.')
      ) {
        if (!seenUrls.has(url)) {
          seenUrls.add(url);
          const { hostName, label } = detectMirrorHost(url);
          extractedLinks.push({
            id: `dl-4fnet-a-${baseSlug}-${idx}`,
            type: 'direct',
            format: 'direct',
            platform: 'PC',
            label,
            url,
            size: detectedSize || 'Download Direto',
            hostName
          });
        }
      }
    });
  }

  // Always keep reference to original 4FNet post as fallback if no direct mirror matched
  if (extractedLinks.length === 0 && post.link) {
    extractedLinks.push({
      id: `dl-4fnet-post-${baseSlug}`,
      type: 'direct',
      format: 'direct',
      platform: 'PC',
      label: 'Página Oficial 4FNet (Links Diretos)',
      url: post.link,
      size: detectedSize || 'PC',
      hostName: '4FNet.org'
    });
  }

  const repackSize = detectedSize || '5.0 GB';

  // Extract description from first [vc_column_text]...[/vc_column_text]
  const colTextMatch = content.match(/\[vc_column_text\]([\s\S]*?)\[\/vc_column_text\]/i);
  const rawDescription = colTextMatch
    ? colTextMatch[1]
        .replace(/<div class="td-post-box-wrapper">[\s\S]*?<\/div>\s*<\/div>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\[[^\]]+\]/g, ' ')
    : (post.excerpt?.rendered || '').replace(/<[^>]+>/g, ' ');
  const description = decodeFourFNetHtml(rawDescription) || `Versão completa de ${cleanTitle} disponibilizada pela coleção 4FNet com múltiplos mirrors de download direto.`;
  const shortDescription = description.length > 185 ? description.slice(0, 182) + '...' : description;

  // Extract System Requirements table
  let minOs = 'Windows 10 64-bit';
  let minCpu = 'Intel Core i5 / AMD Ryzen 3';
  let minRam = '8 GB RAM';
  let minGpu = 'NVIDIA GeForce GTX 960 / AMD Radeon R9 280';
  let minStorage = `${Math.max(2, Math.ceil((parseFloat(repackSize) || 5) * 1.5))} GB de espaço livre`;
  let langsText = '';

  const tableMatch = content.match(/<table[^>]*class=["'][^"']*infobox[^"']*["'][^>]*>([\s\S]*?)<\/table>/i);
  if (tableMatch) {
    const rows = [...tableMatch[1].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
    for (const r of rows) {
      const cells = [...r[1].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi)].map(c =>
        decodeFourFNetHtml(c[1].replace(/<[^>]+>/g, ' '))
      );
      if (cells.length >= 2) {
        const key = cells[0].toLowerCase();
        const val = cells[1];
        if (!val) continue;
        if (key.includes('os') || key.includes('system')) minOs = val;
        else if (key.includes('cpu') || key.includes('processor')) minCpu = val;
        else if (key.includes('memory') || key.includes('ram')) minRam = val;
        else if (key.includes('graphic') || key.includes('video') || key.includes('gpu')) minGpu = val;
        else if (key.includes('storage') || key.includes('disk') || key.includes('space')) minStorage = val;
        else if (key.includes('language')) langsText = val;
      }
    }
  }

  // Extract YouTube trailer ID
  const ytMatch = content.match(/(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  const trailerYoutubeId = ytMatch ? ytMatch[1] : undefined;

  // Images: 4FNet featured media + optional Steam wide header banner
  const wpCover = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
  const steamHeader = steamAppId
    ? `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${steamAppId}/header.jpg`
    : '';
  const coverUrl = wpCover || getGameCover({ title: cleanTitle });
  const bannerUrl = steamHeader || wpCover || getGameBanner({ title: cleanTitle, coverUrl });

  // Categories / Genres
  const termNames = (post._embedded?.['wp:term'] || [])
    .flat()
    .map(t => decodeFourFNetHtml(t.name || ''))
    .filter(n => n && n.toLowerCase() !== 'all games');
  const genres = mapFourFNetGenres(termNames);

  const hasPtBr = langsText.toLowerCase().includes('portuguese') || langsText.toLowerCase().includes('português');
  const categories = ['4FNet', 'Lançamentos'];
  if ((parseFloat(repackSize) || 10) <= 15) categories.push('Repacks Leves');

  return {
    id: gameId,
    title: cleanTitle.slice(0, 100),
    slug: gameSlug.slice(0, 100),
    coverUrl,
    bannerUrl,
    shortDescription,
    description,
    genres,
    categories,
    releaseYear: pubDate.getFullYear() || 2026,
    releaseDate: pubDate.toLocaleDateString('pt-BR'),
    developer: 'PC Release',
    publisher: '4FNet Archive',
    repackInfo: {
      repacker: '4FNet',
      version: versionStr.slice(0, 80),
      repackSize,
      originalSize: repackSize,
      crackStatus: rawTitle.toLowerCase().includes('gog') ? 'DRM Free' : 'Crackeado',
      crackGroup: rawTitle.toLowerCase().includes('gog') ? 'GOG' : 'Pre-Cracked / Scene'
    },
    downloadLinks: filterOutRiotPixels(extractedLinks),
    systemRequirements: {
      minimum: {
        os: minOs,
        processor: minCpu,
        memory: minRam,
        graphics: minGpu,
        storage: minStorage,
        directx: 'Versão 11'
      },
      recommended: {
        os: 'Windows 10/11 64-bit',
        processor: 'Intel Core i5-10400 / AMD Ryzen 5 3600',
        memory: '16 GB RAM',
        graphics: 'NVIDIA GeForce GTX 1660 / AMD Radeon RX 5600 XT',
        storage: minStorage,
        directx: 'Versão 12'
      }
    },
    rating: 0,
    imdbRating: getImdbRating({ title: cleanTitle }),
    totalVotes: 0,
    screenshots: Array.from(new Set([steamHeader, wpCover].filter(Boolean))).length > 0
      ? Array.from(new Set([steamHeader, wpCover].filter(Boolean)))
      : [coverUrl],
    trailerYoutubeId,
    tags: ['4FNet', 'Download Direto', ...genres.slice(0, 2)],
    downloadsCount: 0,
    viewsCount: 0,
    createdAt: pubDate.toISOString(),
    isFeatured: false,
    isTrending: false,
    hasPcTorrent: false,
    hasPtBrAudio: false,
    hasPtBrSubs: hasPtBr,
    platform: 'PC',
    sourceOrigin: '4FNet',
    originalTrackerUrl: post.link,
    languages: hasPtBr ? ['Português (Brasil)', 'Inglês'] : ['Inglês']
  };
}

export async function fetchFourFNetLivePosts(options?: {
  page?: number;
  perPage?: number;
  search?: string;
}): Promise<{ games: Game[]; totalPosts: number; totalPages: number }> {
  const page = options?.page || 1;
  const perPage = Math.min(50, Math.max(1, options?.perPage || 20));
  const search = (options?.search || '').trim();

  const qs = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
    _embed: '1'
  });
  if (search) qs.set('search', search);

  const directUrl = `${FOURFNET_API_BASE}?${qs.toString()}`;
  const proxyUrl = `/api/cron-sync?action=fetch-4fnet&page=${page}&per_page=${perPage}${search ? `&search=${encodeURIComponent(search)}` : ''}`;

  // Try direct CORS-enabled WP REST API first, fallback to server proxy
  for (const url of [directUrl, proxyUrl]) {
    try {
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!res.ok) continue;

      if (url === proxyUrl) {
        const json = await res.json();
        const posts: FourFNetPostRaw[] = Array.isArray(json.posts) ? json.posts : [];
        const games = posts.map(parseFourFNetPost).filter((g): g is Game => Boolean(g));
        return {
          games,
          totalPosts: Number(json.total || games.length),
          totalPages: Number(json.totalPages || 1)
        };
      }

      const totalPosts = Number(res.headers.get('X-WP-Total') || '0');
      const totalPages = Number(res.headers.get('X-WP-TotalPages') || '1');
      const posts: FourFNetPostRaw[] = await res.json();
      if (Array.isArray(posts)) {
        const games = posts.map(parseFourFNetPost).filter((g): g is Game => Boolean(g));
        return {
          games,
          totalPosts: totalPosts || games.length,
          totalPages: totalPages || 1
        };
      }
    } catch {
      // Try next endpoint
    }
  }

  return {
    games: getFourFNetPresetCatalog(),
    totalPosts: FOURFNET_PRESET_GAMES.length,
    totalPages: 1
  };
}
