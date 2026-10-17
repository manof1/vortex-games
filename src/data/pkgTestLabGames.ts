import { GameCheat, GameMod } from '../types';

export interface PkgGame {
  id: string;
  title: string;
  platform: 'PS1' | 'PS2' | 'PS3' | 'PS4' | 'PS5' | 'PSP' | 'PS Vita' | string;
  titleId: string; // Ex: SLUS-00067, SCUS-97481, BCUS-98174, CUSA-00411
  fileUrl: string; // Link direto/origem TheZukoStore, Torrent ou servidor
  fileSize: string; // Tamanho do arquivo
  format: string; // 'PKG' | 'ISO' | 'RAR' | 'ZIP' | '7Z' | 'TORRENT' | 'BIN/CUE' | 'CSO' | 'CHD' | string
  firmware: string;
  region: 'NTSC-U' | 'PAL' | 'NTSC-J' | string;
  coverUrl: string;
  bannerUrl: string;
  screenshots: string[]; // 3 a 4 fotos/screenshots de gameplay reais (Media > Images no GameFAQs)
  description: string; // Sinopse oficial GameFAQs / GameSpot
  releaseYear: number;
  releaseDate: string;
  developer: string;
  publisher: string;
  genres: string[];
  gamefaqsRating: number; // Nota no GameFAQs (0 a 5)
  gamefaqsDifficulty: string; // Dificuldade GameFAQs
  ptBrSupport: boolean;
  zukoStorePageUrl: string;
  gamefaqsPageUrl: string;
  tags: string[];
  coverOptions?: string[]; // Opções de capas do GameFAQs Boxes (Media > Boxes: Front US, PAL, JP, Verso)
  gamefaqsBoxesUrl?: string; // Link direto para a seção Media > Boxes no GameFAQs (gamefaqs.gamespot.com/.../boxes)
  gamefaqsImagesUrl?: string; // Link direto para a seção Media > Images no GameFAQs (gamefaqs.gamespot.com/.../images)
  cheats?: GameCheat[]; // Códigos de trapaça e cheats puxados do GameFAQs
  mods?: GameMod[]; // Mods e patches recomendados do Nexus Mods
  gamefaqsCheatsUrl?: string; // Link da página de Cheats no GameFAQs
  nexusModsUrl?: string; // Link do jogo no Nexus Mods
}

export const INITIAL_PKG_GAMES: PkgGame[] = [
  // ===================== PS1 CLASSICS PKG =====================
  {
    id: 'pkg-ps1-castlevania-sotn',
    title: 'Castlevania: Symphony of the Night',
    platform: 'PS1',
    titleId: 'SLUS-00067',
    fileUrl: 'https://thezukostore.com/ps1-pkg-castlevania-symphony-of-the-night.pkg',
    fileSize: '512 MB',
    format: 'PKG',
    firmware: 'PS3 CFW / HEN 4.90+ (PS1 Classics No-NpDrm)',
    region: 'NTSC-U',
    coverUrl: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Considerado a obra-prima definitiva do gênero Metroidvania. Quatro anos após o desaparecimento de Richter Belmont, o Castelo de Drácula ressurge misteriosamente da névoa. Alucard, o filho meio-humano de Drácula, desperta de seu sono profundo para investigar a anomalia e confrontar o mal ancestral. Explore um mapa labiríntico e não-linear, colete centenas de armas, magias e relíquias, e descubra o segredo do Castelo Invertido.',
    releaseYear: 1997,
    releaseDate: '02/10/1997',
    developer: 'Konami Computer Entertainment Tokyo',
    publisher: 'Konami',
    genres: ['Ação', 'Metroidvania', 'Plataforma 2D', 'RPG Clássico'],
    gamefaqsRating: 4.9,
    gamefaqsDifficulty: 'Equilibrado (Just Right)',
    ptBrSupport: true,
    zukoStorePageUrl: 'https://thezukostore.com/ps1-pkg-castlevania-symphony-of-the-night',
    gamefaqsPageUrl: 'https://gamefaqs.gamespot.com/ps/196885-castlevania-symphony-of-the-night',
    gamefaqsCheatsUrl: 'https://gamefaqs.gamespot.com/ps/196885-castlevania-symphony-of-the-night/cheats',
    nexusModsUrl: 'https://www.nexusmods.com/castlevaniasotn',
    tags: ['Metroidvania', 'Alucard', 'Dracula', 'Dublado / Legendado PT-BR', 'PS1 Classics'],
    cheats: [
      {
        id: 'pkg-sotn-cheat-1',
        title: 'Jogar com Richter Belmont',
        codeOrEffect: 'Digite o nome RICHTER ao iniciar um novo jogo após zerar',
        category: 'Desbloqueáveis',
        source: 'GameFAQs'
      },
      {
        id: 'pkg-sotn-cheat-2',
        title: 'Alucard com Sorte 99 (99 LCK)',
        codeOrEffect: 'Digite o nome X-X!V\'\'Q ao iniciar novo jogo',
        category: 'Geral',
        source: 'GameFAQs'
      }
    ],
    mods: [
      {
        id: 'pkg-sotn-mod-1',
        title: 'Castlevania SOTN Widescreen & Color Fix',
        description: 'Renderização 16:9 sem esticar e correção de paleta de cores 32-bit.',
        nexusUrl: 'https://www.nexusmods.com/castlevaniasotn/mods/1',
        category: 'Fix/FPS',
        author: 'Aero_Modding'
      }
    ]
  },
  {
    id: 'pkg-ps1-silent-hill',
    title: 'Silent Hill',
    platform: 'PS1',
    titleId: 'SLUS-00707',
    fileUrl: 'https://thezukostore.com/ps1-pkg-silent-hill.pkg',
    fileSize: '335 MB',
    format: 'PKG',
    firmware: 'PS3 CFW / HEN 4.90+ (PS1 Classics No-NpDrm)',
    region: 'NTSC-U',
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'O marco que redefiniu o horror psicológico no PlayStation. Harry Mason sofre um acidente de carro na entrada da misteriosa cidade turística de Silent Hill e descobre que sua filha adotiva Cheryl desapareceu. Enquanto busca desesperadamente pela garota sob uma névoa espessa e chuva de cinzas, Harry descobre que a cidade transita para uma dimensão enferrujada e grotesca governada por um culto fanático.',
    releaseYear: 1999,
    releaseDate: '31/01/1999',
    developer: 'Team Silent (Konami)',
    publisher: 'Konami',
    genres: ['Survival Horror', 'Terror Psicológico', 'Mistério'],
    gamefaqsRating: 4.8,
    gamefaqsDifficulty: 'Desafiador (Tough)',
    ptBrSupport: true,
    zukoStorePageUrl: 'https://thezukostore.com/ps1-pkg-silent-hill',
    gamefaqsPageUrl: 'https://gamefaqs.gamespot.com/ps/198641-silent-hill',
    gamefaqsCheatsUrl: 'https://gamefaqs.gamespot.com/ps/198641-silent-hill/cheats',
    nexusModsUrl: 'https://www.nexusmods.com/silenthill',
    tags: ['Survival Horror', 'Harry Mason', 'Team Silent', 'Tradução PT-BR'],
    cheats: [
      {
        id: 'pkg-sh-cheat-1',
        title: 'Munição em Dobro na Opções',
        codeOrEffect: 'L1 + R1 + L2 + R2 na tela de Opções para Bullet Multiplier x2 a x6',
        category: 'Armas',
        source: 'GameFAQs'
      },
      {
        id: 'pkg-sh-cheat-2',
        title: 'Chainsaw e Rock Drill no Next Fear',
        codeOrEffect: 'Terminar o jogo uma vez em qualquer final para destravar armas especiais',
        category: 'Desbloqueáveis',
        source: 'GameFAQs'
      }
    ],
    mods: [
      {
        id: 'pkg-sh-mod-1',
        title: 'Silent Hill Widescreen & 60FPS Enhancement Patch',
        description: 'Remove bordas 4:3 e melhora taxa de quadros.',
        nexusUrl: 'https://www.nexusmods.com/silenthill/mods/1',
        category: 'Fix/FPS',
        author: 'Aero_Modding'
      }
    ]
  },
  {
    id: 'pkg-ps1-resident-evil-2-dualshock',
    title: 'Resident Evil 2: DualShock Edition',
    platform: 'PS1',
    titleId: 'SLUS-00748',
    fileUrl: 'https://thezukostore.com/ps1-pkg-resident-evil-2-dualshock.pkg',
    fileSize: '740 MB',
    format: 'PKG',
    firmware: 'PS3 CFW / HEN 4.90+ (2 Discos Unificados no PKG)',
    region: 'NTSC-U',
    coverUrl: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'O ápice dos clássicos de zumbis em Raccoon City. Dois meses após os incidentes na Mansão Spencer, o T-Vírus consome completamente a cidade. O policial novato Leon S. Kennedy e a jovem estudante universitária Claire Redfield chegam à cidade ao mesmo tempo e devem unir forças para escapar do horror dentro do Departamento de Polícia (R.P.D.) e dos laboratórios subterrâneos da Umbrella.',
    releaseYear: 1998,
    releaseDate: '08/08/1998',
    developer: 'Capcom Production Studio 4',
    publisher: 'Capcom',
    genres: ['Survival Horror', 'Ação', 'Zumbis', 'Quebra-cabeça'],
    gamefaqsRating: 4.9,
    gamefaqsDifficulty: 'Equilibrado (Just Right)',
    ptBrSupport: true,
    zukoStorePageUrl: 'https://thezukostore.com/ps1-pkg-resident-evil-2-dualshock',
    gamefaqsPageUrl: 'https://gamefaqs.gamespot.com/ps/198458-resident-evil-2',
    tags: ['Leon Kennedy', 'Claire Redfield', 'Zumbis', 'DualShock', 'Umbrella']
  },
  {
    id: 'pkg-ps1-metal-gear-solid',
    title: 'Metal Gear Solid',
    platform: 'PS1',
    titleId: 'SLUS-00594',
    fileUrl: 'https://thezukostore.com/ps1-pkg-metal-gear-solid.pkg',
    fileSize: '780 MB',
    format: 'PKG',
    firmware: 'PS3 CFW / HEN 4.90+ (2 Discos Unificados no PKG)',
    region: 'NTSC-U',
    coverUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'A obra-prima cinematográfica de espionagem tática criada por Hideo Kojima. Solid Snake é convocado da aposentadoria para infiltrar-se em uma base de descarte nuclear em Shadow Moses, no Alasca, tomada pela unidade terrorista FOXHOUND liderada por Liquid Snake. Com ameaça de ataque nuclear em 24 horas, Snake precisa resgatar reféns e neutralizar a arma bípede Metal Gear REX.',
    releaseYear: 1998,
    releaseDate: '21/10/1998',
    developer: 'Konami Computer Entertainment Japan',
    publisher: 'Konami',
    genres: ['Espionagem Tática', 'Ação', 'Ficção Científica', 'Stealth'],
    gamefaqsRating: 4.9,
    gamefaqsDifficulty: 'Equilibrado (Just Right)',
    ptBrSupport: true,
    zukoStorePageUrl: 'https://thezukostore.com/ps1-pkg-metal-gear-solid',
    gamefaqsPageUrl: 'https://gamefaqs.gamespot.com/ps/197909-metal-gear-solid',
    tags: ['Solid Snake', 'Kojima', 'Stealth', 'Shadow Moses', 'Legendado PT-BR']
  },

  // ===================== PS2 CLASSICS PKG =====================
  {
    id: 'pkg-ps2-god-of-war-2',
    title: 'God of War II',
    platform: 'PS2',
    titleId: 'SCUS-97481',
    fileUrl: 'https://thezukostore.com/ps2-pkg-god-of-war-2.pkg',
    fileSize: '7.9 GB',
    format: 'PKG',
    firmware: 'PS3 CFW / HEN 4.90+ (PS2 Classics GUI Convertido)',
    region: 'NTSC-U',
    coverUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1593500/library_600x900.jpg',
    bannerUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1593500/header.jpg',
    screenshots: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'O espetáculo definitivo de ação hack-and-slash do PlayStation 2. Kratos, agora entronizado como o novo Deus da Guerra, é traído por Zeus e despojado de seus poderes divinos. Resgatado das garras do Submundo por Gaia, Kratos embarca em uma jornada épica até a Ilha da Criação para encontrar as Irmãs do Destino e alterar o tempo para se vingar do Rei do Olimpo.',
    releaseYear: 2007,
    releaseDate: '13/03/2007',
    developer: 'Santa Monica Studio',
    publisher: 'Sony Computer Entertainment',
    genres: ['Hack and Slash', 'Ação Mitológica', 'Aventura'],
    gamefaqsRating: 4.8,
    gamefaqsDifficulty: 'Equilibrado (Just Right)',
    ptBrSupport: true,
    zukoStorePageUrl: 'https://thezukostore.com/ps2-pkg-god-of-war-2',
    gamefaqsPageUrl: 'https://gamefaqs.gamespot.com/ps2/932483-god-of-war-ii',
    tags: ['Kratos', 'Mitologia Grega', 'Hack and Slash', 'Santa Monica', 'PT-BR']
  },
  {
    id: 'pkg-ps2-gta-san-andreas',
    title: 'Grand Theft Auto: San Andreas',
    platform: 'PS2',
    titleId: 'SLUS-20946',
    fileUrl: 'https://thezukostore.com/ps2-pkg-gta-san-andreas.pkg',
    fileSize: '4.2 GB',
    format: 'PKG',
    firmware: 'PS3 CFW / HEN 4.90+ (PS2 Classics GUI Convertido)',
    region: 'NTSC-U',
    coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'O maior e mais aclamado mundo aberto da era 128-bit. Há cinco anos, Carl Johnson fugiu das pressões de Los Santos, uma cidade corrompida por guerras de gangues, drogas e corrupção. No início dos anos 90, CJ retorna para casa após o assassinato de sua mãe, apenas para ser incriminado por policiais corruptos. CJ é forçado a percorrer todo o estado de San Andreas para salvar sua família e dominar as ruas.',
    releaseYear: 2004,
    releaseDate: '26/10/2004',
    developer: 'Rockstar North',
    publisher: 'Rockstar Games',
    genres: ['Mundo Aberto', 'Ação', 'Crime', 'Sandbox'],
    gamefaqsRating: 4.8,
    gamefaqsDifficulty: 'Equilibrado (Just Right)',
    ptBrSupport: true,
    zukoStorePageUrl: 'https://thezukostore.com/ps2-pkg-gta-san-andreas',
    gamefaqsPageUrl: 'https://gamefaqs.gamespot.com/ps2/914983-grand-theft-auto-san-andreas',
    tags: ['CJ', 'Grove Street', 'Rockstar Games', 'Mundo Aberto', 'Tradução PT-BR']
  },
  {
    id: 'pkg-ps2-shadow-of-the-colossus',
    title: 'Shadow of the Colossus',
    platform: 'PS2',
    titleId: 'SCUS-97472',
    fileUrl: 'https://thezukostore.com/ps2-pkg-shadow-of-the-colossus.pkg',
    fileSize: '2.7 GB',
    format: 'PKG',
    firmware: 'PS3 CFW / HEN 4.90+ (PS2 Classics GUI Convertido)',
    region: 'NTSC-U',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Uma das obras mais poéticas e impactantes da história dos videogames. Um jovem chamado Wander cavalga até uma terra proibida acompanhado de seu fiel corcel Agro para ressuscitar uma garota sacrificada chamada Mono. Para cumprir o pacto com a entidade Dormin, Wander precisa localizar e derrotar dezesseis gigantescos Colossos de pedra espalhados pelo vasto santuário.',
    releaseYear: 2005,
    releaseDate: '18/10/2005',
    developer: 'Team Ico',
    publisher: 'Sony Computer Entertainment',
    genres: ['Aventura Artística', 'Ação', 'Quebra-cabeça de Chefes'],
    gamefaqsRating: 4.9,
    gamefaqsDifficulty: 'Equilibrado (Just Right)',
    ptBrSupport: true,
    zukoStorePageUrl: 'https://thezukostore.com/ps2-pkg-shadow-of-the-colossus',
    gamefaqsPageUrl: 'https://gamefaqs.gamespot.com/ps2/924364-shadow-of-the-colossus',
    tags: ['Fumito Ueda', 'Team Ico', 'Colossos', 'Agro', 'Obra de Arte']
  },
  {
    id: 'pkg-ps2-resident-evil-4',
    title: 'Resident Evil 4',
    platform: 'PS2',
    titleId: 'SLUS-21134',
    fileUrl: 'https://thezukostore.com/ps2-pkg-resident-evil-4-ptbr.pkg',
    fileSize: '3.8 GB',
    format: 'PKG',
    firmware: 'PS3 CFW / HEN 4.90+ (Com Dublagem Brasileira)',
    region: 'NTSC-U',
    coverUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2050650/library_600x900.jpg',
    bannerUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2050650/header.jpg',
    screenshots: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'A revolução que estabeleceu a câmera sobre o ombro e o ritmo moderno dos jogos de tiro e terror. Seis anos após o fim de Raccoon City, Leon S. Kennedy foi recrutado como agente especial do governo norte-americano. Sua missão é resgatar Ashley Graham, a filha do presidente dos EUA, mantida em cativeiro em uma vila rural espanhola dominada pelo culto sinistro Los Iluminados e pelo parasita Las Plagas.',
    releaseYear: 2005,
    releaseDate: '25/10/2005',
    developer: 'Capcom Production Studio 4',
    publisher: 'Capcom',
    genres: ['Survival Horror', 'Ação', 'Tiro em Terceira Pessoa'],
    gamefaqsRating: 4.9,
    gamefaqsDifficulty: 'Equilibrado (Just Right)',
    ptBrSupport: true,
    zukoStorePageUrl: 'https://thezukostore.com/ps2-pkg-resident-evil-4-ptbr',
    gamefaqsPageUrl: 'https://gamefaqs.gamespot.com/ps2/925156-resident-evil-4',
    tags: ['Leon Kennedy', 'Ashley Graham', 'Dublado PT-BR', 'Las Plagas', 'Separate Ways']
  },

  // ===================== PS3 PKG =====================
  {
    id: 'pkg-ps3-the-last-of-us-goty',
    title: 'The Last of Us: Game of the Year',
    platform: 'PS3',
    titleId: 'BCUS-98174',
    fileUrl: 'https://thezukostore.com/ps3-pkg-the-last-of-us-goty.pkg',
    fileSize: '26.4 GB',
    format: 'PKG',
    firmware: 'PS3 CFW / HEN 4.90+ (PKG + RAP + DLC Left Behind)',
    region: 'NTSC-U',
    coverUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1888930/library_600x900.jpg',
    bannerUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1888930/header.jpg',
    screenshots: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'O jogo mais premiado da sétima geração de consoles. Uma pandemia fúngica do fungo Cordyceps devastou os Estados Unidos há vinte anos. Joel, um contrabandista cínico e traumatizado, é encarregado de escoltar Ellie, uma garota de 14 anos imune à infecção, através de uma América pós-apocalíptica em busca do grupo rebelde Vagalumes.',
    releaseYear: 2013,
    releaseDate: '14/06/2013',
    developer: 'Naughty Dog LLC',
    publisher: 'Sony Computer Entertainment',
    genres: ['Ação e Aventura', 'Sobrevivência', 'Narrativa Cinematográfica'],
    gamefaqsRating: 4.9,
    gamefaqsDifficulty: 'Equilibrado (Just Right)',
    ptBrSupport: true,
    zukoStorePageUrl: 'https://thezukostore.com/ps3-pkg-the-last-of-us-goty',
    gamefaqsPageUrl: 'https://gamefaqs.gamespot.com/ps3/652686-the-last-of-us',
    tags: ['Joel e Ellie', 'Naughty Dog', 'Dublagem Clássica PT-BR', 'Left Behind', 'PS3 PKG']
  },
  {
    id: 'pkg-ps3-red-dead-redemption-goty',
    title: 'Red Dead Redemption: Game of the Year',
    platform: 'PS3',
    titleId: 'BLES-01294',
    fileUrl: 'https://thezukostore.com/ps3-pkg-red-dead-redemption-goty.pkg',
    fileSize: '10.2 GB',
    format: 'PKG',
    firmware: 'PS3 CFW / HEN 4.90+ (PKG + Expansão Undead Nightmare)',
    region: 'PAL',
    coverUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'O ápice do faroeste interativo da Rockstar Games. Quando agentes federais ameaçam sua família, o ex-fora da lei John Marston é forçado a caçar os membros de sua antiga gangue de pistoleiros pelas fronteiras áridas do sudoeste americano e do México. Vivencie duelos mortais ao pôr do sol, caçadas, jogos de cartas e a aclamada expansão de terror zumbi Undead Nightmare.',
    releaseYear: 2010,
    releaseDate: '18/05/2010',
    developer: 'Rockstar San Diego',
    publisher: 'Rockstar Games',
    genres: ['Mundo Aberto', 'Faroeste', 'Ação', 'Tiro em Terceira Pessoa'],
    gamefaqsRating: 4.8,
    gamefaqsDifficulty: 'Equilibrado (Just Right)',
    ptBrSupport: true,
    zukoStorePageUrl: 'https://thezukostore.com/ps3-pkg-red-dead-redemption-goty',
    gamefaqsPageUrl: 'https://gamefaqs.gamespot.com/ps3/957923-red-dead-redemption',
    tags: ['John Marston', 'Rockstar Games', 'Undead Nightmare', 'Tradução PT-BR']
  },
  {
    id: 'pkg-ps3-god-of-war-3',
    title: 'God of War III',
    platform: 'PS3',
    titleId: 'BCUS-98111',
    fileUrl: 'https://thezukostore.com/ps3-pkg-god-of-war-3.pkg',
    fileSize: '34.5 GB',
    format: 'PKG',
    firmware: 'PS3 CFW / HEN 4.90+ (PKG Completo + Fix Update)',
    region: 'NTSC-U',
    coverUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1593500/library_600x900.jpg',
    bannerUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1593500/header.jpg',
    screenshots: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'O confronto final contra os deuses do Monte Olimpo. Empunhando as Lâminas do Exílio e subindo pelas costas dos Titãs em direção ao cume dos céus, Kratos busca extinguir toda a linhagem divina da Grécia Antiga. Batalhe contra Poseidon, Hades, Hércules e o próprio Zeus em combates titânicos de escala sem precedentes.',
    releaseYear: 2010,
    releaseDate: '16/03/2010',
    developer: 'Santa Monica Studio',
    publisher: 'Sony Computer Entertainment',
    genres: ['Hack and Slash', 'Ação', 'Mitologia Grega'],
    gamefaqsRating: 4.8,
    gamefaqsDifficulty: 'Equilibrado (Just Right)',
    ptBrSupport: true,
    zukoStorePageUrl: 'https://thezukostore.com/ps3-pkg-god-of-war-3',
    gamefaqsPageUrl: 'https://gamefaqs.gamespot.com/ps3/943928-god-of-war-iii',
    tags: ['Kratos', 'Zeus', 'Santa Monica', 'Olimpo', 'Dublado PT-BR']
  },
  {
    id: 'pkg-ps3-demons-souls',
    title: "Demon's Souls (PS3 PKG)",
    platform: 'PS3',
    titleId: 'BCUS-98176',
    fileUrl: 'https://thezukostore.com/ps3-pkg-demons-souls.pkg',
    fileSize: '8.4 GB',
    format: 'PKG',
    firmware: 'PS3 CFW / HEN 4.90+ (PKG Pronto para Instalação)',
    region: 'NTSC-U',
    coverUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/library_600x900.jpg',
    bannerUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg',
    screenshots: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'O jogo lendário de Hidetaka Miyazaki que deu origem ao gênero Souls-like. O reino de Boletaria foi engolido por um nevoeiro incolor após o Rei Allant despertar o Antigo mal. Assuma o papel de um guerreiro solitário no santuário do Nexus, explorando cinco arquipedras sombrias repletas de demônios impiedosos e armadilhas traiçoeiras.',
    releaseYear: 2009,
    releaseDate: '06/10/2009',
    developer: 'FromSoftware',
    publisher: 'Atlus USA / Sony Computer Entertainment',
    genres: ['Action RPG', 'Fantasia Sombria', 'Souls-like', 'Hardcore'],
    gamefaqsRating: 4.9,
    gamefaqsDifficulty: 'Extremo (Very Tough)',
    ptBrSupport: true,
    zukoStorePageUrl: 'https://thezukostore.com/ps3-pkg-demons-souls',
    gamefaqsPageUrl: 'https://gamefaqs.gamespot.com/ps3/954345-demons-souls',
    tags: ['FromSoftware', 'Miyazaki', 'Souls-like', 'Boletaria', 'Nexus']
  },
  {
    id: 'pkg-ps3-grim-dawn-definitive',
    title: 'Grim Dawn: Definitive Edition',
    platform: 'PS3',
    titleId: 'BLUS-31622',
    fileUrl: 'https://thezukostore.com/pc-pkg-grim-dawn-definitive-edition.pkg',
    fileSize: '11.8 GB',
    format: 'PKG',
    firmware: 'PS3 CFW / HEN 4.90+ & PC Edition',
    region: 'NTSC-U',
    coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Entre em um mundo de fantasia sombrio e apocalíptico onde a humanidade está à beira da extinção. Grim Dawn é o aclamado ARPG espiritual do lendário Titan Quest, combinando árvores de habilidades duplas, centenas de itens épicos e um universo devastado pelo Éter. A Definitive Edition inclui as expansões Ashes of Malmouth e Forgotten Gods, além de suporte a controle e tradução PT-BR.',
    releaseYear: 2016,
    releaseDate: '25/02/2016',
    developer: 'Crate Entertainment',
    publisher: 'Crate Entertainment',
    genres: ['ARPG', 'Hack and Slash', 'RPG de Ação', 'Fantasia Sombria'],
    gamefaqsRating: 4.8,
    gamefaqsDifficulty: 'Desafiador (Hard)',
    ptBrSupport: true,
    zukoStorePageUrl: 'https://thezukostore.com/pc-pkg-grim-dawn-definitive-edition',
    gamefaqsPageUrl: 'https://gamefaqs.gamespot.com/pc/995472-grim-dawn',
    gamefaqsCheatsUrl: 'https://gamefaqs.gamespot.com/pc/995472-grim-dawn/cheats',
    nexusModsUrl: 'https://www.nexusmods.com/grimdawn',
    tags: ['Grim Dawn', 'Definitive Edition', 'ARPG', 'Crate Entertainment', 'GameFAQs', 'Nexus Mods', 'v1.3.1.1'],
    cheats: [
      {
        id: 'gd-cheat-1',
        title: 'Modo Deus / Invulnerabilidade (Console)',
        codeOrEffect: 'Pressione ` (til) ou F1 para abrir o console e digite: game.god true',
        category: 'Vidas/Energia',
        description: 'Torna o personagem imune a qualquer dano de monstros, chefes e poças de éter radioativo.',
        source: 'GameFAQs'
      },
      {
        id: 'gd-cheat-2',
        title: 'Adicionar 1.000.000 de Iron Bits (Dinheiro)',
        codeOrEffect: 'No console de comandos: game.give IronBits 1000000',
        category: 'Dinheiro',
        description: 'Deposita um milhão de moedas no inventário para compras imediatas com ferreiros e mercadores.',
        source: 'GameFAQs'
      },
      {
        id: 'gd-cheat-3',
        title: 'Desbloquear Todos os 55 Pontos de Devoção',
        codeOrEffect: 'No console de comandos: character.grantpow 55',
        category: 'Desbloqueáveis',
        description: 'Garante o número máximo de pontos de Devoção para completar as constelações celestiais.',
        source: 'GameFAQs'
      },
      {
        id: 'gd-cheat-4',
        title: 'Revelar Todo o Mapa de Cairn',
        codeOrEffect: 'No console de comandos: game.revealmap true',
        category: 'Segredos',
        description: 'Limpa a névoa de guerra e mostra todas as passagens secretas, altares e masmorras.',
        source: 'GameFAQs'
      }
    ],
    mods: [
      {
        id: 'gd-mod-1',
        title: 'Grim Internals (Auto-Loot & Teleporte Rápido)',
        description: 'Ferramenta essencial da comunidade que adiciona coleta automática de componentes, estatísticas de DPS em tempo real e atalhos rápidos.',
        nexusUrl: 'https://www.nexusmods.com/grimdawn/mods/40',
        category: 'Gameplay',
        author: 'GlockenGerda',
        downloadsCount: '340k'
      },
      {
        id: 'gd-mod-2',
        title: 'Reign of Terror (Diablo 2 Total Conversion)',
        description: 'Recriação completa do lendário Diablo II e Lord of Destruction dentro da engine do Grim Dawn, com todas as classes clássicas de D2.',
        nexusUrl: 'https://www.nexusmods.com/grimdawn/mods/144',
        category: 'Total Conversion',
        author: 'Ram & RoT Team',
        downloadsCount: '280k'
      },
      {
        id: 'gd-mod-3',
        title: 'Grim Dawn Item Assistant (Armazenamento Infinito)',
        description: 'Gerenciador externo que permite armazenar itens ilimitados sem depender do baú pequeno do jogo.',
        nexusUrl: 'https://www.nexusmods.com/grimdawn/mods/4',
        category: 'Utilitário',
        author: 'SlipperyPete',
        downloadsCount: '410k'
      },
      {
        id: 'gd-mod-4',
        title: 'Dawn of Masteries (Mais de 30 Novas Classes)',
        description: 'Mega mod que funde classes do Titan Quest, Diablo 3, Zenith e Cataclysm no Grim Dawn com balanceamento avançado.',
        nexusUrl: 'https://www.nexusmods.com/grimdawn/mods/82',
        category: 'Classes/Gameplay',
        author: 'mamba',
        downloadsCount: '190k'
      }
    ]
  }
];

// Helper functions for storage
const STORAGE_KEY = 'vortex_pkg_lab_games';

export const getStoredPkgGames = (): PkgGame[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((g: PkgGame) => ({
          ...g,
          title: g.title
            .replace(/\s*\((PS[1-3]|PC)\s*PKG[^\)]*\)/gi, '')
            .replace(/\s*\.pkg\b/gi, '')
            .trim()
        }));
      }
    }
  } catch (e) {
    console.error('Failed to load PKG games from storage', e);
  }
  return INITIAL_PKG_GAMES;
};

export const savePkgGames = (games: PkgGame[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
  } catch (e) {
    console.error('Failed to save PKG games to storage', e);
  }
};

export const resetPkgGamesToDefault = (): PkgGame[] => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to reset PKG games', e);
  }
  return INITIAL_PKG_GAMES;
};

export const updateStoredPkgGame = (updatedGame: PkgGame): PkgGame[] => {
  const current = getStoredPkgGames();
  const exists = current.some(g => g.id === updatedGame.id);
  const updatedList = exists 
    ? current.map(g => g.id === updatedGame.id ? updatedGame : g)
    : [updatedGame, ...current];
  savePkgGames(updatedList);
  return updatedList;
};

export const deleteStoredPkgGame = (gameId: string): PkgGame[] => {
  const current = getStoredPkgGames();
  const filtered = current.filter(g => g.id !== gameId);
  savePkgGames(filtered);
  return filtered;
};
