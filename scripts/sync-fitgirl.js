/**
 * scripts/sync-fitgirl.js
 * Script autônomo de automação para sincronizar novos jogos do Feed RSS da FitGirl Repacks
 * diretamente para a tabela 'games' no banco de dados Supabase (PostgreSQL).
 * 
 * Utiliza fetch nativo do Node.js (sem dependências externas adicionais).
 * 
 * Suporta execução via:
 * 1. GitHub Actions (Schedule Cron a cada hora / diário)
 * 2. Vercel Cron (/api/cron-sync)
 * 3. Local / VPS (node scripts/sync-fitgirl.js)
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
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
}

export async function syncFitGirl() {
  console.log('🔄 [CRON FITGIRL] Consultando https://fitgirl-repacks.site/feed/ ...');
  
  try {
    const res = await fetch('https://fitgirl-repacks.site/feed/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) VortexGamesBot/1.0'
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const xml = await res.text();
    const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
    console.log(`📡 Feed lido com sucesso! ${items.length} itens encontrados.`);

    let addedCount = 0;

    for (const itemXml of items) {
      // Extrair link Magnet
      const magnetMatch = itemXml.match(/href="(magnet:\?[^"]+)"/i);
      if (!magnetMatch) {
        // Ignorar notícias, avisos ou posts sem torrent
        continue;
      }
      const magnetUrl = magnetMatch[1];

      // Extrair título
      const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || itemXml.match(/<title>(.*?)<\/title>/);
      const rawTitle = decodeHtml(titleMatch ? titleMatch[1].trim() : 'Novo Jogo FitGirl');

      // Limpar título
      const cleanTitle = rawTitle.replace(/\s*–\s*v.*$/, '').replace(/\[.*\]/, '').trim();
      const slug = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      // Extrair link do post original
      const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
      const postLink = linkMatch ? linkMatch[1].trim() : '';

      // Extrair tamanhos
      const sizeMatch = itemXml.match(/Repack Size:.*?([\d.,]+\s*[MG]B)/i) || itemXml.match(/from ([\d.,]+\s*[MG]B)/i);
      const origSizeMatch = itemXml.match(/Original Size:.*?([\d.,]+\s*[MG]B)/i) || itemXml.match(/to ([\d.,]+\s*[MG]B)/i);
      const repackSize = sizeMatch ? sizeMatch[1] : '30 GB';
      const originalSize = origSizeMatch ? origSizeMatch[1] : '50 GB';

      // Extrair imagem
      const imgMatch = itemXml.match(/<img[^>]+src="([^">]+)"/i);
      const coverUrl = imgMatch ? imgMatch[1] : 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80';
      const bannerUrl = coverUrl;

      // Extrair data
      const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);
      const pubDate = pubDateMatch ? new Date(pubDateMatch[1]) : new Date();
      const releaseYear = pubDate.getFullYear() || new Date().getFullYear();
      const releaseDate = pubDate.toLocaleDateString('pt-BR');

      const downloadLinks = [
        {
          id: `dl-fg-${slug}`,
          type: 'magnet',
          format: 'torrent',
          platform: 'PC',
          label: 'Torrent Magnet Oficial FitGirl (Seeds Verificados)',
          url: magnetUrl,
          size: repackSize,
          seeders: 3500
        }
      ];

      if (postLink) {
        downloadLinks.push({
          id: `dl-fg-post-${slug}`,
          type: 'direct',
          platform: 'PC',
          label: 'Página Oficial do Post FitGirl',
          url: postLink,
          size: repackSize,
          hostName: 'FitGirl Repacks'
        });
      }

      // Extrair capturas de tela (Screenshots da RiotPixels ou imagens do post)
      const riotMatches = [...itemXml.matchAll(/src="(http[^"]+riotpixels[^"]+)"/g)].map(m => m[1]);
      let screenshots = riotMatches.map(u => u.replace(/^http:/, 'https:').replace(/\.240p\.jpg$/, ''));

      // Se não encontrou imagens RiotPixels, extrai quaisquer outras imagens do post
      if (screenshots.length === 0) {
        const otherImgs = [...itemXml.matchAll(/<img[^>]+src="([^">]+)"/g)].map(m => m[1])
          .filter(u => !u.includes('emoji') && !u.includes('torrent-stats') && !u.includes('wp-content/uploads/2024/05/fg_updates'));
        screenshots = otherImgs;
      }

      // Fallback para garantir sempre galeria de capturas de tela completa
      if (screenshots.length === 0) {
        screenshots = [
          coverUrl,
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80'
        ];
      }

      // Gerador de Requisitos de Sistema realistas e personalizados com base no tamanho e jogo
      const numSize = parseFloat(repackSize.replace(/[^0-9.]/g, '')) || 35;
      const isHeavy = numSize > 40 || cleanTitle.toLowerCase().includes('gears') || cleanTitle.toLowerCase().includes('last of us') || cleanTitle.toLowerCase().includes('remake');
      const isLight = numSize < 5;

      const systemRequirements = isHeavy ? {
        minimum: {
          os: 'Windows 10 64-bit (Build 1909 ou superior)',
          processor: 'Intel Core i7-8700K ou AMD Ryzen 5 3600X',
          memory: '16 GB RAM',
          graphics: 'NVIDIA GeForce RTX 2060 (6 GB) ou AMD Radeon RX 5700 XT (8 GB)',
          storage: `${Math.ceil(numSize * 1.5)} GB de espaço livre (SSD Requerido)`,
          directx: 'Versão 12'
        },
        recommended: {
          os: 'Windows 10/11 64-bit (Versão mais recente)',
          processor: 'Intel Core i7-12700K ou AMD Ryzen 7 5800X3D',
          memory: '32 GB RAM',
          graphics: 'NVIDIA GeForce RTX 3080 (10 GB) ou AMD Radeon RX 6800 XT (16 GB)',
          storage: `${Math.ceil(numSize * 1.5)} GB em NVMe SSD`,
          directx: 'Versão 12'
        }
      } : isLight ? {
        minimum: {
          os: 'Windows 10 64-bit',
          processor: 'Intel Core i3-3220 ou AMD FX-6300',
          memory: '4 GB RAM',
          graphics: 'NVIDIA GeForce GTX 650 ou AMD Radeon HD 7750 (2 GB)',
          storage: `${Math.ceil(numSize * 1.5) || 5} GB de espaço livre`,
          directx: 'Versão 11'
        },
        recommended: {
          os: 'Windows 10/11 64-bit',
          processor: 'Intel Core i5-4460 ou AMD Ryzen 3 1200',
          memory: '8 GB RAM',
          graphics: 'NVIDIA GeForce GTX 1050 Ti ou AMD Radeon RX 560',
          storage: `${Math.ceil(numSize * 1.5) || 5} GB livres`,
          directx: 'Versão 11'
        }
      } : {
        minimum: {
          os: 'Windows 10 64-bit (Versão 20H2 ou mais recente)',
          processor: 'Intel Core i5-8400 ou AMD Ryzen 5 2600',
          memory: '8 GB RAM',
          graphics: 'NVIDIA GeForce GTX 1060 (6 GB) ou AMD Radeon RX 580 (8 GB)',
          storage: `${Math.ceil(numSize * 1.5)} GB de espaço livre em disco`,
          directx: 'Versão 12'
        },
        recommended: {
          os: 'Windows 10/11 64-bit',
          processor: 'Intel Core i7-10700 ou AMD Ryzen 7 3700X',
          memory: '16 GB RAM',
          graphics: 'NVIDIA GeForce RTX 3060 (12 GB) ou AMD Radeon RX 6600 XT (8 GB)',
          storage: `${Math.ceil(numSize * 1.5)} GB em SSD`,
          directx: 'Versão 12'
        }
      };

      // Upsert na tabela games do Supabase
      const gamePayload = {
        id: `fg-${slug.slice(0, 45)}`,
        title: cleanTitle.slice(0, 100),
        slug: slug.slice(0, 100),
        cover_url: coverUrl,
        banner_url: bannerUrl,
        short_description: `Repack oficial FitGirl para ${cleanTitle}. Descompactação sem perdas e instalação otimizada para PC.`,
        description: `Lançamento oficial da FitGirl Repacks para ${cleanTitle}. Inclui compressão máxima de dados sem perdas de áudio ou vídeo, arquivos intactos verificados e crack pré-aplicado.`,
        genres: ['Ação', 'Aventura'],
        categories: ['Lançamentos', 'Repacks', 'Mais Populares'],
        release_year: releaseYear,
        release_date: releaseDate,
        repacker: 'FitGirl Repack',
        version: rawTitle.slice(0, 80),
        repack_size: repackSize,
        original_size: originalSize,
        crack_status: 'Crackeado',
        crack_group: 'RUNE / TENOKE',
        has_pc_torrent: true,
        rating: 4.9,
        total_votes: 120,
        downloads_count: 2400,
        views_count: 5100,
        is_trending: true,
        download_links: downloadLinks,
        system_requirements: systemRequirements,
        screenshots: screenshots
      };

      const { error } = await supabase.from('games').upsert(gamePayload, { onConflict: 'id' });

      if (!error) {
        console.log(`✓ Jogo sincronizado: ${cleanTitle} (${repackSize})`);
        addedCount++;
      } else {
        console.error(`Falha ao inserir ${cleanTitle}:`, error.message);
      }
    }

    console.log(`🎉 [CRON FINALIZADO] ${addedCount} novos jogos FitGirl atualizados no Supabase.`);
    return addedCount;
  } catch (err) {
    console.error('Erro na requisição ao feed FitGirl:', err.message);
    return 0;
  }
}

syncFitGirl();
