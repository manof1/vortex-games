import { Game, DownloadLink } from '../types';
import { BROTHERGAME_PRESET_GAMES } from '../data/brotherGameCatalog';
import { getImdbRating } from '../utils/ratingUtils';
import { getGameCover, getGameBanner } from '../utils/imageUtils';
import { filterOutRiotPixels } from '../utils/linkFilters';

export const BROTHERGAME_RSS_URL = 'https://www.brothergame.org/blog-feed.xml';

/**
 * Returns the curated preset catalog of Brother Game releases & PC Native Ports
 */
export function getBrotherGamePresetCatalog(): Game[] {
  return BROTHERGAME_PRESET_GAMES;
}

/**
 * Parses RSS XML from Brother Game (https://www.brothergame.org/blog-feed.xml)
 */
export function parseBrotherGameRssXml(xmlText: string): Game[] {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const items = xmlDoc.querySelectorAll('item');

    const importedGames: Game[] = [];

    items.forEach((item, index) => {
      const rawTitle = item.querySelector('title')?.textContent || 'Novo Jogo Brother Game';
      const link = item.querySelector('link')?.textContent || 'https://www.brothergame.org';
      const pubDate = item.querySelector('pubDate')?.textContent || new Date().toISOString();
      const description = item.querySelector('description')?.textContent || '';
      const enclosureUrl = item.querySelector('enclosure')?.getAttribute('url') || '';

      // Clean title
      const cleanTitle = rawTitle
        .replace(/\s*–\s*v.*$/, '')
        .replace(/\[.*\]/, '')
        .replace(/\s*PORT\s+PC\s+NATIVO[\s\S]*$/i, '')
        .replace(/\s*PORT\s+NATIVO[\s\S]*$/i, '')
        .replace(/\s*NO\s+EMULADOR[\s\S]*$/i, '')
        .replace(/\s*JOGO\s+PARA\s+EMULADOR[\s\S]*$/i, '')
        .replace(/\s*CRACK\s+NORMAL[\s\S]*$/i, '')
        .replace(/\s*REPACK[\s\S]*$/i, '')
        .trim() || rawTitle.trim();

      const slug = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      // Estimate repack size
      const isPortNativo = rawTitle.toLowerCase().includes('port') || description.toLowerCase().includes('port nativo');
      const isDublado = rawTitle.toLowerCase().includes('pt.br') || rawTitle.toLowerCase().includes('pt-br') || description.toLowerCase().includes('português');

      const repackSize = isPortNativo ? '3.5 GB' : '18.0 GB';
      const originalSize = isPortNativo ? '8.0 GB' : '30.0 GB';

      const coverUrl = enclosureUrl || getGameCover({ title: cleanTitle });
      const bannerUrl = getGameBanner({ title: cleanTitle, coverUrl });

      // Check if this game matches any preset with rich extracted mirrors
      const presetMatch = BROTHERGAME_PRESET_GAMES.find(p => 
        p.title.toLowerCase().includes(cleanTitle.toLowerCase()) || 
        cleanTitle.toLowerCase().includes(p.title.toLowerCase()) ||
        p.slug.includes(slug)
      );

      const downloadLinks: DownloadLink[] = presetMatch?.downloadLinks?.length 
        ? presetMatch.downloadLinks 
        : [
            {
              id: `dl-bg-rss-${index}-direct`,
              type: 'direct',
              format: 'direct',
              platform: 'PC',
              label: 'Página Oficial Brother Game (Download Direto / Mirrors)',
              url: link,
              size: repackSize,
              hostName: 'BrotherGame.org'
            }
          ];

      const numSize = parseFloat(repackSize.replace(/[^0-9.]/g, '')) || 5;

      const systemRequirements = {
        minimum: {
          os: 'Windows 10 / 11 64-bit',
          processor: 'Intel Core i3 ou AMD Ryzen 3',
          memory: '4 GB RAM',
          graphics: 'Intel UHD Graphics 630 ou GeForce GT 730',
          storage: `${Math.ceil(numSize * 1.5)} GB de espaço livre`,
          directx: 'Versão 11'
        },
        recommended: {
          os: 'Windows 10 / 11 64-bit',
          processor: 'Intel Core i5 ou AMD Ryzen 5',
          memory: '8 GB RAM / 16 GB RAM',
          graphics: 'GeForce GTX 1060 ou Radeon RX 580',
          storage: `${Math.ceil(numSize * 1.5)} GB em SSD`,
          directx: 'Versão 12'
        }
      };

      const game: Game = {
        id: `bg-rss-${slug}-${Date.now().toString(36)}-${index}`,
        title: cleanTitle,
        slug: `${slug}-brothergame`,
        coverUrl,
        bannerUrl,
        shortDescription: description.slice(0, 180) + (description.length > 180 ? '...' : ''),
        description: description || `Lançamento disponibilizado pela comunidade Brother Game para ${cleanTitle}. Otimizado para computadores Windows com alta compatibilidade e suporte completo.`,
        genres: ['Ação', 'Aventura', 'Port Nativo'],
        categories: ['BrotherGame', 'Lançamentos', 'Repacks'],
        releaseYear: new Date(pubDate).getFullYear() || 2026,
        releaseDate: new Date(pubDate).toLocaleDateString('pt-BR'),
        developer: 'Estúdio Oficial',
        publisher: 'Brother Game Community',
        repackInfo: {
          repacker: 'Brother Game',
          version: rawTitle.slice(0, 80),
          repackSize,
          originalSize,
          crackStatus: 'DRM Free',
          crackGroup: 'Brother Game Team'
        },
        downloadLinks: filterOutRiotPixels(downloadLinks),
        systemRequirements,
        rating: 0,
        imdbRating: getImdbRating({ title: cleanTitle }),
        totalVotes: 0,
        screenshots: [
          coverUrl,
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80'
        ],
        trailerYoutubeId: '7Q3Zf3n3zE4',
        tags: ['Brother Game', 'Port Nativo PC', 'Tradução PT-BR', 'Download'],
        downloadsCount: 0,
        viewsCount: 0,
        createdAt: new Date().toISOString(),
        isFeatured: false,
        isTrending: true,
        hasPcTorrent: false,
        hasPtBrAudio: isDublado,
        hasPtBrSubs: isDublado,
        sourceOrigin: 'Scene',
        languages: isDublado ? ['Português (Brasil)', 'Inglês'] : ['Inglês', 'Português (Brasil)']
      };

      importedGames.push(game);
    });

    return importedGames;
  } catch (error) {
    console.error('Erro ao processar RSS da Brother Game:', error);
    return [];
  }
}

/**
 * Fetches the live feed from Brother Game using proxy fallbacks
 */
export async function fetchBrotherGameLiveFeed(): Promise<Game[]> {
  const proxyEndpoints = [
    `/api/cron-sync?action=fetch-brothergame`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(BROTHERGAME_RSS_URL)}`,
    `https://corsproxy.io/?${encodeURIComponent(BROTHERGAME_RSS_URL)}`,
    BROTHERGAME_RSS_URL
  ];

  for (const endpoint of proxyEndpoints) {
    try {
      const response = await fetch(endpoint, {
        headers: { 'Accept': 'application/xml, text/xml, */*' }
      });
      if (response.ok) {
        const text = await response.text();
        if (text && text.includes('<rss')) {
          const games = parseBrotherGameRssXml(text);
          if (games.length > 0) {
            return games;
          }
        }
      }
    } catch {
      // Try next endpoint
    }
  }

  // Fallback to presets if all network requests fail
  return getBrotherGamePresetCatalog();
}
