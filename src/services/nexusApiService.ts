/**
 * Serviço de Integração com a API Oficial do Nexus Mods
 * 
 * Documentação da API Oficial: https://api.nexusmods.com/
 * 
 * IMPORTANTE sobre a API do Nexus Mods:
 * 1. O Nexus Mods possui uma API REST oficial em https://api.nexusmods.com/v1/
 * 2. Ela EXIGE obrigatoriamente autenticação via header 'apikey: <sua-chave-pessoal>'.
 * 3. O Nexus Mods não permite requisições públicas anônimas sem API key (retorna 401 Unauthorized).
 * 4. Qualquer usuário do Nexus Mods pode obter sua chave gratuita em:
 *    https://www.nexusmods.com/users/myaccount?tab=api
 */

import { GameMod } from '../types';
import { getNexusModsGameInfo } from '../utils/nexusModsService';

const NEXUS_API_BASE = 'https://api.nexusmods.com/v1';
const STORAGE_KEY_API_KEY = 'vortex_nexusmods_api_key';

export function getStoredNexusApiKey(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(STORAGE_KEY_API_KEY) || '';
}

export function saveNexusApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  const clean = key.trim();
  if (clean) {
    localStorage.setItem(STORAGE_KEY_API_KEY, clean);
  } else {
    localStorage.removeItem(STORAGE_KEY_API_KEY);
  }
}

export interface NexusApiModItem {
  name: string;
  summary: string;
  description: string;
  mod_id: number;
  game_id: number;
  domain_name: string;
  category_id: number;
  version: string;
  author: string;
  uploaded_timestamp: number;
  downloads: number;
  endorsements: number;
}

/**
 * Consulta a API oficial do Nexus Mods para trazer os mods em alta (Trending)
 * caso o usuário tenha informado sua chave pessoal, ou faz fallback seguro
 * para a base canônica do Vortex sem nunca retornar erro 404.
 */
export async function fetchNexusModsForGame(
  gameTitle: string, 
  platform?: string
): Promise<{
  source: 'api' | 'curated';
  mods: GameMod[];
  gameSlug: string | null;
  hubUrl: string;
  message?: string;
}> {
  const info = getNexusModsGameInfo(gameTitle, platform);
  const apiKey = getStoredNexusApiKey();

  if (!info.slug || !apiKey) {
    return {
      source: 'curated',
      mods: info.verifiedMods,
      gameSlug: info.slug,
      hubUrl: info.hubUrl,
      message: !apiKey 
        ? 'Utilizando base verificada (Para dados em tempo real da API do Nexus, informe sua API Key gratuita).'
        : undefined
    };
  }

  try {
    const res = await fetch(`${NEXUS_API_BASE}/games/${info.slug}/mods/trending.json`, {
      headers: {
        'apikey': apiKey,
        'Application-Name': 'VortexGames',
        'Application-Version': '2.5.0'
      }
    });

    if (!res.ok) {
      if (res.status === 401) {
        return {
          source: 'curated',
          mods: info.verifiedMods,
          gameSlug: info.slug,
          hubUrl: info.hubUrl,
          message: 'Chave de API do Nexus Mods inválida ou expirada. Utilizando base verificada.'
        };
      }
      throw new Error(`HTTP ${res.status}`);
    }

    const items: NexusApiModItem[] = await res.json();
    if (Array.isArray(items) && items.length > 0) {
      const topMods: GameMod[] = items.slice(0, 8).map(m => ({
        id: `nexus-${info.slug}-${m.mod_id}`,
        title: m.name,
        description: m.summary || 'Mod verificado e popular da comunidade no Nexus Mods.',
        nexusUrl: `https://www.nexusmods.com/${info.slug}/mods/${m.mod_id}`,
        category: 'Trending',
        author: m.author,
        downloadsCount: m.downloads ? (m.downloads > 1000 ? `${(m.downloads / 1000).toFixed(1)}k` : `${m.downloads}`) : 'Oficial',
        likesCount: m.endorsements ? `${m.endorsements}` : undefined
      }));

      return {
        source: 'api',
        mods: topMods,
        gameSlug: info.slug,
        hubUrl: info.hubUrl,
        message: `✓ Conectado à API Oficial do Nexus Mods! ${topMods.length} mods em alta carregados.`
      };
    }
  } catch (err) {
    console.warn('Falha na requisição à API do Nexus Mods, usando base verificada:', err);
  }

  return {
    source: 'curated',
    mods: info.verifiedMods,
    gameSlug: info.slug,
    hubUrl: info.hubUrl
  };
}
