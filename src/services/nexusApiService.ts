/**
 * Serviço de Integração com a API Oficial do Nexus Mods
 * 
 * Documentação da API Oficial: https://api.nexusmods.com/
 */

import { GameMod } from '../types';
import { getNexusModsGameInfo } from '../utils/nexusModsService';

const NEXUS_API_BASE = 'https://api.nexusmods.com/v1';
const STORAGE_KEY_API_KEY = 'vortex_nexusmods_api_key';

// Chave oficial do criador (manof1) pré-integrada no Vortex Games
export const DEFAULT_NEXUS_API_KEY = '/yRBULn8ic7+rpVMO63geT4EXIBi2z7aQ8rXmfx5kamz--BLoXrBunJxRmi3CX--FO0JMmR6GvUf90SPk+ALhw==';

export function getStoredNexusApiKey(): string {
  if (typeof window === 'undefined') return DEFAULT_NEXUS_API_KEY;
  return localStorage.getItem(STORAGE_KEY_API_KEY) || DEFAULT_NEXUS_API_KEY;
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
 * Valida a chave de API diretamente contra o Nexus Mods
 */
export async function validateNexusApiKey(key: string): Promise<{
  valid: boolean;
  name?: string;
  userId?: number;
  email?: string;
  isSupporter?: boolean;
  error?: string;
}> {
  try {
    const res = await fetch(`${NEXUS_API_BASE}/users/validate.json`, {
      headers: {
        'apikey': key.trim(),
        'Application-Name': 'VortexGames',
        'Application-Version': '2.5.0'
      }
    });

    if (res.ok) {
      const data = await res.json();
      return {
        valid: true,
        name: data.name,
        userId: data.user_id,
        email: data.email,
        isSupporter: data['is_supporter?'] || data.is_supporter
      };
    }
    return { valid: false, error: 'Chave recusada pela API do Nexus Mods.' };
  } catch (err: any) {
    return { valid: false, error: err.message || 'Erro de conexão com o Nexus Mods.' };
  }
}

/**
 * Consulta a API oficial do Nexus Mods para trazer os mods em alta (Trending)
 * ou faz fallback seguro para a base canônica do Vortex sem nunca retornar erro 404.
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
      hubUrl: info.hubUrl
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
          message: 'Chave de API do Nexus Mods expirada. Utilizando base verificada.'
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
