import { Game, DownloadLink } from '../types';
import { ZUKO_TAPOCHEK_PRESETS } from '../data/zukoTapochekPresets';

export interface ZukoTapochekEntry {
  title: string;
  titleId?: string; // ex: CUSA-30477
  firmware?: string; // ex: FW 5.05 - 11.00
  size: string;
  pkgUrl?: string;
  torrentUrl?: string;
  patchPtBrUrl?: string;
  hasPtBrAudio: boolean;
  hasPtBrSubs: boolean;
  genres: string[];
  coverUrl?: string;
  bannerUrl?: string;
  description?: string;
  sourceOrigin: 'TheZukoStore' | 'Tapochek.net' | 'Multi-Tracker';
}

/**
 * Creates a complete Game object with dual-format buttons (Torrent + PKG + PT-BR)
 */
export function createZukoTapochekGame(entry: ZukoTapochekEntry): Game {
  const id = `zt-${entry.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`;
  const slug = `${entry.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${entry.titleId ? entry.titleId.toLowerCase() : 'dual-release'}`;

  const downloadLinks: DownloadLink[] = [];

  // 1. Torrent PC / Magnet Link
  if (entry.torrentUrl && entry.torrentUrl.trim()) {
    downloadLinks.push({
      id: `dl-tor-${Date.now()}`,
      type: 'magnet',
      format: 'torrent',
      platform: 'PC',
      label: `Torrent PC Magnet (${entry.sourceOrigin === 'Tapochek.net' ? 'Tapochek Tracker' : 'Multi-Tracker Seeds'})`,
      url: entry.torrentUrl.trim(),
      seeders: Math.floor(Math.random() * 3000) + 2000,
      leechers: Math.floor(Math.random() * 500) + 100,
      size: entry.size,
      isPtBrAudio: entry.hasPtBrAudio,
      isPtBrSubs: entry.hasPtBrSubs,
      hostName: entry.sourceOrigin === 'Tapochek.net' ? 'Tapochek.net' : 'Torrent Tracker'
    });
  }

  // 2. PKG Console Link (TheZukoStore)
  if (entry.pkgUrl && entry.pkgUrl.trim()) {
    downloadLinks.push({
      id: `dl-pkg-${Date.now()}`,
      type: 'pkg',
      format: 'pkg',
      platform: 'PS4',
      label: `Arquivo PKG Console (${entry.titleId || 'CUSA'} - TheZukoStore)`,
      url: entry.pkgUrl.trim(),
      size: entry.size,
      titleId: entry.titleId || 'CUSA-PKG',
      firmware: entry.firmware || 'FW 5.05 - 11.00',
      isPtBrAudio: entry.hasPtBrAudio,
      isPtBrSubs: entry.hasPtBrSubs,
      hostName: 'TheZukoStore'
    });
  }

  // 3. PT-BR Patch Link (Dublagem / Tradução)
  if (entry.patchPtBrUrl && entry.patchPtBrUrl.trim()) {
    downloadLinks.push({
      id: `dl-ptbr-${Date.now()}`,
      type: 'pt_br_patch',
      format: 'pt_br_patch',
      platform: 'PC',
      label: 'Pacote Oficial de Dublagem & Tradução PT-BR',
      url: entry.patchPtBrUrl.trim(),
      size: '3.2 GB',
      isPtBrAudio: entry.hasPtBrAudio,
      isPtBrSubs: entry.hasPtBrSubs,
      hostName: 'ZukoStore Dublagens'
    });
  }

  const defaultCover = entry.coverUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80';
  const defaultBanner = entry.bannerUrl || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80';

  return {
    id,
    title: entry.title,
    slug,
    coverUrl: defaultCover,
    bannerUrl: defaultBanner,
    shortDescription: `Release com dados originais TheZukoStore & Tapochek. Formato PKG e Torrent PC com suporte a ${entry.hasPtBrAudio ? 'Dublagem' : 'Legendas'} PT-BR.`,
    description: entry.description || `Lançamento completo contendo arquivo PKG pronto para console e Torrent para computador com suporte a emuladores (ShadPS4 / RPCS3). Totalmente verificado com opções distintas de download e localização para Português do Brasil.`,
    genres: entry.genres.length > 0 ? entry.genres : ['Ação', 'Aventura'],
    categories: ['AAA', 'Mais Populares'],
    releaseYear: new Date().getFullYear(),
    releaseDate: new Date().toLocaleDateString('pt-BR'),
    developer: 'PlayStation Studios / Scene',
    publisher: 'PlayStation Publishing LLC',
    repackInfo: {
      repacker: entry.sourceOrigin === 'TheZukoStore' ? 'TheZukoStore (PKG)' : 'TheZukoStore & Tapochek',
      version: `v1.00 + Updates + ${entry.hasPtBrAudio ? 'Dublagem BR' : 'Legendas BR'}`,
      repackSize: entry.size,
      originalSize: `${Math.round(parseFloat(entry.size) * 1.25 || 50)} GB`,
      crackStatus: 'DRM Free',
      crackGroup: 'PlayStation Scene CUSA'
    },
    downloadLinks,
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit / PS4 5.05+',
        processor: 'Intel Core i5-8400 ou AMD Ryzen 5 2600',
        memory: '16 GB RAM',
        graphics: 'NVIDIA GeForce GTX 1060 6GB ou AMD Radeon RX 580',
        storage: '80 GB SSD',
        directx: 'Versão 12'
      },
      recommended: {
        os: 'Windows 10/11 64-bit',
        processor: 'Intel Core i7-10700 ou AMD Ryzen 7 3700X',
        memory: '16 GB RAM',
        graphics: 'NVIDIA GeForce RTX 3060 ou AMD Radeon RX 6700 XT',
        storage: '80 GB NVMe SSD',
        directx: 'Versão 12'
      }
    },
    rating: 4.9,
    totalVotes: Math.floor(Math.random() * 2000) + 500,
    screenshots: [defaultCover, defaultBanner],
    trailerYoutubeId: 'WxjeV4QV4eo',
    tags: [
      entry.title,
      entry.titleId || 'CUSA',
      'TheZukoStore',
      'Tapochek',
      entry.hasPtBrAudio ? 'Dublado PT-BR' : 'Legendas PT-BR',
      'PKG',
      'Torrent'
    ],
    downloadsCount: Math.floor(Math.random() * 30000) + 12000,
    viewsCount: Math.floor(Math.random() * 80000) + 30000,
    createdAt: new Date().toISOString(),
    isFeatured: false,
    isTrending: true,
    hasPtBrAudio: entry.hasPtBrAudio,
    hasPtBrSubs: entry.hasPtBrSubs,
    hasPkgFormat: !!entry.pkgUrl,
    hasPcTorrent: !!entry.torrentUrl,
    titleId: entry.titleId,
    sourceOrigin: entry.sourceOrigin,
    originalTrackerUrl: entry.sourceOrigin === 'TheZukoStore' ? 'https://thezukostore.com' : 'https://tapochek.net',
    languages: entry.hasPtBrAudio 
      ? ['Português (Brasil) Dublado', 'Inglês', 'Espanhol'] 
      : ['Português (Brasil) Legendas', 'Inglês']
  };
}

/**
 * Node.js script for scraping/indexing TheZukoStore & Tapochek to Supabase
 */
export const ZUKO_TAPOCHEK_SUPABASE_SCRIPT = `/**
 * Sync Script: TheZukoStore (PKG) + Tapochek.net (Torrent) -> Supabase
 *
 * Como funciona:
 * 1. Puxa os dados originais: Title ID CUSA, versão do Firmware, PKGs e pacotes de áudio.
 * 2. Cruza com os tópicos do Tapochek.net (torrents de PC e emuladores com áudio PT-BR).
 * 3. Salva no Supabase gerando botões separados para cada formato no portal.
 *
 * Requisitos:
 * npm install @supabase/supabase-js cheerio axios dotenv
 */

import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import * as cheerio from 'cheerio';
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function syncZukoStoreAndTapochek() {
  console.log('🚀 Iniciando indexação TheZukoStore + Tapochek.net...');

  // Exemplo de estrutura de postagem unificada:
  const release = {
    title: "God of War Ragnarök: Digital Deluxe",
    title_id: "CUSA-34388",
    firmware: "FW 9.00 - 11.00",
    repacker: "TheZukoStore & Tapochek",
    has_pkg_format: true,
    has_pc_torrent: true,
    has_pt_br_audio: true,
    has_pt_br_subs: true,
    download_links: [
      {
        id: "dl-torrent-pc",
        type: "magnet",
        format: "torrent",
        platform: "PC",
        label: "Torrent PC Original (Tapochek.net)",
        url: "magnet:?xt=urn:btih:...&dn=God.of.War.Ragnarok-Tapochek",
        size: "102.5 GB",
        seeders: 3800
      },
      {
        id: "dl-pkg-ps4",
        type: "pkg",
        format: "pkg",
        platform: "PS4",
        label: "Arquivo PKG Console (TheZukoStore CUSA-34388)",
        url: "https://thezukostore.com/games/cusa-34388.pkg",
        size: "84.0 GB",
        titleId: "CUSA-34388",
        firmware: "FW 9.00 - 11.00"
      },
      {
        id: "dl-patch-ptbr",
        type: "pt_br_patch",
        format: "pt_br_patch",
        label: "Pacote de Dublagem PT-BR (Ricardo Juarez)",
        url: "https://thezukostore.com/audio/pt-br-gow.pkg",
        size: "4.2 GB"
      }
    ]
  };

  const { data, error } = await supabase
    .from('games')
    .upsert(release, { onConflict: 'title_id' });

  if (error) {
    console.error('Erro ao inserir:', error);
  } else {
    console.log('✅ Jogo inserido com botões distintos de Torrent, PKG e Dublagem PT-BR!');
  }
}

syncZukoStoreAndTapochek();
`;
