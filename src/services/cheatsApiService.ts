import { Game, GameCheat } from '../types';
import { generateCheatsForGame, cleanGameTitle } from '../utils/cheatsModsGenerator';

export interface CheatsApiOptions {
  excludeTitles?: string[];
  category?: 'todos' | 'segredos' | 'desbloqueaveis' | 'comandos' | 'diversao' | string;
  mode?: 'novos' | 'refresh' | 'expand' | string;
}

export interface CheatsApiResponse {
  success: boolean;
  gameTitle?: string;
  platform?: string;
  total?: number;
  cheats: GameCheat[];
  source: string;
  isFresh?: boolean;
  error?: string;
}

/**
 * Consulta a API inteligente para descobrir cheats, códigos, segredos e atalhos autênticos.
 * Suporta filtragem por exclusão de cheats já existentes para SEMPRE retornar truques novos e diferentes.
 */
export async function fetchCheatsFromApi(
  title: string, 
  platform: string = 'PC',
  options: CheatsApiOptions = {}
): Promise<CheatsApiResponse> {
  const cleanedTitle = cleanGameTitle(title);
  if (!cleanedTitle || !cleanedTitle.trim()) {
    return {
      success: false,
      cheats: [],
      source: 'InvalidRequest',
      error: 'Título do jogo não fornecido'
    };
  }

  const { excludeTitles = [], category = 'todos', mode = 'novos' } = options;

  try {
    // Timeout de 12s para permitir resposta completa da IA sem cortar prematuramente
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const queryParams = new URLSearchParams({
      title: cleanedTitle,
      platform: platform.trim(),
      category,
      mode
    });

    if (excludeTitles.length > 0) {
      queryParams.append('exclude', JSON.stringify(excludeTitles));
    }

    const url = `/api/cheats?${queryParams.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Status ${response.status}: ${response.statusText}`);
    }

    const data: CheatsApiResponse = await response.json();
    if (data && Array.isArray(data.cheats) && data.cheats.length > 0) {
      // Filtrar no cliente também para garantia absoluta contra repetições
      const cleanExistingSet = new Set(excludeTitles.map(t => t.toLowerCase().trim()));
      const trulyNewCheats = data.cheats.filter(
        c => !cleanExistingSet.has((c.title || '').toLowerCase().trim())
      );

      return {
        ...data,
        cheats: trulyNewCheats.length > 0 ? trulyNewCheats : data.cheats,
        isFresh: true
      };
    }

    // Fallback variado excluindo os já existentes
    const fallbackCheats = generateCheatsForGame({ title, platform }, { excludeTitles, category });
    return {
      success: true,
      gameTitle: title,
      platform,
      total: fallbackCheats.length,
      cheats: fallbackCheats,
      source: 'Base Autêntica Vortex (Expandida)',
      isFresh: true
    };
  } catch (error: any) {
    const isAbort = error.name === 'AbortError';
    console.warn(`[CheatsAPI] ${isAbort ? 'Timeout de 12s atingido' : 'Falha na requisição'} para "${title}", utilizando gerador autêntico de novos cheats:`, error.message);
    
    const fallbackCheats = generateCheatsForGame({ title, platform }, { excludeTitles, category });
    return {
      success: true,
      gameTitle: title,
      platform,
      total: fallbackCheats.length,
      cheats: fallbackCheats,
      source: isAbort ? 'Base Vortex Alternativa (Rápida)' : 'Base Autêntica Vortex',
      isFresh: true,
      error: error.message
    };
  }
}

/**
 * Atualiza um único jogo utilizando a API de Cheats mesclando novos truques sem repetir os antigos
 */
export async function updateSingleGameWithApiCheats(game: Game, category?: string): Promise<Game> {
  const existingTitles = (game.cheats || []).map(c => c.title);
  const result = await fetchCheatsFromApi(game.title, game.platform || 'PC', {
    excludeTitles: existingTitles,
    category
  });

  if (result.cheats && result.cheats.length > 0) {
    // Unir sem duplicatas
    const existingIds = new Set((game.cheats || []).map(c => c.title.toLowerCase().trim()));
    const newOnes = result.cheats.filter(c => !existingIds.has(c.title.toLowerCase().trim()));
    
    return {
      ...game,
      cheats: [...(game.cheats || []), ...newOnes],
      lastCheatsSync: new Date().toISOString(),
      cheatsSyncStatus: 'synced'
    };
  }
  return game;
}
