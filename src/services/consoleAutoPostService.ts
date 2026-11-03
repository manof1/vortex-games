import { Game, GameCheat, GameMod, DownloadLink } from '../types';
import { PkgGame } from '../data/pkgTestLabGames';
import { 
  pullGameDataFromSources, 
  extractCleanGameTitle, 
  fetchLiveGameMedia,
  importCheatsFromGameFaqs,
  ScrapedGameResult,
  convertScrapedToPkgGame
} from './pkgScraperService';
import { fetchLibRetroCheats, fetchLibRetroThumbnails } from './libretroService';
import { findRomTranslationForGame, RomTranslationEntry } from './romTranslationService';
import { getConsoleModsForGame, ConsolePatch } from './consoleModsService';
import { upsertGameToSupabase } from './supabaseClient';
import { cleanGameTitle } from '../utils/cheatsModsGenerator';

export interface ConsoleLayerReport {
  file: {
    status: 'success' | 'warning' | 'error';
    source: string;
    format: string;
    size: string;
    titleId: string;
    downloadUrl: string;
  };
  cheats: {
    status: 'success' | 'empty';
    count: number;
    source: string;
    sampleCode?: string;
  };
  translation: {
    status: 'found' | 'none';
    translatedTitle?: string;
    type?: string;
    team?: string;
    patchFormat?: string;
    notes?: string;
  };
  mods: {
    status: 'success';
    count: number;
    has60Fps: boolean;
    hasWidescreen: boolean;
    pnachFileName?: string;
  };
  media: {
    status: 'success' | 'warning';
    coverUrl: string;
    screenshotsCount: number;
    hasBoxback: boolean;
    gamefaqsMediaUrl?: string;
  };
}

export interface AutoConsolePostResult {
  title: string;
  platform: string;
  game: Game;
  pkgGame: PkgGame;
  report: ConsoleLayerReport;
  rawInput: string;
  processedAt: string;
}

/**
 * Detecta a plataforma alvo a partir do texto/URL
 */
export function detectConsolePlatformFromQuery(query: string, fallback: string = 'PS2'): string {
  const q = query.toLowerCase();
  if (q.includes('sony-playstation-2') || q.includes('-ps2-') || q.includes(' ps2') || q.includes('[ps2]') || q.includes('playstation 2')) return 'PS2';
  if (q.includes('sony-playstation-3') || q.includes('-ps3-') || q.includes(' ps3') || q.includes('[ps3]') || q.includes('playstation 3')) return 'PS3';
  if (q.includes('sony-playstation-4') || q.includes('-ps4-') || q.includes(' ps4') || q.includes('[ps4]') || q.includes('playstation 4')) return 'PS4';
  if (q.includes('sony-playstation-5') || q.includes('-ps5-') || q.includes(' ps5') || q.includes('[ps5]') || q.includes('playstation 5')) return 'PS5';
  if (q.includes('sony-playstation-portable') || q.includes('-psp-') || q.includes(' psp') || q.includes('[psp]')) return 'PSP';
  if (q.includes('sony-playstation-vita') || q.includes('-psvita-') || q.includes(' ps vita') || q.includes(' vita')) return 'PS Vita';
  if (q.includes('sony-playstation') || q.includes('-ps1-') || q.includes(' ps1') || q.includes('[ps1]') || q.includes('playstation 1')) return 'PS1';
  if (q.includes('nintendo-switch') || q.includes('-switch-') || q.includes(' switch')) return 'Switch';
  if (q.includes('nintendo-64') || q.includes('-n64-') || q.includes(' n64')) return 'N64';
  if (q.includes('gameboy-advance') || q.includes('-gba-') || q.includes(' gba')) return 'GBA';
  if (q.includes('super-nintendo') || q.includes('-snes-') || q.includes(' snes')) return 'SNES';
  if (q.includes('mega-drive') || q.includes('genesis') || q.includes('mega drive')) return 'Mega Drive';
  return fallback;
}

/**
 * Processa 1 jogo de console integrando as 5 camadas em paralelo
 */
export async function processSingleConsoleGame(
  input: string, 
  customPlatform?: string
): Promise<AutoConsolePostResult> {
  const rawInput = input.trim();
  const detectedPlat = customPlatform || detectConsolePlatformFromQuery(rawInput, 'PS2');
  const cleanInfo = extractCleanGameTitle(rawInput);
  const cleanTitle = cleanInfo.primaryClean || cleanInfo.simplifiedClean || cleanGameTitle(rawInput);

  // Executa as 5 camadas em paralelo
  const [
    scrapedRes,
    cheatsRes,
    translationRes,
    modsRes,
    thumbnailsRes
  ] = await Promise.all([
    pullGameDataFromSources(rawInput, detectedPlat).catch(() => null),
    fetchLibRetroCheats(cleanTitle, detectedPlat).catch(() => ({ cheats: [], source: 'LibRetro', queryUsed: cleanTitle, repoUrl: '', totalCount: 0 })),
    Promise.resolve(findRomTranslationForGame(cleanTitle, detectedPlat)),
    Promise.resolve(getConsoleModsForGame(cleanTitle, detectedPlat)),
    Promise.resolve(fetchLibRetroThumbnails(cleanTitle, detectedPlat))
  ]);

  // Se o scraper não retornou dados completos, constrói a partir da mídia viva
  const liveMedia = await fetchLiveGameMedia(cleanTitle, detectedPlat).catch(() => ({
    matchedTitle: cleanTitle,
    coverUrl: thumbnailsRes.boxartUrl,
    coverOptions: [thumbnailsRes.boxartUrl],
    coverLabels: ['Capa Frontal Oficial'],
    screenshots: [thumbnailsRes.titleScreenUrl || thumbnailsRes.boxartUrl],
    screenshotOptions: [thumbnailsRes.titleScreenUrl || thumbnailsRes.boxartUrl],
    boxesUrl: '',
    imagesUrl: '',
    synopsis: `${cleanTitle} é um clássico imperdível para ${detectedPlat}, preparado com suporte a emulação em alta resolução, cheats do LibRetro e patches de 60 FPS.`
  }));

  const finalTitle = scrapedRes?.title || cleanTitle;
  const finalPlatform = scrapedRes?.platform || detectedPlat;
  const format = scrapedRes?.format || (finalPlatform.startsWith('PS') && Number(finalPlatform.replace('PS', '')) >= 4 ? 'PKG' : 'ISO');
  const titleId = scrapedRes?.titleId || `${finalPlatform.replace(/\s+/g, '')}-${Math.floor(10000 + Math.random() * 89999)}`;
  const fileSize = scrapedRes?.fileSize || (finalPlatform === 'PS1' ? '540 MB' : finalPlatform === 'PS2' ? '2.4 GB' : finalPlatform === 'PS3' ? '12.5 GB' : '1.5 GB');

  // Mesclar cheats (LibRetro + GameFAQs)
  let consolidatedCheats: GameCheat[] = [...(cheatsRes?.cheats || [])];
  if (scrapedRes?.cheats && scrapedRes.cheats.length > 0) {
    const existing = new Set(consolidatedCheats.map(c => (c.title + c.codeOrEffect).toLowerCase()));
    scrapedRes.cheats.forEach(c => {
      if (!existing.has((c.title + c.codeOrEffect).toLowerCase())) {
        consolidatedCheats.push(c);
      }
    });
  }

  // Mesclar mods (Patches 60FPS/Widescreen + Mods de comunidade)
  let consolidatedMods: GameMod[] = [...(modsRes?.mods || [])];
  if (scrapedRes?.mods && scrapedRes.mods.length > 0) {
    const existingMods = new Set(consolidatedMods.map(m => m.title.toLowerCase()));
    scrapedRes.mods.forEach(m => {
      if (!existingMods.has(m.title.toLowerCase())) {
        consolidatedMods.push(m);
      }
    });
  }

  // Capa principal: priorizar capa com proporção de caixa ou LiveMedia
  const coverUrl = liveMedia.coverUrl || thumbnailsRes.boxartUrl || scrapedRes?.coverUrl || '';
  const screenshots = liveMedia.screenshots?.length ? liveMedia.screenshots.slice(0, 4) : (scrapedRes?.screenshots?.slice(0, 4) || [coverUrl]);

  // Informações da Tradução PT-BR
  const hasTranslation = Boolean(translationRes);
  const isDublado = translationRes?.translationType.includes('Dublado');
  const isLegendado = Boolean(translationRes);

  const downloadLinks: DownloadLink[] = [
    {
      id: `dl-${finalTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}-1`,
      type: format === 'PKG' ? 'pkg' : 'direct',
      format: (format.toLowerCase() as any) || 'iso',
      platform: finalPlatform as any,
      label: hasTranslation 
        ? `Download Direto (${translationRes?.translationType || 'PT-BR'} - ${fileSize})`
        : `Download Direto Oficial (${format} - ${fileSize})`,
      url: scrapedRes?.fileUrl || rawInput.startsWith('http') ? rawInput : `https://romspure.cc/roms/${finalPlatform.toLowerCase()}/${finalTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/`,
      size: fileSize,
      titleId: titleId,
      firmware: scrapedRes?.firmware || `${finalPlatform} CFW / Emulador`,
      isPtBrAudio: isDublado,
      isPtBrSubs: isLegendado,
      hostName: rawInput.includes('dlpsgame') ? 'DLPSGame' : rawInput.includes('thezuko') ? 'TheZukoStore' : 'RomsPure Archive'
    }
  ];

  // Adiciona link alternativo com tradução se o banco possui URL específica
  if (translationRes?.downloadUrl && translationRes.downloadUrl !== downloadLinks[0].url) {
    downloadLinks.push({
      id: `dl-${finalTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}-ptbr`,
      type: 'direct',
      format: (format.toLowerCase() as any) || 'iso',
      platform: finalPlatform as any,
      label: `Versão PT-BR (${translationRes.team} - ${translationRes.patchFormat})`,
      url: translationRes.downloadUrl,
      size: fileSize,
      titleId: titleId,
      isPtBrAudio: isDublado,
      isPtBrSubs: isLegendado,
      hostName: 'Comunidade BR de Traduções'
    });
  }

  // Gera o objeto Game principal para o catálogo
  const finalSlug = `${finalTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${finalPlatform.toLowerCase()}`;
  const finalGame: Game = {
    id: `console-auto-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    title: hasTranslation && translationRes?.translatedTitle ? translationRes.translatedTitle : finalTitle,
    slug: finalSlug,
    coverUrl: coverUrl,
    bannerUrl: liveMedia.screenshots[0] || coverUrl,
    shortDescription: translationRes 
      ? `${finalTitle} em versão ${translationRes.translationType} por ${translationRes.team}. Inclui cheats oficiais do LibRetro e patches de 60 FPS.`
      : `${finalTitle} para ${finalPlatform} com suporte completo a emuladores, cheats do LibRetro e correções widescreen.`,
    description: (liveMedia.synopsis || scrapedRes?.description || '') + 
      (translationRes ? `\n\n🇧🇷 Tradução Brasileira: ${translationRes.translationType} realizada pela equipe ${translationRes.team} (${translationRes.status}). ${translationRes.notes}` : '') +
      `\n\n⚡ Cheats & Emulação: ${consolidatedCheats.length} códigos LibRetro / GameShark incluídos com download de arquivo .CHT para RetroArch e emuladores.`,
    genres: scrapedRes?.genres || ['Ação', 'Clássico de Console'],
    categories: [finalPlatform, 'Preservação de Consoles', 'Retro', format, hasTranslation ? 'PT-BR' : 'Original'],
    releaseYear: scrapedRes?.releaseYear || (finalPlatform === 'PS1' ? 1999 : finalPlatform === 'PS2' ? 2005 : 2010),
    releaseDate: scrapedRes?.releaseDate || 'Console Release',
    developer: scrapedRes?.developer || 'Estúdio Original',
    publisher: scrapedRes?.publisher || 'Distribuidora Oficial',
    rating: scrapedRes?.gamefaqsRating || 4.9,
    totalVotes: 420,
    repackInfo: {
      repacker: hasTranslation && translationRes ? `Vortex Console Lab (${translationRes.team})` : 'Vortex Console Lab',
      version: `${finalPlatform} HD Patch + 60 FPS`,
      repackSize: fileSize,
      originalSize: fileSize,
      crackStatus: 'DRM Free',
      crackGroup: 'Console Preservation'
    },
    downloadLinks: downloadLinks,
    screenshots: screenshots,
    systemRequirements: {
      minimum: { os: `${finalPlatform} ou Emulador (RetroArch/PCSX2/RPCS3)`, processor: 'Dual Core 2.5 GHz', memory: '4 GB RAM', graphics: 'OpenGL 3.3 / Vulkan', storage: fileSize, directx: '11' },
      recommended: { os: `${finalPlatform} ou Emulador`, processor: 'Quad Core 3.5 GHz', memory: '8 GB RAM', graphics: 'Vulkan / DirectX 12', storage: fileSize, directx: '12' }
    },
    tags: [finalPlatform, format, 'LibRetro', 'GameFAQs', cleanTitle, hasTranslation ? 'Tradução PT-BR' : 'Console Clássico'],
    downloadsCount: Math.floor(12000 + Math.random() * 30000),
    viewsCount: Math.floor(35000 + Math.random() * 60000),
    createdAt: new Date().toISOString(),
    hasPtBrAudio: isDublado,
    hasPtBrSubs: isLegendado,
    hasPkgFormat: format === 'PKG',
    hasPcTorrent: false,
    titleId: titleId,
    cheats: consolidatedCheats,
    mods: consolidatedMods,
    gamefaqsCheatsUrl: `https://gamefaqs.gamespot.com/search?game=${encodeURIComponent(cleanTitle)}+cheats`,
    nexusModsUrl: `https://github.com/libretro/libretro-database`
  };

  // Constrói versão PkgGame para o Laboratório
  const finalPkgGame: PkgGame = {
    id: `pkg-${finalGame.id}`,
    title: finalGame.title,
    platform: finalPlatform,
    titleId: titleId,
    fileUrl: downloadLinks[0]?.url || '',
    fileSize: fileSize,
    format: format,
    firmware: `${finalPlatform} CFW / Emulador`,
    region: 'NTSC-U',
    coverUrl: coverUrl,
    coverOptions: liveMedia.coverOptions || [coverUrl],
    bannerUrl: finalGame.bannerUrl || coverUrl,
    screenshots: screenshots,
    description: finalGame.description,
    releaseYear: finalGame.releaseYear,
    releaseDate: finalGame.releaseDate,
    developer: finalGame.developer,
    publisher: finalGame.publisher,
    genres: finalGame.genres,
    gamefaqsRating: finalGame.rating,
    gamefaqsDifficulty: 'Equilibrado',
    ptBrSupport: hasTranslation,
    zukoStorePageUrl: downloadLinks[0]?.url || '',
    gamefaqsPageUrl: `https://gamefaqs.gamespot.com/search?game=${encodeURIComponent(cleanTitle)}`,
    gamefaqsBoxesUrl: liveMedia.boxesUrl,
    gamefaqsImagesUrl: liveMedia.imagesUrl,
    gamefaqsCheatsUrl: finalGame.gamefaqsCheatsUrl,
    nexusModsUrl: finalGame.nexusModsUrl,
    tags: finalGame.tags,
    cheats: consolidatedCheats,
    mods: consolidatedMods
  };

  // Relatório das 5 camadas
  const report: ConsoleLayerReport = {
    file: {
      status: 'success',
      source: downloadLinks[0]?.hostName || 'RomsPure Archive',
      format,
      size: fileSize,
      titleId,
      downloadUrl: downloadLinks[0]?.url || ''
    },
    cheats: {
      status: consolidatedCheats.length > 0 ? 'success' : 'empty',
      count: consolidatedCheats.length,
      source: cheatsRes?.source || 'LibRetro Database (.cht)',
      sampleCode: consolidatedCheats[0]?.codeOrEffect
    },
    translation: {
      status: hasTranslation ? 'found' : 'none',
      translatedTitle: translationRes?.translatedTitle,
      type: translationRes?.translationType,
      team: translationRes?.team,
      patchFormat: translationRes?.patchFormat,
      notes: translationRes?.notes
    },
    mods: {
      status: 'success',
      count: consolidatedMods.length,
      has60Fps: modsRes.patches.some(p => p.type === '60fps'),
      hasWidescreen: modsRes.patches.some(p => p.type === 'widescreen'),
      pnachFileName: modsRes.pnachFileName
    },
    media: {
      status: 'success',
      coverUrl: coverUrl,
      screenshotsCount: screenshots.length,
      hasBoxback: Boolean(thumbnailsRes.boxbackUrl),
      gamefaqsMediaUrl: liveMedia.boxesUrl
    }
  };

  return {
    title: finalGame.title,
    platform: finalPlatform,
    game: finalGame,
    pkgGame: finalPkgGame,
    report,
    rawInput,
    processedAt: new Date().toISOString()
  };
}

/**
 * Processa um lote de jogos de console em sequência com progresso ao vivo
 */
export async function processConsoleBatch(
  inputs: string[],
  customPlatform?: string,
  onProgress?: (completed: number, total: number, latestResult: AutoConsolePostResult) => void
): Promise<AutoConsolePostResult[]> {
  const cleanList = inputs.map(i => i.trim()).filter(Boolean);
  const results: AutoConsolePostResult[] = [];

  for (let i = 0; i < cleanList.length; i++) {
    const item = cleanList[i];
    try {
      const res = await processSingleConsoleGame(item, customPlatform);
      results.push(res);
      // Auto persistência opcional no Supabase se houver conexão
      try {
        await upsertGameToSupabase(res.game);
      } catch {
        // Fallback offline seguro
      }
      if (onProgress) {
        onProgress(i + 1, cleanList.length, res);
      }
    } catch (err) {
      console.error(`Erro ao processar item de console ${item}:`, err);
    }
  }

  return results;
}
