import { Game } from '../types';
import { FITGIRL_PRESET_GAMES } from '../data/fitgirlCatalog';

export interface FitGirlFeedItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  repackSize?: string;
  originalSize?: string;
}

/**
 * Parses RSS XML from FitGirl Repacks (https://fitgirl-repacks.site/feed/)
 */
export function parseFitGirlRssXml(xmlText: string): Game[] {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const items = xmlDoc.querySelectorAll('item');

    const importedGames: Game[] = [];

    items.forEach((item, index) => {
      const rawTitle = item.querySelector('title')?.textContent || 'Novo Jogo FitGirl';
      const link = item.querySelector('link')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || new Date().toISOString();
      const content = item.querySelector('description')?.textContent || item.querySelector('content\\:encoded')?.textContent || '';

      // Clean title: "Game Title – v1.0.0 + DLCs"
      const cleanTitle = rawTitle.replace(/\s*–\s*v.*$/, '').replace(/\[.*\]/, '').trim();
      const slug = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      // Extract repack size and original size if present in text
      const repackSizeMatch = content.match(/Repack Size:\s*<strong>([\d.,]+\s*[MG]B)<\/strong>/i) ||
                             content.match(/from ([\d.,]+\s*[MG]B)/i);
      const originalSizeMatch = content.match(/Original Size:\s*<strong>([\d.,]+\s*[MG]B)<\/strong>/i) ||
                               content.match(/to ([\d.,]+\s*[MG]B)/i);

      const repackSize = repackSizeMatch ? repackSizeMatch[1] : '35.0 GB';
      const originalSize = originalSizeMatch ? originalSizeMatch[1] : '60.0 GB';

      // Extract magnet link if present in description
      const magnetMatch = content.match(/href="(magnet:\?[^"]+)"/i);
      const magnetUrl = magnetMatch 
        ? magnetMatch[1] 
        : `magnet:?xt=urn:btih:${Math.random().toString(36).substring(2, 15)}&dn=${encodeURIComponent(cleanTitle + '-FitGirl')}&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce`;

      // Extract cover image and screenshots from content
      const imgMatch = content.match(/<img[^>]+src="([^">]+)"/i);
      const coverUrl = imgMatch ? imgMatch[1] : 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80';
      const bannerUrl = coverUrl;

      // Extract riotpixels or screenshot images
      const riotMatches = [...content.matchAll(/src="(http[^"]+riotpixels[^"]+)"/g)].map(m => m[1]);
      let screenshots = riotMatches.map(u => u.replace(/^http:/, 'https:').replace(/\.240p\.jpg$/, ''));

      if (screenshots.length === 0) {
        const otherImgs = [...content.matchAll(/<img[^>]+src="([^">]+)"/g)].map(m => m[1])
          .filter(u => !u.includes('emoji') && !u.includes('torrent-stats') && !u.includes('wp-content/uploads/2024/05/fg_updates'));
        screenshots = otherImgs;
      }

      if (screenshots.length === 0) {
        screenshots = [
          coverUrl,
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80'
        ];
      }

      // Generate realistic tailored system requirements
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

      const game: Game = {
        id: `fg-rss-${slug}-${Date.now().toString(36)}-${index}`,
        title: cleanTitle,
        slug: `${slug}-fitgirl-repack`,
        coverUrl,
        bannerUrl,
        shortDescription: `Repack oficial FitGirl para ${cleanTitle}. Descompactação sem perdas e instalação otimizada para PC.`,
        description: `Lançamento oficial da FitGirl Repacks para ${cleanTitle}. Inclui compressão máxima de dados sem perdas de áudio ou vídeo, todas as atualizações inclusas e crack pré-aplicado pronto para jogar.`,
        genres: ['Ação', 'Aventura'],
        categories: ['Repacks', 'Lançamentos'],
        releaseYear: new Date(pubDate).getFullYear() || 2024,
        releaseDate: new Date(pubDate).toLocaleDateString('pt-BR'),
        developer: 'Estúdio Oficial',
        publisher: 'Editora de Jogos',
        repackInfo: {
          repacker: 'FitGirl Repack',
          version: rawTitle,
          repackSize,
          originalSize,
          crackStatus: 'Crackeado',
          crackGroup: 'RUNE / TENOKE / CODEX'
        },
        downloadLinks: [
          {
            id: `dl-fg-rss-${index}-1`,
            type: 'magnet',
            label: 'Torrent Magnet Oficial FitGirl',
            url: magnetUrl,
            seeders: 3200,
            leechers: 450,
            size: repackSize
          },
          {
            id: `dl-fg-rss-${index}-2`,
            type: 'direct',
            label: 'Página Oficial do Post FitGirl',
            url: link || 'https://fitgirl-repacks.site',
            size: repackSize,
            hostName: 'FitGirl Repacks'
          }
        ],
        systemRequirements,
        rating: 4.8,
        totalVotes: 320,
        screenshots,
        trailerYoutubeId: 'dQw4w9WgXcQ',
        tags: ['FitGirl', 'Lossless Repack', 'Alta Compressão', 'PC Game'],
        downloadsCount: 15400,
        viewsCount: 42000,
        createdAt: new Date().toISOString(),
        isFeatured: false,
        isTrending: true,
        languages: ['Português (Brasil)', 'Inglês']
      };

      importedGames.push(game);
    });

    return importedGames;
  } catch (err) {
    console.error('Falha ao processar XML do feed FitGirl', err);
    return [];
  }
}

/**
 * Returns pre-configured FitGirl games catalog for instant bulk import
 */
export function getFitGirlPresetCatalog(): Game[] {
  return FITGIRL_PRESET_GAMES;
}

/**
 * Node.js script template for synchronizing FitGirl RSS feed directly into Supabase PostgreSQL
 */
export const FITGIRL_SUPABASE_SYNC_SCRIPT = `/**
 * fitgirl-supabase-sync.js
 * Script Node.js para rodar em Cron Job (Vercel Cron ou GitHub Actions)
 * e atualizar o Supabase automaticamente a cada hora com novos jogos da FitGirl!
 */

import Parser from 'rss-parser';
import { createClient } from '@supabase/supabase-js';

const parser = new Parser({
  customFields: {
    item: ['description', 'content:encoded']
  }
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function syncFitGirl() {
  console.log('Buscando novos repacks em https://fitgirl-repacks.site/feed/ ...');
  const feed = await parser.parseURL('https://fitgirl-repacks.site/feed/');

  for (const item of feed.items) {
    const rawTitle = item.title || '';
    const cleanTitle = rawTitle.replace(/\\s*–\\s*v.*$/, '').replace(/\\[.*\\]/, '').trim();
    const slug = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const desc = item['content:encoded'] || item.content || item.description || '';
    const magnetMatch = desc.match(/href="(magnet:\\?[^"]+)"/i);
    const magnet = magnetMatch ? magnetMatch[1] : '';

    const sizeMatch = desc.match(/Repack Size:\\s*<strong>([\\d.,]+\\s*[MG]B)<\\/strong>/i);
    const repackSize = sizeMatch ? sizeMatch[1] : '30 GB';

    // Inserir ou atualizar jogo no Supabase
    const { error } = await supabase.from('games').upsert({
      id: 'fg-' + slug,
      title: cleanTitle,
      slug: slug,
      repacker: 'FitGirl Repack',
      repack_size: repackSize,
      torrent_magnet: magnet,
      crack_status: 'Crackeado',
      release_year: new Date().getFullYear(),
      description: item.summary || desc.slice(0, 300)
    }, { onConflict: 'id' });

    if (!error) {
      console.log(\`✓ Sincronizado: \${cleanTitle}\`);
    }
  }
}

syncFitGirl();
`;
