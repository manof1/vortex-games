import { Game } from "../types";

export interface ConsolePresetItem extends Game {
  sourceWebsite: 'RomsPure' | 'DLPSGame' | 'Ambos';
  sourceUrl: string;
  romFormat: 'ISO' | 'PKG' | 'ROM' | 'BIN/CUE' | 'NSP' | 'XCI' | 'CHD';
  consolePlatform: 'PS1' | 'PS2' | 'PS3' | 'PS4' | 'PS5' | 'PSP' | 'PS Vita' | 'Switch' | 'N64' | 'GBA';
}

type RawConsolePreset = Omit<ConsolePresetItem, 'systemRequirements' | 'tags' | 'downloadsCount' | 'viewsCount' | 'createdAt'> & {
  systemRequirements?: ConsolePresetItem['systemRequirements'];
  tags?: string[];
  downloadsCount?: number;
  viewsCount?: number;
  createdAt?: string;
};

const RAW_ROMSPURE_DLPS_PRESETS: RawConsolePreset[] = [
  // 1. Castlevania: Symphony of the Night (PS1)
  {
    id: "castlevania-sotn-ps1-romspure-dlps",
    title: "Castlevania: Symphony of the Night",
    slug: "castlevania-symphony-of-the-night-ps1-iso",
    coverUrl: "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation/master/Named_Boxarts/Castlevania%20-%20Symphony%20of%20the%20Night%20(USA).png",
    bannerUrl: "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation/master/Named_Snaps/Castlevania%20-%20Symphony%20of%20the%20Night%20(USA).png",
    shortDescription: "A obra-prima definitiva do gênero Metroidvania no PlayStation. Disponível em formato ISO/BIN/CUE oficial preservado via RomsPure e DLPSGame com suporte a RetroArch e DuckStation.",
    description: "Alucard, o filho meio-humano de Drácula, acorda de seu sono de séculos após o desaparecimento de Richter Belmont e a reaparição inexplicada do Castelo de Drácula. Explore corredores góticos, desbloqueie habilidades sombrias e encare o mítico Castelo Invertido.",
    genres: ["Metroidvania", "Ação", "Plataforma 2D", "RPG"],
    categories: ["Clássicos PlayStation", "Mais Baixados", "Retrogaming"],
    releaseYear: 1997,
    releaseDate: "02/10/1997",
    developer: "Konami Computer Entertainment Tokyo",
    publisher: "Konami",
    sourceWebsite: "Ambos",
    sourceUrl: "https://romspure.cc/roms/sony-playstation/castlevania-symphony-of-the-night/",
    romFormat: "ISO",
    consolePlatform: "PS1",
    repackInfo: {
      repacker: "RomsPure & DLPSGame Console Archive",
      version: "v1.0 USA (SLUS-00067) + Tradução PT-BR Opcional",
      repackSize: "485 MB",
      originalSize: "650 MB",
      crackStatus: "DRM Free",
      crackGroup: "Redump PS1 Preservation"
    },
    downloadLinks: [
      {
        id: "dl-sotn-romspure",
        type: "direct",
        format: "iso",
        platform: "PS1",
        label: "Download ROM ISO Direto (RomsPure.cc - SLUS-00067)",
        url: "https://romspure.cc/roms/sony-playstation/castlevania-symphony-of-the-night/",
        size: "485 MB",
        titleId: "SLUS-00067",
        firmware: "PlayStation 1 / Emulador RetroArch / DuckStation",
        isPtBrAudio: false,
        isPtBrSubs: true,
        hostName: "RomsPure.cc"
      },
      {
        id: "dl-sotn-dlps",
        type: "pkg",
        format: "pkg",
        platform: "PS4",
        label: "Conversão PS4 PKG (DLPSGame Classic HD Backport)",
        url: "https://dlpsgame.com/castlevania-symphony-of-the-night-ps1-iso/",
        size: "520 MB",
        titleId: "CUSA-00067",
        firmware: "FW 5.05 - 11.00",
        isPtBrAudio: false,
        isPtBrSubs: true,
        hostName: "DLPSGame.com"
      }
    ],
    rating: 4.9,
    totalVotes: 8940,
    screenshots: [
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation/master/Named_Snaps/Castlevania%20-%20Symphony%20of%20the%20Night%20(USA).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation/master/Named_Boxarts/Castlevania%20-%20Symphony%20of%20the%20Night%20(Europe).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation/master/Named_Boxarts/Akumajou%20Dracula%20X%20-%20Gekka%20no%20Yasoukyoku%20(Japan).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation/master/Named_Snaps/Castlevania%20-%20Symphony%20of%20the%20Night%20(USA).png"
    ]
  },

  // 2. God of War II (PS2)
  {
    id: "god-of-war-2-ps2-romspure-dlps",
    title: "God of War II",
    slug: "god-of-war-ii-ps2-iso",
    coverUrl: "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_2/master/Named_Boxarts/God%20of%20War%20II%20(USA).png",
    bannerUrl: "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_2/master/Named_Snaps/God%20of%20War%20II%20(USA).png",
    shortDescription: "A épica jornada de Kratos contra o próprio Monte Olimpo. Disponível em ISO DVD-9 oficial via RomsPure e pacote PKG PS4/PS3 via DLPSGame.",
    description: "Kratos desafia os Deuses do Olimpo e é traído por Zeus. Guiado por Gaia e armado com as Lâminas de Atena, ele parte em busca das Irmãs do Destino para alterar o próprio passado e aniquilar os Deuses.",
    genres: ["Hack and Slash", "Ação", "Mitologia Grega", "Aventura"],
    categories: ["Clássicos PlayStation", "Mais Baixados", "Destaques"],
    releaseYear: 2007,
    releaseDate: "13/03/2007",
    developer: "Santa Monica Studio",
    publisher: "Sony Computer Entertainment",
    sourceWebsite: "Ambos",
    sourceUrl: "https://dlpsgame.com/god-of-war-ii-ps2-iso/",
    romFormat: "ISO",
    consolePlatform: "PS2",
    repackInfo: {
      repacker: "DLPSGame & RomsPure Preservation",
      version: "v1.01 NTSC-U (SCUS-97481) + Dublagem PT-BR",
      repackSize: "6.8 GB",
      originalSize: "7.9 GB",
      crackStatus: "DRM Free",
      crackGroup: "PCSX2 & Console Scene"
    },
    downloadLinks: [
      {
        id: "dl-gow2-dlps",
        type: "direct",
        format: "iso",
        platform: "PS2",
        label: "Download ISO DVD-9 Direto (DLPSGame.com - SCUS-97481)",
        url: "https://dlpsgame.com/god-of-war-ii-ps2-iso/",
        size: "6.8 GB",
        titleId: "SCUS-97481",
        firmware: "PlayStation 2 OPL / PCSX2 / AetherSX2",
        isPtBrAudio: true,
        isPtBrSubs: true,
        hostName: "DLPSGame.com"
      },
      {
        id: "dl-gow2-romspure",
        type: "direct",
        format: "iso",
        platform: "PS2",
        label: "Download ROM ISO Limpa (RomsPure.cc)",
        url: "https://romspure.cc/roms/sony-playstation-2/god-of-war-ii/",
        size: "6.5 GB",
        titleId: "SCUS-97481",
        firmware: "PS2 OPL / PCSX2",
        isPtBrAudio: false,
        isPtBrSubs: true,
        hostName: "RomsPure.cc"
      }
    ],
    rating: 4.9,
    totalVotes: 12400,
    screenshots: [
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_2/master/Named_Snaps/God%20of%20War%20II%20(USA).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_2/master/Named_Boxarts/God%20of%20War%20II%20(Europe).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_2/master/Named_Boxarts/God%20of%20War%20II%20(USA).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_2/master/Named_Snaps/God%20of%20War%20II%20(USA).png"
    ]
  },

  // 3. Silent Hill (PS1)
  {
    id: "silent-hill-ps1-romspure-dlps",
    title: "Silent Hill",
    slug: "silent-hill-ps1-iso",
    coverUrl: "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation/master/Named_Boxarts/Silent%20Hill%20(USA).png",
    bannerUrl: "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation/master/Named_Snaps/Silent%20Hill%20(USA).png",
    shortDescription: "O clássico divisor de águas do terror psicológico. Harry Mason procura sua filha Cheryl em uma cidadezinha imersa em névoa e pesadelos sangrentos.",
    description: "Após um violento acidente de carro na entrada de Silent Hill, Harry descobre que sua filha Cheryl desapareceu. Confrontado com o nevoeiro impenetrável e a sinistra transição para o Outro Mundo enferrujado, ele deve desvendar um culto macabro.",
    genres: ["Survival Horror", "Terror Psicológico", "Suspense"],
    categories: ["Clássicos PlayStation", "Retrogaming"],
    releaseYear: 1999,
    releaseDate: "23/02/1999",
    developer: "Team Silent / Konami Computer Entertainment Tokyo",
    publisher: "Konami",
    sourceWebsite: "Ambos",
    sourceUrl: "https://romspure.cc/roms/sony-playstation/silent-hill/",
    romFormat: "ISO",
    consolePlatform: "PS1",
    repackInfo: {
      repacker: "RomsPure & DLPSGame Console Preservation",
      version: "v1.1 USA (SLUS-00972) + Patch PT-BR",
      repackSize: "380 MB",
      originalSize: "550 MB",
      crackStatus: "DRM Free",
      crackGroup: "Redump PS1"
    },
    downloadLinks: [
      {
        id: "dl-sh1-romspure",
        type: "direct",
        format: "iso",
        platform: "PS1",
        label: "Download ROM ISO Original (RomsPure.cc - SLUS-00972)",
        url: "https://romspure.cc/roms/sony-playstation/silent-hill/",
        size: "380 MB",
        titleId: "SLUS-00972",
        firmware: "DuckStation / ePSXe / PS1 Real",
        isPtBrAudio: false,
        isPtBrSubs: true,
        hostName: "RomsPure.cc"
      },
      {
        id: "dl-sh1-dlps",
        type: "pkg",
        format: "pkg",
        platform: "PS4",
        label: "PS4 PKG FPKG Convertido (DLPSGame)",
        url: "https://dlpsgame.com/silent-hill-ps1-iso/",
        size: "420 MB",
        titleId: "CUSA-00972",
        firmware: "FW 5.05 - 11.00",
        isPtBrAudio: false,
        isPtBrSubs: true,
        hostName: "DLPSGame.com"
      }
    ],
    rating: 4.9,
    totalVotes: 7820,
    screenshots: [
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation/master/Named_Snaps/Silent%20Hill%20(USA).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation/master/Named_Boxarts/Silent%20Hill%20(Europe).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation/master/Named_Boxarts/Silent%20Hill%20(Japan).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation/master/Named_Snaps/Silent%20Hill%20(USA).png"
    ]
  },

  // 4. Resident Evil 4 (PS2)
  {
    id: "resident-evil-4-ps2-romspure-dlps",
    title: "Resident Evil 4",
    slug: "resident-evil-4-ps2-iso",
    coverUrl: "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_2/master/Named_Boxarts/Resident%20Evil%204%20(USA).png",
    bannerUrl: "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_2/master/Named_Snaps/Resident%20Evil%204%20(USA).png",
    shortDescription: "Leon S. Kennedy enfrenta o culto Los Illuminados em uma vila rural na Espanha para resgatar a filha do presidente dos Estados Unidos.",
    description: "Seis anos após o incidente de Raccoon City, Leon S. Kennedy é enviado a uma remota vila espanhola onde os aldeões foram infectados pelo parasita Las Plagas. Edição definitiva do PS2 com a campanha Separate Ways de Ada Wong.",
    genres: ["Survival Horror", "Tiro em 3ª Pessoa", "Ação"],
    categories: ["Clássicos PlayStation", "Mais Baixados"],
    releaseYear: 2005,
    releaseDate: "25/10/2005",
    developer: "Capcom Production Studio 4",
    publisher: "Capcom",
    sourceWebsite: "Ambos",
    sourceUrl: "https://dlpsgame.com/resident-evil-4-ps2-iso/",
    romFormat: "ISO",
    consolePlatform: "PS2",
    repackInfo: {
      repacker: "DLPSGame & RomsPure",
      version: "v1.0 NTSC-U (SLUS-21134) + Dublagem Brasileira Completa",
      repackSize: "3.4 GB",
      originalSize: "4.3 GB",
      crackStatus: "DRM Free",
      crackGroup: "PlayStation 2 Scene"
    },
    downloadLinks: [
      {
        id: "dl-re4-dlps",
        type: "direct",
        format: "iso",
        platform: "PS2",
        label: "Download ISO DVD Direto (DLPSGame.com - SLUS-21134)",
        url: "https://dlpsgame.com/resident-evil-4-ps2-iso/",
        size: "3.4 GB",
        titleId: "SLUS-21134",
        firmware: "PS2 OPL / PCSX2",
        isPtBrAudio: true,
        isPtBrSubs: true,
        hostName: "DLPSGame.com"
      },
      {
        id: "dl-re4-romspure",
        type: "direct",
        format: "iso",
        platform: "PS2",
        label: "Download ROM ISO (RomsPure.cc)",
        url: "https://romspure.cc/roms/sony-playstation-2/resident-evil-4/",
        size: "3.2 GB",
        titleId: "SLUS-21134",
        firmware: "PCSX2 / OPL",
        isPtBrAudio: false,
        isPtBrSubs: true,
        hostName: "RomsPure.cc"
      }
    ],
    rating: 4.9,
    totalVotes: 15300,
    screenshots: [
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_2/master/Named_Snaps/Resident%20Evil%204%20(USA).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_2/master/Named_Boxarts/Resident%20Evil%204%20(Europe).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_2/master/Named_Boxarts/Biohazard%204%20(Japan).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_2/master/Named_Snaps/Resident%20Evil%204%20(USA).png"
    ]
  },

  // 5. The Last of Us (PS3)
  {
    id: "the-last-of-us-ps3-dlps",
    title: "The Last of Us",
    slug: "the-last-of-us-ps3-iso-pkg",
    coverUrl: "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_3/master/Named_Boxarts/The%20Last%20of%20Us%20(USA).png",
    bannerUrl: "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_3/master/Named_Snaps/The%20Last%20of%20Us%20(USA).png",
    shortDescription: "A experiência seminal da Naughty Dog no PS3. Joel e Ellie cruzam os EUA pós-pandêmico. Edição completa com DLC Left Behind no DLPSGame.",
    description: "Vinte anos após uma praga fúngica dizimar a humanidade, Joel é encarregado de contrabandear Ellie, uma jovem misteriosamente imune, para fora de uma zona de quarentena opressiva. Inclui dublagem clássica em português do Brasil.",
    genres: ["Ação", "Aventura", "Sobrevivência", "Drama"],
    categories: ["Clássicos PlayStation", "Mais Baixados"],
    releaseYear: 2013,
    releaseDate: "14/06/2013",
    developer: "Naughty Dog",
    publisher: "Sony Computer Entertainment",
    sourceWebsite: "DLPSGame",
    sourceUrl: "https://dlpsgame.com/the-last-of-us-ps3-iso/",
    romFormat: "PKG",
    consolePlatform: "PS3",
    repackInfo: {
      repacker: "DLPSGame PS3 Scene Archive",
      version: "v1.11 GOTY + Left Behind DLC (BCUS-98174)",
      repackSize: "28.5 GB",
      originalSize: "34.0 GB",
      crackStatus: "DRM Free",
      crackGroup: "PS3 Scene"
    },
    downloadLinks: [
      {
        id: "dl-tlou-ps3-dlps",
        type: "pkg",
        format: "pkg",
        platform: "PS3",
        label: "Download PKG Direto PS3 HEN / CFW (DLPSGame.com - BCUS-98174)",
        url: "https://dlpsgame.com/the-last-of-us-ps3-iso/",
        size: "28.5 GB",
        titleId: "BCUS-98174",
        firmware: "PS3 CFW 4.91 / HEN 3.3.0 / RPCS3",
        isPtBrAudio: true,
        isPtBrSubs: true,
        hostName: "DLPSGame.com"
      }
    ],
    rating: 4.9,
    totalVotes: 18900,
    screenshots: [
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_3/master/Named_Snaps/The%20Last%20of%20Us%20(USA).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_3/master/Named_Boxarts/The%20Last%20of%20Us%20(Europe).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_3/master/Named_Boxarts/The%20Last%20of%20Us%20(USA).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_3/master/Named_Snaps/The%20Last%20of%20Us%20(USA).png"
    ]
  },

  // 6. Bloodborne: Game of the Year Edition (PS4)
  {
    id: "bloodborne-goty-ps4-dlps",
    title: "Bloodborne: Game of the Year Edition",
    slug: "bloodborne-goty-ps4-pkg",
    coverUrl: "https://image.api.playstation.com/vulcan/img/rnd/202010/2614/gdaeAUzkfv6efQWfg1bM8U07.png",
    bannerUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2322010/header.jpg",
    shortDescription: "A obra-prima cósmica da FromSoftware e Hidetaka Miyazaki. Inclui a aclamada expansão The Old Hunters no DLPSGame em PKG testado.",
    description: "Um Caçador solitário chega à cidade gótica e decrépita de Yharnam em busca do Sangue Pálido, apenas para encontrar seus cidadãos consumidos por uma peste bestial e mistérios cósmicos indescritíveis.",
    genres: ["Soulslike", "RPG de Ação", "Terror Gótico", "Fantasia Sombria"],
    categories: ["AAA", "Exclusivos PlayStation", "Mais Baixados"],
    releaseYear: 2015,
    releaseDate: "24/03/2015",
    developer: "FromSoftware",
    publisher: "Sony Computer Entertainment",
    sourceWebsite: "DLPSGame",
    sourceUrl: "https://dlpsgame.com/bloodborne-game-of-the-year-edition-ps4-pkg/",
    romFormat: "PKG",
    consolePlatform: "PS4",
    repackInfo: {
      repacker: "DLPSGame PS4 FPKG Scene",
      version: "v1.09 + The Old Hunters DLC (CUSA-03173)",
      repackSize: "36.2 GB",
      originalSize: "41.0 GB",
      crackStatus: "DRM Free",
      crackGroup: "CyB1K / DLPSGame"
    },
    downloadLinks: [
      {
        id: "dl-bloodborne-dlps",
        type: "pkg",
        format: "pkg",
        platform: "PS4",
        label: "Download PKG FPKG Console (DLPSGame CUSA-03173)",
        url: "https://dlpsgame.com/bloodborne-game-of-the-year-edition-ps4-pkg/",
        size: "36.2 GB",
        titleId: "CUSA-03173",
        firmware: "FW 5.05 - 11.00 (Backport Testado)",
        isPtBrAudio: true,
        isPtBrSubs: true,
        hostName: "DLPSGame.com"
      }
    ],
    rating: 4.9,
    totalVotes: 14200,
    screenshots: [
      "https://image.api.playstation.com/vulcan/img/rnd/202010/2614/gdaeAUzkfv6efQWfg1bM8U07.png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_3/master/Named_Snaps/The%20Last%20of%20Us%20(USA).png",
      "https://image.api.playstation.com/vulcan/img/rnd/202010/2614/gdaeAUzkfv6efQWfg1bM8U07.png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_3/master/Named_Snaps/The%20Last%20of%20Us%20(USA).png"
    ]
  },

  // 7. God of War: Ghost of Sparta (PSP)
  {
    id: "gow-ghost-of-sparta-psp-romspure",
    title: "God of War: Ghost of Sparta",
    slug: "god-of-war-ghost-of-sparta-psp-iso",
    coverUrl: "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_Portable/master/Named_Boxarts/God%20of%20War%20-%20Ghost%20of%20Sparta%20(USA).png",
    bannerUrl: "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_Portable/master/Named_Snaps/God%20of%20War%20-%20Ghost%20of%20Sparta%20(USA).png",
    shortDescription: "A aclamada aventura portátil de Kratos revelando os mistérios sobre seu irmão Deimos e a maldição de Esparta. Disponível em ISO limpa no RomsPure.",
    description: "Situado entre God of War e God of War II, Kratos parte para o Reino de Tânatos para resgatar seu irmão há muito perdido, Deimos. Gráficos inacreditáveis e combate fluido que levaram o PSP ao seu limite.",
    genres: ["Hack and Slash", "Ação", "Mitologia Grega"],
    categories: ["Portáteis PlayStation", "Clássicos"],
    releaseYear: 2010,
    releaseDate: "02/11/2010",
    developer: "Ready at Dawn / Santa Monica Studio",
    publisher: "Sony Computer Entertainment",
    sourceWebsite: "Ambos",
    sourceUrl: "https://romspure.cc/roms/sony-playstation-portable/god-of-war-ghost-of-sparta/",
    romFormat: "ISO",
    consolePlatform: "PSP",
    repackInfo: {
      repacker: "RomsPure & DLPSGame",
      version: "v1.01 USA (UCUS-98737) + Tradução PT-BR",
      repackSize: "1.1 GB",
      originalSize: "1.6 GB",
      crackStatus: "DRM Free",
      crackGroup: "PSP Scene"
    },
    downloadLinks: [
      {
        id: "dl-gow-psp-romspure",
        type: "direct",
        format: "iso",
        platform: "PSP",
        label: "Download ROM ISO Direto (RomsPure.cc - UCUS-98737)",
        url: "https://romspure.cc/roms/sony-playstation-portable/god-of-war-ghost-of-sparta/",
        size: "1.1 GB",
        titleId: "UCUS-98737",
        firmware: "PPSSPP / PSP Real CFW 6.61 PRO/ME",
        isPtBrAudio: false,
        isPtBrSubs: true,
        hostName: "RomsPure.cc"
      }
    ],
    rating: 4.8,
    totalVotes: 6150,
    screenshots: [
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_Portable/master/Named_Snaps/God%20of%20War%20-%20Ghost%20of%20Sparta%20(USA).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_Portable/master/Named_Boxarts/God%20of%20War%20-%20Ghost%20of%20Sparta%20(Europe).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_Portable/master/Named_Boxarts/God%20of%20War%20-%20Ghost%20of%20Sparta%20(USA).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_Portable/master/Named_Snaps/God%20of%20War%20-%20Ghost%20of%20Sparta%20(USA).png"
    ]
  },

  // 8. The Legend of Zelda: Breath of the Wild (Nintendo Switch)
  {
    id: "zelda-botw-switch-romspure",
    title: "The Legend of Zelda: Breath of the Wild",
    slug: "the-legend-of-zelda-breath-of-the-wild-switch-nsp",
    coverUrl: "https://raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Nintendo_Switch/master/Named_Boxarts/The%20Legend%20of%20Zelda%20-%20Breath%20of%20the%20Wild%20(USA).png",
    bannerUrl: "https://raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Nintendo_Switch/master/Named_Snaps/The%20Legend%20of%20Zelda%20-%20Breath%20of%20the%20Wild%20(USA).png",
    shortDescription: "Um dos jogos mais aclamados de todos os tempos. Explore o vasto reino de Hyrule com liberdade sem precedentes no Nintendo Switch via RomsPure.",
    description: "Desperte de um sono de cem anos e explore o vasto reino arruinado de Hyrule. Escale montanhas, cozinhe refeições, resolva santuários misteriosos e prepare-se para o confronto final contra Calamity Ganon.",
    genres: ["Aventura", "Mundo Aberto", "RPG", "Ação"],
    categories: ["Nintendo", "Destaques", "Mais Baixados"],
    releaseYear: 2017,
    releaseDate: "03/03/2017",
    developer: "Nintendo EPD",
    publisher: "Nintendo",
    sourceWebsite: "RomsPure",
    sourceUrl: "https://romspure.cc/roms/nintendo-switch/the-legend-of-zelda-breath-of-the-wild/",
    romFormat: "NSP",
    consolePlatform: "Switch",
    repackInfo: {
      repacker: "RomsPure Console Archive",
      version: "v1.6.0 + The Master Trials & Champions Ballad DLCs",
      repackSize: "13.8 GB",
      originalSize: "16.0 GB",
      crackStatus: "DRM Free",
      crackGroup: "Nintendo Switch Scene"
    },
    downloadLinks: [
      {
        id: "dl-botw-romspure",
        type: "direct",
        format: "nsp",
        platform: "Nintendo Switch",
        label: "Download ROM NSP/XCI Direto (RomsPure.cc)",
        url: "https://romspure.cc/roms/nintendo-switch/the-legend-of-zelda-breath-of-the-wild/",
        size: "13.8 GB",
        titleId: "01007EF00011E000",
        firmware: "Switch Atmosphere CFW / Ryujinx / Yuzu",
        isPtBrAudio: false,
        isPtBrSubs: true,
        hostName: "RomsPure.cc"
      }
    ],
    rating: 4.9,
    totalVotes: 21500,
    screenshots: [
      "https://raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Nintendo_Switch/master/Named_Snaps/The%20Legend%20of%20Zelda%20-%20Breath%20of%20the%20Wild%20(USA).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Nintendo_Switch/master/Named_Boxarts/The%20Legend%20of%20Zelda%20-%20Breath%20of%20the%20Wild%20(USA).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Nintendo_Switch/master/Named_Snaps/The%20Legend%20of%20Zelda%20-%20Breath%20of%20the%20Wild%20(USA).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Nintendo_Switch/master/Named_Boxarts/The%20Legend%20of%20Zelda%20-%20Breath%20of%20the%20Wild%20(USA).png"
    ]
  },

  // 9. Grand Theft Auto: San Andreas (PS2)
  {
    id: "gta-san-andreas-ps2-dlps-romspure",
    title: "Grand Theft Auto: San Andreas",
    slug: "grand-theft-auto-san-andreas-ps2-iso",
    coverUrl: "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_2/master/Named_Boxarts/Grand%20Theft%20Auto%20-%20San%20Andreas%20(USA).png",
    bannerUrl: "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_2/master/Named_Snaps/Grand%20Theft%20Auto%20-%20San%20Andreas%20(USA).png",
    shortDescription: "A obra máxima da Rockstar Games na era PS2. CJ retorna a Los Santos nos anos 90 para salvar sua família e dominar o submundo.",
    description: "Cinco anos atrás, Carl Johnson escapou da pressão da vida em Los Santos, San Andreas. Agora, no início dos anos 90, Carl precisa voltar para casa após o assassinato de sua mãe. Uma das maiores revoluções dos jogos de mundo aberto.",
    genres: ["Mundo Aberto", "Ação", "Crime", "Tiro em 3ª Pessoa"],
    categories: ["Clássicos PlayStation", "Mais Baixados", "Destaques"],
    releaseYear: 2004,
    releaseDate: "26/10/2004",
    developer: "Rockstar North",
    publisher: "Rockstar Games",
    sourceWebsite: "Ambos",
    sourceUrl: "https://dlpsgame.com/grand-theft-auto-san-andreas-ps2-iso/",
    romFormat: "ISO",
    consolePlatform: "PS2",
    repackInfo: {
      repacker: "DLPSGame & RomsPure Console Archive",
      version: "v1.03 Special Edition (SLUS-20946) + Legendas PT-BR",
      repackSize: "4.1 GB",
      originalSize: "4.7 GB",
      crackStatus: "DRM Free",
      crackGroup: "PS2 Scene"
    },
    downloadLinks: [
      {
        id: "dl-gtasa-dlps",
        type: "direct",
        format: "iso",
        platform: "PS2",
        label: "Download ISO DVD Direto (DLPSGame SLUS-20946)",
        url: "https://dlpsgame.com/grand-theft-auto-san-andreas-ps2-iso/",
        size: "4.1 GB",
        titleId: "SLUS-20946",
        firmware: "PS2 OPL / PCSX2",
        isPtBrAudio: false,
        isPtBrSubs: true,
        hostName: "DLPSGame.com"
      },
      {
        id: "dl-gtasa-romspure",
        type: "direct",
        format: "iso",
        platform: "PS2",
        label: "Download ROM ISO Limpa (RomsPure.cc)",
        url: "https://romspure.cc/roms/sony-playstation-2/grand-theft-auto-san-andreas/",
        size: "4.0 GB",
        titleId: "SLUS-20946",
        firmware: "PCSX2 / OPL",
        isPtBrAudio: false,
        isPtBrSubs: true,
        hostName: "RomsPure.cc"
      }
    ],
    rating: 5.0,
    totalVotes: 28400,
    screenshots: [
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_2/master/Named_Snaps/Grand%20Theft%20Auto%20-%20San%20Andreas%20(USA).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_2/master/Named_Boxarts/Grand%20Theft%20Auto%20-%20San%20Andreas%20(USA).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_2/master/Named_Snaps/Grand%20Theft%20Auto%20-%20San%20Andreas%20(USA).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_2/master/Named_Boxarts/Grand%20Theft%20Auto%20-%20San%20Andreas%20(Europe).png"
    ]
  },

  // 10. Shadow of the Colossus (PS2)
  {
    id: "shadow-of-colossus-ps2-dlps",
    title: "Shadow of the Colossus",
    slug: "shadow-of-the-colossus-ps2-iso",
    coverUrl: "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_2/master/Named_Boxarts/Shadow%20of%20the%20Colossus%20(USA).png",
    bannerUrl: "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_2/master/Named_Snaps/Shadow%20of%20the%20Colossus%20(USA).png",
    shortDescription: "A poética e grandiosa aventura de Wander e sua égua Agro contra dezesseis gigantes míticos para salvar a vida de Mono.",
    description: "Considerado um dos maiores marcos artísticos dos videogames. Cavalgue pela Terra Proibida armada apenas de um arco e da Espada Ancestral para derrotar gigantes que vagam por vales, lagos e montanhas solitárias.",
    genres: ["Aventura", "Ação", "Fantasia", "Épico"],
    categories: ["Clássicos PlayStation", "Obras de Arte"],
    releaseYear: 2005,
    releaseDate: "18/10/2005",
    developer: "Team Ico / Japan Studio",
    publisher: "Sony Computer Entertainment",
    sourceWebsite: "Ambos",
    sourceUrl: "https://dlpsgame.com/shadow-of-the-colossus-ps2-iso/",
    romFormat: "ISO",
    consolePlatform: "PS2",
    repackInfo: {
      repacker: "DLPSGame & RomsPure",
      version: "v1.0 NTSC-U (SCUS-97472) + Tradução PT-BR",
      repackSize: "1.9 GB",
      originalSize: "2.4 GB",
      crackStatus: "DRM Free",
      crackGroup: "Team Ico Archive"
    },
    downloadLinks: [
      {
        id: "dl-sotc-dlps",
        type: "direct",
        format: "iso",
        platform: "PS2",
        label: "Download ISO DVD Direto (DLPSGame - SCUS-97472)",
        url: "https://dlpsgame.com/shadow-of-the-colossus-ps2-iso/",
        size: "1.9 GB",
        titleId: "SCUS-97472",
        firmware: "PS2 OPL / PCSX2",
        isPtBrAudio: false,
        isPtBrSubs: true,
        hostName: "DLPSGame.com"
      }
    ],
    rating: 4.9,
    totalVotes: 11900,
    screenshots: [
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_2/master/Named_Snaps/Shadow%20of%20the%20Colossus%20(USA).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_2/master/Named_Boxarts/Shadow%20of%20the%20Colossus%20(USA).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_2/master/Named_Snaps/Shadow%20of%20the%20Colossus%20(USA).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_2/master/Named_Boxarts/Shadow%20of%20the%20Colossus%20(Europe).png"
    ]
  },

  // 11. Tekken 3 (PS1)
  {
    id: "tekken-3-ps1-romspure-dlps",
    title: "Tekken 3",
    slug: "tekken-3-ps1-iso",
    coverUrl: "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation/master/Named_Boxarts/Tekken%203%20(USA).png",
    bannerUrl: "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation/master/Named_Snaps/Tekken%203%20(USA).png",
    shortDescription: "O ápice dos jogos de luta em 3D do PS1. Jin Kazama, Hwoarang e Eddy Gordo em um torneio lendário de King of Iron Fist.",
    description: "Quase duas décadas após o segundo torneio, Heihachi Mishima busca absorver o poder da entidade Ogre. Apresentando animações capturadas com atores reais e a introdução de Jin Kazama, Tekken 3 vendeu mais de 8 milhões de cópias.",
    genres: ["Luta 3D", "Artes Marciais", "Arcade"],
    categories: ["Clássicos PlayStation", "Retrogaming"],
    releaseYear: 1998,
    releaseDate: "29/04/1998",
    developer: "Namco",
    publisher: "Namco",
    sourceWebsite: "Ambos",
    sourceUrl: "https://romspure.cc/roms/sony-playstation/tekken-3/",
    romFormat: "ISO",
    consolePlatform: "PS1",
    repackInfo: {
      repacker: "RomsPure & DLPSGame",
      version: "v1.1 USA (SLUS-00402) Redump Verified",
      repackSize: "440 MB",
      originalSize: "680 MB",
      crackStatus: "DRM Free",
      crackGroup: "Namco Classic Scene"
    },
    downloadLinks: [
      {
        id: "dl-tekken3-romspure",
        type: "direct",
        format: "iso",
        platform: "PS1",
        label: "Download ROM ISO Direto (RomsPure.cc - SLUS-00402)",
        url: "https://romspure.cc/roms/sony-playstation/tekken-3/",
        size: "440 MB",
        titleId: "SLUS-00402",
        firmware: "DuckStation / RetroArch / PS1",
        isPtBrAudio: false,
        isPtBrSubs: false,
        hostName: "RomsPure.cc"
      }
    ],
    rating: 4.9,
    totalVotes: 16800,
    screenshots: [
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation/master/Named_Snaps/Tekken%203%20(USA).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation/master/Named_Boxarts/Tekken%203%20(USA).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation/master/Named_Snaps/Tekken%203%20(USA).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation/master/Named_Boxarts/Tekken%203%20(Europe).png"
    ]
  },

  // 12. Super Mario Odyssey (Switch)
  {
    id: "super-mario-odyssey-switch-romspure",
    title: "Super Mario Odyssey",
    slug: "super-mario-odyssey-switch-nsp",
    coverUrl: "https://raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Nintendo_Switch/master/Named_Boxarts/Super%20Mario%20Odyssey%20(USA).png",
    bannerUrl: "https://raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Nintendo_Switch/master/Named_Snaps/Super%20Mario%20Odyssey%20(USA).png",
    shortDescription: "Junte-se a Mario e Cappy em uma odisseia mágica de plataforma 3D pelos mais diversos reinos para impedir o casamento de Bowser.",
    description: "Use o chapéu mágico Cappy para capturar e controlar inimigos, objetos e dinossauros em uma incrível viagem de exploração livre estilo Mario 64 e Sunshine.",
    genres: ["Plataforma 3D", "Aventura", "Família"],
    categories: ["Nintendo", "Destaques"],
    releaseYear: 2017,
    releaseDate: "27/10/2017",
    developer: "Nintendo EPD",
    publisher: "Nintendo",
    sourceWebsite: "RomsPure",
    sourceUrl: "https://romspure.cc/roms/nintendo-switch/super-mario-odyssey/",
    romFormat: "NSP",
    consolePlatform: "Switch",
    repackInfo: {
      repacker: "RomsPure Switch Dumps",
      version: "v1.3.0 + Luigi's Balloon World Update",
      repackSize: "5.6 GB",
      originalSize: "6.2 GB",
      crackStatus: "DRM Free",
      crackGroup: "Nintendo Switch Scene"
    },
    downloadLinks: [
      {
        id: "dl-smo-romspure",
        type: "direct",
        format: "nsp",
        platform: "Nintendo Switch",
        label: "Download ROM NSP/XCI Direto (RomsPure.cc)",
        url: "https://romspure.cc/roms/nintendo-switch/super-mario-odyssey/",
        size: "5.6 GB",
        titleId: "0100000000010000",
        firmware: "Ryujinx / Yuzu / Switch CFW Atmosphere",
        isPtBrAudio: false,
        isPtBrSubs: true,
        hostName: "RomsPure.cc"
      }
    ],
    rating: 4.9,
    totalVotes: 19400,
    screenshots: [
      "https://raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Nintendo_Switch/master/Named_Snaps/Super%20Mario%20Odyssey%20(USA).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Nintendo_Switch/master/Named_Boxarts/Super%20Mario%20Odyssey%20(USA).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Nintendo_Switch/master/Named_Snaps/Super%20Mario%20Odyssey%20(USA).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Nintendo_Switch/master/Named_Boxarts/Super%20Mario%20Odyssey%20(USA).png"
    ]
  },

  // 13. The Legend of Zelda: Ocarina of Time (N64)
  {
    id: "zelda-oot-n64-romspure",
    title: "The Legend of Zelda: Ocarina of Time",
    slug: "the-legend-of-zelda-ocarina-of-time-n64-rom",
    coverUrl: "https://raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Nintendo_64/master/Named_Boxarts/Legend%20of%20Zelda%2C%20The%20-%20Ocarina%20of%20Time%20(USA).png",
    bannerUrl: "https://raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Nintendo_64/master/Named_Snaps/Legend%20of%20Zelda%2C%20The%20-%20Ocarina%20of%20Time%20(USA).png",
    shortDescription: "Geralmente considerado o melhor videogame de todos os tempos. Link viaja no tempo para derrotar Ganondorf e salvar Hyrule.",
    description: "Com o sistema inovador de mira Z-Targeting, passagem de tempo dia/noite e canções tocadas na Ocarina, a jornada mágica de Link de criança a herói adulto marcou a história.",
    genres: ["Ação", "Aventura", "Fantasia", "RPG"],
    categories: ["Nintendo", "Retrogaming", "Obras de Arte"],
    releaseYear: 1998,
    releaseDate: "21/11/1998",
    developer: "Nintendo EAD",
    publisher: "Nintendo",
    sourceWebsite: "RomsPure",
    sourceUrl: "https://romspure.cc/roms/nintendo-64/the-legend-of-zelda-ocarina-of-time/",
    romFormat: "ROM",
    consolePlatform: "N64",
    repackInfo: {
      repacker: "RomsPure Preservation",
      version: "v1.2 USA (Z64) + Tradução PT-BR Completa",
      repackSize: "32 MB",
      originalSize: "32 MB",
      crackStatus: "DRM Free",
      crackGroup: "No-Intro N64"
    },
    downloadLinks: [
      {
        id: "dl-oot-romspure",
        type: "direct",
        format: "rom",
        platform: "N64",
        label: "Download ROM N64 Direto (RomsPure.cc - 32 MB)",
        url: "https://romspure.cc/roms/nintendo-64/the-legend-of-zelda-ocarina-of-time/",
        size: "32 MB",
        firmware: "Mupen64Plus / RetroArch / EverDrive 64",
        isPtBrAudio: false,
        isPtBrSubs: true,
        hostName: "RomsPure.cc"
      }
    ],
    rating: 5.0,
    totalVotes: 32000,
    screenshots: [
      "https://raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Nintendo_64/master/Named_Snaps/Legend%20of%20Zelda%2C%20The%20-%20Ocarina%20of%20Time%20(USA).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Nintendo_64/master/Named_Boxarts/Legend%20of%20Zelda%2C%20The%20-%20Ocarina%20of%20Time%20(USA).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Nintendo_64/master/Named_Snaps/Legend%20of%20Zelda%2C%20The%20-%20Ocarina%20of%20Time%20(USA).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Nintendo_64/master/Named_Boxarts/Legend%20of%20Zelda%2C%20The%20-%20Ocarina%20of%20Time%20(Europe).png"
    ]
  },

  // 14. Pokémon Emerald Version (Game Boy Advance)
  {
    id: "pokemon-emerald-gba-romspure",
    title: "Pokémon Emerald Version",
    slug: "pokemon-emerald-version-gba-rom",
    coverUrl: "https://raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Game_Boy_Advance/master/Named_Boxarts/Pokemon%20-%20Emerald%20Version%20(USA%2C%20Europe).png",
    bannerUrl: "https://raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Game_Boy_Advance/master/Named_Snaps/Pokemon%20-%20Emerald%20Version%20(USA%2C%20Europe).png",
    shortDescription: "A versão definitiva da 3ª geração Pokémon na região de Hoenn com Rayquaza, Battle Frontier e suporte a cheat codes.",
    description: "Explore a região de Hoenn, impeça os planos do Team Magma e Team Aqua e desperte o lendário dragão Rayquaza para restaurar o equilíbrio do clima.",
    genres: ["RPG", "Colecionismo", "Aventura"],
    categories: ["Nintendo", "Portáteis", "Retrogaming"],
    releaseYear: 2004,
    releaseDate: "16/09/2004",
    developer: "Game Freak",
    publisher: "The Pokémon Company / Nintendo",
    sourceWebsite: "RomsPure",
    sourceUrl: "https://romspure.cc/roms/gameboy-advance/pokemon-emerald-version/",
    romFormat: "ROM",
    consolePlatform: "GBA",
    repackInfo: {
      repacker: "RomsPure GBA Archive",
      version: "v1.0 USA/EUR Clean Dump + Tradução PT-BR",
      repackSize: "16 MB",
      originalSize: "16 MB",
      crackStatus: "DRM Free",
      crackGroup: "No-Intro GBA"
    },
    downloadLinks: [
      {
        id: "dl-emerald-romspure",
        type: "direct",
        format: "rom",
        platform: "GBA",
        label: "Download ROM GBA Direto (RomsPure.cc - 16 MB)",
        url: "https://romspure.cc/roms/gameboy-advance/pokemon-emerald-version/",
        size: "16 MB",
        firmware: "mGBA / VisualBoyAdvance / RetroArch",
        isPtBrAudio: false,
        isPtBrSubs: true,
        hostName: "RomsPure.cc"
      }
    ],
    rating: 4.9,
    totalVotes: 24500,
    screenshots: [
      "https://raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Game_Boy_Advance/master/Named_Snaps/Pokemon%20-%20Emerald%20Version%20(USA%2C%20Europe).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Game_Boy_Advance/master/Named_Boxarts/Pokemon%20-%20Emerald%20Version%20(USA%2C%20Europe).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Game_Boy_Advance/master/Named_Snaps/Pokemon%20-%20Emerald%20Version%20(USA%2C%20Europe).png",
      "https://raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Game_Boy_Advance/master/Named_Boxarts/Pokemon%20-%20Emerald%20Version%20(USA%2C%20Europe).png"
    ]
  }
];

export const ROMSPURE_DLPS_PRESETS: ConsolePresetItem[] = RAW_ROMSPURE_DLPS_PRESETS.map((item, idx) => ({
  ...item,
  systemRequirements: item.systemRequirements || {
    minimum: { os: `${item.consolePlatform} ou Emulador`, processor: 'Dual Core 2.5GHz', memory: '4 GB RAM', graphics: 'DirectX 11 compatível', storage: '4 GB', directx: '11' },
    recommended: { os: `${item.consolePlatform} ou Emulador`, processor: 'Quad Core 3.5GHz', memory: '8 GB RAM', graphics: 'DirectX 12 / Vulkan', storage: '8 GB', directx: '12' }
  },
  tags: item.tags || [item.consolePlatform, item.romFormat, item.sourceWebsite, 'Console', 'RetroArch', 'VortexGames'],
  downloadsCount: item.downloadsCount || (14500 + (idx * 3120)),
  viewsCount: item.viewsCount || (48000 + (idx * 9400)),
  createdAt: item.createdAt || '2024-03-01T12:00:00Z',
  hasPtBrSubs: true,
  hasPkgFormat: item.romFormat === 'PKG' || item.downloadLinks.some(d => d.format === 'pkg'),
  hasPcTorrent: false
}));

export const ROMSPURE_DLPS_SUPABASE_SCRIPT = `-- ==============================================================================
-- Script de Inserção Automática de Jogos Consoles (RomsPure.cc & DLPSGame.com)
-- VortexGames: Títulos Clássicos e Modernos com links para ISO, PKG e ROMs
-- ==============================================================================

INSERT INTO games (
  id, title, slug, cover_url, banner_url, short_description, description,
  genres, categories, release_year, release_date, developer, publisher,
  repack_info, download_links, rating, total_votes, screenshots, created_at, updated_at
) VALUES 
${ROMSPURE_DLPS_PRESETS.map(g => {
  const esc = (s: string) => s.replace(/'/g, "''");
  return `(
  '${g.id}',
  '${esc(g.title)}',
  '${esc(g.slug)}',
  '${esc(g.coverUrl)}',
  '${esc(g.bannerUrl)}',
  '${esc(g.shortDescription)}',
  '${esc(g.description)}',
  ARRAY[${g.genres.map(x => `'${esc(x)}'`).join(', ')}],
  ARRAY[${g.categories.map(x => `'${esc(x)}'`).join(', ')}],
  ${g.releaseYear},
  '${esc(g.releaseDate || '01/01/2000')}',
  '${esc(g.developer)}',
  '${esc(g.publisher)}',
  '${esc(JSON.stringify(g.repackInfo))}'::jsonb,
  '${esc(JSON.stringify(g.downloadLinks))}'::jsonb,
  ${g.rating},
  ${g.totalVotes},
  ARRAY[${g.screenshots.map(s => `'${esc(s)}'`).join(', ')}],
  NOW(),
  NOW()
)`;
}).join(',\n')}
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  cover_url = EXCLUDED.cover_url,
  banner_url = EXCLUDED.banner_url,
  repack_info = EXCLUDED.repack_info,
  download_links = EXCLUDED.download_links,
  updated_at = NOW();
`;
