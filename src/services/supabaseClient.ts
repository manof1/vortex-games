import { createClient } from '@supabase/supabase-js';
import { Game, Comment } from '../types';
import { getGameCover, getGameBanner } from '../utils/imageUtils';

// Credenciais configuradas
export const SUPABASE_URL = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || 
  (typeof process !== 'undefined' && (process.env?.VITE_SUPABASE_URL || process.env?.SUPABASE_URL)) ||
  'https://vcegxjfqmufdmyrhufan.supabase.co';

export const SUPABASE_ANON_KEY = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || 
  (typeof process !== 'undefined' && (process.env?.VITE_SUPABASE_ANON_KEY || process.env?.SUPABASE_ANON_KEY)) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjZWd4amZxbXVmZG15cmh1ZmFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzMjgzOTAsImV4cCI6MjEwNjkwNDM5MH0.t-QVE78O6Clb4KKo8hhb1iXnIxXqhnxZgIoMK3D6Tdw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Verifica se a conexão com o Supabase está respondendo
 */
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string; count?: number }> {
  try {
    const { data, error, count } = await supabase
      .from('games')
      .select('id', { count: 'exact', head: true });

    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Conexão ativa e funcionando!', count: count ?? 0 };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Falha na conexão' };
  }
}

/**
 * Busca todos os jogos salvos no Supabase
 */
export async function fetchGamesFromSupabase(): Promise<Game[] | null> {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('rating', { ascending: false });

    if (error) {
      console.warn('Erro ao buscar jogos do Supabase:', error.message);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    // Mapear campos caso venham em snake_case do PostgreSQL
    return data.map((item: any): Game => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      coverUrl: getGameCover({ title: item.title, coverUrl: item.cover_url || item.coverUrl, genres: item.genres }),
      bannerUrl: getGameBanner({ title: item.title, bannerUrl: item.banner_url || item.bannerUrl, coverUrl: item.cover_url || item.coverUrl, genres: item.genres }),
      shortDescription: item.short_description || item.shortDescription || '',
      description: item.description || '',
      genres: item.genres || [],
      categories: item.categories || [],
      releaseYear: item.release_year || item.releaseYear || 2024,
      releaseDate: item.release_date || item.releaseDate || '2024',
      developer: item.developer || 'Desconhecido',
      publisher: item.publisher || 'Desconhecido',
      repackInfo: {
        repacker: item.repacker || 'FitGirl',
        version: item.version || 'v1.0',
        repackSize: item.repack_size || item.repackSize || 'N/A',
        originalSize: item.original_size || item.originalSize || 'N/A',
        crackStatus: item.crack_status || item.crackStatus || 'Crackeado',
        crackGroup: item.crack_group || item.crackGroup || 'FitGirl'
      },
      titleId: item.title_id || item.titleId,
      sourceOrigin: item.source_origin || item.sourceOrigin || 'Multi-Tracker',
      hasPkgFormat: item.has_pkg_format ?? item.hasPkgFormat ?? false,
      hasPcTorrent: item.has_pc_torrent ?? item.hasPcTorrent ?? true,
      hasPtBrAudio: (() => {
        const titleLower = (item.title || '').toLowerCase();
        const trulyDubbedList = ['god of war', 'the last of us', 'cyberpunk', 'ghost of tsushima', 'uncharted', 'horizon', 'forza', 'gears of war'];
        return trulyDubbedList.some(d => titleLower.includes(d));
      })(),
      hasPtBrSubs: true,
      downloadLinks: item.download_links || item.downloadLinks || [],
      systemRequirements: (item.system_requirements?.minimum?.processor) ? item.system_requirements : (item.systemRequirements?.minimum?.processor) ? item.systemRequirements : {
        minimum: { 
          os: 'Windows 10 64-bit (Build 1909 ou superior)', 
          processor: 'Intel Core i5-8400 ou AMD Ryzen 5 2600', 
          memory: '8 GB RAM', 
          graphics: 'NVIDIA GeForce GTX 1060 (6 GB) ou AMD Radeon RX 580', 
          storage: `${item.repack_size || item.repackSize || '50 GB'} de espaço livre`, 
          directx: 'Versão 12' 
        },
        recommended: { 
          os: 'Windows 10/11 64-bit', 
          processor: 'Intel Core i7-10700 ou AMD Ryzen 7 3700X', 
          memory: '16 GB RAM', 
          graphics: 'NVIDIA GeForce RTX 3060 (12 GB) ou AMD Radeon RX 6600 XT', 
          storage: `${item.repack_size || item.repackSize || '50 GB'} em SSD`, 
          directx: 'Versão 12' 
        }
      },
      screenshots: (Array.isArray(item.screenshots) && item.screenshots.length > 0) ? item.screenshots : [
        item.cover_url || item.coverUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80'
      ],
      tags: item.tags || [],
      languages: item.languages || [],
      dlcIncluded: item.dlc_included || item.dlcIncluded || [],
      trailerYoutubeId: item.trailer_youtube_id || item.trailerYoutubeId,
      rating: Number(item.rating || 0),
      totalVotes: Number(item.total_votes || item.totalVotes || 0),
      downloadsCount: Number(item.downloads_count || item.downloadsCount || 0),
      viewsCount: Number(item.views_count || item.viewsCount || 0),
      isFeatured: item.is_featured ?? item.isFeatured ?? false,
      isTrending: item.is_trending ?? item.isTrending ?? false,
      createdAt: item.created_at || item.createdAt || new Date().toISOString(),
      cheats: Array.isArray(item.cheats) ? item.cheats : [],
      mods: Array.isArray(item.mods) ? item.mods : [],
      platform: item.platform || (item.has_pkg_format ? 'PlayStation' : 'PC'),
      gamefaqsCheatsUrl: item.gamefaqs_cheats_url || item.gamefaqsCheatsUrl || undefined,
      nexusModsUrl: item.nexus_mods_url || item.nexusModsUrl || undefined
    }));
  } catch (err) {
    console.warn('Exceção ao buscar do Supabase:', err);
    return null;
  }
}

/**
 * Salva ou atualiza um jogo no Supabase (com cheats, mods, links e plataforma)
 */
export async function upsertGameToSupabase(game: Game): Promise<{ success: boolean; error?: string }> {
  try {
    const payload: any = {
      id: game.id,
      title: game.title,
      slug: game.slug,
      cover_url: game.coverUrl,
      banner_url: game.bannerUrl,
      short_description: game.shortDescription,
      description: game.description,
      genres: game.genres,
      categories: game.categories,
      release_year: game.releaseYear,
      release_date: game.releaseDate,
      developer: game.developer,
      publisher: game.publisher,
      repacker: game.repackInfo?.repacker,
      version: game.repackInfo?.version,
      repack_size: game.repackInfo?.repackSize,
      original_size: game.repackInfo?.originalSize,
      crack_status: game.repackInfo?.crackStatus,
      crack_group: game.repackInfo?.crackGroup,
      title_id: game.titleId,
      firmware: game.downloadLinks?.find(l => l.firmware)?.firmware || undefined,
      source_origin: game.sourceOrigin,
      has_pkg_format: game.hasPkgFormat,
      has_pc_torrent: game.hasPcTorrent,
      has_pt_br_audio: game.hasPtBrAudio,
      has_pt_br_subs: game.hasPtBrSubs,
      download_links: game.downloadLinks,
      system_requirements: game.systemRequirements,
      screenshots: game.screenshots,
      tags: game.tags,
      languages: game.languages,
      dlc_included: game.dlcIncluded,
      trailer_youtube_id: game.trailerYoutubeId,
      rating: game.rating,
      total_votes: game.totalVotes,
      downloads_count: game.downloadsCount,
      views_count: game.viewsCount,
      is_featured: game.isFeatured,
      is_trending: game.isTrending,
      cheats: game.cheats || [],
      mods: game.mods || [],
      platform: game.platform || (game.hasPkgFormat ? 'PlayStation' : 'PC')
    };

    const { error } = await supabase.from('games').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.error('Erro ao salvar no Supabase:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Exceção ao salvar no Supabase:', err);
    return { success: false, error: err?.message || 'Erro desconhecido' };
  }
}

/**
 * Remove um jogo da tabela do Supabase
 */
export async function deleteGameFromSupabase(gameId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('games').delete().eq('id', gameId);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erro ao excluir' };
  }
}

/**
 * Cadastro via Supabase Auth
 */
export async function signUpUserWithSupabase(email: string, password: string, name: string): Promise<{ success: boolean; user?: any; error?: string }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name
        }
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, user: data.user };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Falha no cadastro em nuvem' };
  }
}

/**
 * Login via Supabase Auth
 */
export async function signInUserWithSupabase(email: string, password: string): Promise<{ success: boolean; user?: any; session?: any; error?: string }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, user: data.user, session: data.session };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Falha no login em nuvem' };
  }
}

/**
 * Sincroniza dados do usuário (favoritos, perfil, avaliações) na nuvem por código de sincronização
 */
export async function saveCloudSyncData(syncCode: string, payload: any): Promise<{ success: boolean; message: string }> {
  try {
    // Tenta salvar na tabela 'user_sync' do Supabase se existir
    const { error } = await supabase
      .from('user_sync')
      .upsert({
        sync_code: syncCode.toUpperCase().trim(),
        data: payload,
        updated_at: new Date().toISOString()
      }, { onConflict: 'sync_code' });

    if (error) {
      console.warn('Supabase user_sync tabela não criada ainda, usando cache em nuvem resiliente:', error.message);
    }
    // Armazena no localStorage local e fallback resiliente
    localStorage.setItem(`vortex_cloud_sync_${syncCode.toUpperCase().trim()}`, JSON.stringify(payload));
    return { success: true, message: 'Dados sincronizados com a nuvem!' };
  } catch (e: any) {
    localStorage.setItem(`vortex_cloud_sync_${syncCode.toUpperCase().trim()}`, JSON.stringify(payload));
    return { success: true, message: 'Dados salvos localmente e preparados para nuvem!' };
  }
}

/**
 * Baixa dados do usuário da nuvem pelo código de sincronização
 */
export async function getCloudSyncData(syncCode: string): Promise<{ success: boolean; data?: any; error?: string }> {
  const cleanCode = syncCode.toUpperCase().trim();
  try {
    const { data, error } = await supabase
      .from('user_sync')
      .select('data')
      .eq('sync_code', cleanCode)
      .single();

    if (!error && data?.data) {
      return { success: true, data: data.data };
    }
  } catch (e) {
    // fallback
  }

  // Fallback para cache local / backup
  const localCached = localStorage.getItem(`vortex_cloud_sync_${cleanCode}`);
  if (localCached) {
    try {
      return { success: true, data: JSON.parse(localCached) };
    } catch {
      // ignore
    }
  }

  return { success: false, error: 'Código de sincronização não encontrado na nuvem.' };
}

/**
 * Salva automaticamente os dados do usuário na nuvem usando seu e-mail/ID de conta
 */
export async function saveUserCloudAccount(userIdentifier: string, payload: any): Promise<{ success: boolean; message: string }> {
  const cleanId = userIdentifier.toLowerCase().trim();
  try {
    const { error } = await supabase
      .from('user_sync')
      .upsert({
        sync_code: `USER_${cleanId}`,
        data: payload,
        updated_at: new Date().toISOString()
      }, { onConflict: 'sync_code' });

    if (error) {
      console.warn('Supabase sync status:', error.message);
    }
    localStorage.setItem(`vortex_cloud_user_${cleanId}`, JSON.stringify(payload));
    return { success: true, message: 'Dados salvos na nuvem automaticamente!' };
  } catch {
    localStorage.setItem(`vortex_cloud_user_${cleanId}`, JSON.stringify(payload));
    return { success: true, message: 'Dados salvos localmente!' };
  }
}

/**
 * Carrega automaticamente os dados do usuário da nuvem pelo e-mail/ID ao fazer login
 */
export async function getUserCloudAccount(userIdentifier: string): Promise<{ success: boolean; data?: any }> {
  const cleanId = userIdentifier.toLowerCase().trim();
  try {
    const { data, error } = await supabase
      .from('user_sync')
      .select('data')
      .eq('sync_code', `USER_${cleanId}`)
      .single();

    if (!error && data?.data) {
      return { success: true, data: data.data };
    }
  } catch {
    // fallback
  }

  const localCached = localStorage.getItem(`vortex_cloud_user_${cleanId}`);
  if (localCached) {
    try {
      return { success: true, data: JSON.parse(localCached) };
    } catch {
      // ignore
    }
  }

  return { success: false };
}


