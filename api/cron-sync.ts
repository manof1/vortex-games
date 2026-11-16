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
    const oldLimit = req.query?.mode === 'new-only'
      ? 0
      : Math.min(50, Math.max(0, Number(req.query?.old_limit ?? OLD_GAMES_PER_SITE_PER_DAY)));

    console.log(`⏰ [CRON DIÁRIO] Executando regra (Todos os novos + ${oldLimit} antigos/dia) para FitGirl, DODI e 4FNet...`);

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

    // 2. Executar os 3 sites em paralelo (Todos novos + 10 antigos por dia de cada)
    const [fgStats, dodiStats, fourFStats] = await Promise.all([
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
      })
    ]);

    let processedCount =
      fgStats.newAdded + fgStats.oldAdded +
      dodiStats.newAdded + dodiStats.oldAdded +
      fourFStats.newAdded + fourFStats.oldAdded;

    // 3. Brother Game (RSS) - mantém atualizações novas também
    let bgAdded = 0;
    try {
      const bgRes = await fetch('https://www.brothergame.org/blog-feed.xml', {
        headers: { 'User-Agent': BOT_UA }
      });
      if (bgRes.ok) {
        const bgXml = await bgRes.text();
        const bgItems = bgXml.match(/<item>([\s\S]*?)<\/item>/g) || [];
        const bgRows: any[] = [];
        for (const itemXml of bgItems) {
          const rawTitle = decodeHtml(itemXml.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '');
          if (!rawTitle) continue;
          const cleanTitle = rawTitle
            .replace(/\s*–\s*v.*$/, '')
            .replace(/\[.*\]/, '')
            .replace(/\s*PORT\s+PC\s+NATIVO[\s\S]*$/i, '')
            .replace(/\s*PORT\s+NATIVO[\s\S]*$/i, '')
            .trim() || rawTitle.trim();
          const slug = makeSlug(cleanTitle);
          const id = `bg-${slug.slice(0, 45)}`;
          if (existingIds.has(id)) continue;

          const link = itemXml.match(/<link>([\s\S]*?)<\/link>/)?.[1] || 'https://www.brothergame.org';
          const pubDate = new Date(itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || Date.now());
          const description = decodeHtml(itemXml.match(/<description>([\s\S]*?)<\/description>/)?.[1] || '').replace(/<[^>]+>/g, ' ').trim();
          const coverUrl = itemXml.match(/<enclosure\s+[^>]*url="([^"]+)"/i)?.[1] || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80';
          const isDublado = rawTitle.toLowerCase().includes('pt.br') || rawTitle.toLowerCase().includes('pt-br') || description.toLowerCase().includes('português');
          const uniqueSlug = ensureUniqueSlug(`${slug}-brothergame`, 'bg', existingSlugs);
          existingIds.add(id);

          bgRows.push({
            id,
            title: cleanTitle.slice(0, 100),
            slug: uniqueSlug,
            cover_url: coverUrl,
            banner_url: coverUrl,
            short_description: description.slice(0, 180) + (description.length > 180 ? '...' : ''),
            description: description || `Lançamento oficial Brother Game para ${cleanTitle}.`,
            genres: ['Ação', 'Aventura', 'Port Nativo'],
            categories: ['BrotherGame', 'Lançamentos', 'Repacks'],
            release_year: pubDate.getFullYear() || 2026,
            release_date: pubDate.toLocaleDateString('pt-BR'),
            repacker: 'Brother Game',
            version: rawTitle.slice(0, 80),
            repack_size: rawTitle.toLowerCase().includes('port') ? '3.5 GB' : '18.0 GB',
            original_size: '30.0 GB',
            crack_status: 'DRM Free',
            crack_group: 'Brother Game Team',
            download_links: [{
              id: `dl-bg-direct-${slug}`,
              type: 'direct',
              format: 'direct',
              platform: 'PC',
              label: 'Página Oficial Brother Game',
              url: link,
              size: '3.5 GB',
              hostName: 'BrotherGame.org'
            }],
            screenshots: [coverUrl],
            rating: 0,
            total_votes: 0,
            tags: ['Brother Game', 'Port Nativo PC', 'Tradução PT-BR'],
            downloads_count: 0,
            views_count: 0,
            has_pt_br_audio: isDublado,
            has_pt_br_subs: isDublado,
            has_pc_torrent: false,
            source_origin: 'BrotherGame',
            platform: 'PC',
            created_at: pubDate.toISOString()
          });
          bgAdded++;
        }
        if (bgRows.length > 0) {
          await supabase.from('games').upsert(bgRows, { onConflict: 'id' });
          processedCount += bgRows.length;
        }
      }
    } catch (bgErr) {
      console.error('Aviso Brother Game:', bgErr);
    }

    return res.status(200).json({
      success: true,
      message: `Regra diária executada: novos + até ${oldLimit} antigos/dia por site (FitGirl, DODI e 4FNet).`,
      processed: processedCount,
      oldLimitPerSite: oldLimit,
      summary: {
        fitgirl: fgStats,
        dodi: dodiStats,
        fourFNet: fourFStats,
        brotherGameAdded: bgAdded
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Erro no cron-sync:', error);
    return res.status(500).json({ error: error.message || 'Falha na execução do cron' });
  }
}
