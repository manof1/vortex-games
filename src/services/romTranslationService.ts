/**
 * Serviço de Banco de Dados de Traduções PT-BR para Consoles
 * Cobre clássicos de PS1, PS2, PS3, PSP, GBA, N64, SNES, Genesis, etc.
 * Mapeia grupos de tradução reconhecidos (João13, Monkey's, Nemesis, Tribo Gamer, etc.)
 */

export interface RomTranslationEntry {
  gameTitle: string;
  aliases: string[];
  platform: 'PS1' | 'PS2' | 'PS3' | 'PSP' | 'GBA' | 'N64' | 'SNES' | 'Mega Drive' | 'GameCube' | 'Switch' | string;
  translatedTitle?: string;
  translationType: 'Dublado & Legendado' | 'Dublado PT-BR' | 'Legendado PT-BR' | 'Textos & Menus';
  team: string;
  releaseYear?: number;
  status: '100% Completo' | '98% Revisado' | 'Beta Funcional';
  patchFormat: 'ISO Pré-patcheada' | 'Patch XDELTA' | 'Patch IPS' | 'Patch PPF' | 'PKG PT-BR';
  notes: string;
  downloadUrl?: string;
}

export const BRAZILIAN_TRANSLATIONS_DATABASE: RomTranslationEntry[] = [
  // --- PLAYSTATION 2 ---
  {
    gameTitle: 'God of War II',
    aliases: ['god of war 2', 'gow 2', 'gow ii'],
    platform: 'PS2',
    translatedTitle: 'God of War II (Dublado & Legendado PT-BR)',
    translationType: 'Dublado & Legendado',
    team: 'Nemesis Fandubs & Equipe Brazukas',
    status: '100% Completo',
    patchFormat: 'ISO Pré-patcheada',
    notes: 'Dublagem brasileira completa para Kratos, deuses e cutscenes, com fontes e legendas 100% adaptadas.',
    downloadUrl: 'https://romspure.cc/roms/sony-playstation-2/god-of-war-ii-pt-br/'
  },
  {
    gameTitle: 'God of War',
    aliases: ['god of war 1', 'gow 1', 'gow'],
    platform: 'PS2',
    translatedTitle: 'God of War (Dublado & Legendado PT-BR)',
    translationType: 'Dublado & Legendado',
    team: 'Nemesis Fandubs',
    status: '100% Completo',
    patchFormat: 'ISO Pré-patcheada',
    notes: 'Dublagem clássica completa com vozes em português de alta qualidade e diálogos revisados.',
    downloadUrl: 'https://romspure.cc/roms/sony-playstation-2/god-of-war-pt-br/'
  },
  {
    gameTitle: 'Resident Evil 4',
    aliases: ['re4', 'resident evil 4 ps2', 'biohazard 4'],
    platform: 'PS2',
    translatedTitle: 'Resident Evil 4 (Legendado PT-BR Oficial da Comunidade)',
    translationType: 'Legendado PT-BR',
    team: 'Central de Traduções / João13',
    status: '100% Completo',
    patchFormat: 'ISO Pré-patcheada',
    notes: 'Textos, arquivos de rádio da Hunnigan, inventário e diários 100% traduzidos com acentuação original.',
    downloadUrl: 'https://romspure.cc/roms/sony-playstation-2/resident-evil-4-pt-br/'
  },
  {
    gameTitle: 'Silent Hill 2',
    aliases: ['sh2', 'silent hill 2 ps2'],
    platform: 'PS2',
    translatedTitle: 'Silent Hill 2: Director\'s Cut (PT-BR)',
    translationType: 'Legendado PT-BR',
    team: 'Monkey\'s Traduções & Silent Hill Brasil',
    status: '100% Completo',
    patchFormat: 'Patch XDELTA',
    notes: 'Tradução psicológica cuidadosa, incluindo enigmas de poesia, cartas e os finais secretos.',
    downloadUrl: 'https://romspure.cc/roms/sony-playstation-2/silent-hill-2-pt-br/'
  },
  {
    gameTitle: 'Shadow of the Colossus',
    aliases: ['sotc', 'shadow of the colossus ps2', 'wander and the colossus'],
    platform: 'PS2',
    translatedTitle: 'Shadow of the Colossus (PT-BR)',
    translationType: 'Legendado PT-BR',
    team: 'Equipe João13 & Central de Traduções',
    status: '100% Completo',
    patchFormat: 'ISO Pré-patcheada',
    notes: 'Legendas do dialeto antigo de Dormin e textos da narração inicial traduzidos poeticamente.',
    downloadUrl: 'https://romspure.cc/roms/sony-playstation-2/shadow-of-the-colossus-pt-br/'
  },
  {
    gameTitle: 'Grand Theft Auto: San Andreas',
    aliases: ['gta sa', 'gta san andreas', 'san andreas'],
    platform: 'PS2',
    translatedTitle: 'GTA San Andreas (Legendado PT-BR V2)',
    translationType: 'Legendado PT-BR',
    team: 'Brazukas & GameVicio Archive',
    status: '100% Completo',
    patchFormat: 'ISO Pré-patcheada',
    notes: 'Todas as gírias de Los Santos e diálogos de CJ adaptados ao português brasileiro.',
    downloadUrl: 'https://romspure.cc/roms/sony-playstation-2/grand-theft-auto-san-andreas-pt-br/'
  },
  {
    gameTitle: 'Bully',
    aliases: ['canis canem edit', 'bully ps2'],
    platform: 'PS2',
    translatedTitle: 'Bully (Canis Canem Edit) PT-BR',
    translationType: 'Legendado PT-BR',
    team: 'Tribo Gamer / Brazukas',
    status: '100% Completo',
    patchFormat: 'ISO Pré-patcheada',
    notes: 'Aulas de inglês adaptadas para português e todas as falas da Bullworth Academy traduzidas.',
    downloadUrl: 'https://romspure.cc/roms/sony-playstation-2/bully-pt-br/'
  },
  {
    gameTitle: 'Black',
    aliases: ['black ps2', 'black criterion'],
    platform: 'PS2',
    translatedTitle: 'Black (Dublado & Legendado PT-BR)',
    translationType: 'Dublado & Legendado',
    team: 'Nemesis Fandubs',
    status: '100% Completo',
    patchFormat: 'ISO Pré-patcheada',
    notes: 'Falas de rádio táticas e cinemáticas em live-action dubladas em português.',
    downloadUrl: 'https://romspure.cc/roms/sony-playstation-2/black-pt-br/'
  },
  {
    gameTitle: 'Metal Gear Solid 3: Snake Eater',
    aliases: ['mgs3', 'snake eater', 'metal gear solid 3 subsistence'],
    platform: 'PS2',
    translatedTitle: 'Metal Gear Solid 3: Snake Eater (PT-BR)',
    translationType: 'Legendado PT-BR',
    team: 'Equipe MGS Brasil & João13',
    status: '100% Completo',
    patchFormat: 'Patch XDELTA',
    notes: 'Mais de 40 horas de diálogos no Codec com Snake, Major Zero e Para-Medic 100% em português.',
    downloadUrl: 'https://romspure.cc/roms/sony-playstation-2/metal-gear-solid-3-pt-br/'
  },
  {
    gameTitle: 'Def Jam: Fight for NY',
    aliases: ['def jam ny', 'def jam fight for ny ps2'],
    platform: 'PS2',
    translatedTitle: 'Def Jam: Fight for NY (PT-BR)',
    translationType: 'Textos & Menus',
    team: 'Comunidade Brazukas',
    status: '100% Completo',
    patchFormat: 'ISO Pré-patcheada',
    notes: 'Modo história, menus e golpes traduzidos.',
    downloadUrl: 'https://romspure.cc/roms/sony-playstation-2/def-jam-pt-br/'
  },
  {
    gameTitle: 'Need for Speed: Most Wanted',
    aliases: ['nfsmw', 'nfs most wanted 2005', 'most wanted ps2'],
    platform: 'PS2',
    translatedTitle: 'Need for Speed: Most Wanted (Blacklist PT-BR)',
    translationType: 'Legendado PT-BR',
    team: 'Central de Traduções',
    status: '100% Completo',
    patchFormat: 'ISO Pré-patcheada',
    notes: 'Mensagens no pager da Mia e rádio da polícia de Rockport traduzidos em português.',
    downloadUrl: 'https://romspure.cc/roms/sony-playstation-2/need-for-speed-most-wanted-pt-br/'
  },

  // --- PLAYSTATION 1 ---
  {
    gameTitle: 'Castlevania: Symphony of the Night',
    aliases: ['sotn', 'castlevania sotn', 'symphony of the night ps1'],
    platform: 'PS1',
    translatedTitle: 'Castlevania: Symphony of the Night (Dublado & Legendado PT-BR)',
    translationType: 'Dublado & Legendado',
    team: 'Nemesis Fandubs & Equipe Trans-Center',
    status: '100% Completo',
    patchFormat: 'ISO Pré-patcheada',
    notes: 'O lendário diálogo de Richter Belmont e Drácula dublado em português majestoso.',
    downloadUrl: 'https://romspure.cc/roms/sony-playstation/castlevania-sotn-pt-br/'
  },
  {
    gameTitle: 'Silent Hill',
    aliases: ['sh1', 'silent hill 1 ps1'],
    platform: 'PS1',
    translatedTitle: 'Silent Hill (PT-BR Oficial)',
    translationType: 'Legendado PT-BR',
    team: 'Monkey\'s Traduções',
    status: '100% Completo',
    patchFormat: 'Patch XDELTA',
    notes: 'Enigmas do piano, mapa de Silent Hill e diários de Alessa traduzidos com precisão.',
    downloadUrl: 'https://romspure.cc/roms/sony-playstation/silent-hill-pt-br/'
  },
  {
    gameTitle: 'Resident Evil 3: Nemesis',
    aliases: ['re3', 'resident evil 3 ps1', 're3 nemesis'],
    platform: 'PS1',
    translatedTitle: 'Resident Evil 3: Nemesis (Dublado & Legendado PT-BR)',
    translationType: 'Dublado & Legendado',
    team: 'Nemesis Fandubs Brasil',
    status: '100% Completo',
    patchFormat: 'ISO Pré-patcheada',
    notes: 'Vozes icônicas de Jill Valentine, Carlos Oliveira e Nemesis completamente em português.',
    downloadUrl: 'https://romspure.cc/roms/sony-playstation/resident-evil-3-nemesis-pt-br/'
  },
  {
    gameTitle: 'Metal Gear Solid',
    aliases: ['mgs1', 'metal gear solid ps1'],
    platform: 'PS1',
    translatedTitle: 'Metal Gear Solid (Dublado & Legendado PT-BR)',
    translationType: 'Dublado & Legendado',
    team: 'Equipe MGS Brasil & Fandub',
    status: '100% Completo',
    patchFormat: 'ISO Pré-patcheada',
    notes: 'Todos os 2 CDs com vozes profissionais em português e codec 100% localizado.',
    downloadUrl: 'https://romspure.cc/roms/sony-playstation/metal-gear-solid-pt-br/'
  },
  {
    gameTitle: 'Chrono Cross',
    aliases: ['chrono cross ps1'],
    platform: 'PS1',
    translatedTitle: 'Chrono Cross (PT-BR)',
    translationType: 'Legendado PT-BR',
    team: 'Trans-Center',
    status: '100% Completo',
    patchFormat: 'Patch IPS',
    notes: 'Os 45 personagens com sotaques regionais brasileiros preservados.',
    downloadUrl: 'https://romspure.cc/roms/sony-playstation/chrono-cross-pt-br/'
  },
  {
    gameTitle: 'Final Fantasy VII',
    aliases: ['ff7', 'final fantasy 7 ps1'],
    platform: 'PS1',
    translatedTitle: 'Final Fantasy VII (PT-BR)',
    translationType: 'Legendado PT-BR',
    team: 'Equipe CBR / João13',
    status: '100% Completo',
    patchFormat: 'ISO Pré-patcheada',
    notes: 'Todos os 3 discos traduzidos com nomes de magias clássicas e matérias adaptadas.',
    downloadUrl: 'https://romspure.cc/roms/sony-playstation/final-fantasy-vii-pt-br/'
  },

  // --- PLAYSTATION PORTABLE (PSP) ---
  {
    gameTitle: 'God of War: Ghost of Sparta',
    aliases: ['ghost of sparta', 'gow ghost of sparta psp'],
    platform: 'PSP',
    translatedTitle: 'God of War: Ghost of Sparta (PT-BR)',
    translationType: 'Legendado PT-BR',
    team: 'Tribo Gamer PSP',
    status: '100% Completo',
    patchFormat: 'ISO Pré-patcheada',
    notes: 'Diálogos de Kratos e Deimos localizados para a jornada a Atlântida.',
    downloadUrl: 'https://romspure.cc/roms/sony-playstation-portable/god-of-war-ghost-of-sparta-pt-br/'
  },
  {
    gameTitle: 'Crisis Core: Final Fantasy VII',
    aliases: ['crisis core psp'],
    platform: 'PSP',
    translatedTitle: 'Crisis Core: Final Fantasy VII (PT-BR)',
    translationType: 'Legendado PT-BR',
    team: 'Monkey\'s Traduções',
    status: '100% Completo',
    patchFormat: 'ISO Pré-patcheada',
    notes: 'DMW, cutscenes épicas e cartas do fã-clube do Sephiroth em português.',
    downloadUrl: 'https://romspure.cc/roms/sony-playstation-portable/crisis-core-pt-br/'
  },

  // --- NINTENDO 64 ---
  {
    gameTitle: 'The Legend of Zelda: Ocarina of Time',
    aliases: ['zelda oot', 'ocarina of time n64'],
    platform: 'N64',
    translatedTitle: 'The Legend of Zelda: Ocarina of Time (PT-BR V2)',
    translationType: 'Legendado PT-BR',
    team: 'Equipe Zelda Brasil & Monkey\'s',
    status: '100% Completo',
    patchFormat: 'Patch IPS',
    notes: 'Diálogos de Navi, sábios e descrições dos templos com terminologia consagrada.',
    downloadUrl: 'https://romspure.cc/roms/nintendo-64/the-legend-of-zelda-ocarina-of-time-pt-br/'
  },
  {
    gameTitle: 'Super Mario 64',
    aliases: ['sm64', 'mario 64 n64'],
    platform: 'N64',
    translatedTitle: 'Super Mario 64 (PT-BR)',
    translationType: 'Legendado PT-BR',
    team: 'Trans-Center',
    status: '100% Completo',
    patchFormat: 'Patch IPS',
    notes: 'Placas do castelo, mensagens de Bowser e estrelas com nomes em português.',
    downloadUrl: 'https://romspure.cc/roms/nintendo-64/super-mario-64-pt-br/'
  },

  // --- GAME BOY ADVANCE (GBA) ---
  {
    gameTitle: 'Pokemon Emerald',
    aliases: ['pokemon emerald gba', 'pokémon emerald'],
    platform: 'GBA',
    translatedTitle: 'Pokémon Emerald (PT-BR Oficial BR)',
    translationType: 'Legendado PT-BR',
    team: 'Equipe PKMN Brasil',
    status: '100% Completo',
    patchFormat: 'Patch IPS',
    notes: 'Todos os golpes, itens, Pokédex e falas da Battle Frontier em português.',
    downloadUrl: 'https://romspure.cc/roms/gameboy-advance/pokemon-emerald-pt-br/'
  },
  {
    gameTitle: 'Castlevania: Aria of Sorrow',
    aliases: ['aria of sorrow gba'],
    platform: 'GBA',
    translatedTitle: 'Castlevania: Aria of Sorrow (PT-BR)',
    translationType: 'Legendado PT-BR',
    team: 'Monkey\'s Traduções',
    status: '100% Completo',
    patchFormat: 'Patch IPS',
    notes: 'Descrições de todas as almas de Soma Cruz e diálogos da trama traduzidos.',
    downloadUrl: 'https://romspure.cc/roms/gameboy-advance/castlevania-aria-of-sorrow-pt-br/'
  },

  // --- SUPER NINTENDO (SNES) ---
  {
    gameTitle: 'Super Mario World',
    aliases: ['smw', 'super mario world snes'],
    platform: 'SNES',
    translatedTitle: 'Super Mario World (PT-BR)',
    translationType: 'Legendado PT-BR',
    team: 'Trans-Center',
    status: '100% Completo',
    patchFormat: 'Patch IPS',
    notes: 'Textos das casas de Yoshi, mensagens secretas e créditos finais em português.',
    downloadUrl: 'https://romspure.cc/roms/super-nintendo/super-mario-world-pt-br/'
  },
  {
    gameTitle: 'Chrono Trigger',
    aliases: ['chrono trigger snes'],
    platform: 'SNES',
    translatedTitle: 'Chrono Trigger (PT-BR V2.0)',
    translationType: 'Legendado PT-BR',
    team: 'Equipe CBR',
    status: '100% Completo',
    patchFormat: 'Patch IPS',
    notes: 'Todas as eras temporais, nomes de magias e os 13 finais em português impecável.',
    downloadUrl: 'https://romspure.cc/roms/super-nintendo/chrono-trigger-pt-br/'
  }
];

/**
 * Normaliza um título para matching flexível
 */
function normalizeTitle(t: string): string {
  return t
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Consulta a base de dados de traduções PT-BR para um jogo específico
 */
export function findRomTranslationForGame(
  gameTitle: string, 
  platform?: string
): RomTranslationEntry | null {
  if (!gameTitle) return null;
  const normSearch = normalizeTitle(gameTitle);
  const platLower = (platform || '').toLowerCase();

  // 1. Match exato ou por aliases
  const matched = BRAZILIAN_TRANSLATIONS_DATABASE.find(entry => {
    // Filtro de plataforma se especificado
    if (platform && platLower) {
      const epLower = entry.platform.toLowerCase();
      const matchPlat = epLower.includes(platLower) || platLower.includes(epLower);
      if (!matchPlat) return false;
    }

    const normEntry = normalizeTitle(entry.gameTitle);
    if (normSearch.includes(normEntry) || normEntry.includes(normSearch)) {
      return true;
    }

    return entry.aliases.some(alias => {
      const normAlias = normalizeTitle(alias);
      return normSearch.includes(normAlias) || normAlias.includes(normSearch);
    });
  });

  return matched || null;
}

/**
 * Retorna todas as traduções disponíveis para uma plataforma
 */
export function getTranslationsByPlatform(platform: string): RomTranslationEntry[] {
  const pLower = platform.toLowerCase();
  return BRAZILIAN_TRANSLATIONS_DATABASE.filter(entry => 
    entry.platform.toLowerCase().includes(pLower) || pLower.includes(entry.platform.toLowerCase())
  );
}
