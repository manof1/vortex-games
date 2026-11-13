/**
 * scripts/sync-brothergame.js
 * Script autônomo de automação para sincronizar novos jogos do Feed RSS do Brother Game (https://www.brothergame.org/)
 * diretamente para a tabela 'games' no banco de dados Supabase (PostgreSQL).
 * 
 * Especialidade: Ports nativos de PC sem emuladores, 60/120 FPS, Dublagens & Traduções PT-BR.
 * 
 * Suporta execução via:
 * 1. GitHub Actions (Schedule Cron)
 * 2. Vercel Cron (/api/cron-sync)
 * 3. Local / VPS (node scripts/sync-brothergame.js)
 */

import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://vcegxjfqmufdmyrhufan.supabase.co';
const DEFAULT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjZWd4amZxbXVmZG15cmh1ZmFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzMjgzOTAsImV4cCI6MjEwNjkwNDM5MH0.t-QVE78O6Clb4KKo8hhb1iXnIxXqhnxZgIoMK3D6Tdw';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function decodeHtml(html) {
  if (!html) return '';
  return html
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .trim();
}

function cleanTitle(rawTitle) {
  return rawTitle
    .replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1')
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

async function extractDownloadLinksFromPost(postUrl, defaultSize, slug) {
  try {
    const res = await fetch(postUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      }
    });
    if (!res.ok) return [];
    const html = await res.text();
    
    const re = /href=["'](https?:\/\/[^"']+)["']/gi;
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

      // Ignorar links internos ou sociais
      if (
        lower.includes('wix') ||
        lower.includes('brothergame.org') ||
        lower.includes('discord.gg') ||
        lower.includes('google.com/detail') ||
        lower.includes('.css') ||
        lower.includes('.js') ||
        lower.includes('wikipedia.org') ||
        lower.includes('fandom.com') ||
        lower.includes('steampowered.com') ||
        lower.includes('nintendo.com') ||
        lower.includes('gran-turismo.com') ||
        lower.includes('google.com/search') ||
        lower.includes('pt.br')
      ) {
        continue;
      }

      if (seenUrls.has(u)) continue;
      seenUrls.add(u);

      let hostName = 'Download Direto';
      let label = 'Download Direto';

      if (lower.includes('mediafire.com')) {
        hostName = 'MediaFire';
        const isModOrDub = lower.includes('traducao') || lower.includes('dublagem') || lower.includes('mod');
        label = isModOrDub ? 'MediaFire (Tradução / Dublagem / Mods)' : 'MediaFire (Download Direto)';
      } else if (lower.includes('drive.google.com')) {
        hostName = 'Google Drive';
        label = 'Google Drive (Download Nuvem Oficial)';
      } else if (lower.includes('gofile.io')) {
        hostName = 'Gofile';
        label = 'Gofile (Alta Velocidade Sem Limites)';
      } else if (lower.includes('buzzheavier.com')) {
        hostName = 'Buzzheavier';
        label = 'Buzzheavier (Download Rápido)';
      } else if (lower.includes('fileditchfiles.st') || lower.includes('fileditch.com')) {
        hostName = 'Fileditch';
        label = 'Fileditch (Download Direto .rar / .zip)';
      } else if (lower.includes('pixeldrain.com')) {
        hostName = 'PixelDrain';
        label = 'PixelDrain (Mirror Direto)';
      } else if (lower.includes('vikingfile') || lower.includes('vik1ngfile')) {
        hostName = 'VikingFile';
        label = 'VikingFile (Download Rápido)';
      } else if (lower.includes('blazeupload.com')) {
        hostName = 'BlazeUpload';
        label = 'BlazeUpload (Mirror Direto)';
      } else if (lower.includes('github.com') || lower.includes('gitlab.com') || lower.includes('eden-emu.dev')) {
        hostName = 'GitHub / GitLab';
        label = 'Repositório Oficial do Port / Releases';
      } else if (lower.includes('clica.so')) {
        hostName = 'Servidor Brother Game';
        label = 'Mirror Alternativo Brother Game';
      } else {
        continue;
      }

      idx++;
      validLinks.push({
        id: `dl-${slug}-extracted-${idx}`,
        type: 'direct',
        format: 'direct',
        platform: 'PC',
        label,
        url: u,
        size: defaultSize,
        hostName
      });
    }

    return validLinks;
  } catch (err) {
    console.error(`Falha ao ler links do post ${postUrl}:`, err.message);
    return [];
  }
}

export async function syncBrotherGame() {
  console.log('🔄 [CRON BROTHER GAME] Consultando https://www.brothergame.org/blog-feed.xml ...');
  
  try {
    const res = await fetch('https://www.brothergame.org/blog-feed.xml', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) VortexGamesBot/1.0'
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const xml = await res.text();
    const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
    console.log(`📡 Feed Brother Game lido com sucesso! ${items.length} itens encontrados.`);

    let addedCount = 0;

    for (const itemXml of items) {
      const titleMatch = itemXml.match(/<title>([\s\S]*?)<\/title>/);
      const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/);
      const descMatch = itemXml.match(/<description>([\s\S]*?)<\/description>/);
      const enclosureMatch = itemXml.match(/<enclosure\s+url="([^"]+)"/i);
      const pubDateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/);

      const rawTitle = titleMatch ? decodeHtml(titleMatch[1]) : '';
      if (!rawTitle) continue;

      const link = linkMatch ? decodeHtml(linkMatch[1]) : 'https://www.brothergame.org';
      const description = descMatch ? decodeHtml(descMatch[1]).replace(/<[^>]+>/g, ' ').slice(0, 500) : '';
      const coverUrl = enclosureMatch ? enclosureMatch[1] : 'https://static.wixstatic.com/media/3b8369_259721a8a1c141e09d1a8bf0c8fd6a1d~mv2.png/v1/fit/w_896,h_1000,al_c,q_80/file.png';
      const pubDate = pubDateMatch ? new Date(pubDateMatch[1]) : new Date();

      const normalizedTitle = cleanTitle(rawTitle);
      const slug = 'bg-' + normalizedTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const isDublado = rawTitle.toLowerCase().includes('pt.br') || rawTitle.toLowerCase().includes('pt-br') || description.toLowerCase().includes('português');
      const isPortNativo = rawTitle.toLowerCase().includes('port') || description.toLowerCase().includes('port nativo');
      const repackSize = isPortNativo ? '3.5 GB' : '15.0 GB';

      // Extrair os links reais de dentro do post HTML da Brother Game
      console.log(`🔍 [SCRAPER] Lendo links reais do post: ${link} ...`);
      const extractedLinks = await extractDownloadLinksFromPost(link, repackSize, slug);

      const downloadLinks = [
        ...extractedLinks,
        {
          id: `dl-${slug}-post-ref`,
          type: 'direct',
          format: 'direct',
          platform: 'PC',
          label: 'Página Oficial Brother Game (Informações & Suporte)',
          url: link,
          size: repackSize,
          hostName: 'BrotherGame.org'
        }
      ];

      const gamePayload = {
        id: slug.slice(0, 45),
        title: normalizedTitle.slice(0, 100),
        slug: `${slug}-brothergame`.slice(0, 100),
        cover_url: coverUrl,
        banner_url: coverUrl,
        short_description: description ? description.slice(0, 180) + '...' : 'Port nativo de PC otimizado com suporte a altas resoluções e dublagem PT-BR.',
        description: description || `Lançamento e porte fornecido pela comunidade Brother Game para ${normalizedTitle}.`,
        genres: ['Port PC Nativo', 'Ação', 'Clássico'],
        categories: ['BrotherGame', 'Lançamentos', 'Repacks'],
        release_year: pubDate.getFullYear() || 2026,
        release_date: pubDate.toLocaleDateString('pt-BR'),
        repacker: 'Brother Game',
        version: rawTitle.slice(0, 80),
        repack_size: repackSize,
        original_size: '30.0 GB',
        crack_status: 'DRM Free',
        crack_group: 'Brother Game Community',
        download_links: downloadLinks,
        system_requirements: {
          minimum: {
            os: 'Windows 10/11 64-bit',
            processor: 'Intel Core i3 / AMD Ryzen 3',
            memory: '4 GB RAM',
            graphics: 'Intel UHD 630 / GTX 750',
            storage: '5 GB de espaço livre',
            directx: 'DirectX 11'
          },
          recommended: {
            os: 'Windows 10/11 64-bit',
            processor: 'Intel Core i5 / AMD Ryzen 5',
            memory: '8 GB RAM',
            graphics: 'GTX 1060 / RX 580',
            storage: '10 GB de espaço livre',
            directx: 'DirectX 12'
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
        has_pc_torrent: false,
        source_origin: 'BrotherGame'
      };

      const { error } = await supabase.from('games').upsert(gamePayload, { onConflict: 'id' });

      if (!error) {
        console.log(`✅ Adicionado/Atualizado: ${normalizedTitle}`);
        addedCount++;
      } else {
        console.error(`❌ Erro ao inserir ${normalizedTitle}:`, error.message);
      }
    }

    console.log(`🎉 Sincronização Brother Game concluída! ${addedCount} jogos sincronizados.`);
  } catch (err) {
    console.error('❌ Falha na sincronização Brother Game:', err.message);
  }
}

if (process.argv[1] && process.argv[1].endsWith('sync-brothergame.js')) {
  syncBrotherGame();
}
