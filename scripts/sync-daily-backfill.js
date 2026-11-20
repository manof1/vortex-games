/**
 * scripts/sync-daily-backfill.js
 * Regra Diária Multicanal (FitGirl + DODI + Brother Game + 4FNet + Repack-Games sem +18):
 * - Busca TODOS os lançamentos novos de hoje de cada site
 * - Importa gradualmente +10 jogos antigos por dia de cada site (até 31/12/2026)
 * - Mantém todas as estatísticas iniciais (rating, votos, acessos, downloads) zeradas (0)
 *
 * Uso:
 *   node scripts/sync-daily-backfill.js
 *   node scripts/sync-daily-backfill.js --old-limit=10
 */

import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://vcegxjfqmufdmyrhufan.supabase.co';
const DEFAULT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjZWd4amZxbXVmZG15cmh1ZmFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzMjgzOTAsImV4cCI6MjEwNjkwNDM5MH0.t-QVE78O6Clb4KKo8hhb1iXnIxXqhnxZgIoMK3D6Tdw';
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const BOT_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) VortexGamesBot/1.0';
const BACKFILL_DEADLINE_ISO = '2026-12-31T23:59:59.999Z';

function decodeHtml(html) {
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

function toWpIsoNoMs(dateLike) {
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  return d.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

async function fetchJsonSafe(url) {
  const res = await fetch(url, { headers: { 'User-Agent': BOT_UA, Accept: 'application/json' } });
  const text = await res.text();
  if (!res.ok) return { ok: false, status: res.status, headers: res.headers, data: null };
  try {
    return { ok: true, status: res.status, headers: res.headers, data: JSON.parse(text) };
  } catch {
    return { ok: false, status: res.status, headers: res.headers, data: null };
  }
}

function toUtcIso(post) {
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

function makeSlug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'game';
}

function ensureUniqueSlug(desiredSlug, suffix, existingSlugs) {
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

function mapGenres(rawText) {
  const mapped = new Set();
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

function parseFitGirlPost(post) {
  const rawTitle = decodeHtml(post.title?.rendered || '');
  if (!rawTitle) return null;
  const content = post.content?.rendered || '';
  const allMagnets = [...content.matchAll(/href="(magnet:\?[^"]+)"/gi)].map(m => m[1]);
  if (allMagnets.length === 0) return null;

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

  const downloadLinks = [
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
    description: `Lançamento oficial da FitGirl Repacks para ${cleanTitle}. Inclui compressão máxima de dados sem perdas de áudio ou vídeo e crack pré-aplicado.`,
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

function parseDodiPost(post) {
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

  const downloadLinks = [
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

function parseFourFNetPost(post) {
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
  let steamAppId = null;
  let detectedSize = '';
  const downloadLinks = [];
  const seenUrls = new Set();

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
  const termNames = (post._embedded?.['wp:term'] || []).flat().map(t => decodeHtml(t.name || '')).join(' ');
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

async function syncSite({ siteKey, repackerName, slugSuffix, apiBase, useEmbed, parser, existingIds, existingSlugs, oldestCursorIso, initialCountInDb, oldLimit }) {
  const embedParam = useEmbed ? '&_embed=1' : '';
  const rowsToInsert = [];
  let newAdded = 0;
  let oldAdded = 0;
  let totalAvailable = 0;
  let archiveCompleted = false;

  try {
    for (let page = 1; page <= 3; page++) {
      const res = await fetchJsonSafe(`${apiBase}?per_page=20&page=${page}${embedParam}`);
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
    console.error(`[${siteKey}] Aviso novos:`, err.message);
  }

  if (oldLimit > 0) {
    try {
      let currentCursor = oldestCursorIso ? toWpIsoNoMs(oldestCursorIso) : null;
      for (let page = 1; page <= 5 && oldAdded < oldLimit; page++) {
        const beforeQuery = currentCursor ? `&before=${encodeURIComponent(currentCursor)}` : '';
        const res = await fetchJsonSafe(`${apiBase}?per_page=25${beforeQuery}${embedParam}`);
        if (!res.ok) {
          if (res.status === 400) archiveCompleted = true;
          break;
        }
        if (!totalAvailable && page === 1) totalAvailable = Number(res.headers.get('x-wp-total') || 0);
        const posts = res.data;
        if (!Array.isArray(posts) || posts.length === 0) {
          if (page === 1) archiveCompleted = true;
          break;
        }
        let oldestInBatch = null;
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
      console.error(`[${siteKey}] Aviso backfill:`, err.message);
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
    site: siteKey,
    repacker: repackerName,
    newAdded,
    oldAdded,
    totalInDb: initialCountInDb + newAdded + oldAdded,
    totalAvailable,
    archiveCompleted
  };
}

function cleanBrotherGameTitle(rawTitle) {
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

function isNonGameBrotherPost(text) {
  const low = (text || '').toLowerCase();
  return (
    low.includes('camrip') ||
    low.includes('hdcam') ||
    low.includes('telesync') ||
    low.includes('webrip') ||
    low.includes('dublado-camrip')
  );
}

function extractBrotherGameLinksFromHtml(html, defaultSize, slug) {
  const re = /href=["'](https?:\/\/[^"']+|magnet:\?[^"']+)["']/gi;
  let match;
  const urls = [];
  while ((match = re.exec(html)) !== null) {
    urls.push(match[1]);
  }

  const validLinks = [];
  const seenUrls = new Set();
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
    let type = 'direct';
    let format = 'direct';

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

function buildBrotherGameRow({ id, title, slug, rawTitle, description, coverUrl, postUrl, extractedLinks, createdAt }) {
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

async function syncBrotherGameSite({ existingIds, existingSlugs, oldestCursorIso, initialCountInDb, oldLimit }) {
  const rowsToInsert = [];
  let newAdded = 0;
  let oldAdded = 0;
  let totalAvailable = 0;
  let archiveCompleted = false;

  // 1. TODOS OS JOGOS NOVOS via RSS (blog-feed.xml)
  try {
    const bgRes = await fetch('https://www.brothergame.org/blog-feed.xml', { headers: { 'User-Agent': BOT_UA } });
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

        let extractedLinks = [];
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
    console.error('[brothergame] Aviso novos:', err.message);
  }

  // 2. BACKFILL GRADUAL DOS ANTIGOS via Sitemap Oficial (blog-posts-sitemap.xml -> 10 antigos/dia)
  if (oldLimit > 0) {
    try {
      const smRes = await fetch('https://www.brothergame.org/blog-posts-sitemap.xml', { headers: { 'User-Agent': BOT_UA } });
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

                  const ogDesc = decodeHtml(html.match(/property="og:description"\s+content="([^"]*)"/i)?.[1] || '');
                  const ogImg =
                    html.match(/property="og:image"\s+content="([^"]*)"/i)?.[1] ||
                    entry.img ||
                    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80';
                  const pubMeta = html.match(/article:published_time"\s+content="([^"]*)"/i)?.[1] || '';

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
      console.error('[brothergame] Aviso backfill:', err.message);
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
    archiveCompleted
  };
}

const RG_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const RG_ADULT_CATEGORY_TOKENS = [
  'adult',
  'nudity',
  '3d-comics',
  '3d comics',
  'porn',
  'hentai',
  'nsfw',
  'erotic',
  'eroge',
  'xxx',
  '18+',
  'futa',
  'fetish',
  'visual-novel-18'
];
const RG_ADULT_TEXT_REGEX = /\b(porn|hentai|nsfw|eroge|erotic|xxx|milf|bdsm|incest|ecchi|koikatsu|honey\s*select|futanari|futa|futabu|femboy|onlyfans|adult\s+games?|cuckold|brothel|strip\s*club|harem\s+hotel|waifu\s+sex|sex\s+(?:game|sim|simulator|club|doll|wife|power)|being\s+a\s+dik|treasure\s+of\s+nadia|lust\s+(?:academy|theory|epidemic|ville)|succubus\s+affection|18\+)\b/i;

function isNonGameRepackGamesPost(textOrUrl) {
  const low = (textOrUrl || '').toLowerCase();
  return (
    low.includes('/how-to-') ||
    low.includes('/faq') ||
    low.includes('/dmca') ||
    low.includes('/contact') ||
    low.includes('/privacy') ||
    low.includes('/request-games') ||
    low.includes('/all-games') ||
    low.includes('/discord') ||
    low.includes('/donate') ||
    low.includes('how to download') ||
    low.includes('how to install') ||
    low.includes('game request') ||
    low.includes('changelog')
  );
}

function isAdultRepackGames({ rawTitle = '', url = '', categories = [], description = '' }) {
  const cats = categories.map(c => c.toLowerCase().trim());
  for (const cat of cats) {
    if (RG_ADULT_CATEGORY_TOKENS.some(tok => cat === tok || cat.includes(tok))) {
      return true;
    }
  }
  const urlLow = url.toLowerCase();
  if (
    urlLow.includes('/category/adult') ||
    urlLow.includes('/category/nudity') ||
    urlLow.includes('/category/3d-comics') ||
    urlLow.includes('/category/porn') ||
    urlLow.includes('/category/hentai')
  ) {
    return true;
  }
  const titleAndUrl = `${rawTitle} ${urlLow.replace(/[-_/]/g, ' ')}`;
  if (RG_ADULT_TEXT_REGEX.test(titleAndUrl)) return true;
  if (description && RG_ADULT_TEXT_REGEX.test(description)) return true;
  return false;
}

function cleanRepackGamesTitle(rawTitle) {
  const cleaned = decodeHtml(rawTitle)
    .replace(/\s*[-–|]\s*Repack-Games(?:\.com)?\s*$/i, '')
    .replace(/\s*Free\s+Download.*$/i, '')
    .replace(/\s*\(v[\d.]+[^)]*\)\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned || decodeHtml(rawTitle);
}

function extractRepackGamesCategoriesFromHtml(html) {
  const cats = new Set();
  const re1 = /href="https?:\/\/repack-games\.com\/category\/([^"\/]+)\/?"[^>]*rel="category tag"/gi;
  const re2 = /rel="category tag"[^>]*href="https?:\/\/repack-games\.com\/category\/([^"\/]+)\/?"/gi;
  for (const m of html.matchAll(re1)) cats.add(decodeHtml(m[1]).toLowerCase());
  for (const m of html.matchAll(re2)) cats.add(decodeHtml(m[1]).toLowerCase());

  const ldMatches = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  for (const m of ldMatches) {
    try {
      const parsed = JSON.parse(m[1]);
      const nodes = Array.isArray(parsed?.['@graph']) ? parsed['@graph'] : [parsed];
      for (const node of nodes) {
        if (Array.isArray(node?.articleSection)) {
          for (const sec of node.articleSection) {
            if (typeof sec === 'string' && sec.trim()) cats.add(sec.trim().toLowerCase());
          }
        }
      }
    } catch {}
  }
  return Array.from(cats);
}

function extractRepackGamesLinksFromArticle(articleHtml, defaultSize, slug) {
  const rawLinks = [...articleHtml.matchAll(/href="(https?:\/\/[^"]+|magnet:\?[^"]+)"/gi)].map(m => decodeHtml(m[1]));
  const seen = new Set();
  const validLinks = [];
  let idx = 0;

  for (const rawUrl of rawLinks) {
    const u = (rawUrl || '').trim();
    if (!u || seen.has(u)) continue;
    const low = u.toLowerCase();
    if (
      low.includes('repack-games.com') ||
      low.includes('discord.') ||
      low.includes('reddit.com') ||
      low.includes('facebook.com') ||
      low.includes('twitter.com') ||
      low.includes('x.com/') ||
      low.includes('pinterest.') ||
      low.includes('whatsapp.') ||
      low.includes('theporndude') ||
      low.includes('the-dark-games') ||
      low.includes('linktr.ee')
    ) {
      continue;
    }

    let type = 'direct';
    let format = 'direct';
    let hostName = '';
    let label = '';

    if (low.startsWith('magnet:?')) {
      type = 'magnet';
      format = 'torrent';
      hostName = 'Torrent Magnet';
      label = 'Torrent Magnet (Repack-Games)';
    } else if (low.endsWith('.torrent')) {
      type = 'torrent';
      format = 'torrent';
      hostName = 'Arquivo Torrent';
      label = 'Download .torrent';
    } else if (low.includes('filekeeper.net')) {
      hostName = 'FileKeeper';
      label = 'Download Direto FileKeeper';
    } else if (low.includes('datanodes.to')) {
      hostName = 'DataNodes';
      label = 'Download Direto DataNodes';
    } else if (low.includes('gofile.io')) {
      hostName = 'GoFile';
      label = 'Download Direto GoFile';
    } else if (low.includes('buzzheavier.com')) {
      hostName = 'Buzzheavier';
      label = 'Download Direto Buzzheavier';
    } else if (low.includes('vikingfile.com')) {
      hostName = 'VikingFile';
      label = 'Download Direto VikingFile';
    } else if (low.includes('fileditch')) {
      hostName = 'FileDitch';
      label = 'Download Direto FileDitch';
    } else if (low.includes('pixeldrain.com')) {
      hostName = 'PixelDrain';
      label = 'Download Direto PixelDrain';
    } else if (low.includes('mediafire.com')) {
      hostName = 'MediaFire';
      label = 'Download Direto MediaFire';
    } else if (low.includes('mega.nz')) {
      hostName = 'Mega.nz';
      label = 'Download Direto Mega.nz';
    } else if (low.includes('1fichier.com')) {
      hostName = '1Fichier';
      label = 'Download Direto 1Fichier';
    } else if (low.includes('krakenfiles.com')) {
      hostName = 'Krakenfiles';
      label = 'Download Direto Krakenfiles';
    } else if (low.includes('qiwi.gg')) {
      hostName = 'Qiwi';
      label = 'Download Direto Qiwi';
    } else if (low.includes('mixdrop')) {
      hostName = 'MixDrop';
      label = 'Mirror MixDrop';
    } else if (low.includes('rapidgator')) {
      hostName = 'Rapidgator';
      label = 'Mirror Rapidgator';
    } else if (low.includes('multiup')) {
      hostName = 'MultiUp';
      label = 'Multi-Mirrors';
    } else {
      continue;
    }

    seen.add(u);
    idx++;
    validLinks.push({
      id: `dl-rg-${slug}-${idx}`,
      type,
      format,
      platform: 'PC',
      label,
      url: u,
      size: defaultSize,
      hostName
    });
    if (validLinks.length >= 10) break;
  }

  return validLinks;
}

function extractRepackGamesDetails(articleHtml, rawTitle, ogDesc, coverUrl) {
  const plain = decodeHtml(
    articleHtml
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<[^>]+>/g, '\n')
  )
    .replace(/\r/g, '')
    .trim();

  const sizeRaw = articleHtml
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .match(/(?:Game\s*Size|Repack\s*Size|Size)\s*:?\s*(\d+(?:[.,]\d+)?\s*(?:GB|MB))/i)?.[1];
  const repackSize = sizeRaw ? sizeRaw.toUpperCase().replace(/\s+/g, ' ').trim() : '15.0 GB';

  const versionMatch = rawTitle.match(/\((v[\d.]+[^)]*)\)/i)?.[1]
    || plain.match(/Game:\s*(V?[\d.][^\n]{0,24})/i)?.[1]
    || 'Pre-Installed';

  const osLine = plain.match(/\bOS:\s*([^\n]{3,70})/i)?.[1]?.trim() || 'Windows 10/11 64-bit';
  const cpuLine = plain.match(/\bProcessor:\s*([^\n]{3,80})/i)?.[1]?.trim() || 'Intel Core i5 / AMD Ryzen 5';
  const ramLine = plain.match(/\bMemory:\s*([^\n]{2,50})/i)?.[1]?.trim() || '8 GB RAM';
  const gpuLine = plain.match(/\bGraphics:\s*([^\n]{3,80})/i)?.[1]?.trim() || 'NVIDIA GTX 1060 / AMD RX 580';
  const dxLine = plain.match(/\bDirectX:\s*([^\n]{2,40})/i)?.[1]?.trim() || 'Versão 11';
  const storageLine = plain.match(/\bStorage:\s*([^\n]{2,50})/i)?.[1]?.trim() || `${repackSize} disponíveis`;

  const screenshots = [...articleHtml.matchAll(/(?:data-src|src)="(https?:\/\/repack-games\.com\/wp-content\/uploads\/[^"]+\.(?:jpg|jpeg|png|webp))"/gi)]
    .map(m => m[1])
    .filter(u => !u.toLowerCase().includes('/logo.') && !u.toLowerCase().includes('placeholder'))
    .filter((u, idx, arr) => arr.indexOf(u) === idx)
    .slice(0, 5);
  if (screenshots.length === 0 && coverUrl) screenshots.push(coverUrl);

  const cleanDesc = (ogDesc || '')
    .replace(/Free Download Repack-Games\.com\s*-\s*PC game in a pre-installed direct link.*/i, '')
    .trim();

  return {
    repackSize,
    version: versionMatch.trim().slice(0, 60),
    description: cleanDesc || `${cleanRepackGamesTitle(rawTitle)} pré-instalado para PC com múltiplos links diretos.`,
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

function buildRepackGamesRow({
  id,
  title,
  slug,
  rawTitle,
  description,
  coverUrl,
  postUrl,
  repackSize,
  version,
  screenshots,
  systemRequirements,
  extractedLinks,
  postCategories,
  createdAt
}) {
  const pubDate = new Date(createdAt);
  const numSize = parseFloat(repackSize) || 15;
  const isLightweight = /\bmb\b/i.test(repackSize) || numSize <= 20;
  const isPort = postCategories.some(c => c.includes('port')) || /\bpc port\b/i.test(rawTitle);
  const genres = mapGenres(`${rawTitle} ${postCategories.join(' ')} ${description}`);

  const downloadLinks = [
    ...extractedLinks,
    {
      id: `dl-rg-page-${slug}`,
      type: 'direct',
      format: 'direct',
      platform: 'PC',
      label: 'Página Oficial Repack-Games',
      url: postUrl,
      size: repackSize,
      hostName: 'Repack-Games.com'
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
      'Repack-Games',
      'Lançamentos',
      ...(isLightweight ? ['Repacks Leves'] : []),
      ...(isPort ? ['PortsNativos'] : [])
    ],
    release_year: pubDate.getFullYear() || 2026,
    release_date: pubDate.toLocaleDateString('pt-BR'),
    developer: 'PC Pre-Installed',
    publisher: 'Repack-Games Archive',
    repacker: 'Repack-Games',
    version,
    repack_size: repackSize,
    original_size: repackSize,
    crack_status: 'Pré-Instalado (Crack Incluso)',
    crack_group: 'Scene / Pre-Installed',
    download_links: downloadLinks,
    system_requirements: systemRequirements,
    screenshots: screenshots.length > 0 ? screenshots : [coverUrl],
    rating: 0,
    total_votes: 0,
    tags: ['Repack-Games', 'Pré-Instalado PC', 'Download Direto', ...genres.slice(0, 2)],
    downloads_count: 0,
    views_count: 0,
    has_pt_br_audio: false,
    has_pt_br_subs: false,
    has_pc_torrent: extractedLinks.some(l => l.type === 'magnet' || l.type === 'torrent'),
    source_origin: 'Repack-Games',
    platform: 'PC',
    created_at: createdAt
  };
}

async function fetchAndParseRepackGamesPost({ postUrl, fallbackTitle = '', fallbackCategories = [], fallbackDateIso, anchorToFallbackDate = false, existingIds }) {
  if (!postUrl || isNonGameRepackGamesPost(postUrl)) return null;
  if (isAdultRepackGames({ rawTitle: fallbackTitle, url: postUrl, categories: fallbackCategories })) {
    return null;
  }

  try {
    const res = await fetch(postUrl, {
      headers: { 'User-Agent': RG_UA, 'Accept-Language': 'en-US,en;q=0.9' },
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) return null;
    const html = await res.text();

    const ogTitle = decodeHtml(
      html.match(/property="og:title"\s+content="([^"]*)"/i)?.[1] ||
      html.match(/content="([^"]*)"\s+property="og:title"/i)?.[1] ||
      html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ||
      fallbackTitle
    );
    if (!ogTitle || isNonGameRepackGamesPost(ogTitle)) return null;

    const ogDesc = decodeHtml(
      html.match(/property="og:description"\s+content="([^"]*)"/i)?.[1] ||
      html.match(/name="description"\s+content="([^"]*)"/i)?.[1] ||
      ''
    );

    const htmlCategories = extractRepackGamesCategoriesFromHtml(html);
    const allCategories = Array.from(new Set([...fallbackCategories.map(c => c.toLowerCase()), ...htmlCategories]));

    if (isAdultRepackGames({ rawTitle: ogTitle, url: postUrl, categories: allCategories, description: ogDesc })) {
      return null;
    }

    const cleanTitle = cleanRepackGamesTitle(ogTitle);
    const slugBase = makeSlug(cleanTitle);
    const id = `rg-${slugBase.slice(0, 45)}`;
    if (existingIds.has(id)) return null;

    const articleHtml = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i)?.[1] || '';
    if (!articleHtml) return null;

    const coverUrl =
      html.match(/property="og:image"\s+content="([^"]*)"/i)?.[1] ||
      html.match(/content="([^"]*)"\s+property="og:image"/i)?.[1] ||
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80';

    const details = extractRepackGamesDetails(articleHtml, ogTitle, ogDesc, coverUrl);
    const extractedLinks = extractRepackGamesLinksFromArticle(articleHtml, details.repackSize, slugBase);
    if (extractedLinks.length === 0) return null;

    const pubMeta = html.match(/property="article:published_time"\s+content="([^"]*)"/i)?.[1] || '';
    let createdAt = fallbackDateIso || new Date().toISOString();
    if (pubMeta) {
      const parsedPub = new Date(pubMeta);
      if (!Number.isNaN(parsedPub.getTime())) {
        if (!anchorToFallbackDate || (fallbackDateIso && pubMeta.slice(0, 10) === fallbackDateIso.slice(0, 10))) {
          createdAt = parsedPub.toISOString();
        }
      }
    }

    return {
      id,
      title: cleanTitle,
      slugBase,
      rawTitle: ogTitle,
      description: details.description,
      coverUrl,
      postUrl,
      repackSize: details.repackSize,
      version: details.version,
      screenshots: details.screenshots,
      systemRequirements: details.systemRequirements,
      extractedLinks,
      postCategories: allCategories,
      createdAt
    };
  } catch {
    return null;
  }
}

async function syncRepackGamesSite({ existingIds, existingSlugs, oldestCursorIso, initialCountInDb, oldLimit }) {
  const rowsToInsert = [];
  let newAdded = 0;
  let oldAdded = 0;
  let totalAvailable = 0;
  let archiveCompleted = false;

  // 1. TODOS OS JOGOS NOVOS (não-adultos) via RSS (/feed/)
  try {
    const rssRes = await fetch('https://repack-games.com/feed/', {
      headers: { 'User-Agent': RG_UA, 'Accept-Language': 'en-US,en;q=0.9' },
      signal: AbortSignal.timeout(8000)
    });
    if (rssRes.ok) {
      const rssXml = await rssRes.text();
      const items = rssXml.match(/<item>([\s\S]*?)<\/item>/g) || [];
      for (const itemXml of items) {
        const rawTitle = decodeHtml(itemXml.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '');
        const link = decodeHtml(itemXml.match(/<link>([\s\S]*?)<\/link>/)?.[1] || '');
        const rssCats = [...itemXml.matchAll(/<category>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/category>/gi)].map(c => decodeHtml(c[1]));
        if (!rawTitle || !link || isNonGameRepackGamesPost(link) || isNonGameRepackGamesPost(rawTitle)) continue;
        if (isAdultRepackGames({ rawTitle, url: link, categories: rssCats })) continue;

        const approxId = `rg-${makeSlug(cleanRepackGamesTitle(rawTitle)).slice(0, 45)}`;
        if (existingIds.has(approxId)) continue;

        const pubRaw = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || '';
        const pubParsed = new Date(pubRaw);
        const fallbackDateIso = Number.isNaN(pubParsed.getTime()) ? new Date().toISOString() : pubParsed.toISOString();

        const item = await fetchAndParseRepackGamesPost({
          postUrl: link,
          fallbackTitle: rawTitle,
          fallbackCategories: rssCats,
          fallbackDateIso,
          existingIds
        });
        if (!item || existingIds.has(item.id)) continue;

        const uniqueSlug = ensureUniqueSlug(`${item.slugBase}-repackgames`, 'rg', existingSlugs);
        existingIds.add(item.id);
        rowsToInsert.push(buildRepackGamesRow({ ...item, slug: uniqueSlug }));
        newAdded++;
      }
    }
  } catch (err) {
    console.error('[repack-games] Aviso novos:', err.message);
  }

  // 2. BACKFILL GRADUAL DOS ANTIGOS (10 não-adultos/dia) via Sitemaps Oficiais
  if (oldLimit > 0) {
    try {
      const idxRes = await fetch('https://repack-games.com/sitemap_index.xml', {
        headers: { 'User-Agent': RG_UA, 'Accept-Language': 'en-US,en;q=0.9' },
        signal: AbortSignal.timeout(8000)
      });
      if (idxRes.ok) {
        const idxXml = await idxRes.text();
        const sitemaps = [...idxXml.matchAll(/<sitemap>([\s\S]*?)<\/sitemap>/g)]
          .map(m => {
            const loc = m[1].match(/<loc>(.*?)<\/loc>/)?.[1] || '';
            const lastmod = m[1].match(/<lastmod>(.*?)<\/lastmod>/)?.[1] || '';
            const numMatch = loc.match(/post-sitemap(\d*)\.xml/i);
            const num = numMatch ? (numMatch[1] ? Number(numMatch[1]) : 1) : 0;
            return { loc, lastmod, num };
          })
          .filter(s => s.num > 0)
          .sort((a, b) => a.num - b.num);

        totalAvailable = sitemaps.length * 950;

        let sitemapsChecked = 0;
        let htmlFetchedCount = 0;
        for (let i = sitemaps.length - 1; i >= 0 && oldAdded < oldLimit && sitemapsChecked < 8 && htmlFetchedCount < 35; i--) {
          const sm = sitemaps[i];

          sitemapsChecked++;
          const smRes = await fetch(sm.loc, {
            headers: { 'User-Agent': RG_UA, 'Accept-Language': 'en-US,en;q=0.9' },
            signal: AbortSignal.timeout(8000)
          });
          if (!smRes.ok) continue;

          const smXml = await smRes.text();
          const entries = [...smXml.matchAll(/<url>([\s\S]*?)<\/url>/g)]
            .map(m => ({
              loc: m[1].match(/<loc>(.*?)<\/loc>/)?.[1] || '',
              lastmod: m[1].match(/<lastmod>(.*?)<\/lastmod>/)?.[1] || ''
            }))
            .filter(e => {
              if (!e.loc || !e.lastmod) return false;
              if (isNonGameRepackGamesPost(e.loc) || isAdultRepackGames({ url: e.loc })) return false;
              const urlSlug = e.loc.replace(/^https?:\/\/repack-games\.com\//i, '').replace(/\/+$/, '').replace(/-free-download$/i, '');
              const approxId = `rg-${makeSlug(urlSlug).slice(0, 45)}`;
              if (existingIds.has(approxId)) return false;
              return true;
            });

          entries.sort((a, b) => b.lastmod.localeCompare(a.lastmod) || a.loc.localeCompare(b.loc));

          const batchSize = 6;
          for (let offset = 0; offset < entries.length && oldAdded < oldLimit && htmlFetchedCount < 35; offset += batchSize) {
            const batch = entries.slice(offset, offset + batchSize);
            htmlFetchedCount += batch.length;
            const parsedBatch = await Promise.all(
              batch.map(entry => {
                const modDay = entry.lastmod.slice(0, 10);
                const fallbackDateIso = /^\d{4}-\d{2}-\d{2}$/.test(modDay)
                  ? `${modDay}T12:00:00.000Z`
                  : new Date().toISOString();
                return fetchAndParseRepackGamesPost({
                  postUrl: entry.loc,
                  fallbackDateIso,
                  anchorToFallbackDate: true,
                  existingIds
                });
              })
            );

            for (const item of parsedBatch) {
              if (!item || oldAdded >= oldLimit) continue;
              if (existingIds.has(item.id)) continue;
              const uniqueSlug = ensureUniqueSlug(`${item.slugBase}-repackgames`, 'rg', existingSlugs);
              existingIds.add(item.id);
              rowsToInsert.push(buildRepackGamesRow({ ...item, slug: uniqueSlug }));
              oldAdded++;
            }
          }
          if (i === 0 && entries.length === 0) {
            archiveCompleted = true;
          }
        }
      }
    } catch (err) {
      console.error('[repack-games] Aviso backfill:', err.message);
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
    site: 'repack-games',
    repacker: 'Repack-Games',
    newAdded,
    oldAdded,
    totalInDb: initialCountInDb + newAdded + oldAdded,
    totalAvailable,
    archiveCompleted
  };
}

export async function runDailyBackfill(requestedOldLimit = 10) {
  const isBackfillActive = Date.now() <= Date.parse(BACKFILL_DEADLINE_ISO);
  const oldLimit = isBackfillActive ? Math.max(0, requestedOldLimit) : 0;
  console.log(
    isBackfillActive
      ? `⏰ [REGRA DIÁRIA] Ativa até 31/12/2026: Buscando TODOS os novos + ${oldLimit} antigos por site (FitGirl, DODI, Brother Game, 4FNet, Repack-Games sem +18)...`
      : `⏰ [REGRA DIÁRIA] Pós-31/12/2026: Buscando APENAS jogos novos por site (FitGirl, DODI, Brother Game, 4FNet, Repack-Games sem +18)...`
  );

  const existingIds = new Set();
  const existingSlugs = new Set();
  const countByRepacker = {};
  const oldestByRepacker = {};

  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from('games')
      .select('id, slug, repacker, created_at')
      .range(from, from + 999);

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
    if (data.length < 1000) break;
    from += 1000;
  }

  const [fg, dodi, bg, fourf, rg] = await Promise.all([
    syncSite({
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
    syncSite({
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
    syncBrotherGameSite({
      existingIds,
      existingSlugs,
      oldestCursorIso: oldestByRepacker['Brother Game'] || null,
      initialCountInDb: countByRepacker['Brother Game'] || 0,
      oldLimit
    }),
    syncSite({
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
    syncRepackGamesSite({
      existingIds,
      existingSlugs,
      oldestCursorIso: oldestByRepacker['Repack-Games'] || null,
      initialCountInDb: countByRepacker['Repack-Games'] || 0,
      oldLimit
    })
  ]);

  console.table({ FitGirl: fg, DODI: dodi, 'Brother Game': bg, '4FNet': fourf, 'Repack-Games': rg });
  const totalAdded =
    fg.newAdded + fg.oldAdded +
    dodi.newAdded + dodi.oldAdded +
    bg.newAdded + bg.oldAdded +
    fourf.newAdded + fourf.oldAdded +
    rg.newAdded + rg.oldAdded;
  console.log(`🎉 Regra diária concluída! Total adicionado: ${totalAdded} jogo(s). (Backfill antigos ativo até 31/12/2026: ${isBackfillActive})`);
  return { fg, dodi, bg, fourf, rg, totalAdded, backfillActive: isBackfillActive, backfillEndsAt: BACKFILL_DEADLINE_ISO };
}

if (process.argv[1] && process.argv[1].endsWith('sync-daily-backfill.js')) {
  const oldArg = process.argv.find(a => a.startsWith('--old-limit='));
  const oldLimit = oldArg ? Math.max(0, Number(oldArg.split('=')[1])) : 10;
  runDailyBackfill(oldLimit);
}
