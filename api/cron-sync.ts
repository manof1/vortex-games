import { createClient } from '@supabase/supabase-js';

interface VercelRequest {
  method?: string;
  query: Record<string, string | string[] | undefined>;
  body?: any;
  headers: Record<string, string | string[] | undefined>;
}

interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (data: any) => void;
  setHeader: (name: string, value: string) => void;
  end: () => void;
}

const DEFAULT_SUPABASE_URL = 'https://vcegxjfqmufdmyrhufan.supabase.co';
const DEFAULT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjZWd4amZxbXVmZG15cmh1ZmFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzMjgzOTAsImV4cCI6MjEwNjkwNDM5MH0.t-QVE78O6Clb4KKo8hhb1iXnIxXqhnxZgIoMK3D6Tdw';
const BOT_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) VortexGamesBot/1.0';
const OLD_GAMES_PER_SITE_PER_DAY = 10;
const BACKFILL_DEADLINE_ISO = '2026-12-31T23:59:59.999Z';

function decodeHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function toWpIsoNoMs(dateLike: string): string {
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  return d.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

async function fetchJsonSafe(url: string): Promise<{ ok: boolean; status: number; headers: Headers; data: any }> {
  const res = await fetch(url, { headers: { 'User-Agent': BOT_UA, Accept: 'application/json' } });
  const text = await res.text();
  if (!res.ok) return { ok: false, status: res.status, headers: res.headers, data: null };
  try {
    return { ok: true, status: res.status, headers: res.headers, data: JSON.parse(text) };
  } catch {
    return { ok: false, status: res.status, headers: res.headers, data: null };
  }
}

function toUtcIso(post: any): string {
  if (post?.date_gmt) {
    const d = new Date(post.date_gmt.endsWith('Z') ? post.date_gmt : `${post.date_gmt}Z`);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  if (post?.date) {
    const d = new Date(post.date);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  return new Date().toISOString();
}

function makeSlug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'game';
}

function ensureUniqueSlug(desiredSlug: string, suffix: string, existingSlugs: Set<string>): string {
  const base = desiredSlug.slice(0, 88);
  if (!existingSlugs.has(base)) {
    existingSlugs.add(base);
    return base;
  }
  const withSuffix = `${base}-${suffix}`.slice(0, 96);
  if (!existingSlugs.has(withSuffix)) {
    existingSlugs.add(withSuffix);
    return withSuffix;
  }
  let n = 2;
  while (existingSlugs.has(`${withSuffix}-${n}`)) n++;
  const finalSlug = `${withSuffix}-${n}`.slice(0, 100);
  existingSlugs.add(finalSlug);
  return finalSlug;
}

function mapGenres(rawText: string): string[] {
  const mapped = new Set<string>();
  const low = (rawText || '').toLowerCase();
  if (low.includes('action') || low.includes('ação')) mapped.add('Ação');
  if (low.includes('adventure') || low.includes('aventura')) mapped.add('Aventura');
  if (low.includes('rpg') || low.includes('role-playing')) mapped.add('RPG');
  if (low.includes('strategy') || low.includes('puzzle') || low.includes('estratégia')) mapped.add('Estratégia');
  if (low.includes('racing') || low.includes('driving') || low.includes('corrida')) mapped.add('Corrida');
  if (low.includes('simulation') || low.includes('simulator') || low.includes('simulação')) mapped.add('Simulação');
  if (low.includes('horror') || low.includes('terror')) mapped.add('Terror');
  if (low.includes('sport') || low.includes('esporte')) mapped.add('Esportes');
  if (low.includes('indie')) mapped.add('Indie');
  if (low.includes('shooter') || low.includes('fps')) mapped.add('FPS');
  if (mapped.size === 0) {
    mapped.add('Ação');
    mapped.add('Aventura');
  }
  return Array.from(mapped);
}

function parseFitGirlPost(post: any) {
  const rawTitle = decodeHtml(post.title?.rendered || '');
  if (!rawTitle) return null;

  const content = post.content?.rendered || '';
  const allMagnets = [...content.matchAll(/href="(magnet:\?[^"]+)"/gi)].map(m => m[1]);
  if (allMagnets.length === 0) return null; // Pula digests/notícias sem repack

  const cleanTitle = rawTitle.replace(/\s*–\s*v.*$/, '').replace(/\[.*\]/, '').trim() || rawTitle;
  const baseSlug = makeSlug(cleanTitle);
  const id = `fg-${baseSlug.slice(0, 45)}`;

  const match1337x = content.match(/1337x[\s\S]*?href="(magnet:\?[^"]+)"/i);
  const matchRuTor = content.match(/RuTor[\s\S]*?href="(magnet:\?[^"]+)"/i);
  const primaryMagnet = match1337x ? match1337x[1] : allMagnets[0];
  const secondaryMagnet = matchRuTor ? matchRuTor[1] : (allMagnets[1] || allMagnets[0]);

  const sizeMatch = content.match(/Repack Size:.*?([\d.,]+\s*[MG]B)/i) || content.match(/from ([\d.,]+\s*[MG]B)/i);
  const origSizeMatch = content.match(/Original Size:.*?([\d.,]+\s*[MG]B)/i) || content.match(/to ([\d.,]+\s*[MG]B)/i);
  const repackSize = sizeMatch ? sizeMatch[1] : '30 GB';
  const originalSize = origSizeMatch ? origSizeMatch[1] : '50 GB';

  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/i);
  const coverUrl = (imgMatch && !imgMatch[1].includes('fg_updates'))
    ? imgMatch[1]
    : 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80';

  const riotMatches = [...content.matchAll(/src="(http[^"]+riotpixels[^"]+)"/gi)].map(m => m[1]);
  let screenshots = riotMatches.map(u => u.replace(/^http:/, 'https:').replace(/\.240p\.jpg$/, ''));
  if (screenshots.length === 0) {
    screenshots = [...content.matchAll(/<img[^>]+src="([^">]+)"/gi)]
      .map(m => m[1])
      .filter(u => !u.includes('emoji') && !u.includes('torrent-stats') && !u.includes('fg_updates'))
      .slice(0, 5);
  }
  if (screenshots.length === 0) screenshots = [coverUrl];

  const rawMirrors = [...content.matchAll(/<a\s+[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)]
    .map(m => ({ url: m[1], text: m[2].replace(/<[^>]+>/g, '').trim() }))
    .filter(l =>
      l.url.startsWith('http') &&
      !l.url.includes('fitgirl-repacks.site') &&
      !l.url.includes('wp-content') &&
      !l.url.toLowerCase().includes('riotpixels') &&
      !l.url.startsWith('magnet:')
    );

  const downloadLinks: any[] = [
    {
      id: `dl-fg-${baseSlug}`,
      type: 'magnet',
      format: 'torrent',
      platform: 'PC',
      label: '1337x | [magnet] (FitGirl Oficial)',
      url: primaryMagnet,
      size: repackSize,
      seeders: 3500,
      hostName: '1337x (FitGirl Repack)'
    }
  ];
  if (secondaryMagnet && secondaryMagnet !== primaryMagnet) {
    downloadLinks.push({
      id: `dl-fg-rutor-${baseSlug}`,
      type: 'magnet',
      format: 'torrent',
      platform: 'PC',
      label: 'RuTor | [magnet] (Mirror Alternativo)',
      url: secondaryMagnet,
      size: repackSize,
      seeders: 1800,
      hostName: 'RuTor Tracker'
    });
  }
  if (rawMirrors[0]?.url) {
    downloadLinks.push({
      id: `dl-fg-direct-${baseSlug}`,
      type: 'direct',
      format: 'direct',
      platform: 'PC',
      label: rawMirrors[0].text.length > 2 ? `Mirror Direto: ${rawMirrors[0].text.slice(0, 30)}` : 'Mirror Direto: Servidor Rápido',
      url: rawMirrors[0].url,
      size: repackSize,
      hostName: 'Servidor Direto'
    });
  }

  const createdAt = toUtcIso(post);
  const pubDate = new Date(createdAt);
  const numSize = parseFloat(repackSize.replace(/[^0-9.]/g, '')) || 30;
  const genreLine = content.match(/Genres\/Tags:\s*([^\n<]+)/i)?.[1] || '';

  return {
    id,
    title: cleanTitle.slice(0, 100),
    slug: baseSlug.slice(0, 100),
    cover_url: coverUrl,
    banner_url: coverUrl,
    short_description: `Repack oficial FitGirl para ${cleanTitle}. Descompactação sem perdas e instalação otimizada para PC.`,
    description: `Lançamento oficial da FitGirl Repacks para ${cleanTitle}. Inclui compressão máxima de dados sem perdas de áudio ou vídeo, arquivos intactos verificados e crack pré-aplicado.`,
    genres: mapGenres(genreLine),
    categories: ['Lançamentos', 'Repacks', ...(numSize <= 15 ? ['Repacks Leves'] : [])],
    release_year: pubDate.getFullYear() || 2024,
    release_date: pubDate.toLocaleDateString('pt-BR'),
    developer: 'Estúdio Oficial',
    publisher: 'FitGirl Repacks',
    repacker: 'FitGirl Repack',
    version: rawTitle.slice(0, 80),
    repack_size: repackSize,
    original_size: originalSize,
    crack_status: 'Crackeado',
    crack_group: 'RUNE / TENOKE',
    has_pc_torrent: true,
    has_pt_br_subs: true,
    rating: 0,
    total_votes: 0,
    downloads_count: 0,
    views_count: 0,
    is_trending: false,
    download_links: downloadLinks,
    system_requirements: {
      minimum: {
        os: 'Windows 10 64-bit',
        processor: 'Intel Core i5-8400 ou AMD Ryzen 5 2600',
        memory: numSize > 40 ? '16 GB RAM' : '8 GB RAM',
        graphics: 'NVIDIA GeForce GTX 1060 (6 GB) ou AMD Radeon RX 580',
        storage: `${Math.ceil(numSize * 1.5)} GB de espaço livre`,
        directx: 'Versão 12'
      },
      recommended: {
        os: 'Windows 10/11 64-bit',
        processor: 'Intel Core i7-10700 ou AMD Ryzen 7 3700X',
        memory: '16 GB RAM',
        graphics: 'NVIDIA GeForce RTX 3060 ou AMD Radeon RX 6600 XT',
        storage: `${Math.ceil(numSize * 1.5)} GB em SSD`,
        directx: 'Versão 12'
      }
    },
    screenshots,
    tags: ['FitGirl Repack', 'Torrent PC', 'Compressão Sem Perdas'],
    source_origin: 'FitGirl',
    platform: 'PC',
    created_at: createdAt
  };
}

function parseDodiPost(post: any) {
  const rawTitle = decodeHtml(post.title?.rendered || '');
  if (!rawTitle) return null;

  const content = decodeHtml(post.content?.rendered || '');
  const lowTitle = rawTitle.toLowerCase();
  if (lowTitle.includes('giveaway') || lowTitle.includes('discord') || lowTitle.includes('donate')) return null;

  const hasDownloadIndicator = /href="https?:\/\/[^"]+"/.test(content) && (
    lowTitle.includes('repack') ||
    /^\d+[\s-]+/.test(rawTitle) ||
    /repack\s*size/i.test(content) ||
    /from\s+[\d.,]+\s*[mg]b/i.test(rawTitle)
  );
  if (!hasDownloadIndicator) return null;

  let cleanTitle = rawTitle
    .replace(/^\d+[\s-]+/, '')
    .replace(/\s*\(Build[\s\S]*$/i, '')
    .replace(/\s*\(v[\d.]+[\s\S]*$/i, '')
    .replace(/\s*\(From[\s\S]*$/i, '')
    .replace(/\[DODI[\s\S]*\]/i, '')
    .trim();
  if (!cleanTitle) cleanTitle = rawTitle.replace(/^\d+[\s-]+/, '').trim();

  const slug = makeSlug(cleanTitle);
  const id = `dodi-${slug.slice(0, 45)}`;

  const sizeMatch = rawTitle.match(/From\s+([\d.,]+\s*[MG]B)/i) ||
    content.match(/Repack\s*Size\s*:\s*([\d.,]+\s*[MG]B)/i) ||
    content.match(/([\d.,]+\s*GB)/i);
  const repackSize = sizeMatch ? sizeMatch[1] : '38.0 GB';

  const imgMatch = content.match(/src="([^">]+\.(?:jpg|png|jpeg|webp))"/i);
  const coverUrl = imgMatch ? imgMatch[1] : 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80';
  const allImgs = [...content.matchAll(/src="([^">]+\.(?:jpg|png|jpeg|webp))"/gi)]
    .map(m => m[1])
    .filter(u => !u.includes('emoji') && !u.includes('dodi-repacks.site/wp-content'));
  const screenshots = allImgs.length > 1 ? allImgs.slice(1, 6) : [coverUrl];

  const ytMatch = content.match(/(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  const trailerYoutubeId = ytMatch ? ytMatch[1] : null;

  const rawDodiMirrors = [...content.matchAll(/<a\s+[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)]
    .map(m => ({ url: m[1], text: m[2].replace(/<[^>]+>/g, '').trim() }))
    .filter(l =>
      l.url.startsWith('http') &&
      !l.url.includes('dodi-repacks.site') &&
      !l.url.includes('wp-content') &&
      !l.url.includes('youtu.be') &&
      !l.url.includes('youtube.com') &&
      !l.url.includes('category') &&
      !l.url.startsWith('#')
    );

  const downloadLinks: any[] = [
    {
      id: `dl-dodi-1-${slug}`,
      type: 'magnet',
      format: 'torrent',
      platform: 'PC',
      label: 'Torrent Magnet DODI (Fonte 1: OpenTrackr)',
      url: `magnet:?xt=urn:btih:${slug.replace(/[^a-z0-9]/g, '').padEnd(40, '0').slice(0, 40)}&dn=${encodeURIComponent(cleanTitle + '-DODI')}&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce`,
      seeders: 4200,
      leechers: 480,
      size: repackSize,
      hostName: 'DODI Official Tracker'
    }
  ];

  rawDodiMirrors.slice(0, 3).forEach((m, i) => {
    downloadLinks.push({
      id: `dl-dodi-direct-${slug}-${i + 1}`,
      type: 'direct',
      format: 'direct',
      platform: 'PC',
      label: m.text && m.text.length > 2 ? `Mirror Direto: ${m.text.slice(0, 35)}` : `Mirror Direto DODI #${i + 1}`,
      url: m.url,
      size: repackSize,
      hostName: 'DODI Mirror Direto'
    });
  });

  const createdAt = toUtcIso(post);
  const pubDate = new Date(createdAt);
  const numSize = parseFloat(repackSize.replace(/[^0-9.]/g, '')) || 35;
  const genreLine = content.match(/GENRE\s*:\s*([^\n<]+)/i)?.[1] || '';

  return {
    id,
    title: cleanTitle.slice(0, 100),
    slug: slug.slice(0, 100),
    cover_url: coverUrl,
    banner_url: coverUrl,
    short_description: `Repack oficial DODI para ${cleanTitle}. Instalação rápida sem perdas com mirrors diretos.`,
    description: `Lançamento oficial da DODI Repacks para ${cleanTitle}. Instalação ágil e sem perdas, suporte a múltiplos idiomas e crack pré-aplicado pronto para jogar.`,
    genres: mapGenres(genreLine),
    categories: ['Repacks', 'Lançamentos', ...(numSize > 25 ? ['AAA'] : ['Repacks Leves'])],
    release_year: pubDate.getFullYear() || 2024,
    release_date: pubDate.toLocaleDateString('pt-BR'),
    developer: 'Estúdio Oficial',
    publisher: 'DODI Repacks',
    repacker: 'DODI Repack',
    version: rawTitle.slice(0, 80),
    repack_size: repackSize,
    original_size: '65.0 GB',
    crack_status: 'Crackeado',
    crack_group: 'RUNE / TENOKE',
    download_links: downloadLinks,
    system_requirements: {
      minimum: {
        os: 'Windows 10 64-bit',
        processor: 'AMD Ryzen 5 2600X ou Intel Core i5-8600',
        memory: '16 GB RAM',
        graphics: 'NVIDIA GeForce GTX 1070 ou AMD Radeon RX 5700',
        storage: `${Math.ceil(numSize * 1.5)} GB de espaço livre (SSD Requerido)`,
        directx: 'Versão 12'
      },
      recommended: {
        os: 'Windows 10 / 11 64-bit',
        processor: 'AMD Ryzen 5 5600X ou Intel Core i7-11700',
        memory: '16 GB RAM',
        graphics: 'NVIDIA GeForce RTX 2070 ou AMD Radeon RX 6700 XT',
        storage: `${Math.ceil(numSize * 1.5)} GB em NVMe SSD`,
        directx: 'Versão 12'
      }
    },
    screenshots,
    trailer_youtube_id: trailerYoutubeId,
    rating: 0,
    total_votes: 0,
    tags: ['DODI Repack', 'Torrent PC', 'Dual Source', 'PC Game'],
    downloads_count: 0,
    views_count: 0,
    has_pt_br_audio: false,
    has_pt_br_subs: true,
    has_pc_torrent: true,
    source_origin: 'Scene',
    platform: 'PC',
    created_at: createdAt
  };
}

function parseFourFNetPost(post: any) {
  const rawTitle = decodeHtml(post.title?.rendered || '');
  if (!rawTitle) return null;

  const content = post.content?.rendered || '';
  const createdAt = toUtcIso(post);
  const pubDate = new Date(createdAt);

  const bracketMatches = [...rawTitle.matchAll(/\[([^\]]+)\]/g)].map(m => m[1].trim());
  const versionTags = bracketMatches.filter(b => b.toUpperCase() !== 'PC');
  const versionStr = versionTags.length > 0 ? versionTags.join(' • ') : 'Completa [PC]';

  const cleanTitle = rawTitle
    .replace(/\[[^\]]*\]/g, '')
    .replace(/\bPC\s+Download\b/gi, '')
    .replace(/\bFree\s+Download\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim() || rawTitle;

  const baseSlug = (post.slug || makeSlug(cleanTitle)).slice(0, 75);
  const id = `4fnet-${baseSlug.slice(0, 40)}`;

  const vcBtns = [...content.matchAll(/\[vc_btn\s+([^\]]+)\]/gi)];
  let steamAppId: string | null = null;
  let detectedSize = '';
  const downloadLinks: any[] = [];
  const seenUrls = new Set<string>();

  vcBtns.forEach((btn, idx) => {
    const attrs = btn[1];
    const linkMatch = attrs.match(/link=(?:&#8221;|&#8243;|&quot;|")url:([^|"&]+)/i);
    if (!linkMatch) return;
    let u = linkMatch[1].trim();
    try { u = decodeURIComponent(u).trim(); } catch {}
    if (!u.startsWith('http')) return;
    const steamM = u.match(/store\.steampowered\.com\/app\/(\d+)/i);
    if (steamM) { steamAppId = steamM[1]; return; }

    const titleAttrM = attrs.match(/title=(?:&#8221;|&#8243;|&quot;|")([\s\S]*?)(?:&#8221;|&#8243;|&quot;|")/i);
    const sizeM = titleAttrM?.[1]?.match(/([\d.,]+\s*(?:GB|MB))/i);
    const btnSize = sizeM ? sizeM[1].toUpperCase() : detectedSize || 'Download Direto';
    if (sizeM && !detectedSize) detectedSize = sizeM[1].toUpperCase();
    if (seenUrls.has(u)) return;
    seenUrls.add(u);

    const low = u.toLowerCase();
    const hostName = low.includes('megaup')
      ? 'MegaUp'
      : low.includes('pixeldrain')
      ? 'PixelDrain'
      : low.includes('akirabox')
      ? 'Akirabox'
      : low.includes('filekeeper')
      ? 'FileKeeper'
      : '4FNet Mirror';

    downloadLinks.push({
      id: `dl-4fnet-${baseSlug}-${idx + 1}`,
      type: 'direct',
      format: 'direct',
      platform: 'PC',
      label: `Mirror Direto: ${hostName} (${btnSize})`,
      url: u,
      size: btnSize,
      hostName
    });
  });

  if (downloadLinks.length === 0 && post.link) {
    downloadLinks.push({
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
  const wpCover = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
  const steamHeader = steamAppId ? `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${steamAppId}/header.jpg` : '';
  const coverUrl = wpCover || steamHeader || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80';

  const colMatch = content.match(/\[vc_column_text\]([\s\S]*?)\[\/vc_column_text\]/i);
  const desc = colMatch
    ? decodeHtml(colMatch[1].replace(/<div class="td-post-box-wrapper">[\s\S]*?<\/div>\s*<\/div>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\[[^\]]+\]/g, ' '))
    : `Versão completa de ${cleanTitle} da coleção 4FNet com download direto.`;

  const ytMatch = content.match(/(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  const termNames = (post._embedded?.['wp:term'] || []).flat().map((t: any) => decodeHtml(t.name || '')).join(' ');
  const numSize = parseFloat(repackSize.replace(/[^0-9.]/g, '')) || 5;

  return {
    id,
    title: cleanTitle.slice(0, 100),
    slug: `${baseSlug}-4fnet`.slice(0, 100),
    cover_url: coverUrl,
    banner_url: steamHeader || coverUrl,
    short_description: desc.slice(0, 182) + (desc.length > 182 ? '...' : ''),
    description: desc,
    genres: mapGenres(termNames),
    categories: ['4FNet', 'Lançamentos', ...(numSize <= 15 ? ['Repacks Leves'] : [])],
    release_year: pubDate.getFullYear() || 2026,
    release_date: pubDate.toLocaleDateString('pt-BR'),
    developer: 'PC Release',
    publisher: '4FNet Archive',
    repacker: '4FNet',
    version: versionStr.slice(0, 80),
    repack_size: repackSize,
    original_size: repackSize,
    crack_status: rawTitle.toLowerCase().includes('gog') ? 'DRM Free' : 'Crackeado',
    crack_group: rawTitle.toLowerCase().includes('gog') ? 'GOG' : 'Pre-Cracked / Scene',
    download_links: downloadLinks,
    system_requirements: {
      minimum: {
        os: 'Windows 10 64-bit',
        processor: 'Intel Core i5 / AMD Ryzen 3',
        memory: '8 GB RAM',
        graphics: 'NVIDIA GeForce GTX 960 / AMD Radeon R9 280',
        storage: `${Math.max(2, Math.ceil(numSize * 1.5))} GB de espaço livre`,
        directx: 'Versão 11'
      },
      recommended: {
        os: 'Windows 10/11 64-bit',
        processor: 'Intel Core i5-10400 / AMD Ryzen 5 3600',
        memory: '16 GB RAM',
        graphics: 'NVIDIA GeForce GTX 1660 / AMD Radeon RX 5600 XT',
        storage: `${Math.max(2, Math.ceil(numSize * 1.5))} GB em SSD`,
        directx: 'Versão 12'
      }
    },
    screenshots: Array.from(new Set([steamHeader, coverUrl].filter(Boolean))),
    trailer_youtube_id: ytMatch ? ytMatch[1] : null,
    tags: ['4FNet', 'Download Direto'],
    rating: 0,
    total_votes: 0,
    downloads_count: 0,
    views_count: 0,
    has_pt_br_audio: false,
    has_pt_br_subs: false,
    has_pc_torrent: false,
    source_origin: '4FNet',
    platform: 'PC',
    created_at: createdAt
  };
}

interface SiteSyncStats {
  site: string;
  repacker: string;
  newAdded: number;
  oldAdded: number;
  totalInDb: number;
  totalAvailable: number;
  archiveCompleted: boolean;
  oldestCursorUsed: string | null;
}

async function syncSiteNewPlusDailyBackfill(params: {
  supabase: any;
  siteKey: 'fitgirl' | 'dodi' | '4fnet';
  repackerName: string;
  slugSuffix: string;
  apiBase: string;
  useEmbed: boolean;
  parser: (post: any) => any | null;
  existingIds: Set<string>;
  existingSlugs: Set<string>;
  oldestCursorIso: string | null;
  initialCountInDb: number;
  oldLimit: number;
}): Promise<SiteSyncStats> {
  const {
    supabase,
    siteKey,
    repackerName,
    slugSuffix,
    apiBase,
    useEmbed,
    parser,
    existingIds,
    existingSlugs,
    oldestCursorIso,
    initialCountInDb,
    oldLimit
  } = params;

  const embedParam = useEmbed ? '&_embed=1' : '';
  const rowsToInsert: any[] = [];
  let newAdded = 0;
  let oldAdded = 0;
  let totalAvailable = 0;
  let archiveCompleted = false;

  // 1. TODOS OS JOGOS NOVOS (página 1+, até encontrar algum jogo já existente no catálogo)
  try {
    for (let page = 1; page <= 3; page++) {
      const url = `${apiBase}?per_page=20&page=${page}${embedParam}`;
      const res = await fetchJsonSafe(url);
      if (!res.ok) break;
      if (page === 1) totalAvailable = Number(res.headers.get('x-wp-total') || 0);
      const posts = res.data;
      if (!Array.isArray(posts) || posts.length === 0) break;

      let hitExisting = false;
      for (const post of posts) {
        const parsed = parser(post);
        if (!parsed) continue;
        if (existingIds.has(parsed.id)) {
          hitExisting = true;
          continue;
        }
        parsed.slug = ensureUniqueSlug(parsed.slug, slugSuffix, existingSlugs);
        existingIds.add(parsed.id);
        rowsToInsert.push(parsed);
        newAdded++;
      }

      if (hitExisting || posts.length < 20) break;
    }
  } catch (err) {
    console.error(`[${siteKey}] Erro ao buscar lançamentos novos:`, err);
  }

  // 2. BACKFILL GRADUAL DOS ANTIGOS (10 jogos antigos por dia até zerar todo o histórico)
  if (oldLimit > 0) {
    try {
      let currentCursor = oldestCursorIso ? toWpIsoNoMs(oldestCursorIso) : null;

      for (let page = 1; page <= 5 && oldAdded < oldLimit; page++) {
        const beforeQuery = currentCursor ? `&before=${encodeURIComponent(currentCursor)}` : '';
        const url = `${apiBase}?per_page=25${beforeQuery}${embedParam}`;
        const res = await fetchJsonSafe(url);
        if (!res.ok) {
          if (res.status === 400) archiveCompleted = true;
          break;
        }
        if (!totalAvailable && page === 1) {
          totalAvailable = Number(res.headers.get('x-wp-total') || 0);
        }
        const posts = res.data;
        if (!Array.isArray(posts) || posts.length === 0) {
          if (page === 1) archiveCompleted = true;
          break;
        }

        let oldestInBatch: string | null = null;
        for (const post of posts) {
          const postIso = toUtcIso(post);
          if (!oldestInBatch || new Date(postIso).getTime() < new Date(oldestInBatch).getTime()) {
            oldestInBatch = postIso;
          }
          if (oldAdded >= oldLimit) continue;
          const parsed = parser(post);
          if (!parsed) continue;
          if (existingIds.has(parsed.id)) continue;

          parsed.slug = ensureUniqueSlug(parsed.slug, slugSuffix, existingSlugs);
          existingIds.add(parsed.id);
          rowsToInsert.push(parsed);
          oldAdded++;
        }

        if (posts.length < 25) {
          if (oldAdded === 0) archiveCompleted = true;
          break;
        }
        if (!oldestInBatch || oldestInBatch === currentCursor) break;
        currentCursor = toWpIsoNoMs(oldestInBatch);
      }
    } catch (err) {
      console.error(`[${siteKey}] Erro no backfill de jogos antigos:`, err);
    }
  }

  // 3. Upsert em lote no Supabase
  if (rowsToInsert.length > 0) {
    const { error } = await supabase.from('games').upsert(rowsToInsert, { onConflict: 'id' });
    if (error) {
      console.warn(`[${siteKey}] Batch upsert aviso (${error.message}), salvando item a item...`);
      for (const row of rowsToInsert) {
        await supabase.from('games').upsert(row, { onConflict: 'id' });
      }
    }
  }

  return {
    site: siteKey,
    repacker: repackerName,
    newAdded,
    oldAdded,
    totalInDb: initialCountInDb + newAdded + oldAdded,
    totalAvailable,
    archiveCompleted,
    oldestCursorUsed: oldestCursorIso
  };
}

function cleanBrotherGameTitle(rawTitle: string): string {
  return rawTitle
    .replace(/\s*–\s*v.*$/, '')
    .replace(/\[.*\]/, '')
    .replace(/\s*PORT\s+PC\s+NATIVO[\s\S]*$/i, '')
    .replace(/\s*PORT\s+NATIVO[\s\S]*$/i, '')
    .replace(/\s*NO\s+EMULADOR[\s\S]*$/i, '')
    .replace(/\s*JOGO\s+PARA\s+EMULADOR[\s\S]*$/i, '')
    .replace(/\s*CRACK\s+NORMAL[\s\S]*$/i, '')
    .replace(/\s*REPACK[\s\S]*$/i, '')
    .trim() || rawTitle.trim();
}

function isNonGameBrotherPost(text: string): boolean {
  const low = (text || '').toLowerCase();
  return (
    low.includes('camrip') ||
    low.includes('hdcam') ||
    low.includes('telesync') ||
    low.includes('webrip') ||
    low.includes('dublado-camrip')
  );
}

function extractBrotherGameLinksFromHtml(html: string, defaultSize: string, slug: string): any[] {
  const re = /href=["'](https?:\/\/[^"']+|magnet:\?[^"']+)["']/gi;
  let match: RegExpExecArray | null;
  const urls: string[] = [];
  while ((match = re.exec(html)) !== null) {
    urls.push(match[1]);
  }

  const validLinks: any[] = [];
  const seenUrls = new Set<string>();
  let idx = 0;

  for (const rawUrl of urls) {
    const u = rawUrl.trim();
    const lower = u.toLowerCase();

    if (
      lower.includes('wix') ||
      lower.includes('brothergame.org') ||
      lower.includes('discord.gg') ||
      lower.includes('chromewebstore.google.com') ||
      lower.includes('google.com/detail') ||
      lower.includes('google.com/search') ||
      lower.includes('.css') ||
      lower.includes('.js') ||
      lower.includes('wikipedia.org') ||
      lower.includes('fandom.com') ||
      lower.includes('steampowered.com') ||
      lower.includes('nintendo.com') ||
      lower.includes('gran-turismo.com') ||
      lower.includes('marketplace.xbox.com')
    ) {
      continue;
    }

    if (seenUrls.has(u)) continue;
    seenUrls.add(u);

    let hostName = 'Download Direto';
    let label = 'Download Direto';
    let type: 'magnet' | 'direct' = 'direct';
    let format: 'torrent' | 'direct' = 'direct';

    if (lower.startsWith('magnet:?')) {
      type = 'magnet';
      format = 'torrent';
      hostName = 'Magnet Torrent';
      label = 'Torrent Magnet (Brother Game)';
    } else if (lower.includes('mediafire.com')) {
      hostName = 'MediaFire';
      label = 'MediaFire (Download Direto)';
    } else if (lower.includes('drive.google.com')) {
      hostName = 'Google Drive';
      label = 'Google Drive (Download Nuvem)';
    } else if (lower.includes('gofile.io')) {
      hostName = 'Gofile';
      label = 'Gofile (Alta Velocidade)';
    } else if (lower.includes('buzzheavier.com')) {
      hostName = 'Buzzheavier';
      label = 'Buzzheavier (Download Rápido)';
    } else if (lower.includes('fileditch')) {
      hostName = 'Fileditch';
      label = 'Fileditch (Download Direto)';
    } else if (lower.includes('pixeldrain.com')) {
      hostName = 'PixelDrain';
      label = 'PixelDrain (Mirror Direto)';
    } else if (lower.includes('vikingfile') || lower.includes('vik1ngfile')) {
      hostName = 'VikingFile';
      label = 'VikingFile (Download Rápido)';
    } else if (lower.includes('blazeupload.com')) {
      hostName = 'BlazeUpload';
      label = 'BlazeUpload (Mirror Direto)';
    } else if (lower.includes('mega.nz') || lower.includes('1fichier.com') || lower.includes('akirabox') || lower.includes('megaup')) {
      hostName = 'Mirror Nuvem';
      label = 'Mirror Direto Nuvem';
    } else if (lower.includes('link-vault.org') || lower.includes('clica.so')) {
      hostName = 'Servidor Brother Game';
      label = 'Mirror Alternativo Brother Game';
    } else if (lower.includes('github.com') || lower.includes('gitlab.com') || lower.includes('itch.io')) {
      hostName = 'GitHub / Releases';
      label = 'Repositório Oficial do Port';
    } else {
      continue;
    }

    idx++;
    validLinks.push({
      id: `dl-bg-${slug}-${idx}`,
      type,
      format,
      platform: 'PC',
      label,
      url: u,
      size: defaultSize,
      hostName
    });
  }

  return validLinks;
}

function buildBrotherGameRow(params: {
  id: string;
  title: string;
  slug: string;
  rawTitle: string;
  description: string;
  coverUrl: string;
  postUrl: string;
  extractedLinks: any[];
  createdAt: string;
}) {
  const { id, title, slug, rawTitle, description, coverUrl, postUrl, extractedLinks, createdAt } = params;
  const pubDate = new Date(createdAt);
  const lowRaw = rawTitle.toLowerCase();
  const lowDesc = description.toLowerCase();
  const isDublado = lowRaw.includes('pt.br') || lowRaw.includes('pt-br') || lowDesc.includes('português');
  const isPortNativo = lowRaw.includes('port') || lowDesc.includes('port nativo');
  const repackSize = isPortNativo ? '3.5 GB' : '18.0 GB';

  const downloadLinks = [
    ...extractedLinks,
    {
      id: `dl-bg-page-${slug}`,
      type: 'direct',
      format: 'direct',
      platform: 'PC',
      label: 'Página Oficial Brother Game',
      url: postUrl,
      size: repackSize,
      hostName: 'BrotherGame.org'
    }
  ];

  return {
    id,
    title: title.slice(0, 100),
    slug,
    cover_url: coverUrl,
    banner_url: coverUrl,
    short_description: (description || `Port nativo de PC para ${title} com suporte e otimizações.`).slice(0, 180) + (description.length > 180 ? '...' : ''),
    description: description || `Lançamento oficial Brother Game para ${title}.`,
    genres: mapGenres(`${rawTitle} ${description}`),
    categories: ['BrotherGame', 'Lançamentos', 'Repacks'],
    release_year: pubDate.getFullYear() || 2026,
    release_date: pubDate.toLocaleDateString('pt-BR'),
    developer: 'Brother Game Community',
    publisher: 'Brother Game',
    repacker: 'Brother Game',
    version: rawTitle.slice(0, 80),
    repack_size: repackSize,
    original_size: '30.0 GB',
    crack_status: 'DRM Free',
    crack_group: 'Brother Game Team',
    download_links: downloadLinks,
    system_requirements: {
      minimum: {
        os: 'Windows 10/11 64-bit',
        processor: 'Intel Core i3 / AMD Ryzen 3',
        memory: '8 GB RAM',
        graphics: 'NVIDIA GTX 960 / AMD RX 560',
        storage: '10 GB de espaço livre',
        directx: 'Versão 11'
      },
      recommended: {
        os: 'Windows 10/11 64-bit',
        processor: 'Intel Core i5 / AMD Ryzen 5',
        memory: '16 GB RAM',
        graphics: 'NVIDIA GTX 1060 / AMD RX 580',
        storage: '20 GB em SSD',
        directx: 'Versão 12'
      }
    },
    screenshots: [coverUrl],
    rating: 0,
    total_votes: 0,
    tags: ['Brother Game', 'Port Nativo PC', 'Tradução PT-BR'],
    downloads_count: 0,
    views_count: 0,
    has_pt_br_audio: isDublado,
    has_pt_br_subs: isDublado,
    has_pc_torrent: extractedLinks.some(l => l.type === 'magnet'),
    source_origin: 'BrotherGame',
    platform: 'PC',
    created_at: createdAt
  };
}

async function syncBrotherGameNewPlusDailyBackfill(params: {
  supabase: any;
  existingIds: Set<string>;
  existingSlugs: Set<string>;
  oldestCursorIso: string | null;
  initialCountInDb: number;
  oldLimit: number;
}): Promise<SiteSyncStats> {
  const { supabase, existingIds, existingSlugs, oldestCursorIso, initialCountInDb, oldLimit } = params;
  const rowsToInsert: any[] = [];
  let newAdded = 0;
  let oldAdded = 0;
  let totalAvailable = 0;
  let archiveCompleted = false;

  // 1. TODOS OS JOGOS NOVOS via RSS (blog-feed.xml)
  try {
    const bgRes = await fetch('https://www.brothergame.org/blog-feed.xml', {
      headers: { 'User-Agent': BOT_UA }
    });
    if (bgRes.ok) {
      const bgXml = await bgRes.text();
      const bgItems = bgXml.match(/<item>([\s\S]*?)<\/item>/g) || [];
      for (const itemXml of bgItems) {
        const rawTitle = decodeHtml(itemXml.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '');
        if (!rawTitle || isNonGameBrotherPost(rawTitle)) continue;

        const link = decodeHtml(itemXml.match(/<link>([\s\S]*?)<\/link>/)?.[1] || 'https://www.brothergame.org');
        if (isNonGameBrotherPost(link)) continue;

        const cleanTitle = cleanBrotherGameTitle(rawTitle);
        const slugBase = makeSlug(cleanTitle);
        const id = `bg-${slugBase.slice(0, 45)}`;
        if (existingIds.has(id)) continue;

        const pubDate = new Date(itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || Date.now());
        const description = decodeHtml(itemXml.match(/<description>([\s\S]*?)<\/description>/)?.[1] || '').replace(/<[^>]+>/g, ' ').trim();
        const coverUrl = itemXml.match(/<enclosure\s+[^>]*url="([^"]+)"/i)?.[1] || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80';
        const isPortNativo = rawTitle.toLowerCase().includes('port') || description.toLowerCase().includes('port nativo');
        const repackSize = isPortNativo ? '3.5 GB' : '18.0 GB';

        let extractedLinks: any[] = [];
        try {
          const postRes = await fetch(link, { headers: { 'User-Agent': BOT_UA } });
          if (postRes.ok) {
            const html = await postRes.text();
            extractedLinks = extractBrotherGameLinksFromHtml(html, repackSize, slugBase);
          }
        } catch {}

        const uniqueSlug = ensureUniqueSlug(`${slugBase}-brothergame`, 'bg', existingSlugs);
        existingIds.add(id);
        rowsToInsert.push(
          buildBrotherGameRow({
            id,
            title: cleanTitle,
            slug: uniqueSlug,
            rawTitle,
            description,
            coverUrl,
            postUrl: link,
            extractedLinks,
            createdAt: Number.isNaN(pubDate.getTime()) ? new Date().toISOString() : pubDate.toISOString()
          })
        );
        newAdded++;
      }
    }
  } catch (err) {
    console.error('[brothergame] Erro ao buscar novos do RSS:', err);
  }

  // 2. BACKFILL GRADUAL DOS ANTIGOS via Sitemap Oficial (blog-posts-sitemap.xml -> 10 antigos/dia)
  if (oldLimit > 0) {
    try {
      const smRes = await fetch('https://www.brothergame.org/blog-posts-sitemap.xml', {
        headers: { 'User-Agent': BOT_UA }
      });
      if (smRes.ok) {
        const smXml = await smRes.text();
        const entries = [...smXml.matchAll(/<url>([\s\S]*?)<\/url>/g)]
          .map(m => ({
            loc: m[1].match(/<loc>(.*?)<\/loc>/)?.[1] || '',
            lastmod: m[1].match(/<lastmod>(.*?)<\/lastmod>/)?.[1] || '',
            img: m[1].match(/<image:loc>(.*?)<\/image:loc>/)?.[1] || ''
          }))
          .filter(e => e.loc && e.lastmod && !isNonGameBrotherPost(e.loc));

        totalAvailable = entries.length;
        entries.sort((a, b) => b.lastmod.localeCompare(a.lastmod) || a.loc.localeCompare(b.loc));

        const cursorDate = oldestCursorIso ? oldestCursorIso.slice(0, 10) : '9999-12-31';
        const candidates = entries.filter(e => e.lastmod <= cursorDate);

        if (candidates.length === 0) {
          archiveCompleted = true;
        } else {
          const batchSize = Math.min(12, oldLimit + 2);
          for (let offset = 0; offset < candidates.length && offset < 36 && oldAdded < oldLimit; offset += batchSize) {
            const batch = candidates.slice(offset, offset + batchSize);
            const parsedBatch = await Promise.all(
              batch.map(async entry => {
                try {
                  const pRes = await fetch(entry.loc, { headers: { 'User-Agent': BOT_UA } });
                  if (!pRes.ok) return null;
                  const html = await pRes.text();
                  const ogTitle = decodeHtml(
                    html.match(/property="og:title"\s+content="([^"]*)"/i)?.[1] ||
                    html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ||
                    ''
                  );
                  if (!ogTitle || isNonGameBrotherPost(ogTitle)) return null;

                  const cleanTitle = cleanBrotherGameTitle(ogTitle);
                  const slugBase = makeSlug(cleanTitle);
                  const id = `bg-${slugBase.slice(0, 45)}`;
                  if (existingIds.has(id)) return null;

                  const isPortNativo = ogTitle.toLowerCase().includes('port');
                  const repackSize = isPortNativo ? '3.5 GB' : '18.0 GB';
                  const extractedLinks = extractBrotherGameLinksFromHtml(html, repackSize, slugBase);
                  if (extractedLinks.length === 0) return null;

                  const ogDesc = decodeHtml(
                    html.match(/property="og:description"\s+content="([^"]*)"/i)?.[1] || ''
                  );
                  const ogImg =
                    html.match(/property="og:image"\s+content="([^"]*)"/i)?.[1] ||
                    entry.img ||
                    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80';
                  const pubMeta = html.match(/article:published_time"\s+content="([^"]*)"/i)?.[1] || '';

                  // Mantém cursor consistente com entry.lastmod para nunca pular datas do sitemap
                  let createdAt = `${entry.lastmod}T12:00:00.000Z`;
                  if (pubMeta && pubMeta.slice(0, 10) === entry.lastmod) {
                    const parsedPub = new Date(pubMeta);
                    if (!Number.isNaN(parsedPub.getTime())) createdAt = parsedPub.toISOString();
                  }

                  return {
                    id,
                    title: cleanTitle,
                    slugBase,
                    rawTitle: ogTitle,
                    description: ogDesc,
                    coverUrl: ogImg,
                    postUrl: entry.loc,
                    extractedLinks,
                    createdAt
                  };
                } catch {
                  return null;
                }
              })
            );

            for (const item of parsedBatch) {
              if (!item || oldAdded >= oldLimit) continue;
              if (existingIds.has(item.id)) continue;
              const uniqueSlug = ensureUniqueSlug(`${item.slugBase}-brothergame`, 'bg', existingSlugs);
              existingIds.add(item.id);
              rowsToInsert.push(
                buildBrotherGameRow({
                  id: item.id,
                  title: item.title,
                  slug: uniqueSlug,
                  rawTitle: item.rawTitle,
                  description: item.description,
                  coverUrl: item.coverUrl,
                  postUrl: item.postUrl,
                  extractedLinks: item.extractedLinks,
                  createdAt: item.createdAt
                })
              );
              oldAdded++;
            }
          }
        }
      }
    } catch (err) {
      console.error('[brothergame] Erro no backfill do sitemap:', err);
    }
  }

  if (rowsToInsert.length > 0) {
    const { error } = await supabase.from('games').upsert(rowsToInsert, { onConflict: 'id' });
    if (error) {
      for (const row of rowsToInsert) {
        await supabase.from('games').upsert(row, { onConflict: 'id' });
      }
    }
  }

  return {
    site: 'brothergame',
    repacker: 'Brother Game',
    newAdded,
    oldAdded,
    totalInDb: initialCountInDb + newAdded + oldAdded,
    totalAvailable,
    archiveCompleted,
    oldestCursorUsed: oldestCursorIso
  };
}

const IGG_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const IGG_ADULT_CATEGORY_TOKENS = [
  'adult',
  'eroge',
  'nudity',
  'hentai',
  'nsfw',
  'porn',
  '3d-comics',
  '3d comics',
  'erotic',
  'ecchi',
  'futa',
  'fetish',
  'sexual content',
  '18+',
  'xxx'
];
const IGG_ADULT_TEXT_REGEX = /\b(porn|hentai|nsfw|eroge|erotic|xxx|milf|bdsm|incest|ecchi|koikatsu|honey\s*select|futanari|futa|futabu|femboy|onlyfans|adult\s+games?|erolabs|nutaku|cuckold|brothel|strip\s*club|harem\s+hotel|waifu\s+sex|sex\s+(?:game|sim|simulator|club|doll|wife|power)|being\s+a\s+dik|treasure\s+of\s+nadia|lust\s+(?:academy|theory|epidemic|ville|flame)|succubus\s+affection|horny\s+energy|18\+)\b/i;

function isNonGameIggPost(textOrUrl: string): boolean {
  const low = (textOrUrl || '').toLowerCase();
  return (
    low.includes('/how-to-') ||
    low.includes('/faq') ||
    low.includes('/dmca') ||
    low.includes('/contact') ||
    low.includes('/privacy') ||
    low.includes('/request') ||
    low.includes('/changelog') ||
    low.includes('/tag/') ||
    low.includes('/category/') ||
    low.includes('how to install') ||
    low.includes('game list')
  );
}

function isAdultIggGames(params: {
  rawTitle?: string;
  url?: string;
  categories?: string[];
  description?: string;
}): boolean {
  // Nota: 'Mature' isolado é usado em jogos AAA convencionais (ex: GTA V), portanto não bloqueamos 'mature' sozinho.
  const cats = (params.categories || []).map(c => c.toLowerCase().trim());
  for (const cat of cats) {
    if (IGG_ADULT_CATEGORY_TOKENS.some(tok => cat === tok || cat.includes(tok))) {
      return true;
    }
  }
  const urlLow = (params.url || '').toLowerCase();
  if (
    urlLow.includes('/category/adult') ||
    urlLow.includes('/category/eroge') ||
    urlLow.includes('/category/nudity') ||
    urlLow.includes('/category/hentai')
  ) {
    return true;
  }
  const titleAndUrl = `${params.rawTitle || ''} ${urlLow.replace(/[-_/]/g, ' ')}`;
  if (IGG_ADULT_TEXT_REGEX.test(titleAndUrl)) return true;
  if (params.description && IGG_ADULT_TEXT_REGEX.test(params.description)) return true;
  return false;
}

function cleanIggTitle(rawTitle: string): string {
  const cleaned = decodeHtml(rawTitle)
    .replace(/\s*[«\-–|]\s*IGGGAMES(?:\.com)?\s*$/i, '')
    .replace(/\s*Free\s+Download.*$/i, '')
    .replace(/\s*REPACK\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned || decodeHtml(rawTitle);
}

function extractIggCategoriesFromHtml(html: string): string[] {
  const cats = new Set<string>();
  const articleHtml = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i)?.[1] || html;
  const relTagRe = /rel="category tag"[^>]*>([^<]+)</gi;
  for (const m of articleHtml.matchAll(relTagRe)) {
    cats.add(decodeHtml(m[1]).toLowerCase());
  }
  const genreLine = articleHtml
    .replace(/<[^>]+>/g, ' ')
    .match(/Genre:\s*([^\n<]{3,160})/i)?.[1];
  if (genreLine) {
    for (const part of genreLine.split(',')) {
      const clean = part.trim().toLowerCase();
      if (clean && clean.length <= 40) cats.add(clean);
    }
  }
  return Array.from(cats);
}

function resolveIggHostMeta(headingText: string, url: string): {
  priority: number;
  hostName: string;
  baseLabel: string;
  type: string;
  format: string;
} | null {
  const h = `${headingText} ${url}`.toLowerCase();
  if (h.includes('megaup')) {
    return {
      priority: 0,
      hostName: 'MegaUp.net',
      baseLabel: 'MegaUp.net',
      type: 'direct',
      format: 'direct'
    };
  }
  if (h.includes('gofile')) {
    return { priority: 1, hostName: 'GoFile', baseLabel: 'GoFile', type: 'direct', format: 'direct' };
  }
  if (h.includes('pixeldrain')) {
    return { priority: 2, hostName: 'PixelDrain', baseLabel: 'PixelDrain', type: 'direct', format: 'direct' };
  }
  if (h.includes('mega.nz') || (h.includes('link mega') && !h.includes('megaup'))) {
    return { priority: 3, hostName: 'Mega.nz', baseLabel: 'Mega.nz', type: 'direct', format: 'direct' };
  }
  if (h.includes('1fichier')) {
    return { priority: 4, hostName: '1Fichier', baseLabel: '1Fichier', type: 'direct', format: 'direct' };
  }
  if (h.includes('mixdrop')) {
    return { priority: 5, hostName: 'MixDrop', baseLabel: 'MixDrop', type: 'direct', format: 'direct' };
  }
  if (h.includes('rapidgator')) {
    return { priority: 6, hostName: 'Rapidgator', baseLabel: 'Rapidgator', type: 'direct', format: 'direct' };
  }
  if (
    h.includes('bowfile') ||
    h.includes('clicknupload') ||
    h.includes('mediafire') ||
    h.includes('vikingfile') ||
    h.includes('datanodes') ||
    h.includes('buzzheavier') ||
    h.includes('filekeeper') ||
    h.includes('katfile') ||
    h.includes('qiwi') ||
    h.includes('uploaded')
  ) {
    const cleanHost = headingText.replace(/^link\s+/i, '').replace(/:$/, '').trim() || 'Mirror Direto';
    return { priority: 7, hostName: cleanHost, baseLabel: cleanHost, type: 'direct', format: 'direct' };
  }
  if (h.includes('torrent') || h.includes('pcgamestorrents') || h.startsWith('magnet:?') || h.endsWith('.torrent')) {
    return {
      priority: 8,
      hostName: 'Torrent IGG',
      baseLabel: 'Torrent',
      type: url.toLowerCase().startsWith('magnet:?') ? 'magnet' : 'torrent',
      format: 'torrent'
    };
  }
  return null;
}

function extractIggLinksFromArticle(articleHtml: string, defaultSize: string, slug: string): any[] {
  const candidates: Array<{
    priority: number;
    hostName: string;
    label: string;
    url: string;
    type: string;
    format: string;
  }> = [];
  const seenUrls = new Set<string>();

  // 1. Padrão principal do IGG-Games: <b class="uk-heading-bullet">Link MegaUp.net:</b> ... <a href="...">
  const bulletBlocks = [
    ...articleHtml.matchAll(/<b[^>]*class="[^"]*uk-heading-bullet[^"]*"[^>]*>([\s\S]*?)<\/b>([\s\S]*?)(?=<\/p>|<b[^>]*class="[^"]*uk-heading-bullet|$)/gi)
  ];

  for (const block of bulletBlocks) {
    const heading = decodeHtml(block[1].replace(/<[^>]+>/g, ' '));
    const linksArea = block[2];
    const anchors = [...linksArea.matchAll(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)];
    if (anchors.length === 0) continue;

    for (const a of anchors) {
      const url = decodeHtml(a[1]).trim();
      const linkText = decodeHtml(a[2].replace(/<[^>]+>/g, ' ')).trim();
      if (!url || seenUrls.has(url)) continue;
      if (url.toLowerCase().includes('igg-games.com')) continue;

      const meta = resolveIggHostMeta(heading, url);
      if (!meta) continue;
      seenUrls.add(url);

      let label = meta.baseLabel;
      if (meta.priority === 0) {
        label = anchors.length > 1 && linkText && !/download here/i.test(linkText)
          ? `MegaUp.net (${linkText})`
          : 'MegaUp.net (Download Direto Prioritário)';
      } else if (meta.priority === 8) {
        label = 'Download via Torrent (PCGamesTorrents)';
      } else {
        label = anchors.length > 1 && linkText && !/download here/i.test(linkText)
          ? `Download Direto ${meta.hostName} (${linkText})`
          : `Download Direto ${meta.hostName}`;
      }

      candidates.push({
        priority: meta.priority,
        hostName: meta.hostName,
        label,
        url,
        type: meta.type,
        format: meta.format
      });
    }
  }

  // 2. Fallback para posts antigos sem uk-heading-bullet
  if (candidates.length === 0) {
    const allAnchors = [...articleHtml.matchAll(/<a[^>]+href="(https?:\/\/[^"]+|magnet:\?[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)];
    for (const a of allAnchors) {
      const url = decodeHtml(a[1]).trim();
      const linkText = decodeHtml(a[2].replace(/<[^>]+>/g, ' ')).trim();
      if (!url || seenUrls.has(url) || url.toLowerCase().includes('igg-games.com')) continue;
      const meta = resolveIggHostMeta(linkText, url);
      if (!meta) continue;
      seenUrls.add(url);
      candidates.push({
        priority: meta.priority,
        hostName: meta.hostName,
        label: meta.priority === 0 ? 'MegaUp.net (Download Direto Prioritário)' : `Download Direto ${meta.hostName}`,
        url,
        type: meta.type,
        format: meta.format
      });
    }
  }

  // Ordenar garantindo MegaUp.net (priority === 0) sempre em PRIMEIRO lugar
  candidates.sort((a, b) => a.priority - b.priority);

  // Manter todas as partes do MegaUp.net (até 25 partes) + até 2 mirrors por servidor alternativo
  const hostCounts: Record<string, number> = {};
  const finalLinks: any[] = [];
  let idx = 0;

  for (const item of candidates) {
    const count = hostCounts[item.hostName] || 0;
    const maxForHost = item.priority === 0 ? 25 : 2;
    if (count >= maxForHost) continue;
    hostCounts[item.hostName] = count + 1;
    idx++;
    finalLinks.push({
      id: `dl-igg-${slug}-${idx}`,
      type: item.type,
      format: item.format,
      platform: 'PC',
      label: item.label,
      url: item.url,
      size: defaultSize,
      hostName: item.hostName
    });
  }

  return finalLinks;
}

async function resolvePcGamesTorrentsLink(pcgUrl: string): Promise<string> {
  if (!pcgUrl || !pcgUrl.toLowerCase().includes('pcgamestorrents.com')) return pcgUrl;
  try {
    const res = await fetch(pcgUrl, {
      headers: { 'User-Agent': IGG_UA, 'Accept-Language': 'en-US,en;q=0.9' },
      signal: AbortSignal.timeout(7000)
    });
    if (!res.ok) return pcgUrl;
    const html = await res.text();
    if (html.includes('Just a moment...')) return pcgUrl;

    const blueMatch = html.match(
      /href="(https?:\/\/(?:magnet\.)?(?:urlbluemedia|bluemediafiles)[^"]+)"/i
    )?.[1];
    if (blueMatch) return decodeHtml(blueMatch).trim();

    const magnetMatch = html.match(/href="(magnet:\?[^"]+)"/i)?.[1];
    if (magnetMatch) return decodeHtml(magnetMatch).trim();

    const torrentMatch = html.match(/href="(https?:\/\/[^"]+\.torrent(?:\?[^"]*)?)"/i)?.[1];
    if (torrentMatch) return decodeHtml(torrentMatch).trim();

    return pcgUrl;
  } catch {
    return pcgUrl;
  }
}

function extractIggDetails(html: string, articleHtml: string, rawTitle: string, ogDesc: string) {
  const plainLines = articleHtml
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<(?:br|\/p|p|\/div|div|\/li|li|\/h[1-6]|h[1-6])[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .split('\n')
    .map(line => decodeHtml(line).trim())
    .filter(Boolean);
  const plain = plainLines.join('\n');

  const explicitSize = plain.match(/(?:File\s*Size|Game\s*Size|Repack\s*Size|Download\s*Size)\s*:?\s*(\d+(?:[.,]\d+)?\s*(?:GB|MB))/i)?.[1];
  const storageSize = plain.match(/\bStorage\s*:?\s*(?:~|approx\.?\s*)?(\d+(?:[.,]\d+)?\s*(?:GB|MB))/i)?.[1];
  const rawSize = explicitSize || storageSize;
  const repackSize = rawSize ? rawSize.toUpperCase().replace(/\s+/g, ' ').trim() : '12.0 GB';

  const cleanField = (val: string | undefined, fallback: string, maxLen = 70) => {
    if (!val) return fallback;
    const cleaned = val
      .replace(/\s+(?:Developer|Publisher|Release\s*Date|Genre|OS|Processor|Memory|Graphics|DirectX|Storage|Sound\s*Card|Additional\s*Notes|Recommended|Minimum)\s*:.*$/i, '')
      .replace(/\s+/g, ' ')
      .trim();
    return cleaned.length >= 2 ? cleaned.slice(0, maxLen) : fallback;
  };

  const developer = cleanField(
    plain.match(/Developer:\s*([\s\S]{2,120}?)(?=\s*(?:Publisher:|Release\s*Date:|Genre:|\n|$))/i)?.[1],
    'PC Release',
    60
  );
  const publisher = cleanField(
    plain.match(/Publisher:\s*([\s\S]{2,120}?)(?=\s*(?:Release\s*Date:|Genre:|\n|$))/i)?.[1],
    'IGG-Games Archive',
    60
  );
  const versionMatch = rawTitle.match(/\((v[\d.]+[^)]*)\)/i)?.[1] || 'Completa / Cracked';

  const osLine = cleanField(
    plain.match(/\bOS:\s*([\s\S]{2,120}?)(?=\s*(?:Processor:|Memory:|Graphics:|DirectX:|Storage:|Sound\s*Card:|Recommended:|\n|$))/i)?.[1],
    'Windows 10/11 64-bit',
    70
  );
  const cpuLine = cleanField(
    plain.match(/\bProcessor:\s*([\s\S]{2,120}?)(?=\s*(?:Memory:|Graphics:|DirectX:|Storage:|Sound\s*Card:|Recommended:|\n|$))/i)?.[1],
    'Intel Core i5 / AMD Ryzen 5',
    80
  );
  const ramLine = cleanField(
    plain.match(/\bMemory:\s*([\s\S]{2,80}?)(?=\s*(?:Graphics:|DirectX:|Storage:|Sound\s*Card:|Additional\s*Notes:|Recommended:|\n|$))/i)?.[1],
    '8 GB RAM',
    50
  );
  const gpuLine = cleanField(
    plain.match(/\bGraphics:\s*([\s\S]{2,120}?)(?=\s*(?:DirectX:|Storage:|Sound\s*Card:|Network:|Additional\s*Notes:|Recommended:|\n|$))/i)?.[1],
    'NVIDIA GTX 1060 / AMD RX 580',
    80
  );
  const dxLine = cleanField(
    plain.match(/\bDirectX:\s*([\s\S]{2,60}?)(?=\s*(?:Storage:|Network:|Sound\s*Card:|Additional\s*Notes:|Recommended:|\n|$))/i)?.[1],
    'Versão 11',
    40
  );
  const storageLine = cleanField(
    plain.match(/\bStorage:\s*([\s\S]{2,80}?)(?=\s*(?:Sound\s*Card:|Additional\s*Notes:|VR\s*Support:|Recommended:|\n|$))/i)?.[1],
    `${repackSize} disponíveis`,
    50
  );

  const ldThumb = html.match(/"thumbnailUrl"\s*:\s*"([^"]+)"/i)?.[1]?.replace(/\\\//g, '/') || '';
  const articleIggImgs = [...articleHtml.matchAll(/src="(https:\/\/igg-games\.com\/wp-content\/uploads\/[^"]+\.(?:jpg|jpeg|png|webp))"/gi)]
    .map(m => m[1])
    .filter((u, idx, arr) => arr.indexOf(u) === idx);

  const coverUrl = ldThumb || articleIggImgs[0] || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80';
  const screenshots = articleIggImgs.length > 0 ? articleIggImgs.slice(0, 5) : [coverUrl];

  const cleanDesc = (ogDesc || '')
    .replace(/^.*Free Download PC Game Cracked in Direct Link and Torrent\.\s*/i, '')
    .trim();

  return {
    repackSize,
    developer,
    publisher,
    version: versionMatch.trim().slice(0, 60),
    description: cleanDesc || `${cleanIggTitle(rawTitle)} completo para PC via download direto (MegaUp.net) e Torrent.`,
    coverUrl,
    screenshots,
    systemRequirements: {
      minimum: {
        os: osLine,
        processor: cpuLine,
        memory: ramLine,
        graphics: gpuLine,
        storage: storageLine,
        directx: dxLine
      },
      recommended: {
        os: 'Windows 10/11 64-bit',
        processor: 'Intel Core i5-10400 / AMD Ryzen 5 3600',
        memory: '16 GB RAM',
        graphics: 'NVIDIA RTX 2060 / AMD RX 5700',
        storage: storageLine,
        directx: 'Versão 12'
      }
    }
  };
}

function buildIggGamesRow(params: {
  id: string;
  title: string;
  slug: string;
  rawTitle: string;
  description: string;
  coverUrl: string;
  postUrl: string;
  repackSize: string;
  version: string;
  developer: string;
  publisher: string;
  screenshots: string[];
  systemRequirements: any;
  extractedLinks: any[];
  postCategories: string[];
  createdAt: string;
}) {
  const {
    id,
    title,
    slug,
    rawTitle,
    description,
    coverUrl,
    postUrl,
    repackSize,
    version,
    developer,
    publisher,
    screenshots,
    systemRequirements,
    extractedLinks,
    postCategories,
    createdAt
  } = params;
  const pubDate = new Date(createdAt);
  const numSize = parseFloat(repackSize) || 12;
  const isLightweight = /\bmb\b/i.test(repackSize) || numSize <= 20;
  const genres = mapGenres(`${rawTitle} ${postCategories.join(' ')} ${description}`);
  const hasMegaUp = extractedLinks.some(l => (l.hostName || '').toLowerCase().includes('megaup'));

  const downloadLinks = [
    ...extractedLinks,
    {
      id: `dl-igg-page-${slug}`,
      type: 'direct',
      format: 'direct',
      platform: 'PC',
      label: 'Página Oficial IGG-Games',
      url: postUrl,
      size: repackSize,
      hostName: 'IGG-Games.com'
    }
  ];

  return {
    id,
    title: title.slice(0, 100),
    slug,
    cover_url: coverUrl,
    banner_url: coverUrl,
    short_description: description.slice(0, 180) + (description.length > 180 ? '...' : ''),
    description,
    genres,
    categories: [
      'IGG-Games',
      'Lançamentos',
      ...(isLightweight ? ['Repacks Leves'] : [])
    ],
    release_year: pubDate.getFullYear() || 2026,
    release_date: pubDate.toLocaleDateString('pt-BR'),
    developer: developer.slice(0, 60),
    publisher: publisher.slice(0, 60),
    repacker: 'IGG-Games',
    version,
    repack_size: repackSize,
    original_size: repackSize,
    crack_status: 'Cracked / Pré-Ativado',
    crack_group: 'Scene / IGG-Games',
    download_links: downloadLinks,
    system_requirements: systemRequirements,
    screenshots,
    rating: 0,
    total_votes: 0,
    tags: [
      'IGG-Games',
      ...(hasMegaUp ? ['MegaUp.net'] : []),
      'Download Direto',
      ...genres.slice(0, 2)
    ],
    downloads_count: 0,
    views_count: 0,
    has_pt_br_audio: false,
    has_pt_br_subs: false,
    has_pc_torrent: extractedLinks.some(l => l.type === 'magnet' || l.type === 'torrent'),
    source_origin: 'IGG-Games',
    platform: 'PC',
    created_at: createdAt
  };
}

async function fetchAndParseIggPost(params: {
  postUrl: string;
  fallbackTitle?: string;
  fallbackCategories?: string[];
  fallbackDateIso?: string;
  existingIds: Set<string>;
}): Promise<{ rowData: any } | null> {
  const { postUrl, fallbackTitle = '', fallbackCategories = [], fallbackDateIso, existingIds } = params;
  if (!postUrl || isNonGameIggPost(postUrl)) return null;
  if (isAdultIggGames({ rawTitle: fallbackTitle, url: postUrl, categories: fallbackCategories })) {
    return null;
  }

  try {
    const res = await fetch(postUrl, {
      headers: { 'User-Agent': IGG_UA, 'Accept-Language': 'en-US,en;q=0.9' },
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) return null;
    const html = await res.text();
    if (html.includes('Just a moment...')) return null;

    const articleHtml = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i)?.[1] || '';
    if (!articleHtml) return null;

    const h1Title = decodeHtml(
      articleHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, ' ') ||
      html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ||
      fallbackTitle
    );
    if (!h1Title || isNonGameIggPost(h1Title)) return null;

    const metaDesc = decodeHtml(
      html.match(/name="description"\s+content="([^"]*)"/i)?.[1] ||
      html.match(/property="og:description"\s+content="([^"]*)"/i)?.[1] ||
      ''
    );

    const htmlCategories = extractIggCategoriesFromHtml(html);
    const allCategories = Array.from(new Set([...fallbackCategories.map(c => c.toLowerCase()), ...htmlCategories]));
    const pubText = articleHtml.replace(/<[^>]+>/g, ' ').match(/Publisher:\s*([^\n<]{2,60})/i)?.[1] || '';

    if (isAdultIggGames({
      rawTitle: h1Title,
      url: postUrl,
      categories: allCategories,
      description: `${metaDesc} ${pubText}`
    })) {
      return null;
    }

    const cleanTitle = cleanIggTitle(h1Title);
    const slugBase = makeSlug(cleanTitle);
    const id = `igg-${slugBase.slice(0, 45)}`;
    if (existingIds.has(id)) return null;

    const details = extractIggDetails(html, articleHtml, h1Title, metaDesc);
    const extractedLinks = extractIggLinksFromArticle(articleHtml, details.repackSize, slugBase);
    if (extractedLinks.length === 0) return null;

    for (const link of extractedLinks) {
      if (link?.url && link.url.toLowerCase().includes('pcgamestorrents.com')) {
        const resolved = await resolvePcGamesTorrentsLink(link.url);
        if (resolved && resolved !== link.url) {
          link.url = resolved;
          if (resolved.startsWith('magnet:?')) {
            link.type = 'magnet';
          }
          link.label = 'Download via Torrent (Magnet / .Torrent)';
        }
      }
    }

    const pubMeta =
      html.match(/property="datePublished"\s+content="([^"]*)"/i)?.[1] ||
      html.match(/property="article:published_time"\s+content="([^"]*)"/i)?.[1] ||
      '';
    let createdAt = fallbackDateIso || new Date().toISOString();
    if (pubMeta) {
      const parsedPub = new Date(pubMeta);
      if (!Number.isNaN(parsedPub.getTime())) createdAt = parsedPub.toISOString();
    }

    return {
      rowData: {
        id,
        title: cleanTitle,
        slugBase,
        rawTitle: h1Title,
        description: details.description,
        coverUrl: details.coverUrl,
        postUrl,
        repackSize: details.repackSize,
        version: details.version,
        developer: details.developer,
        publisher: details.publisher,
        screenshots: details.screenshots,
        systemRequirements: details.systemRequirements,
        extractedLinks,
        postCategories: allCategories,
        createdAt
      }
    };
  } catch {
    return null;
  }
}

async function syncIggGamesNewPlusDailyBackfill(params: {
  supabase: any;
  existingIds: Set<string>;
  existingSlugs: Set<string>;
  oldestCursorIso: string | null;
  initialCountInDb: number;
  oldLimit: number;
}): Promise<SiteSyncStats> {
  const { supabase, existingIds, existingSlugs, oldestCursorIso, initialCountInDb, oldLimit } = params;
  const rowsToInsert: any[] = [];
  let newAdded = 0;
  let oldAdded = 0;
  let totalAvailable = 0;
  let archiveCompleted = false;

  // 1. TODOS OS JOGOS NOVOS (não-adultos) via RSS (/feed/)
  try {
    const rssRes = await fetch('https://igg-games.com/feed/', {
      headers: { 'User-Agent': IGG_UA, 'Accept-Language': 'en-US,en;q=0.9' },
      signal: AbortSignal.timeout(8000)
    });
    if (rssRes.ok) {
      const rssXml = await rssRes.text();
      const items = rssXml.match(/<item>([\s\S]*?)<\/item>/g) || [];
      for (const itemXml of items) {
        const rawTitle = decodeHtml(itemXml.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '');
        const link = decodeHtml(itemXml.match(/<link>([\s\S]*?)<\/link>/)?.[1] || '');
        const rssCats = [...itemXml.matchAll(/<category>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/category>/gi)].map(c => decodeHtml(c[1]));
        if (!rawTitle || !link || isNonGameIggPost(link) || isNonGameIggPost(rawTitle)) continue;
        if (isAdultIggGames({ rawTitle, url: link, categories: rssCats })) continue;

        const approxId = `igg-${makeSlug(cleanIggTitle(rawTitle)).slice(0, 45)}`;
        if (existingIds.has(approxId)) continue;

        const pubRaw = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || '';
        const pubParsed = new Date(pubRaw);
        const fallbackDateIso = Number.isNaN(pubParsed.getTime()) ? new Date().toISOString() : pubParsed.toISOString();

        const parsed = await fetchAndParseIggPost({
          postUrl: link,
          fallbackTitle: rawTitle,
          fallbackCategories: rssCats,
          fallbackDateIso,
          existingIds
        });
        if (!parsed) continue;

        const item = parsed.rowData;
        if (existingIds.has(item.id)) continue;
        const uniqueSlug = ensureUniqueSlug(`${item.slugBase}-igggames`, 'igg', existingSlugs);
        existingIds.add(item.id);
        rowsToInsert.push(buildIggGamesRow({ ...item, slug: uniqueSlug }));
        newAdded++;
      }
    }
  } catch (err) {
    console.error('[igg-games] Erro ao buscar novos do RSS:', err);
  }

  // 2. BACKFILL GRADUAL DOS ANTIGOS (10 não-adultos/dia) via Arquivos Mensais (/YYYY/MM/page/N/)
  if (oldLimit > 0) {
    try {
      const now = new Date();
      let curYear = now.getUTCFullYear();
      let curMonth = now.getUTCMonth() + 1;
      if (oldestCursorIso) {
        const curDate = new Date(oldestCursorIso);
        if (!Number.isNaN(curDate.getTime()) && curDate.getTime() <= now.getTime()) {
          curYear = curDate.getUTCFullYear();
          curMonth = curDate.getUTCMonth() + 1;
        }
      }

      totalAvailable = 15000;
      let archivePagesChecked = 0;
      let htmlFetchedCount = 0;

      while (
        oldAdded < oldLimit &&
        archivePagesChecked < 10 &&
        htmlFetchedCount < 35 &&
        (curYear > 2015 || (curYear === 2015 && curMonth >= 6))
      ) {
        const mm = String(curMonth).padStart(2, '0');
        let page = 1;
        while (oldAdded < oldLimit && archivePagesChecked < 10 && htmlFetchedCount < 35 && page <= 15) {
          const pageUrl = page === 1
            ? `https://igg-games.com/${curYear}/${mm}/`
            : `https://igg-games.com/${curYear}/${mm}/page/${page}/`;

          archivePagesChecked++;
          const archRes = await fetch(pageUrl, {
            headers: { 'User-Agent': IGG_UA, 'Accept-Language': 'en-US,en;q=0.9' },
            signal: AbortSignal.timeout(8000)
          });
          if (!archRes.ok) break;
          const archHtml = await archRes.text();
          if (archHtml.includes('Just a moment...')) break;

          const articleCards = [...archHtml.matchAll(/<article[\s\S]*?<\/article>/gi)];
          if (articleCards.length === 0) break;

          const candidates: Array<{ url: string; title: string; cats: string[] }> = [];
          for (const cardMatch of articleCards) {
            const card = cardMatch[0];
            const href = card.match(/<h2[^>]*>[\s\S]*?<a[^>]+href="([^"]+)"/i)?.[1]
              || card.match(/href="(https:\/\/igg-games\.com\/[^"]+-free-download\.html)"/i)?.[1]
              || '';
            const title = decodeHtml(card.match(/<h2[^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i)?.[1] || '');
            const cats = [...card.matchAll(/rel="category tag"[^>]*>([^<]+)</gi)].map(c => decodeHtml(c[1]));
            if (!href || isNonGameIggPost(href)) continue;
            if (isAdultIggGames({ rawTitle: title, url: href, categories: cats })) continue;

            const approxSlug = title
              ? cleanIggTitle(title)
              : href.replace(/^https?:\/\/igg-games\.com\//i, '').replace(/-free-download\.html$/i, '').replace(/\.html$/i, '');
            const approxId = `igg-${makeSlug(approxSlug).slice(0, 45)}`;
            if (existingIds.has(approxId)) continue;

            candidates.push({ url: href, title, cats });
          }

          const batchSize = 6;
          for (let offset = 0; offset < candidates.length && oldAdded < oldLimit && htmlFetchedCount < 35; offset += batchSize) {
            const batch = candidates.slice(offset, offset + batchSize);
            htmlFetchedCount += batch.length;
            const parsedBatch = await Promise.all(
              batch.map(c =>
                fetchAndParseIggPost({
                  postUrl: c.url,
                  fallbackTitle: c.title,
                  fallbackCategories: c.cats,
                  fallbackDateIso: `${curYear}-${mm}-15T12:00:00.000Z`,
                  existingIds
                })
              )
            );

            for (const parsed of parsedBatch) {
              if (!parsed || oldAdded >= oldLimit) continue;
              const item = parsed.rowData;
              if (existingIds.has(item.id)) continue;
              const uniqueSlug = ensureUniqueSlug(`${item.slugBase}-igggames`, 'igg', existingSlugs);
              existingIds.add(item.id);
              rowsToInsert.push(buildIggGamesRow({ ...item, slug: uniqueSlug }));
              oldAdded++;
            }
          }

          const hasNext = /class="[^"]*next page-numbers|rel="next"/i.test(archHtml);
          if (!hasNext) break;
          page++;
        }

        curMonth--;
        if (curMonth < 1) {
          curMonth = 12;
          curYear--;
        }
      }

      if (curYear < 2015 || (curYear === 2015 && curMonth < 6)) {
        archiveCompleted = true;
      }
    } catch (err) {
      console.error('[igg-games] Erro no backfill dos arquivos:', err);
    }
  }

  if (rowsToInsert.length > 0) {
    const { error } = await supabase.from('games').upsert(rowsToInsert, { onConflict: 'id' });
    if (error) {
      for (const row of rowsToInsert) {
        await supabase.from('games').upsert(row, { onConflict: 'id' });
      }
    }
  }

  return {
    site: 'igg-games',
    repacker: 'IGG-Games',
    newAdded,
    oldAdded,
    totalInDb: initialCountInDb + newAdded + oldAdded,
    totalAvailable,
    archiveCompleted,
    oldestCursorUsed: oldestCursorIso
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && req.headers?.authorization !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const apiKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY;
  const supabase = createClient(supabaseUrl, apiKey);

  // Proxy para buscar catálogo ao vivo do 4FNet pelo Painel Admin
  if (req.query?.action === 'fetch-4fnet') {
    try {
      const page = Math.max(1, Number(req.query?.page || 1));
      const perPage = Math.min(50, Math.max(1, Number(req.query?.per_page || 20)));
      const search = typeof req.query?.search === 'string' ? req.query.search.trim() : '';
      const qs = new URLSearchParams({
        page: String(page),
        per_page: String(perPage),
        _embed: '1'
      });
      if (search) qs.set('search', search);

      const fRes = await fetch(`https://www.4fnet.org/wp-json/wp/v2/posts?${qs.toString()}`, {
        headers: { 'User-Agent': BOT_UA }
      });
      if (!fRes.ok) {
        return res.status(502).json({ error: `Erro ao consultar 4FNet API: HTTP ${fRes.status}` });
      }
      const posts = await fRes.json();
      return res.status(200).json({
        posts: Array.isArray(posts) ? posts : [],
        total: Number(fRes.headers.get('x-wp-total') || 0),
        totalPages: Number(fRes.headers.get('x-wp-totalpages') || 1)
      });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Falha ao consultar 4FNet' });
    }
  }

  try {
    const isBackfillActive = Date.now() <= Date.parse(BACKFILL_DEADLINE_ISO);
    const oldLimit = (!isBackfillActive || req.query?.mode === 'new-only')
      ? 0
      : Math.min(50, Math.max(0, Number(req.query?.old_limit ?? OLD_GAMES_PER_SITE_PER_DAY)));

    console.log(
      isBackfillActive
        ? `⏰ [CRON DIÁRIO] Regra ativa até 31/12/2026: Todos os novos + ${oldLimit} antigos/dia (FitGirl, DODI, Brother Game, 4FNet, IGG-Games sem +18)...`
        : `⏰ [CRON DIÁRIO] Período pós-31/12/2026: Buscando APENAS jogos novos (FitGirl, DODI, Brother Game, 4FNet, IGG-Games sem +18)...`
    );

    // 1. Carregar IDs, slugs e cursor mais antigo por repacker do Supabase
    const existingIds = new Set<string>();
    const existingSlugs = new Set<string>();
    const countByRepacker: Record<string, number> = {};
    const oldestByRepacker: Record<string, string> = {};

    const pageSize = 1000;
    let from = 0;
    while (true) {
      const { data, error } = await supabase
        .from('games')
        .select('id, slug, repacker, created_at')
        .range(from, from + pageSize - 1);

      if (error || !data || data.length === 0) break;
      for (const row of data) {
        if (row.id) existingIds.add(row.id);
        if (row.slug) existingSlugs.add(row.slug);
        const rep = row.repacker || '';
        countByRepacker[rep] = (countByRepacker[rep] || 0) + 1;
        if (row.created_at) {
          if (!oldestByRepacker[rep] || new Date(row.created_at).getTime() < new Date(oldestByRepacker[rep]).getTime()) {
            oldestByRepacker[rep] = row.created_at;
          }
        }
      }
      if (data.length < pageSize) break;
      from += pageSize;
    }

    // 2. Executar os 5 sites em paralelo (Todos novos + 10 antigos por dia de cada; IGG-Games sem jogos adultos e priorizando MegaUp.net)
    const [fgStats, dodiStats, bgStats, fourFStats, iggStats] = await Promise.all([
      syncSiteNewPlusDailyBackfill({
        supabase,
        siteKey: 'fitgirl',
        repackerName: 'FitGirl Repack',
        slugSuffix: 'fg',
        apiBase: 'https://fitgirl-repacks.site/wp-json/wp/v2/posts',
        useEmbed: false,
        parser: parseFitGirlPost,
        existingIds,
        existingSlugs,
        oldestCursorIso: oldestByRepacker['FitGirl Repack'] || null,
        initialCountInDb: countByRepacker['FitGirl Repack'] || 0,
        oldLimit
      }),
      syncSiteNewPlusDailyBackfill({
        supabase,
        siteKey: 'dodi',
        repackerName: 'DODI Repack',
        slugSuffix: 'dodi',
        apiBase: 'https://dodi-repacks.site/wp-json/wp/v2/posts',
        useEmbed: false,
        parser: parseDodiPost,
        existingIds,
        existingSlugs,
        oldestCursorIso: oldestByRepacker['DODI Repack'] || null,
        initialCountInDb: countByRepacker['DODI Repack'] || 0,
        oldLimit
      }),
      syncBrotherGameNewPlusDailyBackfill({
        supabase,
        existingIds,
        existingSlugs,
        oldestCursorIso: oldestByRepacker['Brother Game'] || null,
        initialCountInDb: countByRepacker['Brother Game'] || 0,
        oldLimit
      }),
      syncSiteNewPlusDailyBackfill({
        supabase,
        siteKey: '4fnet',
        repackerName: '4FNet',
        slugSuffix: '4fnet',
        apiBase: 'https://www.4fnet.org/wp-json/wp/v2/posts',
        useEmbed: true,
        parser: parseFourFNetPost,
        existingIds,
        existingSlugs,
        oldestCursorIso: oldestByRepacker['4FNet'] || null,
        initialCountInDb: countByRepacker['4FNet'] || 0,
        oldLimit
      }),
      syncIggGamesNewPlusDailyBackfill({
        supabase,
        existingIds,
        existingSlugs,
        oldestCursorIso: oldestByRepacker['IGG-Games'] || null,
        initialCountInDb: countByRepacker['IGG-Games'] || 0,
        oldLimit
      })
    ]);

    const processedCount =
      fgStats.newAdded + fgStats.oldAdded +
      dodiStats.newAdded + dodiStats.oldAdded +
      bgStats.newAdded + bgStats.oldAdded +
      fourFStats.newAdded + fourFStats.oldAdded +
      iggStats.newAdded + iggStats.oldAdded;

    return res.status(200).json({
      success: true,
      backfillActive: isBackfillActive,
      backfillEndsAt: BACKFILL_DEADLINE_ISO,
      message: isBackfillActive
        ? `Regra diária executada (até 31/12/2026): novos + até ${oldLimit} antigos/dia por site (FitGirl, DODI, Brother Game, 4FNet e IGG-Games sem +18).`
        : `Regra pós-31/12/2026 executada: busca de apenas jogos novos (FitGirl, DODI, Brother Game, 4FNet e IGG-Games sem +18).`,
      processed: processedCount,
      oldLimitPerSite: oldLimit,
      summary: {
        fitgirl: fgStats,
        dodi: dodiStats,
        brothergame: bgStats,
        fourFNet: fourFStats,
        iggGames: iggStats,
        brotherGameAdded: bgStats.newAdded + bgStats.oldAdded
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Erro no cron-sync:', error);
    return res.status(500).json({ error: error.message || 'Falha na execução do cron' });
  }
}
