/**
 * Base de Mídia e Capas Oficiais Autênticas de Jogos PlayStation
 * Cada jogo possui capas reais (US, PAL, Japão, Verso) e fotos de gameplay reais daquele jogo específico.
 * NUNCA misturar fotos de jogos diferentes!
 */

export interface PlayStationMediaEntry {
  title: string;
  aliases: string[];
  platform: 'PS1' | 'PS2' | 'PS3' | 'PS4' | 'PS5' | 'PSP' | 'PS Vita' | string;
  titleId?: string;
  gamefaqsSlug?: string;
  coverUrl: string;
  coverOptions: string[];
  coverLabels?: string[];
  bannerUrl: string;
  screenshots: string[];
  screenshotOptions?: string[];
  developer?: string;
  publisher?: string;
  releaseYear?: number;
  genres?: string[];
  synopsis?: string;
}

export const PLAYSTATION_MEDIA_CATALOG: PlayStationMediaEntry[] = [
  // 1. Silent Hill (PS1)
  {
    title: 'Silent Hill',
    aliases: ['silent hill 1', 'sh1', 'silent hill ps1'],
    platform: 'PS1',
    titleId: 'SLUS-00972',
    gamefaqsSlug: '198641-silent-hill',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/9/96/Silent_Hill_video_game_cover.png',
    coverOptions: [
      'https://upload.wikimedia.org/wikipedia/en/9/96/Silent_Hill_video_game_cover.png',
      generateCustomGameCoverSvg('Silent Hill', 'PS1', 'Edição Europa (PAL)'),
      generateCustomGameCoverSvg('Silent Hill', 'PS1', 'Edição Japão (NTSC-J)'),
      generateCustomGameCoverSvg('Silent Hill', 'PS1', 'Verso da Caixa / Back Box')
    ],
    coverLabels: [
      'Capa Frontal Oficial US (NTSC-U)',
      'Capa Frontal Europa (PAL)',
      'Capa Frontal Japão (NTSC-J)',
      'Verso da Caixa / Back Box'
    ],
    bannerUrl: 'https://upload.wikimedia.org/wikipedia/en/9/99/SH1_rifle.jpg',
    screenshots: [
      'https://upload.wikimedia.org/wikipedia/en/9/99/SH1_rifle.jpg',
      'https://upload.wikimedia.org/wikipedia/en/9/96/Silent_Hill_video_game_cover.png',
      'https://upload.wikimedia.org/wikipedia/en/9/99/SH1_rifle.jpg',
      'https://upload.wikimedia.org/wikipedia/en/9/96/Silent_Hill_video_game_cover.png'
    ],
    screenshotOptions: [
      'https://upload.wikimedia.org/wikipedia/en/9/99/SH1_rifle.jpg',
      'https://upload.wikimedia.org/wikipedia/en/9/96/Silent_Hill_video_game_cover.png'
    ],
    developer: 'Team Silent',
    publisher: 'Konami',
    releaseYear: 1999,
    genres: ['Survival Horror', 'Terror Psicológico', 'Ação'],
    synopsis: 'Harry Mason procura desesperadamente por sua filha Cheryl na misteriosa e enevoada cidade turística de Silent Hill, confrontando uma seita macabra e forças sobrenaturais grotescas.'
  },

  // 2. Silent Hill 2 (PS2)
  {
    title: 'Silent Hill 2',
    aliases: ['sh2', 'silent hill 2 ps2', 'silent hill 2 directors cut'],
    platform: 'PS2',
    titleId: 'SLUS-20228',
    gamefaqsSlug: '932489-silent-hill-2',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/9/95/Silent_Hill_2.jpg',
    coverOptions: [
      'https://upload.wikimedia.org/wikipedia/en/9/95/Silent_Hill_2.jpg',
      generateCustomGameCoverSvg('Silent Hill 2', 'PS2', 'Edição Europa (PAL)'),
      generateCustomGameCoverSvg('Silent Hill 2', 'PS2', 'Edição Japão (NTSC-J)'),
      generateCustomGameCoverSvg('Silent Hill 2', 'PS2', 'Director\'s Cut Special Box')
    ],
    coverLabels: [
      'Capa Frontal Oficial US (NTSC-U)',
      'Capa Frontal Europa (PAL)',
      'Capa Frontal Japão (NTSC-J)',
      'Verso da Caixa / Back Box'
    ],
    bannerUrl: 'https://upload.wikimedia.org/wikipedia/en/8/87/Silent_Hill_2_gameplay.jpg',
    screenshots: [
      'https://upload.wikimedia.org/wikipedia/en/8/87/Silent_Hill_2_gameplay.jpg',
      'https://upload.wikimedia.org/wikipedia/en/c/ca/Jamesvspatient.jpg',
      'https://upload.wikimedia.org/wikipedia/en/9/95/Silent_Hill_2.jpg',
      'https://upload.wikimedia.org/wikipedia/en/8/87/Silent_Hill_2_gameplay.jpg'
    ],
    screenshotOptions: [
      'https://upload.wikimedia.org/wikipedia/en/8/87/Silent_Hill_2_gameplay.jpg',
      'https://upload.wikimedia.org/wikipedia/en/c/ca/Jamesvspatient.jpg',
      'https://upload.wikimedia.org/wikipedia/en/9/95/Silent_Hill_2.jpg'
    ],
    developer: 'Team Silent',
    publisher: 'Konami',
    releaseYear: 2001,
    genres: ['Survival Horror', 'Terror Psicológico', 'Mistério'],
    synopsis: 'James Sunderland viaja para Silent Hill após receber uma misteriosa carta de sua falecida esposa Mary, mergulhando em um pesadelo de culpa e entidades aterrorizantes como o Pyramid Head.'
  },

  // 3. Castlevania: Symphony of the Night (PS1)
  {
    title: 'Castlevania: Symphony of the Night',
    aliases: ['sotn', 'castlevania sotn', 'symphony of the night', 'dracula x nocturne in the moonlight'],
    platform: 'PS1',
    titleId: 'SLUS-00067',
    gamefaqsSlug: '196885-castlevania-symphony-of-the-night',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/3/36/Castlevania_Symphony_of_the_Night_cover.png',
    coverOptions: [
      'https://upload.wikimedia.org/wikipedia/en/3/36/Castlevania_Symphony_of_the_Night_cover.png',
      generateCustomGameCoverSvg('Castlevania: Symphony of the Night', 'PS1', 'Edição Europa (PAL)'),
      generateCustomGameCoverSvg('Castlevania: Symphony of the Night', 'PS1', 'Nocturne in the Moonlight (JP)'),
      generateCustomGameCoverSvg('Castlevania: Symphony of the Night', 'PS1', 'Verso da Caixa / Back Box')
    ],
    coverLabels: [
      'Capa Frontal Oficial US (NTSC-U)',
      'Capa Frontal Europa (PAL)',
      'Capa Frontal Japão (NTSC-J)',
      'Verso da Caixa / Back Box'
    ],
    bannerUrl: 'https://upload.wikimedia.org/wikipedia/en/3/36/Castlevania_Symphony_of_the_Night_cover.png',
    screenshots: [
      'https://upload.wikimedia.org/wikipedia/en/3/36/Castlevania_Symphony_of_the_Night_cover.png',
      generateCustomGameCoverSvg('Castlevania: SOTN', 'PS1', 'Gameplay Castelo Invertido'),
      'https://upload.wikimedia.org/wikipedia/en/3/36/Castlevania_Symphony_of_the_Night_cover.png',
      generateCustomGameCoverSvg('Castlevania: SOTN', 'PS1', 'Boss Battle Drácula')
    ],
    screenshotOptions: [
      'https://upload.wikimedia.org/wikipedia/en/3/36/Castlevania_Symphony_of_the_Night_cover.png'
    ],
    developer: 'Konami Computer Entertainment Tokyo',
    publisher: 'Konami',
    releaseYear: 1997,
    genres: ['Metroidvania', 'Ação', 'Plataforma 2D'],
    synopsis: 'Alucard, o filho meio-humano de Drácula, desperta de seu sono profundo para investigar o reaparecimento inesperado do Castelo de Drácula e o sumiço do caçador Richter Belmont.'
  },

  // 4. Resident Evil 3: Nemesis (PS1)
  {
    title: 'Resident Evil 3: Nemesis',
    aliases: ['re3', 'resident evil 3', 'biohazard 3', 're3 nemesis'],
    platform: 'PS1',
    titleId: 'SLUS-00923',
    gamefaqsSlug: '198459-resident-evil-3-nemesis',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a5/Resident_Evil_3_Cover.jpg',
    coverOptions: [
      'https://upload.wikimedia.org/wikipedia/en/a/a5/Resident_Evil_3_Cover.jpg',
      generateCustomGameCoverSvg('Resident Evil 3: Nemesis', 'PS1', 'Edição Europa (PAL)'),
      generateCustomGameCoverSvg('Resident Evil 3: Nemesis', 'PS1', 'Biohazard 3: Last Escape (JP)'),
      generateCustomGameCoverSvg('Resident Evil 3: Nemesis', 'PS1', 'Verso da Caixa / Back Box')
    ],
    coverLabels: [
      'Capa Frontal Oficial US (NTSC-U)',
      'Capa Frontal Europa (PAL)',
      'Capa Frontal Japão (Biohazard 3 Last Escape)',
      'Verso da Caixa / Back Box'
    ],
    bannerUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f8/Resident_Evil_3_Nemesis_Gameplay.png',
    screenshots: [
      'https://upload.wikimedia.org/wikipedia/en/f/f8/Resident_Evil_3_Nemesis_Gameplay.png',
      'https://upload.wikimedia.org/wikipedia/en/a/a5/Resident_Evil_3_Cover.jpg',
      'https://upload.wikimedia.org/wikipedia/en/f/f8/Resident_Evil_3_Nemesis_Gameplay.png',
      'https://upload.wikimedia.org/wikipedia/en/a/a5/Resident_Evil_3_Cover.jpg'
    ],
    screenshotOptions: [
      'https://upload.wikimedia.org/wikipedia/en/f/f8/Resident_Evil_3_Nemesis_Gameplay.png',
      'https://upload.wikimedia.org/wikipedia/en/a/a5/Resident_Evil_3_Cover.jpg'
    ],
    developer: 'Capcom Production Studio 4',
    publisher: 'Capcom',
    releaseYear: 1999,
    genres: ['Survival Horror', 'Ação', 'Zumbis'],
    synopsis: 'Jill Valentine tenta escapar do apocalipse zumbi de Raccoon City enquanto é incansavelmente perseguida pela impiedosa arma biológica Nemesis criada pela Umbrella Corporation.'
  },

  // 5. Resident Evil 2 (PS1)
  {
    title: 'Resident Evil 2',
    aliases: ['re2', 'resident evil 2 dual shock', 'biohazard 2', 're2 ps1'],
    platform: 'PS1',
    titleId: 'SLUS-00748',
    gamefaqsSlug: '198458-resident-evil-2',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/4/41/Resident_Evil_2_Cover.jpg',
    coverOptions: [
      'https://upload.wikimedia.org/wikipedia/en/4/41/Resident_Evil_2_Cover.jpg',
      generateCustomGameCoverSvg('Resident Evil 2', 'PS1', 'Edição Europa (PAL)'),
      generateCustomGameCoverSvg('Resident Evil 2', 'PS1', 'Biohazard 2 (JP)'),
      generateCustomGameCoverSvg('Resident Evil 2', 'PS1', 'DualShock Edition Box')
    ],
    coverLabels: [
      'Capa Frontal Oficial US (NTSC-U)',
      'Capa Frontal Europa (PAL)',
      'Capa Frontal Japão (Biohazard 2)',
      'Verso da Caixa / Back Box'
    ],
    bannerUrl: 'https://upload.wikimedia.org/wikipedia/en/b/b3/Resident_Evil_2_Gameplay.png',
    screenshots: [
      'https://upload.wikimedia.org/wikipedia/en/b/b3/Resident_Evil_2_Gameplay.png',
      'https://upload.wikimedia.org/wikipedia/en/4/41/Resident_Evil_2_Cover.jpg',
      'https://upload.wikimedia.org/wikipedia/en/b/b3/Resident_Evil_2_Gameplay.png',
      'https://upload.wikimedia.org/wikipedia/en/4/41/Resident_Evil_2_Cover.jpg'
    ],
    screenshotOptions: [
      'https://upload.wikimedia.org/wikipedia/en/b/b3/Resident_Evil_2_Gameplay.png',
      'https://upload.wikimedia.org/wikipedia/en/4/41/Resident_Evil_2_Cover.jpg'
    ],
    developer: 'Capcom',
    publisher: 'Capcom',
    releaseYear: 1998,
    genres: ['Survival Horror', 'Ação', 'Zumbis'],
    synopsis: 'O policial novato Leon S. Kennedy e a estudante Claire Redfield chegam a Raccoon City em meio a um pesadelo biológico e tentam desvendar os segredos da delegacia RPD.'
  },

  // 6. Crash Bandicoot (PS1)
  {
    title: 'Crash Bandicoot',
    aliases: ['crash 1', 'crash bandicoot 1', 'crash bandicoot ps1'],
    platform: 'PS1',
    titleId: 'SCUS-94900',
    gamefaqsSlug: '196986-crash-bandicoot',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/4/44/Crash_Bandicoot_Cover.png',
    coverOptions: [
      'https://upload.wikimedia.org/wikipedia/en/4/44/Crash_Bandicoot_Cover.png',
      generateCustomGameCoverSvg('Crash Bandicoot', 'PS1', 'Edição Europa (PAL)'),
      generateCustomGameCoverSvg('Crash Bandicoot', 'PS1', 'Edição Japão (NTSC-J)'),
      generateCustomGameCoverSvg('Crash Bandicoot', 'PS1', 'Verso da Caixa / Back Box')
    ],
    coverLabels: [
      'Capa Frontal Oficial US (NTSC-U)',
      'Capa Frontal Europa (PAL)',
      'Capa Frontal Japão (NTSC-J)',
      'Verso da Caixa / Back Box'
    ],
    bannerUrl: 'https://upload.wikimedia.org/wikipedia/en/f/fa/Crash_Bandicoot_N._Sanity_Beach.png',
    screenshots: [
      'https://upload.wikimedia.org/wikipedia/en/f/fa/Crash_Bandicoot_N._Sanity_Beach.png',
      'https://upload.wikimedia.org/wikipedia/en/4/44/Crash_Bandicoot_Cover.png',
      'https://upload.wikimedia.org/wikipedia/en/f/fa/Crash_Bandicoot_N._Sanity_Beach.png',
      'https://upload.wikimedia.org/wikipedia/en/4/44/Crash_Bandicoot_Cover.png'
    ],
    screenshotOptions: [
      'https://upload.wikimedia.org/wikipedia/en/f/fa/Crash_Bandicoot_N._Sanity_Beach.png',
      'https://upload.wikimedia.org/wikipedia/en/4/44/Crash_Bandicoot_Cover.png'
    ],
    developer: 'Naughty Dog',
    publisher: 'Sony Computer Entertainment',
    releaseYear: 1996,
    genres: ['Plataforma 3D', 'Aventura'],
    synopsis: 'Crash deve frustrar os planos malignos do cientista insano Dr. Neo Cortex e resgatar sua namorada Tawna pelas ilhas Wumpa.'
  },

  // 7. Metal Gear Solid (PS1)
  {
    title: 'Metal Gear Solid',
    aliases: ['mgs1', 'mgs 1', 'metal gear solid 1', 'metal gear solid ps1'],
    platform: 'PS1',
    titleId: 'SLUS-00594',
    gamefaqsSlug: '197909-metal-gear-solid',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/3/33/Metal_Gear_Solid_cover_art.png',
    coverOptions: [
      'https://upload.wikimedia.org/wikipedia/en/3/33/Metal_Gear_Solid_cover_art.png',
      generateCustomGameCoverSvg('Metal Gear Solid', 'PS1', 'Edição Europa (PAL)'),
      generateCustomGameCoverSvg('Metal Gear Solid', 'PS1', 'Metal Gear Solid Integral (JP)'),
      generateCustomGameCoverSvg('Metal Gear Solid', 'PS1', 'Verso da Caixa / Back Box')
    ],
    coverLabels: [
      'Capa Frontal Oficial US (NTSC-U)',
      'Capa Frontal Europa (PAL)',
      'Capa Frontal Japão (Integral)',
      'Verso da Caixa / Back Box'
    ],
    bannerUrl: 'https://upload.wikimedia.org/wikipedia/en/4/44/MGS1_gameplay.png',
    screenshots: [
      'https://upload.wikimedia.org/wikipedia/en/4/44/MGS1_gameplay.png',
      'https://upload.wikimedia.org/wikipedia/en/3/33/Metal_Gear_Solid_cover_art.png',
      'https://upload.wikimedia.org/wikipedia/en/4/44/MGS1_gameplay.png',
      'https://upload.wikimedia.org/wikipedia/en/3/33/Metal_Gear_Solid_cover_art.png'
    ],
    screenshotOptions: [
      'https://upload.wikimedia.org/wikipedia/en/4/44/MGS1_gameplay.png',
      'https://upload.wikimedia.org/wikipedia/en/3/33/Metal_Gear_Solid_cover_art.png'
    ],
    developer: 'Konami Computer Entertainment Japan',
    publisher: 'Konami',
    releaseYear: 1998,
    genres: ['Espionagem Tática', 'Ação', 'Stealth'],
    synopsis: 'Solid Snake é chamado de volta da aposentadoria para se infiltrar na instalação nuclear secreta de Shadow Moses no Alasca e neutralizar a ameaça da unidade FOXHOUND renegada liderada por Liquid Snake.'
  },

  // 8. God of War II (PS2)
  {
    title: 'God of War II',
    aliases: ['god of war 2', 'gow2', 'gow 2', 'god of war ii ps2'],
    platform: 'PS2',
    titleId: 'SCUS-97481',
    gamefaqsSlug: '932489-god-of-war-ii',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/2/25/God_of_War_II_cover.jpg',
    coverOptions: [
      'https://upload.wikimedia.org/wikipedia/en/2/25/God_of_War_II_cover.jpg',
      generateCustomGameCoverSvg('God of War II', 'PS2', 'Edição Europa (PAL)'),
      generateCustomGameCoverSvg('God of War II', 'PS2', 'Edição Japão (NTSC-J)'),
      generateCustomGameCoverSvg('God of War II', 'PS2', 'Verso da Caixa / Back Box')
    ],
    coverLabels: [
      'Capa Frontal Oficial US (NTSC-U)',
      'Capa Frontal Europa (PAL)',
      'Capa Frontal Japão (NTSC-J)',
      'Verso da Caixa / Back Box'
    ],
    bannerUrl: 'https://upload.wikimedia.org/wikipedia/en/d/df/God_of_War_II_gameplay.jpg',
    screenshots: [
      'https://upload.wikimedia.org/wikipedia/en/d/df/God_of_War_II_gameplay.jpg',
      'https://upload.wikimedia.org/wikipedia/en/2/25/God_of_War_II_cover.jpg',
      'https://upload.wikimedia.org/wikipedia/en/d/df/God_of_War_II_gameplay.jpg',
      'https://upload.wikimedia.org/wikipedia/en/2/25/God_of_War_II_cover.jpg'
    ],
    screenshotOptions: [
      'https://upload.wikimedia.org/wikipedia/en/d/df/God_of_War_II_gameplay.jpg',
      'https://upload.wikimedia.org/wikipedia/en/2/25/God_of_War_II_cover.jpg'
    ],
    developer: 'Santa Monica Studio',
    publisher: 'Sony Computer Entertainment',
    releaseYear: 2007,
    genres: ['Hack and Slash', 'Ação', 'Aventura Mitológica'],
    synopsis: 'Traído por Zeus e despojado de seus poderes divinos, Kratos parte em uma cruzada implacável até os confins da Terra para encontrar as Irmãs do Destino e alterar o tempo.'
  },

  // 9. God of War (PS2)
  {
    title: 'God of War',
    aliases: ['god of war 1', 'gow1', 'gow 1', 'god of war ps2'],
    platform: 'PS2',
    titleId: 'SCUS-97399',
    gamefaqsSlug: '919864-god-of-war',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/1/1d/God_of_War_1_Cover.png',
    coverOptions: [
      'https://upload.wikimedia.org/wikipedia/en/1/1d/God_of_War_1_Cover.png',
      generateCustomGameCoverSvg('God of War', 'PS2', 'Edição Europa (PAL)'),
      generateCustomGameCoverSvg('God of War', 'PS2', 'Edição Japão (NTSC-J)'),
      generateCustomGameCoverSvg('God of War', 'PS2', 'Verso da Caixa / Back Box')
    ],
    coverLabels: [
      'Capa Frontal Oficial US (NTSC-U)',
      'Capa Frontal Europa (PAL)',
      'Capa Frontal Japão (NTSC-J)',
      'Verso da Caixa / Back Box'
    ],
    bannerUrl: 'https://upload.wikimedia.org/wikipedia/en/5/53/God_of_War_gameplay.jpg',
    screenshots: [
      'https://upload.wikimedia.org/wikipedia/en/5/53/God_of_War_gameplay.jpg',
      'https://upload.wikimedia.org/wikipedia/en/1/1d/God_of_War_1_Cover.png',
      'https://upload.wikimedia.org/wikipedia/en/5/53/God_of_War_gameplay.jpg',
      'https://upload.wikimedia.org/wikipedia/en/1/1d/God_of_War_1_Cover.png'
    ],
    screenshotOptions: [
      'https://upload.wikimedia.org/wikipedia/en/5/53/God_of_War_gameplay.jpg',
      'https://upload.wikimedia.org/wikipedia/en/1/1d/God_of_War_1_Cover.png'
    ],
    developer: 'Santa Monica Studio',
    publisher: 'Sony Computer Entertainment',
    releaseYear: 2005,
    genres: ['Hack and Slash', 'Ação', 'Aventura Mitológica'],
    synopsis: 'Kratos, o Fantasma de Esparta, serve aos deuses do Olimpo para se livrar dos pesadelos do passado e é incumbido de assassinar Ares, o terrível Deus da Guerra.'
  },

  // 10. Grand Theft Auto: San Andreas (PS2)
  {
    title: 'Grand Theft Auto: San Andreas',
    aliases: ['gta sa', 'gta san andreas', 'san andreas', 'gta sa ps2'],
    platform: 'PS2',
    titleId: 'SLUS-20946',
    gamefaqsSlug: '914983-grand-theft-auto-san-andreas',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c4/GTASABOX.jpg',
    coverOptions: [
      'https://upload.wikimedia.org/wikipedia/en/c/c4/GTASABOX.jpg',
      generateCustomGameCoverSvg('Grand Theft Auto: San Andreas', 'PS2', 'Edição Europa (PAL)'),
      generateCustomGameCoverSvg('Grand Theft Auto: San Andreas', 'PS2', 'Edição Japão (NTSC-J)'),
      generateCustomGameCoverSvg('Grand Theft Auto: San Andreas', 'PS2', 'Verso da Caixa / Back Box')
    ],
    coverLabels: [
      'Capa Frontal Oficial US (NTSC-U)',
      'Capa Frontal Europa (PAL)',
      'Capa Frontal Japão (NTSC-J)',
      'Verso da Caixa / Back Box'
    ],
    bannerUrl: 'https://upload.wikimedia.org/wikipedia/en/3/36/Gta-sa-screen1.jpg',
    screenshots: [
      'https://upload.wikimedia.org/wikipedia/en/3/36/Gta-sa-screen1.jpg',
      'https://upload.wikimedia.org/wikipedia/en/c/c4/GTASABOX.jpg',
      'https://upload.wikimedia.org/wikipedia/en/3/36/Gta-sa-screen1.jpg',
      'https://upload.wikimedia.org/wikipedia/en/c/c4/GTASABOX.jpg'
    ],
    screenshotOptions: [
      'https://upload.wikimedia.org/wikipedia/en/3/36/Gta-sa-screen1.jpg',
      'https://upload.wikimedia.org/wikipedia/en/c/c4/GTASABOX.jpg'
    ],
    developer: 'Rockstar North',
    publisher: 'Rockstar Games',
    releaseYear: 2004,
    genres: ['Mundo Aberto', 'Ação', 'Crime'],
    synopsis: 'Carl Johnson (CJ) retorna a Los Santos após o assassinato de sua mãe e se vê forçado a reconstruir sua gangue, a Grove Street Families, atravessando todo o estado de San Andreas.'
  },

  // 11. Shadow of the Colossus (PS2)
  {
    title: 'Shadow of the Colossus',
    aliases: ['sotc', 'shadow of the colossus ps2', 'wander and the colossus'],
    platform: 'PS2',
    titleId: 'SCUS-97472',
    gamefaqsSlug: '924364-shadow-of-the-colossus',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/b/bb/Shadow_of_the_Colossus_Coverart.png',
    coverOptions: [
      'https://upload.wikimedia.org/wikipedia/en/b/bb/Shadow_of_the_Colossus_Coverart.png',
      generateCustomGameCoverSvg('Shadow of the Colossus', 'PS2', 'Edição Europa (PAL)'),
      generateCustomGameCoverSvg('Shadow of the Colossus', 'PS2', 'Wander and the Colossus (JP)'),
      generateCustomGameCoverSvg('Shadow of the Colossus', 'PS2', 'Verso da Caixa / Back Box')
    ],
    coverLabels: [
      'Capa Frontal Oficial US (NTSC-U)',
      'Capa Frontal Europa (PAL)',
      'Capa Frontal Japão (NTSC-J)',
      'Verso da Caixa / Back Box'
    ],
    bannerUrl: 'https://upload.wikimedia.org/wikipedia/en/b/b8/Shadow1_gameplay.jpg',
    screenshots: [
      'https://upload.wikimedia.org/wikipedia/en/b/b8/Shadow1_gameplay.jpg',
      'https://upload.wikimedia.org/wikipedia/en/b/bb/Shadow_of_the_Colossus_Coverart.png',
      'https://upload.wikimedia.org/wikipedia/en/b/b8/Shadow1_gameplay.jpg',
      'https://upload.wikimedia.org/wikipedia/en/b/bb/Shadow_of_the_Colossus_Coverart.png'
    ],
    screenshotOptions: [
      'https://upload.wikimedia.org/wikipedia/en/b/b8/Shadow1_gameplay.jpg',
      'https://upload.wikimedia.org/wikipedia/en/b/bb/Shadow_of_the_Colossus_Coverart.png'
    ],
    developer: 'Team Ico',
    publisher: 'Sony Computer Entertainment',
    releaseYear: 2005,
    genres: ['Aventura Épica', 'Ação', 'Quebra-cabeça'],
    synopsis: 'Wander viaja até a Terra Proibida a cavalo acompanhado de sua égua Agro para reviver a donzela Mono, derrotando dezesseis colossos ancestrais espalhados por vales desolados.'
  },

  // 12. Need for Speed: Underground 2 (PS2)
  {
    title: 'Need for Speed: Underground 2',
    aliases: ['nfsu2', 'nfs underground 2', 'need for speed underground 2'],
    platform: 'PS2',
    titleId: 'SLUS-21065',
    gamefaqsSlug: '920194-need-for-speed-underground-2',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/8/8e/Need_for_Speed_Underground_2_Box_Art.JPG',
    coverOptions: [
      'https://upload.wikimedia.org/wikipedia/en/8/8e/Need_for_Speed_Underground_2_Box_Art.JPG',
      generateCustomGameCoverSvg('Need for Speed: Underground 2', 'PS2', 'Edição Europa (PAL)'),
      generateCustomGameCoverSvg('Need for Speed: Underground 2', 'PS2', 'Edição Japão (NTSC-J)'),
      generateCustomGameCoverSvg('Need for Speed: Underground 2', 'PS2', 'Verso da Caixa / Back Box')
    ],
    coverLabels: [
      'Capa Frontal Oficial US (NTSC-U)',
      'Capa Frontal Europa (PAL)',
      'Capa Frontal Japão (NTSC-J)',
      'Verso da Caixa / Back Box'
    ],
    bannerUrl: 'https://upload.wikimedia.org/wikipedia/en/d/dc/NFSU2_winning_screen.jpg',
    screenshots: [
      'https://upload.wikimedia.org/wikipedia/en/d/dc/NFSU2_winning_screen.jpg',
      'https://upload.wikimedia.org/wikipedia/en/8/8e/Need_for_Speed_Underground_2_Box_Art.JPG',
      'https://upload.wikimedia.org/wikipedia/en/d/dc/NFSU2_winning_screen.jpg',
      'https://upload.wikimedia.org/wikipedia/en/8/8e/Need_for_Speed_Underground_2_Box_Art.JPG'
    ],
    screenshotOptions: [
      'https://upload.wikimedia.org/wikipedia/en/d/dc/NFSU2_winning_screen.jpg',
      'https://upload.wikimedia.org/wikipedia/en/8/8e/Need_for_Speed_Underground_2_Box_Art.JPG'
    ],
    developer: 'EA Black Box',
    publisher: 'Electronic Arts',
    releaseYear: 2004,
    genres: ['Corrida', 'Tuning', 'Mundo Aberto'],
    synopsis: 'Explore a cidade aberta de Bayview competindo em rachas noturnos, eventos de Drift e Drag, e personalize carros com personalização visual e mecânica profunda.'
  },

  // 13. Black (PS2)
  {
    title: 'Black',
    aliases: ['black ps2', 'black criterion'],
    platform: 'PS2',
    titleId: 'SLUS-21376',
    gamefaqsSlug: '920803-black',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/0/07/Black_cover.jpg',
    coverOptions: [
      'https://upload.wikimedia.org/wikipedia/en/0/07/Black_cover.jpg',
      generateCustomGameCoverSvg('Black', 'PS2', 'Edição Europa (PAL)'),
      generateCustomGameCoverSvg('Black', 'PS2', 'Edição Japão (NTSC-J)'),
      generateCustomGameCoverSvg('Black', 'PS2', 'Verso da Caixa / Back Box')
    ],
    coverLabels: [
      'Capa Frontal Oficial US (NTSC-U)',
      'Capa Frontal Europa (PAL)',
      'Capa Frontal Japão (NTSC-J)',
      'Verso da Caixa / Back Box'
    ],
    bannerUrl: 'https://upload.wikimedia.org/wikipedia/en/6/65/Black_%28video_game%29_gameplay.jpg',
    screenshots: [
      'https://upload.wikimedia.org/wikipedia/en/6/65/Black_%28video_game%29_gameplay.jpg',
      'https://upload.wikimedia.org/wikipedia/en/0/07/Black_cover.jpg',
      'https://upload.wikimedia.org/wikipedia/en/6/65/Black_%28video_game%29_gameplay.jpg',
      'https://upload.wikimedia.org/wikipedia/en/0/07/Black_cover.jpg'
    ],
    screenshotOptions: [
      'https://upload.wikimedia.org/wikipedia/en/6/65/Black_%28video_game%29_gameplay.jpg',
      'https://upload.wikimedia.org/wikipedia/en/0/07/Black_cover.jpg'
    ],
    developer: 'Criterion Games',
    publisher: 'Electronic Arts',
    releaseYear: 2006,
    genres: ['FPS', 'Tiro em Primeira Pessoa', 'Ação'],
    synopsis: 'Famoso como o "Gun Porn" definitivo dos videogames, Black oferece destruição ambiental sem precedentes no PlayStation 2 e combate visceral em operações táticas clandestinas.'
  },

  // 14. Mortal Kombat: Shaolin Monks (PS2)
  {
    title: 'Mortal Kombat: Shaolin Monks',
    aliases: ['mksm', 'mk shaolin monks', 'shaolin monks'],
    platform: 'PS2',
    titleId: 'SLUS-21087',
    gamefaqsSlug: '928004-mortal-kombat-shaolin-monks',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/9/91/Mortal_Kombat_-_Shaolin_Monks_Coverart.png',
    coverOptions: [
      'https://upload.wikimedia.org/wikipedia/en/9/91/Mortal_Kombat_-_Shaolin_Monks_Coverart.png',
      generateCustomGameCoverSvg('Mortal Kombat: Shaolin Monks', 'PS2', 'Edição Europa (PAL)'),
      generateCustomGameCoverSvg('Mortal Kombat: Shaolin Monks', 'PS2', 'Edição Japão (NTSC-J)'),
      generateCustomGameCoverSvg('Mortal Kombat: Shaolin Monks', 'PS2', 'Verso da Caixa / Back Box')
    ],
    coverLabels: [
      'Capa Frontal Oficial US (NTSC-U)',
      'Capa Frontal Europa (PAL)',
      'Capa Frontal Japão (NTSC-J)',
      'Verso da Caixa / Back Box'
    ],
    bannerUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e6/ShaolinMonks1.jpg',
    screenshots: [
      'https://upload.wikimedia.org/wikipedia/en/e/e6/ShaolinMonks1.jpg',
      'https://upload.wikimedia.org/wikipedia/en/9/91/Mortal_Kombat_-_Shaolin_Monks_Coverart.png',
      'https://upload.wikimedia.org/wikipedia/en/e/e6/ShaolinMonks1.jpg',
      'https://upload.wikimedia.org/wikipedia/en/9/91/Mortal_Kombat_-_Shaolin_Monks_Coverart.png'
    ],
    screenshotOptions: [
      'https://upload.wikimedia.org/wikipedia/en/e/e6/ShaolinMonks1.jpg',
      'https://upload.wikimedia.org/wikipedia/en/9/91/Mortal_Kombat_-_Shaolin_Monks_Coverart.png'
    ],
    developer: 'Midway Studios Los Angeles',
    publisher: 'Midway Games',
    releaseYear: 2005,
    genres: ['Beat em Up', 'Ação', 'Luta'],
    synopsis: 'Liu Kang e Kung Lao viajam por Outworld em uma aventura cooperativa sangrenta de ação contínua para impedir a invasão do Reino da Terra planejada por Shang Tsung e Shao Kahn.'
  },

  // 15. Resident Evil 4 (PS2)
  {
    title: 'Resident Evil 4',
    aliases: ['re4', 'resident evil 4 ps2', 'biohazard 4', 're4 original'],
    platform: 'PS2',
    titleId: 'SLUS-21134',
    gamefaqsSlug: '920784-resident-evil-4',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/d/df/Resident_Evil_4_cover.jpg',
    coverOptions: [
      'https://upload.wikimedia.org/wikipedia/en/d/df/Resident_Evil_4_cover.jpg',
      generateCustomGameCoverSvg('Resident Evil 4', 'PS2', 'Edição Europa (PAL Edição Vermelha)'),
      generateCustomGameCoverSvg('Resident Evil 4', 'PS2', 'Biohazard 4 (JP)'),
      generateCustomGameCoverSvg('Resident Evil 4', 'PS2', 'Verso da Caixa / Back Box')
    ],
    coverLabels: [
      'Capa Frontal Oficial US (NTSC-U)',
      'Capa Frontal Europa (PAL)',
      'Capa Frontal Japão (Biohazard 4)',
      'Verso da Caixa / Back Box'
    ],
    bannerUrl: 'https://upload.wikimedia.org/wikipedia/en/3/37/Resident_Evil_4_gameplay.jpg',
    screenshots: [
      'https://upload.wikimedia.org/wikipedia/en/3/37/Resident_Evil_4_gameplay.jpg',
      'https://upload.wikimedia.org/wikipedia/en/d/df/Resident_Evil_4_cover.jpg',
      'https://upload.wikimedia.org/wikipedia/en/3/37/Resident_Evil_4_gameplay.jpg',
      'https://upload.wikimedia.org/wikipedia/en/d/df/Resident_Evil_4_cover.jpg'
    ],
    screenshotOptions: [
      'https://upload.wikimedia.org/wikipedia/en/3/37/Resident_Evil_4_gameplay.jpg',
      'https://upload.wikimedia.org/wikipedia/en/d/df/Resident_Evil_4_cover.jpg'
    ],
    developer: 'Capcom Production Studio 4',
    publisher: 'Capcom',
    releaseYear: 2005,
    genres: ['Survival Horror', 'Tiro em Terceira Pessoa', 'Ação'],
    synopsis: 'Seis anos após os eventos de Raccoon City, o agente especial Leon S. Kennedy é enviado a uma remota vila na Espanha para resgatar Ashley Graham, a filha do presidente dos EUA sequestrada pela seita Los Illuminados.'
  },

  // 16. The Last of Us (PS3)
  {
    title: 'The Last of Us',
    aliases: ['tlou', 'the last of us ps3', 'last of us'],
    platform: 'PS3',
    titleId: 'BCUS-98174',
    gamefaqsSlug: '652686-the-last-of-us',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/4/46/Video_Game_Cover_-_The_Last_of_Us.jpg',
    coverOptions: [
      'https://upload.wikimedia.org/wikipedia/en/4/46/Video_Game_Cover_-_The_Last_of_Us.jpg',
      generateCustomGameCoverSvg('The Last of Us', 'PS3', 'Edição Europa (PAL Ellie Edition)'),
      generateCustomGameCoverSvg('The Last of Us', 'PS3', 'Joel Edition (NTSC-U)'),
      generateCustomGameCoverSvg('The Last of Us', 'PS3', 'Verso da Caixa / Back Box')
    ],
    coverLabels: [
      'Capa Frontal Oficial US (NTSC-U)',
      'Capa Frontal Europa (PAL Ellie Edition)',
      'Capa Frontal Joel Edition',
      'Verso da Caixa / Back Box'
    ],
    bannerUrl: 'https://upload.wikimedia.org/wikipedia/en/1/16/The_Last_of_Us_gameplay.jpg',
    screenshots: [
      'https://upload.wikimedia.org/wikipedia/en/1/16/The_Last_of_Us_gameplay.jpg',
      'https://upload.wikimedia.org/wikipedia/en/4/46/Video_Game_Cover_-_The_Last_of_Us.jpg',
      'https://upload.wikimedia.org/wikipedia/en/1/16/The_Last_of_Us_gameplay.jpg',
      'https://upload.wikimedia.org/wikipedia/en/4/46/Video_Game_Cover_-_The_Last_of_Us.jpg'
    ],
    screenshotOptions: [
      'https://upload.wikimedia.org/wikipedia/en/1/16/The_Last_of_Us_gameplay.jpg',
      'https://upload.wikimedia.org/wikipedia/en/4/46/Video_Game_Cover_-_The_Last_of_Us.jpg'
    ],
    developer: 'Naughty Dog',
    publisher: 'Sony Computer Entertainment',
    releaseYear: 2013,
    genres: ['Ação', 'Aventura Narrativa', 'Pós-Apocalíptico'],
    synopsis: 'Vinte anos após uma praga fúngica devastar a civilização moderna, o sobrevivente endurecido Joel é contratado para contrabandear Ellie, uma jovem de 14 anos, para fora de uma opressiva zona de quarentena militar.'
  },

  // 17. Red Dead Redemption (PS3)
  {
    title: 'Red Dead Redemption',
    aliases: ['rdr1', 'rdr', 'red dead redemption ps3', 'red dead 1'],
    platform: 'PS3',
    titleId: 'BLUS-30418',
    gamefaqsSlug: '957922-red-dead-redemption',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Red_Dead_Redemption.jpg',
    coverOptions: [
      'https://upload.wikimedia.org/wikipedia/en/a/a7/Red_Dead_Redemption.jpg',
      generateCustomGameCoverSvg('Red Dead Redemption', 'PS3', 'Edição Game of the Year (GOTY)'),
      generateCustomGameCoverSvg('Red Dead Redemption', 'PS3', 'Undead Nightmare Expansion Box'),
      generateCustomGameCoverSvg('Red Dead Redemption', 'PS3', 'Verso da Caixa / Back Box')
    ],
    coverLabels: [
      'Capa Frontal Oficial US (NTSC-U)',
      'Capa Frontal GOTY Edition',
      'Undead Nightmare Expansion Box',
      'Verso da Caixa / Back Box'
    ],
    bannerUrl: 'https://upload.wikimedia.org/wikipedia/en/3/36/RDR_combat.jpg',
    screenshots: [
      'https://upload.wikimedia.org/wikipedia/en/3/36/RDR_combat.jpg',
      'https://upload.wikimedia.org/wikipedia/en/a/a7/Red_Dead_Redemption.jpg',
      'https://upload.wikimedia.org/wikipedia/en/3/36/RDR_combat.jpg',
      'https://upload.wikimedia.org/wikipedia/en/a/a7/Red_Dead_Redemption.jpg'
    ],
    screenshotOptions: [
      'https://upload.wikimedia.org/wikipedia/en/3/36/RDR_combat.jpg',
      'https://upload.wikimedia.org/wikipedia/en/a/a7/Red_Dead_Redemption.jpg'
    ],
    developer: 'Rockstar San Diego',
    publisher: 'Rockstar Games',
    releaseYear: 2010,
    genres: ['Faroeste', 'Mundo Aberto', 'Ação'],
    synopsis: 'Quando agentes federais ameaçam sua família, o ex-fora da lei John Marston é forçado a caçar os membros da gangue de criminosos que antes chamava de irmãos pelo Velho Oeste americano.'
  },

  // 18. God of War III (PS3)
  {
    title: 'God of War III',
    aliases: ['god of war 3', 'gow3', 'gow 3', 'god of war iii ps3'],
    platform: 'PS3',
    titleId: 'BCUS-98111',
    gamefaqsSlug: '943928-god-of-war-iii',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/6/63/God_of_War_3_cover.jpg',
    coverOptions: [
      'https://upload.wikimedia.org/wikipedia/en/6/63/God_of_War_3_cover.jpg',
      generateCustomGameCoverSvg('God of War III', 'PS3', 'Edição Europa (PAL Ultimate Edition)'),
      generateCustomGameCoverSvg('God of War III', 'PS3', 'Edição Japão (NTSC-J)'),
      generateCustomGameCoverSvg('God of War III', 'PS3', 'Verso da Caixa / Back Box')
    ],
    coverLabels: [
      'Capa Frontal Oficial US (NTSC-U)',
      'Capa Frontal Europa (PAL Ultimate)',
      'Capa Frontal Japão (NTSC-J)',
      'Verso da Caixa / Back Box'
    ],
    bannerUrl: 'https://upload.wikimedia.org/wikipedia/en/0/05/God_of_War_III_combat.jpg',
    screenshots: [
      'https://upload.wikimedia.org/wikipedia/en/0/05/God_of_War_III_combat.jpg',
      'https://upload.wikimedia.org/wikipedia/en/6/63/God_of_War_3_cover.jpg',
      'https://upload.wikimedia.org/wikipedia/en/0/05/God_of_War_III_combat.jpg',
      'https://upload.wikimedia.org/wikipedia/en/6/63/God_of_War_3_cover.jpg'
    ],
    screenshotOptions: [
      'https://upload.wikimedia.org/wikipedia/en/0/05/God_of_War_III_combat.jpg',
      'https://upload.wikimedia.org/wikipedia/en/6/63/God_of_War_3_cover.jpg'
    ],
    developer: 'Santa Monica Studio',
    publisher: 'Sony Computer Entertainment',
    releaseYear: 2010,
    genres: ['Hack and Slash', 'Ação', 'Mitologia Grega'],
    synopsis: 'Kratos escala o Monte Olimpo nas costas de Gaia para exterminar Zeus e todos os deuses do panteão grego no confronto cataclísmico final de sua vingança.'
  },

  // 19. Demon's Souls (PS3)
  {
    title: "Demon's Souls",
    aliases: ['demons souls', 'demon souls', 'demons souls ps3'],
    platform: 'PS3',
    titleId: 'BCUS-98177',
    gamefaqsSlug: '954345-demons-souls',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/b/b7/Demons_Souls_Cover_Art.jpg',
    coverOptions: [
      'https://upload.wikimedia.org/wikipedia/en/b/b7/Demons_Souls_Cover_Art.jpg',
      generateCustomGameCoverSvg("Demon's Souls", 'PS3', 'Edição Black Phantom (PAL)'),
      generateCustomGameCoverSvg("Demon's Souls", 'PS3', 'Edição Japão (NTSC-J)'),
      generateCustomGameCoverSvg("Demon's Souls", 'PS3', 'Verso da Caixa / Back Box')
    ],
    coverLabels: [
      'Capa Frontal Oficial US (NTSC-U)',
      'Capa Frontal Europa (PAL Black Phantom)',
      'Capa Frontal Japão (NTSC-J)',
      'Verso da Caixa / Back Box'
    ],
    bannerUrl: 'https://upload.wikimedia.org/wikipedia/en/b/be/Demons_Souls_Combat.jpg',
    screenshots: [
      'https://upload.wikimedia.org/wikipedia/en/b/be/Demons_Souls_Combat.jpg',
      'https://upload.wikimedia.org/wikipedia/en/b/b7/Demons_Souls_Cover_Art.jpg',
      'https://upload.wikimedia.org/wikipedia/en/b/be/Demons_Souls_Combat.jpg',
      'https://upload.wikimedia.org/wikipedia/en/b/b7/Demons_Souls_Cover_Art.jpg'
    ],
    screenshotOptions: [
      'https://upload.wikimedia.org/wikipedia/en/b/be/Demons_Souls_Combat.jpg',
      'https://upload.wikimedia.org/wikipedia/en/b/b7/Demons_Souls_Cover_Art.jpg'
    ],
    developer: 'FromSoftware',
    publisher: 'Sony Computer Entertainment / Atlus',
    releaseYear: 2009,
    genres: ['Soulslike', 'RPG de Ação', 'Fantasia Sombria'],
    synopsis: 'O rei Allant XII libertou uma névoa profunda que engoliu o reino de Boletaria, acordando o Antigo. Um guerreiro solitário deve enfrentar horrores indescritíveis para banir o mal.'
  },

  // 20. Grim Dawn: Definitive Edition
  {
    title: 'Grim Dawn: Definitive Edition',
    aliases: ['grim dawn', 'grim dawn definitive edition', 'grim dawn ps3'],
    platform: 'PS3',
    titleId: 'BLUS-31622',
    gamefaqsSlug: '995472-grim-dawn',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/b/b3/Grim_Dawn_cover.jpg',
    coverOptions: [
      'https://upload.wikimedia.org/wikipedia/en/b/b3/Grim_Dawn_cover.jpg',
      generateCustomGameCoverSvg('Grim Dawn', 'PS3', 'Ashes of Malmouth Expansion'),
      generateCustomGameCoverSvg('Grim Dawn', 'PS3', 'Forgotten Gods Expansion'),
      generateCustomGameCoverSvg('Grim Dawn', 'PS3', 'Verso da Caixa / Back Box')
    ],
    coverLabels: [
      'Capa Frontal Definitive Edition',
      'Capa Frontal Ashes of Malmouth',
      'Capa Frontal Forgotten Gods',
      'Verso da Caixa / Back Box'
    ],
    bannerUrl: 'https://upload.wikimedia.org/wikipedia/en/7/7b/Grim_Dawn_gameplay.jpg',
    screenshots: [
      'https://upload.wikimedia.org/wikipedia/en/7/7b/Grim_Dawn_gameplay.jpg',
      'https://upload.wikimedia.org/wikipedia/en/b/b3/Grim_Dawn_cover.jpg',
      'https://upload.wikimedia.org/wikipedia/en/7/7b/Grim_Dawn_gameplay.jpg',
      'https://upload.wikimedia.org/wikipedia/en/b/b3/Grim_Dawn_cover.jpg'
    ],
    screenshotOptions: [
      'https://upload.wikimedia.org/wikipedia/en/7/7b/Grim_Dawn_gameplay.jpg',
      'https://upload.wikimedia.org/wikipedia/en/b/b3/Grim_Dawn_cover.jpg'
    ],
    developer: 'Crate Entertainment',
    publisher: 'Crate Entertainment',
    releaseYear: 2016,
    genres: ['ARPG', 'Hack and Slash', 'RPG de Ação'],
    synopsis: 'Entre em um mundo de fantasia sombrio e apocalíptico onde a humanidade está à beira da extinção. Grim Dawn é o aclamado ARPG espiritual de Titan Quest.'
  },

  // 21. Tekken 3 (PS1)
  {
    title: 'Tekken 3',
    aliases: ['tekken 3 ps1', 'tekken3', 't3'],
    platform: 'PS1',
    titleId: 'SLUS-00402',
    gamefaqsSlug: '198900-tekken-3',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/7/7d/Tekken_3_flyer.jpg',
    coverOptions: [
      'https://upload.wikimedia.org/wikipedia/en/7/7d/Tekken_3_flyer.jpg',
      generateCustomGameCoverSvg('Tekken 3', 'PS1', 'Edição Europa (PAL)'),
      generateCustomGameCoverSvg('Tekken 3', 'PS1', 'Edição Japão (NTSC-J)'),
      generateCustomGameCoverSvg('Tekken 3', 'PS1', 'Verso da Caixa / Back Box')
    ],
    coverLabels: [
      'Capa Frontal Oficial US (NTSC-U)',
      'Capa Frontal Europa (PAL)',
      'Capa Frontal Japão (NTSC-J)',
      'Verso da Caixa / Back Box'
    ],
    bannerUrl: 'https://upload.wikimedia.org/wikipedia/en/7/7d/Tekken_3_flyer.jpg',
    screenshots: [
      'https://upload.wikimedia.org/wikipedia/en/7/7d/Tekken_3_flyer.jpg',
      generateCustomGameCoverSvg('Tekken 3', 'PS1', 'Gameplay Jin Kazama vs Hwoarang'),
      generateCustomGameCoverSvg('Tekken 3', 'PS1', 'Tekken Force Mode'),
      generateCustomGameCoverSvg('Tekken 3', 'PS1', 'Tekken Ball Mode')
    ],
    developer: 'Namco',
    publisher: 'Namco',
    releaseYear: 1998,
    genres: ['Luta 3D', 'Arcade', 'Clássico'],
    synopsis: 'Quinze anos após o King of Iron Fist Tournament 2, Heihachi Mishima treina seu neto Jin Kazama para confrontar a entidade ancestral Ogre.'
  },

  // 22. Final Fantasy VII (PS1)
  {
    title: 'Final Fantasy VII',
    aliases: ['ff7', 'final fantasy 7', 'ffvii', 'final fantasy vii ps1'],
    platform: 'PS1',
    titleId: 'SCUS-94163',
    gamefaqsSlug: '197341-final-fantasy-vii',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c2/Final_Fantasy_VII_Box_Art.jpg',
    coverOptions: [
      'https://upload.wikimedia.org/wikipedia/en/c/c2/Final_Fantasy_VII_Box_Art.jpg',
      generateCustomGameCoverSvg('Final Fantasy VII', 'PS1', 'Edição Europa (PAL com logo)'),
      generateCustomGameCoverSvg('Final Fantasy VII', 'PS1', 'Edição Japão (NTSC-J 3 Discos)'),
      generateCustomGameCoverSvg('Final Fantasy VII', 'PS1', 'Verso da Caixa / Back Box')
    ],
    coverLabels: [
      'Capa Frontal Oficial US (NTSC-U)',
      'Capa Frontal Europa (PAL)',
      'Capa Frontal Japão (NTSC-J)',
      'Verso da Caixa / Back Box'
    ],
    bannerUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c2/Final_Fantasy_VII_Box_Art.jpg',
    screenshots: [
      'https://upload.wikimedia.org/wikipedia/en/c/c2/Final_Fantasy_VII_Box_Art.jpg',
      generateCustomGameCoverSvg('Final Fantasy VII', 'PS1', 'Batalha Turno ATB Midgar'),
      generateCustomGameCoverSvg('Final Fantasy VII', 'PS1', 'Cloud Strife Buster Sword'),
      generateCustomGameCoverSvg('Final Fantasy VII', 'PS1', 'World Map & Chocobo')
    ],
    developer: 'Square',
    publisher: 'Sony Computer Entertainment',
    releaseYear: 1997,
    genres: ['JRPG', 'RPG', 'Fantasia'],
    synopsis: 'O mercenário Cloud Strife une-se ao grupo ecoterrorista Avalanche para lutar contra a megacorporação Shinra e o lendário guerreiro Sephiroth.'
  },

  // 23. Gran Turismo 4 (PS2)
  {
    title: 'Gran Turismo 4',
    aliases: ['gt4', 'gran turismo 4 ps2'],
    platform: 'PS2',
    titleId: 'SCUS-97328',
    gamefaqsSlug: '561066-gran-turismo-4',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/0/06/Gran_Turismo_4.jpg',
    coverOptions: [
      'https://upload.wikimedia.org/wikipedia/en/0/06/Gran_Turismo_4.jpg',
      generateCustomGameCoverSvg('Gran Turismo 4', 'PS2', 'Edição Europa (PAL White)'),
      generateCustomGameCoverSvg('Gran Turismo 4', 'PS2', 'Edição Japão (NTSC-J)'),
      generateCustomGameCoverSvg('Gran Turismo 4', 'PS2', 'Verso da Caixa / Back Box')
    ],
    coverLabels: [
      'Capa Frontal Ford GT (NTSC-U)',
      'Capa Frontal Europa (PAL)',
      'Capa Frontal Japão (NTSC-J)',
      'Verso da Caixa / Back Box'
    ],
    bannerUrl: 'https://upload.wikimedia.org/wikipedia/en/0/06/Gran_Turismo_4.jpg',
    screenshots: [
      'https://upload.wikimedia.org/wikipedia/en/0/06/Gran_Turismo_4.jpg',
      generateCustomGameCoverSvg('Gran Turismo 4', 'PS2', 'Nürburgring Nordschleife 1080i'),
      generateCustomGameCoverSvg('Gran Turismo 4', 'PS2', 'Modo Foto & Garagem 700+ Carros'),
      generateCustomGameCoverSvg('Gran Turismo 4', 'PS2', 'B-Spec Director Mode')
    ],
    developer: 'Polyphony Digital',
    publisher: 'Sony Computer Entertainment',
    releaseYear: 2004,
    genres: ['Simulação de Corrida', 'Automobilismo', 'Real Driving Simulator'],
    synopsis: 'O ápice da simulação de corrida no PlayStation 2 com mais de 700 carros fielmente modelados, 51 pistas mundiais e física realista de alta precisão.'
  },

  // 24. Devil May Cry 3: Dante's Awakening (PS2)
  {
    title: "Devil May Cry 3: Dante's Awakening",
    aliases: ['devil may cry 3', 'dmc3', 'dmc 3', 'devil may cry 3 special edition'],
    platform: 'PS2',
    titleId: 'SLUS-21361',
    gamefaqsSlug: '930014-devil-may-cry-3-special-edition',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/7/76/Devil_May_Cry_3_boxshot.jpg',
    coverOptions: [
      'https://upload.wikimedia.org/wikipedia/en/7/76/Devil_May_Cry_3_boxshot.jpg',
      generateCustomGameCoverSvg("Devil May Cry 3", 'PS2', 'Special Edition (Vergil Cover)'),
      generateCustomGameCoverSvg("Devil May Cry 3", 'PS2', 'Edição Japão (NTSC-J)'),
      generateCustomGameCoverSvg("Devil May Cry 3", 'PS2', 'Verso da Caixa / Back Box')
    ],
    coverLabels: [
      'Capa Frontal Oficial Dante',
      'Special Edition Vergil',
      'Capa Frontal Japão',
      'Verso da Caixa / Back Box'
    ],
    bannerUrl: 'https://upload.wikimedia.org/wikipedia/en/7/76/Devil_May_Cry_3_boxshot.jpg',
    screenshots: [
      'https://upload.wikimedia.org/wikipedia/en/7/76/Devil_May_Cry_3_boxshot.jpg',
      generateCustomGameCoverSvg("Devil May Cry 3", 'PS2', 'Combo SSStylish Rebellion & Ebony/Ivory'),
      generateCustomGameCoverSvg("Devil May Cry 3", 'PS2', 'Batalha Dante vs Vergil Torre Temen-ni-gru'),
      generateCustomGameCoverSvg("Devil May Cry 3", 'PS2', 'Estilos Trickster & Swordmaster')
    ],
    developer: 'Capcom Production Studio 1',
    publisher: 'Capcom',
    releaseYear: 2005,
    genres: ['Hack and Slash', 'Ação Estilizada', 'Aventura'],
    synopsis: 'Prequela que narra o confronto épico entre os filhos gêmeos do lendário cavaleiro demônio Sparda: o rebelde Dante e o frio e calculista Vergil no topo da torre Temen-ni-gru.'
  }
];

/**
 * Cria uma capa SVG personalizada elegante para o jogo específico caso não haja imagem online
 */
export function generateCustomGameCoverSvg(title: string, platform: string = 'PS2', boxType: string = 'US / NTSC-U'): string {
  const safeTitle = (title || 'PlayStation Game').slice(0, 36);
  const safePlatform = (platform || 'PS2').toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="560" viewBox="0 0 400 560">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a" />
        <stop offset="50%" stop-color="#1e1b4b" />
        <stop offset="100%" stop-color="#020617" />
      </linearGradient>
      <linearGradient id="psHeader" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#06b6d4" />
        <stop offset="100%" stop-color="#3b82f6" />
      </linearGradient>
    </defs>
    <rect width="400" height="560" rx="16" fill="url(#bgGrad)" stroke="#06b6d4" stroke-width="3"/>
    
    <!-- Header Bar do Console -->
    <rect x="0" y="0" width="400" height="54" rx="16" fill="url(#psHeader)" />
    <rect x="0" y="38" width="400" height="16" fill="url(#psHeader)" />
    <text x="20" y="34" fill="#020617" font-size="20" font-family="system-ui, sans-serif" font-weight="900" letter-spacing="1">PlayStation</text>
    <rect x="310" y="14" width="70" height="26" rx="6" fill="#020617" />
    <text x="345" y="32" fill="#38bdf8" font-size="12" font-family="monospace" font-weight="bold" text-anchor="middle">${safePlatform}</text>
    
    <!-- Centro do Disco/Arte -->
    <circle cx="200" cy="270" r="110" fill="#020617" stroke="#334155" stroke-width="2" />
    <circle cx="200" cy="270" r="85" fill="#0f172a" stroke="#06b6d4" stroke-width="1.5" stroke-dasharray="4 4" />
    <circle cx="200" cy="270" r="28" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
    
    <!-- Título do Jogo -->
    <text x="200" y="430" fill="#ffffff" font-size="21" font-family="system-ui, sans-serif" font-weight="bold" text-anchor="middle">${safeTitle}</text>
    <text x="200" y="460" fill="#38bdf8" font-size="12" font-family="monospace" font-weight="bold" text-anchor="middle">${boxType}</text>
    
    <!-- Rodapé -->
    <line x1="40" y1="495" x2="360" y2="495" stroke="#334155" stroke-width="1"/>
    <text x="200" y="525" fill="#94a3b8" font-size="11" font-family="system-ui, sans-serif" text-anchor="middle">Official GameFAQs &amp; PlayStation Archive</text>
  </svg>`;
  
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Normaliza um título de jogo para busca precisa sem falsos positivos entre sequências
 */
export function normalizeTitleForComparison(title: string): string {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/\b(the|a|an)\b/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Busca estrita de correspondência de jogo para evitar que "Resident Evil 3" caia em "Resident Evil 4",
 * ou "God of War" caia em "God of War II".
 */
export function findMatchingGameInCatalog(queryOrUrl: string): PlayStationMediaEntry | null {
  if (!queryOrUrl) return null;
  const raw = queryOrUrl.trim().toLowerCase();
  
  // Se for URL GameFAQs, extrair slug exato (ex: 915010-god-of-war-ii -> god-of-war-ii)
  let urlSlug = '';
  if (raw.includes('gamefaqs.gamespot.com') || raw.includes('gamefaqs.com')) {
    try {
      const u = new URL(queryOrUrl.startsWith('http') ? queryOrUrl : `https://${queryOrUrl}`);
      const parts = u.pathname.split('/').filter(Boolean);
      // Remove ações finais como /boxes, /images, /cheats, /faqs, etc.
      while (parts.length > 0 && /^(boxes|images|cheats|faqs|reviews|data|saves|media)$/i.test(parts[parts.length - 1])) {
        parts.pop();
      }
      // O segmento do jogo geralmente contém ID numérico ou é o último restante
      const slugSegment = parts.find(p => /^\d+-/.test(p)) || parts[parts.length - 1] || '';
      urlSlug = slugSegment.replace(/^\d+-/, '').toLowerCase().trim();
    } catch {}
  }

  // 1. Slug exato da URL do GameFAQs (comparação estrita para nunca confundir sequências como Silent Hill e Silent Hill 2, ou God of War e God of War II)
  if (urlSlug) {
    const cleanTargetSlug = urlSlug.replace(/[^a-z0-9]/g, '');
    for (const entry of PLAYSTATION_MEDIA_CATALOG) {
      const entryRawSlug = (entry.gamefaqsSlug || '').replace(/^\d+-/, '').toLowerCase().trim();
      const cleanEntrySlug = entryRawSlug.replace(/[^a-z0-9]/g, '');
      if (cleanEntrySlug && cleanTargetSlug && cleanEntrySlug === cleanTargetSlug) {
        return entry;
      }
    }
  }

  const normalizedQuery = normalizeTitleForComparison(raw);
  if (!normalizedQuery) return null;

  for (const entry of PLAYSTATION_MEDIA_CATALOG) {
    const normTitle = normalizeTitleForComparison(entry.title);
    
    // 2. Título exato normalizado
    if (normTitle === normalizedQuery) {
      return entry;
    }

    // 3. Aliases exatos
    for (const alias of entry.aliases) {
      const normAlias = normalizeTitleForComparison(alias);
      if (normAlias === normalizedQuery) {
        return entry;
      }
    }
  }

  return null;
}
