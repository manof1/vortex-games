export interface PkgGame {
  id: string;
  title: string;
  platform: 'PS1' | 'PS2' | 'PS3';
  titleId: string; // Ex: SLUS-00067, SCUS-97481, BCUS-98174
  fileUrl: string; // Link direto/origem TheZukoStore
  fileSize: string; // Tamanho do arquivo PKG
  format: 'PKG';
  firmware: string;
  region: 'NTSC-U' | 'PAL' | 'NTSC-J';
  coverUrl: string;
  bannerUrl: string;
  screenshots: string[]; // 3 a 4 fotos/screenshots de gameplay reais
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
}

export const INITIAL_PKG_GAMES: PkgGame[] = [
  // ===================== PS1 CLASSICS PKG =====================
  {
    id: 'pkg-ps1-castlevania-sotn',
    title: 'Castlevania: Symphony of the Night (PS1 PKG)',
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
    description: 'Sinopse GameFAQs: Considerado a obra-prima definitiva do gênero Metroidvania. Quatro anos após o desaparecimento de Richter Belmont, o Castelo de Drácula ressurge misteriosamente da névoa. Alucard, o filho meio-humano de Drácula, desperta de seu sono profundo para investigar a anomalia e confrontar o mal ancestral. Explore um mapa labiríntico e não-linear, colete centenas de armas, magias e relíquias, e descubra o segredo do Castelo Invertido.',
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
    tags: ['Metroidvania', 'Alucard', 'Dracula', 'Dublado / Legendado PT-BR', 'PS1 Classics']
  },
  {
    id: 'pkg-ps1-silent-hill',
    title: 'Silent Hill (PS1 PKG)',
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
    description: 'Sinopse GameFAQs: O marco que redefiniu o horror psicológico no PlayStation. Harry Mason sofre um acidente de carro na entrada da misteriosa cidade turística de Silent Hill e descobre que sua filha adotiva Cheryl desapareceu. Enquanto busca desesperadamente pela garota sob uma névoa espessa e chuva de cinzas, Harry descobre que a cidade transita para uma dimensão enferrujada e grotesca governada por um culto fanático.',
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
    tags: ['Survival Horror', 'Harry Mason', 'Team Silent', 'Tradução PT-BR']
  },
  {
    id: 'pkg-ps1-resident-evil-2-dualshock',
    title: 'Resident Evil 2: DualShock Edition (PS1 PKG)',
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
    description: 'Sinopse GameFAQs: O ápice dos clássicos de zumbis em Raccoon City. Dois meses após os incidentes na Mansão Spencer, o T-Vírus consome completamente a cidade. O policial novato Leon S. Kennedy e a jovem estudante universitária Claire Redfield chegam à cidade ao mesmo tempo e devem unir forças para escapar do horror dentro do Departamento de Polícia (R.P.D.) e dos laboratórios subterrâneos da Umbrella.',
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
    title: 'Metal Gear Solid (PS1 PKG)',
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
    description: 'Sinopse GameFAQs: A obra-prima cinematográfica de espionagem tática criada por Hideo Kojima. Solid Snake é convocado da aposentadoria para infiltrar-se em uma base de descarte nuclear em Shadow Moses, no Alasca, tomada pela unidade terrorista FOXHOUND liderada por Liquid Snake. Com ameaça de ataque nuclear em 24 horas, Snake precisa resgatar reféns e neutralizar a arma bípede Metal Gear REX.',
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
    title: 'God of War II (PS2 PKG)',
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
    description: 'Sinopse GameFAQs: O espetáculo definitivo de ação hack-and-slash do PlayStation 2. Kratos, agora entronizado como o novo Deus da Guerra, é traído por Zeus e despojado de seus poderes divinos. Resgatado das garras do Submundo por Gaia, Kratos embarca em uma jornada épica até a Ilha da Criação para encontrar as Irmãs do Destino e alterar o tempo para se vingar do Rei do Olimpo.',
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
    title: 'Grand Theft Auto: San Andreas (PS2 PKG)',
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
    description: 'Sinopse GameFAQs: O maior e mais aclamado mundo aberto da era 128-bit. Há cinco anos, Carl Johnson fugiu das pressões de Los Santos, uma cidade corrompida por guerras de gangues, drogas e corrupção. No início dos anos 90, CJ retorna para casa após o assassinato de sua mãe, apenas para ser incriminado por policiais corruptos. CJ é forçado a percorrer todo o estado de San Andreas para salvar sua família e dominar as ruas.',
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
    title: 'Shadow of the Colossus (PS2 PKG)',
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
    description: 'Sinopse GameFAQs: Uma das obras mais poéticas e impactantes da história dos videogames. Um jovem chamado Wander cavalga até uma terra proibida acompanhado de seu fiel corcel Agro para ressuscitar uma garota sacrificada chamada Mono. Para cumprir o pacto com a entidade Dormin, Wander precisa localizar e derrotar dezesseis gigantescos Colossos de pedra espalhados pelo vasto santuário.',
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
    title: 'Resident Evil 4 (PS2 PKG - PT-BR Dublado)',
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
    description: 'Sinopse GameFAQs: A revolução que estabeleceu a câmera sobre o ombro e o ritmo moderno dos jogos de tiro e terror. Seis anos após o fim de Raccoon City, Leon S. Kennedy foi recrutado como agente especial do governo norte-americano. Sua missão é resgatar Ashley Graham, a filha do presidente dos EUA, mantida em cativeiro em uma vila rural espanhola dominada pelo culto sinistro Los Iluminados e pelo parasita Las Plagas.',
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
    title: 'The Last of Us: Game of the Year (PS3 PKG)',
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
    description: 'Sinopse GameFAQs: O jogo mais premiado da sétima geração de consoles. Uma pandemia fúngica do fungo Cordyceps devastou os Estados Unidos há vinte anos. Joel, um contrabandista cínico e traumatizado, é encarregado de escoltar Ellie, uma garota de 14 anos imune à infecção, através de uma América pós-apocalíptica em busca do grupo rebelde Vagalumes.',
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
    title: 'Red Dead Redemption: Game of the Year (PS3 PKG)',
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
    description: 'Sinopse GameFAQs: O ápice do faroeste interativo da Rockstar Games. Quando agentes federais ameaçam sua família, o ex-fora da lei John Marston é forçado a caçar os membros de sua antiga gangue de pistoleiros pelas fronteiras áridas do sudoeste americano e do México. Vivencie duelos mortais ao pôr do sol, caçadas, jogos de cartas e a aclamada expansão de terror zumbi Undead Nightmare.',
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
    title: 'God of War III (PS3 PKG)',
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
    description: 'Sinopse GameFAQs: O confronto final contra os deuses do Monte Olimpo. Empunhando as Lâminas do Exílio e subindo pelas costas dos Titãs em direção ao cume dos céus, Kratos busca extinguir toda a linhagem divina da Grécia Antiga. Batalhe contra Poseidon, Hades, Hércules e o próprio Zeus em combates titânicos de escala sem precedentes.',
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
    description: 'Sinopse GameFAQs: O jogo lendário de Hidetaka Miyazaki que deu origem ao gênero Souls-like. O reino de Boletaria foi engolido por um nevoeiro incolor após o Rei Allant despertar o Antigo mal. Assuma o papel de um guerreiro solitário no santuário do Nexus, explorando cinco arquipedras sombrias repletas de demônios impiedosos e armadilhas traiçoeiras.',
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
        return parsed;
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
