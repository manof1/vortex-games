import { Game, GameCheat } from '../types';

/**
 * Serviço de Integração com o LibRetro Database (GitHub)
 * https://github.com/libretro/libretro-database
 * 
 * Permite buscar cheats oficiais em formato .cht e gerar arquivos prontos
 * para emuladores (RetroArch, DuckStation, PCSX2, PPSSPP, mupen64plus).
 */

export function getLibRetroPlatformFolder(platform: string = ''): string {
  const p = platform.toLowerCase();
  if (p.includes('ps1') || p.includes('playstation 1')) return 'Sony - PlayStation';
  if (p.includes('ps2') || p.includes('playstation 2')) return 'Sony - PlayStation 2';
  if (p.includes('psp')) return 'Sony - PlayStation Portable';
  if (p.includes('gba') || p.includes('advance')) return 'Nintendo - Game Boy Advance';
  if (p.includes('n64') || p.includes('nintendo 64')) return 'Nintendo - Nintendo 64 (Aleck64)';
  if (p.includes('snes') || p.includes('super nintendo')) return 'Nintendo - Super Nintendo Entertainment System';
  if (p.includes('genesis') || p.includes('mega drive')) return 'Sega - Mega Drive - Genesis';
  return 'Sony - PlayStation 2';
}

export function getLibRetroGitHubRepoUrl(platform?: string): string {
  const folder = getLibRetroPlatformFolder(platform);
  return `https://github.com/libretro/libretro-database/tree/master/cht/${encodeURIComponent(folder)}`;
}

/**
 * Converte a lista de cheats do jogo no formato oficial de arquivo .CHT do LibRetro/RetroArch
 */
export function formatAsLibRetroCht(game: Game): string {
  const cheats = game.cheats || [];
  if (cheats.length === 0) {
    return `# LibRetro Cheat File for ${game.title}\ncheats = 0\n`;
  }

  let content = `# ==========================================================\n`;
  content += `# LibRetro / RetroArch Official Cheat File\n`;
  content += `# Game: ${game.title}\n`;
  content += `# Platform: ${game.platform || 'Console / Emulador'}\n`;
  content += `# Source: VortexGames / LibRetro Community Database\n`;
  content += `# ==========================================================\n\n`;
  content += `cheats = ${cheats.length}\n\n`;

  cheats.forEach((cheat, index) => {
    const cleanDesc = (cheat.title || `Cheat ${index + 1}`).replace(/"/g, "'");
    const cleanCode = (cheat.codeOrEffect || '00000000 0000').replace(/[\r\n]/g, ' ');

    content += `cheat${index}_desc = "${cleanDesc}"\n`;
    content += `cheat${index}_code = "${cleanCode}"\n`;
    content += `cheat${index}_enable = false\n\n`;
  });

  return content;
}

/**
 * Dispara o download de um arquivo .cht pronto para o emulador
 */
export function downloadLibRetroChtFile(game: Game): void {
  const content = formatAsLibRetroCht(game);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const safeFilename = `${game.slug || 'game'}-cheats.cht`;

  const link = document.createElement('a');
  link.href = url;
  link.download = safeFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
