/**
 * scripts/sync-4fnet.js
 * Script autônomo para sincronizar jogos do acervo 4FNet (https://www.4fnet.org/)
 * via WordPress REST API diretamente para a tabela 'games' no Supabase (PostgreSQL).
 *
 * Uso:
 *   node scripts/sync-4fnet.js                  (sincroniza os 50 mais recentes)
 *   node scripts/sync-4fnet.js --pages=3        (sincroniza 3 páginas de 50 = 150 jogos)
 */

import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://vcegxjfqmufdmyrhufan.supabase.co';
const DEFAULT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjZWd4amZxbXVmZG15cmh1ZmFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzMjgzOTAsImV4cCI6MjEwNjkwNDM5MH0.t-QVE78O6Clb4KKo8hhb1iXnIxXqhnxZgIoMK3D6Tdw';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const FOURFNET_API_BASE = 'https://www.4fnet.org/wp-json/wp/v2/posts';

function decodeHtml(str) {
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

function mapGenres(termNames) {
  const mapped = new Set();
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

function detectMirrorHost(url) {
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

export function parseFourFNetPostToDbRow(post) {
  const rawTitle = decodeHtml(post.title?.rendered || '');
  if (!rawTitle) return null;

  const content = post.content?.rendered || '';
  const pubDate = post.date ? new Date(post.date) : new Date();

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

  const vcBtns = [...content.matchAll(/\[vc_btn\s+([^\]]+)\]/gi)];
  let steamAppId = null;
  let detectedSize = '';
  const downloadLinks = [];
  const seenUrls = new Set();

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
    const titleRaw = titleAttrMatch ? decodeHtml(titleAttrMatch[1]) : '';
    const sizeMatch = titleRaw.match(/([\d.,]+\s*(?:GB|MB))/i);
    const btnSize = sizeMatch ? sizeMatch[1].toUpperCase() : detectedSize || 'Download Direto';
    if (sizeMatch && !detectedSize) {
      detectedSize = sizeMatch[1].toUpperCase();
    }

    if (seenUrls.has(decodedUrl)) return;
    seenUrls.add(decodedUrl);

    const { hostName, label } = detectMirrorHost(decodedUrl);
    downloadLinks.push({
      id: `dl-4fnet-${baseSlug}-${idx + 1}`,
      type: 'direct',
      format: 'direct',
      platform: 'PC',
      label: `${label} (${btnSize})`,
      url: decodedUrl,
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

  const colTextMatch = content.match(/\[vc_column_text\]([\s\S]*?)\[\/vc_column_text\]/i);
  const rawDescription = colTextMatch
    ? colTextMatch[1]
        .replace(/<div class="td-post-box-wrapper">[\s\S]*?<\/div>\s*<\/div>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\[[^\]]+\]/g, ' ')
    : (post.excerpt?.rendered || '').replace(/<[^>]+>/g, ' ');
  const description = decodeHtml(rawDescription) || `Versão completa de ${cleanTitle} disponibilizada pela coleção 4FNet com múltiplos mirrors de download direto.`;
  const shortDescription = description.length > 185 ? description.slice(0, 182) + '...' : description;

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
        decodeHtml(c[1].replace(/<[^>]+>/g, ' '))
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

  const ytMatch = content.match(/(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  const trailerYoutubeId = ytMatch ? ytMatch[1] : null;

  const wpCover = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
  const steamHeader = steamAppId
    ? `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${steamAppId}/header.jpg`
    : '';
  const coverUrl = wpCover || steamHeader || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80';
  const bannerUrl = steamHeader || coverUrl;

  const termNames = (post._embedded?.['wp:term'] || [])
    .flat()
    .map(t => decodeHtml(t.name || ''))
    .filter(n => n && n.toLowerCase() !== 'all games');
  const genres = mapGenres(termNames);
  const hasPtBr = langsText.toLowerCase().includes('portuguese') || langsText.toLowerCase().includes('português');
  const categories = ['4FNet', 'Lançamentos'];
  if ((parseFloat(repackSize) || 10) <= 15) categories.push('Repacks Leves');

  return {
    id: gameId,
    title: cleanTitle.slice(0, 100),
    slug: gameSlug.slice(0, 100),
    cover_url: coverUrl,
    banner_url: bannerUrl,
    short_description: shortDescription,
    description,
    genres,
    categories,
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
    screenshots: Array.from(new Set([steamHeader, wpCover].filter(Boolean))),
    trailer_youtube_id: trailerYoutubeId,
    tags: ['4FNet', 'Download Direto', ...genres.slice(0, 2)],
    languages: hasPtBr ? ['Português (Brasil)', 'Inglês'] : ['Inglês'],
    rating: 0,
    total_votes: 0,
    downloads_count: 0,
    views_count: 0,
    is_featured: false,
    is_trending: false,
    has_pt_br_audio: false,
    has_pt_br_subs: hasPtBr,
    has_pc_torrent: false,
    source_origin: '4FNet',
    platform: 'PC',
    created_at: pubDate.toISOString()
  };
}

export async function syncFourFNet({ pages = 2, perPage = 50 } = {}) {
  console.log(`🔄 [CRON 4FNET] Consultando WP REST API (https://www.4fnet.org/wp-json/wp/v2/posts) — ${pages} página(s) x ${perPage} jogos...`);

  let totalUpserted = 0;
  let totalAvailable = 0;

  for (let page = 1; page <= pages; page++) {
    try {
      const url = `${FOURFNET_API_BASE}?per_page=${perPage}&page=${page}&_embed=1`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) VortexGamesBot/1.0'
        }
      });

      if (!res.ok) {
        console.warn(`⚠️ Página ${page} retornou HTTP ${res.status}`);
        break;
      }

      if (page === 1) {
        totalAvailable = Number(res.headers.get('x-wp-total') || 0);
        console.log(`📡 Total disponível no acervo 4FNet: ${totalAvailable} jogos!`);
      }

      const posts = await res.json();
      if (!Array.isArray(posts) || posts.length === 0) break;

      const rows = posts
        .map(parseFourFNetPostToDbRow)
        .filter(Boolean);

      if (rows.length > 0) {
        const { error } = await supabase.from('games').upsert(rows, { onConflict: 'id' });
        if (!error) {
          totalUpserted += rows.length;
          console.log(`✅ Página ${page}: ${rows.length} jogos sincronizados (${rows[0].title} ... ${rows[rows.length - 1].title})`);
        } else {
          console.warn(`⚠️ Batch página ${page} falhou (${error.message}), tentando item a item...`);
          for (const row of rows) {
            const { error: singleErr } = await supabase.from('games').upsert(row, { onConflict: 'id' });
            if (!singleErr) totalUpserted++;
          }
        }
      }
    } catch (err) {
      console.error(`❌ Erro na página ${page}:`, err.message);
    }
  }

  console.log(`🎉 Sincronização 4FNet concluída! ${totalUpserted} jogos sincronizados com o Supabase.`);
  return { totalUpserted, totalAvailable };
}

if (process.argv[1] && process.argv[1].endsWith('sync-4fnet.js')) {
  const pagesArg = process.argv.find(a => a.startsWith('--pages='));
  const perPageArg = process.argv.find(a => a.startsWith('--per-page='));
  const pages = pagesArg ? Math.max(1, Number(pagesArg.split('=')[1])) : 1;
  const perPage = perPageArg ? Math.min(100, Math.max(1, Number(perPageArg.split('=')[1]))) : 50;
  syncFourFNet({ pages, perPage });
}
