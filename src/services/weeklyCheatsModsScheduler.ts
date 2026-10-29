import { Game } from '../types';
import { enrichGameWithCheatsAndMods } from '../utils/cheatsModsGenerator';

export interface SundaySyncLog {
  id: string;
  timestamp: string;
  title: string;
  detail: string;
  type: 'success' | 'info' | 'weekly';
}

export interface SundaySyncInfo {
  enabled: boolean;
  scheduleDay: string; // 'Todo Domingo'
  scheduleTime: string; // '00:00 BRT'
  lastSyncDate: string | null;
  lastSyncFormatted: string;
  nextSyncDate: string;
  nextSyncFormatted: string;
  totalGamesCovered: number;
  totalCheatsActive: number;
  totalModsActive: number;
  logs: SundaySyncLog[];
}

const STORAGE_KEY = 'vortex_sunday_sync_info';

// Calcula o próximo domingo às 00:00:00
export function getNextSundayDate(): Date {
  const now = new Date();
  const nextSunday = new Date(now);
  const currentDay = now.getDay(); // 0 = Domingo, 1 = Segunda, etc.
  const daysUntilNextSunday = currentDay === 0 ? 7 : 7 - currentDay;

  nextSunday.setDate(now.getDate() + daysUntilNextSunday);
  nextSunday.setHours(0, 0, 0, 0);
  return nextSunday;
}

// Verifica se hoje é domingo
export function isTodaySunday(): boolean {
  return new Date().getDay() === 0;
}

// Formata data amigável em Português
export function formatFriendlyDate(date: Date | string | null): string {
  if (!date) return 'Pendente (Primeira Execução Agendada)';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'Pendente';
  
  return d.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Carrega as informações atuais do Agendador de Domingo
export function loadSundaySyncInfo(currentGames: Game[] = []): SundaySyncInfo {
  const nextSunday = getNextSundayDate();
  const nextSyncFormatted = formatFriendlyDate(nextSunday);

  let stored: Partial<SundaySyncInfo> = {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      stored = JSON.parse(raw);
    }
  } catch (e) {
    console.error('Falha ao ler status do Sunday Sync', e);
  }

  // Contagem dinâmica
  let cheatsCount = 0;
  let modsCount = 0;
  currentGames.forEach(g => {
    cheatsCount += g.cheats?.length || 0;
    modsCount += g.mods?.length || 0;
  });

  const defaultLogs: SundaySyncLog[] = [
    {
      id: 'log-sched-init',
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      title: 'Rotina Semanal de Domingo Programada',
      detail: `Agendamento ativado: Todo domingo às 00:00 a rotina sincroniza Cheats e Mods para todos os jogos.`,
      type: 'info'
    }
  ];

  return {
    enabled: stored.enabled !== undefined ? stored.enabled : true,
    scheduleDay: 'Todo Domingo',
    scheduleTime: '00:00 BRT',
    lastSyncDate: stored.lastSyncDate || null,
    lastSyncFormatted: stored.lastSyncDate ? formatFriendlyDate(stored.lastSyncDate) : 'Sincronizado na inicialização',
    nextSyncDate: stored.nextSyncDate || nextSunday.toISOString(),
    nextSyncFormatted: stored.nextSyncFormatted || nextSyncFormatted,
    totalGamesCovered: currentGames.length,
    totalCheatsActive: cheatsCount,
    totalModsActive: modsCount,
    logs: stored.logs && stored.logs.length > 0 ? stored.logs : defaultLogs
  };
}

// Salva informações do Agendador de Domingo
export function saveSundaySyncInfo(info: SundaySyncInfo): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
  } catch (e) {
    console.error('Falha ao salvar Sunday Sync Info', e);
  }
}

// Executa a sincronização completa de Domingo para TODOS os jogos
export function executeSundayCheatsModsSync(
  games: Game[],
  isManualTrigger = false
): {
  updatedGames: Game[];
  syncInfo: SundaySyncInfo;
  updatedCount: number;
  totalCheats: number;
  totalMods: number;
} {
  const now = new Date();
  const nextSunday = getNextSundayDate();

  let updatedCount = 0;
  let totalCheats = 0;
  let totalMods = 0;

  // Processa e enriquece 100% dos jogos
  const updatedGames = games.map(game => {
    const enriched = enrichGameWithCheatsAndMods({
      ...game,
      lastCheatsSync: now.toISOString(),
      cheatsSyncStatus: 'synced'
    }, true);
    updatedCount++;
    totalCheats += enriched.cheats?.length || 0;
    totalMods += enriched.mods?.length || 0;
    return enriched;
  });

  // Atualiza também no localStorage principal do Vortex
  try {
    localStorage.setItem('vortex_games', JSON.stringify(updatedGames));
  } catch (e) {
    console.warn('Erro ao salvar jogos sincronizados no storage', e);
  }

  const prevInfo = loadSundaySyncInfo(updatedGames);

  const newLog: SundaySyncLog = {
    id: `sunday-sync-${Date.now()}`,
    timestamp: now.toLocaleTimeString('pt-BR'),
    title: isManualTrigger
      ? '🚀 Atualização Semanal de Cheats Executada Manualmente'
      : '📅 Rotina Automática Semanal de Cheats Executada com Sucesso',
    detail: `Sincronizados 100% dos jogos (${updatedGames.length} títulos). Total ativo: ${totalCheats} Cheats verificados e ${totalMods} Mods do Nexus Mods.`,
    type: 'weekly'
  };

  const updatedSyncInfo: SundaySyncInfo = {
    ...prevInfo,
    lastSyncDate: now.toISOString(),
    lastSyncFormatted: formatFriendlyDate(now),
    nextSyncDate: nextSunday.toISOString(),
    nextSyncFormatted: formatFriendlyDate(nextSunday),
    totalGamesCovered: updatedGames.length,
    totalCheatsActive: totalCheats,
    totalModsActive: totalMods,
    logs: [newLog, ...(prevInfo.logs || []).slice(0, 19)]
  };

  saveSundaySyncInfo(updatedSyncInfo);

  return {
    updatedGames,
    syncInfo: updatedSyncInfo,
    updatedCount,
    totalCheats,
    totalMods
  };
}

// Checagem automática que roda ao inicializar o app
export function checkAndRunScheduledSundaySync(
  games: Game[]
): { executed: boolean; updatedGames?: Game[]; syncInfo?: SundaySyncInfo } {
  const info = loadSundaySyncInfo(games);
  if (!info.enabled) return { executed: false };

  const now = new Date();
  const isSunday = now.getDay() === 0;

  // Verifica se já rodou no mesmo dia
  let alreadyRanToday = false;
  let isWeeklyExpired = false;

  if (info.lastSyncDate) {
    const lastDate = new Date(info.lastSyncDate);
    const isSameDay =
      lastDate.getFullYear() === now.getFullYear() &&
      lastDate.getMonth() === now.getMonth() &&
      lastDate.getDate() === now.getDate();
    alreadyRanToday = isSameDay;

    const daysDiff = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff >= 7) {
      isWeeklyExpired = true;
    }
  } else {
    isWeeklyExpired = true;
  }

  // Se faz 7 dias ou mais, ou se é domingo e ainda não rodou hoje:
  if ((isSunday && !alreadyRanToday) || isWeeklyExpired) {
    const result = executeSundayCheatsModsSync(games, false);
    return {
      executed: true,
      updatedGames: result.updatedGames,
      syncInfo: result.syncInfo
    };
  }

  // Caso algum jogo ainda não tenha cheats salvos em 100%, sincroniza e salva imediatamente
  const hasGamesWithoutCheats = games.some(
    g => !g.cheats || g.cheats.length === 0 || !g.mods || g.mods.length === 0
  );
  if (hasGamesWithoutCheats) {
    const result = executeSundayCheatsModsSync(games, false);
    return {
      executed: true,
      updatedGames: result.updatedGames,
      syncInfo: result.syncInfo
    };
  }

  return { executed: false };
}
