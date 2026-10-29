import { Game } from '../types';
import { SUPABASE_SYNCED_GAMES } from './supabasePresets';
import { DODI_PRESET_GAMES } from './dodiPresets';
import { ZUKO_TAPOCHEK_PRESETS } from './zukoTapochekPresets';

export const INITIAL_GAMES: Game[] = [
  ...SUPABASE_SYNCED_GAMES,
  ...DODI_PRESET_GAMES,
  ...ZUKO_TAPOCHEK_PRESETS,
  {
    id: 'bloodborne-complete',
    title: 'Bloodborne: Game of the Year Edition',
    slug: 'bloodborne-goty-pkg-cusa03173',
    coverUrl: 'https://image.api.playstation.com/vulcan/img/rnd/202010/2614/gdaeAUzkfv6efQWfg1bM8U07.png',
    bannerUrl: 'https://image.api.playstation.com/vulcan/img/rnd/202010/2614/gdaeAUzkfv6efQWfg1bM8U07.png',
    shortDescription: 'Enfrente seus pesadelos na amaldiçoada cidade de Yharnam. Disponível em formato PKG para console e Torrent com ShadPS4 para PC. 100% Dublado e Legendado em PT-BR.',
    description: 'Um caçador solitário viaja para a cidade de Yharnam, famosa por seus remédios médicos milagrosos. No entanto, uma praga endêmica transformou os cidadãos em feras bestiais. Pacote completo com a expansão The Old Hunters e patch de 60 FPS.',
    genres: ['RPG', 'Soulslike', 'Ação', 'Terror Gótico'],
    categories: ['AAA', 'Mais Populares'],
    releaseYear: 2015,
    releaseDate: '24/03/2015',
    developer: 'FromSoftware Inc.',
    publisher: 'Sony Computer Entertainment',
    repackInfo: {
      repacker: 'TheZukoStore / Tapochek Team',
      version: 'v1.09 + The Old Hunters DLC + 60 FPS Patch',
      repackSize: '36.8 GB',
      originalSize: '42.0 GB',
      crackStatus: 'DRM Free',
      crackGroup: 'PlayStation Scene / CUSA'
    },
    downloadLinks: [
      {
        id: 'dl-bb-pkg-1',
        type: 'pkg',
        format: 'pkg',
        platform: 'PS4',
        label: 'Download Arquivo PKG (PlayStation 4 / CUSA-03173)',
        url: 'https://thezukostore.com',
        size: '36.8 GB',
        titleId: 'CUSA-03173',
        firmware: 'FW 5.05 - 11.00 (TheZukoStore Verificado)',
        isPtBrAudio: true,
        isPtBrSubs: true,
        hostName: 'TheZukoStore'
      },
      {
        id: 'dl-bb-fg-1337x',
        type: 'magnet',
        format: 'torrent',
        platform: 'PC',
        label: '1337x | [magnet] (46.432 Seeds Verificados FitGirl)',
        url: 'magnet:?xt=urn:btih:7244192038471029384710293847102938471029&dn=Bloodborne.Game.of.the.Year.Edition.v1.09-PC-FitGirl&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=udp%3A%2F%2Fopentracker.i2p.rocks%3A6969%2Fannounce',
        seeders: 46432,
        leechers: 21991,
        size: '14.1 GB',
        hostName: '1337x (FitGirl Repack)'
      },
      {
        id: 'dl-bb-fg-rutor',
        type: 'magnet',
        format: 'torrent',
        platform: 'PC',
        label: 'RuTor | [magnet] (Mirror Alternativo Torrent)',
        url: 'magnet:?xt=urn:btih:7244192038471029384710293847102938471028&dn=Bloodborne.Game.of.the.Year.Edition.v1.09-PC-FitGirl-RuTor&tr=udp%3A%2F%2Fopentor.net%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce',
        seeders: 18450,
        leechers: 8200,
        size: '14.1 GB',
        hostName: 'RuTor Tracker'
      },
      {
        id: 'dl-bb-datanodes',
        type: 'direct',
        format: 'direct',
        platform: 'PC',
        label: 'Mirror Direto: DataNodes (Speed & Usability) [Use IDM]',
        url: 'https://datanodes.to',
        size: '14.1 GB',
        hostName: 'DataNodes'
      },
      {
        id: 'dl-bb-fuckingfast',
        type: 'direct',
        format: 'direct',
        platform: 'PC',
        label: 'Mirror Direto: FuckingFast (REALLY Fucking Fast)',
        url: 'https://fuckingfast.co',
        size: '14.1 GB',
        hostName: 'FuckingFast'
      },
      {
        id: 'dl-bb-filekeeper',
        type: 'direct',
        format: 'direct',
        platform: 'PC',
        label: 'Mirror Direto: FileKeeper.net (Servidor Alternativo)',
        url: 'https://filekeeper.net',
        size: '14.1 GB',
        hostName: 'FileKeeper'
      },
      {
        id: 'dl-bb-pc-1',
        type: 'magnet',
        format: 'torrent',
        platform: 'PC',
        label: 'Torrent PC Magnet (ShadPS4 Emulador Embutido - Tapochek)',
        url: 'magnet:?xt=urn:btih:7729103847102938471029384710293847102938&dn=Bloodborne.GOTY.PC.ShadPS4-Tapochek&tr=udp%3A%2F%2Ftracker.tapochek.net%3A2710%2Fannounce',
        seeders: 5800,
        leechers: 720,
        size: '38.2 GB',
        isPtBrAudio: true,
        isPtBrSubs: true,
        hostName: 'Tapochek.net'
      },
      {
        id: 'dl-bb-patch-ptbr',
        type: 'pt_br_patch',
        format: 'pt_br_patch',
        platform: 'PS4',
        label: 'Pacote de Tradução & Legendas PT-BR (TheZukoStore)',
        url: 'https://thezukostore.com',
        size: '1.2 GB',
        isPtBrAudio: true,
        isPtBrSubs: true,
        hostName: 'ZukoStore Dublagens'
      }
    ],
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit / PS4 5.05+',
        processor: 'Intel Core i5-8400 ou AMD Ryzen 5 2600',
        memory: '16 GB RAM',
        graphics: 'NVIDIA GeForce RTX 2060 ou AMD Radeon RX 5700',
        storage: '45 GB SSD',
        directx: 'Vulkan 1.3 / Direct3D 12'
      },
      recommended: {
        os: 'Windows 11 64-bit',
        processor: 'Intel Core i7-12700 ou AMD Ryzen 7 7700X',
        memory: '32 GB RAM',
        graphics: 'NVIDIA GeForce RTX 3070 ou superior',
        storage: '45 GB NVMe SSD',
        directx: 'Vulkan 1.3'
      }
    },
    rating: 0,
    totalVotes: 0,
    imdbRating: 9.7,
    screenshots: [
      'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'
    ],
    trailerYoutubeId: 'G203e1HhixY',
    tags: ['Bloodborne', 'CUSA-03173', 'TheZukoStore', 'Tapochek', 'Dublado PT-BR', 'PKG', '60 FPS'],
    downloadsCount: 115000,
    viewsCount: 380000,
    createdAt: '2024-03-01T12:00:00Z',
    isFeatured: true,
    isTrending: true,
    hasPtBrAudio: false,
    hasPtBrSubs: true,
    hasPkgFormat: true,
    hasPcTorrent: true,
    titleId: 'CUSA-03173',
    sourceOrigin: 'TheZukoStore',
    originalTrackerUrl: 'https://thezukostore.com',
    dlcIncluded: ['The Old Hunters DLC Expansion', 'Top Hat Hunter Skin', '60 FPS Unlocked Patch v1.09'],
    languages: ['Português (Brasil) Dublado', 'Inglês', 'Japonês', 'Espanhol'],
    gamefaqsCheatsUrl: 'https://gamefaqs.gamespot.com/ps4/805577-bloodborne/cheats',
    nexusModsUrl: 'https://www.nexusmods.com/bloodborne',
    cheats: [
      {
        id: 'bb-cheat-1',
        title: 'Cálice Secreto de Ecos Infinitos (cummmfpk)',
        codeOrEffect: 'Digite o glifo cummmfpk no Altar dos Cálices em Sonho do Caçador para farmar 143.000 Ecos a cada 10 segundos',
        category: 'Dinheiro',
        description: 'Dungeon gerada pela comunidade que concede centenas de milhares de ecos de sangue de forma segura no início da aventura.',
        source: 'GameFAQs'
      },
      {
        id: 'bb-cheat-2',
        title: 'Glitch de Pular a Cerca em Iosefka Clinic',
        codeOrEffect: 'Salte sobre a grade do portão trancado da clínica usando o caixão de madeira para acessar os Bosques Proibidos no início',
        category: 'Segredos',
        description: 'Permite acesso imediato a itens avançados e à carta de Cainhurst logo após o primeiro chefe.',
        source: 'GameFAQs'
      }
    ],
    mods: [
      {
        id: 'bb-mod-1',
        title: 'ShadPS4 60FPS & 1440p High Resolution Patch',
        description: 'Desbloqueia os 60 quadros por segundo fluidos e resolução de renderização 1440p/4K para PC via emulador.',
        nexusUrl: 'https://www.nexusmods.com/search/?gsearch=Bloodborne+shadps4+60fps',
        category: 'Fix/FPS',
        author: 'FromSoftwarePC_Group',
        downloadsCount: '142k'
      },
      {
        id: 'bb-mod-2',
        title: 'Tradução PT-BR Aprimorada & Fontes Nítidas',
        description: 'Restaura termos do lore oficial com legendas mais legíveis em monitores ultrawide.',
        nexusUrl: 'https://www.nexusmods.com/search/?gsearch=Bloodborne+traducao+pt-br',
        category: 'Tradução',
        author: 'VortexBrasilTeam',
        downloadsCount: '88k'
      }
    ]
  },
  {
    id: 'cyberpunk-2077',
    title: 'Cyberpunk 2077: Phantom Liberty',
    slug: 'cyberpunk-2077-phantom-liberty',
    coverUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/library_600x900.jpg',
    bannerUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg',
    shortDescription: 'Mergulhe no submundo sombrio de Dogtown como o mercenário V numa eletrizante missão de espionagem com Keanu Reeves e Idris Elba.',
    description: 'Phantom Liberty é uma aclamada expansão de suspense e espionagem para o RPG de ação em mundo aberto Cyberpunk 2077. Quando a nave orbital da presidente dos Novos Estados Unidos da América é abatida sobre o distrito mais perigoso de Night City, apenas uma pessoa pode salvá-la: você. Torne-se V, um mercenário cibernético de aluguel, e mergulhe em uma teia complexa de espionagem e intriga política.',
    genres: ['RPG', 'Ação', 'Mundo Aberto', 'Ficção Científica', 'FPS'],
    categories: ['AAA', 'Lançamentos', 'Repacks'],
    releaseYear: 2023,
    releaseDate: '26/09/2023',
    developer: 'CD Projekt RED',
    publisher: 'CD Projekt RED',
    repackInfo: {
      repacker: 'FitGirl Repack',
      version: 'v2.13 + Phantom Liberty DLC + REDmod',
      repackSize: '56.4 GB',
      originalSize: '84.2 GB',
      crackStatus: 'DRM Free',
      crackGroup: 'GOG / CD Projekt'
    },
    downloadLinks: [
      {
        id: 'dl-cp-1337x',
        type: 'magnet',
        format: 'torrent',
        platform: 'PC',
        label: '1337x | [magnet] (34.500 Seeds Verificados FitGirl)',
        url: 'magnet:?xt=urn:btih:3fa9128456123984712093847102938471029384&dn=Cyberpunk.2077.v2.13-Phantom.Liberty-FitGirl&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=udp%3A%2F%2Fopentracker.i2p.rocks%3A6969%2Fannounce',
        seeders: 34500,
        leechers: 1420,
        size: '56.4 GB',
        isPtBrAudio: true,
        isPtBrSubs: true,
        hostName: '1337x (FitGirl Repack)'
      },
      {
        id: 'dl-cp-rutor',
        type: 'magnet',
        format: 'torrent',
        platform: 'PC',
        label: 'RuTor | [magnet] (Mirror Alternativo Torrent)',
        url: 'magnet:?xt=urn:btih:3fa9128456123984712093847102938471029385&dn=Cyberpunk.2077.v2.13-Phantom.Liberty-FitGirl-RuTor&tr=udp%3A%2F%2Fopentor.net%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce',
        seeders: 14200,
        leechers: 580,
        size: '56.4 GB',
        isPtBrAudio: true,
        isPtBrSubs: true,
        hostName: 'RuTor Tracker'
      },
      {
        id: 'dl-cp-pkg',
        type: 'pkg',
        format: 'pkg',
        platform: 'PS4',
        label: 'Arquivo PKG PlayStation 4 (CUSA-16596 - TheZukoStore)',
        url: 'https://thezukostore.com',
        size: '59.8 GB',
        titleId: 'CUSA-16596',
        firmware: 'FW 9.00 - 11.00 (Backport 5.05)',
        isPtBrAudio: true,
        isPtBrSubs: true,
        hostName: 'TheZukoStore'
      },
      {
        id: 'dl-cp-datanodes',
        type: 'direct',
        format: 'direct',
        platform: 'PC',
        label: 'Mirror Direto: DataNodes (Speed & Usability) [Use IDM]',
        url: 'https://datanodes.to',
        size: '56.4 GB',
        hostName: 'DataNodes'
      },
      {
        id: 'dl-cp-fuckingfast',
        type: 'direct',
        format: 'direct',
        platform: 'PC',
        label: 'Mirror Direto: FuckingFast (REALLY Fucking Fast)',
        url: 'https://fuckingfast.co',
        size: '56.4 GB',
        hostName: 'FuckingFast'
      },
      {
        id: 'dl-cp-filekeeper',
        type: 'direct',
        format: 'direct',
        platform: 'PC',
        label: 'Mirror Direto: FileKeeper.net (Servidor Alternativo)',
        url: 'https://filekeeper.net',
        size: '56.4 GB',
        hostName: 'FileKeeper'
      }
    ],
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit',
        processor: 'Intel Core i7-6700 ou AMD Ryzen 5 1600',
        memory: '12 GB RAM',
        graphics: 'NVIDIA GeForce GTX 1060 6GB ou AMD Radeon RX 580 8GB',
        storage: '70 GB SSD requerido',
        directx: 'Versão 12'
      },
      recommended: {
        os: 'Windows 10/11 64-bit',
        processor: 'Intel Core i7-12700 ou AMD Ryzen 7 7800X3D',
        memory: '16 GB RAM',
        graphics: 'NVIDIA GeForce RTX 3070 ou AMD Radeon RX 6800 XT',
        storage: '70 GB NVMe SSD',
        directx: 'Versão 12 Ultimate'
      }
    },
    rating: 0,
    totalVotes: 0,
    imdbRating: 9.3,
    screenshots: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80'
    ],
    trailerYoutubeId: 'kfX8t5lI214',
    tags: ['Cyberpunk', 'Ray Tracing', 'Dublado PT-BR', 'PKG', 'TheZukoStore', 'Tapochek'],
    downloadsCount: 48920,
    viewsCount: 154200,
    createdAt: '2024-01-10T14:00:00Z',
    isFeatured: true,
    isTrending: true,
    hasPtBrAudio: true,
    hasPtBrSubs: true,
    hasPkgFormat: true,
    hasPcTorrent: true,
    titleId: 'CUSA-16596',
    sourceOrigin: 'TheZukoStore',
    originalTrackerUrl: 'https://thezukostore.com',
    dlcIncluded: ['Phantom Liberty', 'Bonus In-Game Jackets & Weapons', 'OST Soundtrack FLAC', 'Digital Artbook'],
    languages: ['Português (Brasil) Dublado', 'Inglês', 'Espanhol', 'Francês', 'Alemão', 'Japonês'],
    gamefaqsCheatsUrl: 'https://gamefaqs.gamespot.com/pc/778998-cyberpunk-2077/cheats',
    nexusModsUrl: 'https://www.nexusmods.com/cyberpunk2077',
    cheats: [
      {
        id: 'cp-cheat-1',
        title: 'Eurodólares Infinitos (Cyber Engine Tweaks)',
        codeOrEffect: 'Game.AddToInventory("Items.money", 1000000)',
        category: 'Dinheiro',
        description: 'Adiciona 1 milhão de eddies instantaneamente à sua carteira no console CET.',
        source: 'GameFAQs'
      },
      {
        id: 'cp-cheat-2',
        title: 'Nível Máximo de V & Pontos de Vantagem',
        codeOrEffect: 'Game.SetLevel("Level", 60) e Game.GiveDevPoints("Attribute", 20)',
        category: 'Geral',
        description: 'Eleva V imediatamente ao nível 60 com 20 pontos de atributos para desbloquear qualquer build.',
        source: 'GameFAQs'
      },
      {
        id: 'cp-cheat-3',
        title: 'Todas as Armas Icônicas Lendárias',
        codeOrEffect: 'Game.AddToInventory("Items.Preset_Silverhand_3516", 1)',
        category: 'Armas',
        description: 'Adiciona a icônica pistola Malorian Arms 3516 de Johnny Silverhand com dano máximo.',
        source: 'GameFAQs'
      }
    ],
    mods: [
      {
        id: 'cp-mod-1',
        title: 'Cyber Engine Tweaks (CET Framework Oficial)',
        description: 'Framework indispensável para habilitar console de comandos, atalhos e suporte a scripts de mods.',
        nexusUrl: 'https://www.nexusmods.com/cyberpunk2077/mods/107',
        category: 'Gameplay',
        author: 'Yamashi / CET Team',
        downloadsCount: '4.8M'
      },
      {
        id: 'cp-mod-2',
        title: 'Ultra Plus Better Path Tracing & Performance Boost',
        description: 'Otimização avançada de iluminação por ray tracing que reduz ruído e melhora a taxa de FPS.',
        nexusUrl: 'https://www.nexusmods.com/cyberpunk2077/mods/10490',
        category: 'Fix/FPS',
        author: 'CyanPancake',
        downloadsCount: '320k'
      },
      {
        id: 'cp-mod-3',
        title: 'Let There Be Flight (Carros Voadores em Night City)',
        description: 'Adiciona propulsores de voo realistas aos veículos para sobrevoar todos os arranha-céus de Night City.',
        nexusUrl: 'https://www.nexusmods.com/cyberpunk2077/mods/5208',
        category: 'Gameplay',
        author: 'JackTheSpook',
        downloadsCount: '890k'
      }
    ]
  },
  {
    id: 'grim-dawn-definitive-edition',
    title: 'Grim Dawn: Definitive Edition',
    slug: 'grim-dawn-definitive-edition',
    coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'O aclamado ARPG sombrio da Crate Entertainment em sua edição definitiva com todas as expansões (Ashes of Malmouth e Forgotten Gods), tradução PT-BR, Cheats GameFAQs e Mods Nexus ativos.',
    description: 'Entre em um mundo de fantasia sombrio e apocalíptico onde a humanidade está à beira da extinção. Grim Dawn é o aclamado ARPG espiritual do clássico Titan Quest, combinando árvores de habilidades duplas, centenas de itens épicos e um universo devastado pelo Éter. A Definitive Edition inclui as expansões Ashes of Malmouth e Forgotten Gods, além de suporte nativo a controle e legendas em português.',
    genres: ['RPG', 'ARPG', 'Hack and Slash', 'Fantasia Sombria'],
    categories: ['AAA', 'Mais Populares', 'Destaques'],
    releaseYear: 2016,
    releaseDate: '25/02/2016',
    developer: 'Crate Entertainment',
    publisher: 'Crate Entertainment',
    repackInfo: {
      repacker: 'DODI / FitGirl Repack',
      version: 'v1.3.1.1 + All DLCs + Bonus Content + MULTi13',
      repackSize: '11.8 GB',
      originalSize: '16.5 GB',
      crackStatus: 'DRM Free',
      crackGroup: 'GOG'
    },
    downloadLinks: [
      {
        id: 'dl-gd-pc-torrent',
        type: 'magnet',
        format: 'torrent',
        platform: 'PC',
        label: 'Torrent PC Magnet (Grim Dawn Definitive Edition v1.3.1.1)',
        url: 'magnet:?xt=urn:btih:8923481239847120938471029384710293847102&dn=Grim.Dawn.Definitive.Edition.v1.3.1.1-Tapochek&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce',
        seeders: 4210,
        leechers: 380,
        size: '11.8 GB',
        isPtBrSubs: true,
        hostName: 'Tapochek.net'
      },
      {
        id: 'dl-gd-pkg-ps3',
        type: 'pkg',
        format: 'pkg',
        platform: 'PS3',
        label: 'Arquivo PKG PlayStation (TheZukoStore Servidor)',
        url: 'https://thezukostore.com/pc-pkg-grim-dawn-definitive-edition.pkg',
        size: '11.8 GB',
        titleId: 'BLUS-31622',
        firmware: 'FW 4.90+ HEN/CFW',
        isPtBrSubs: true,
        hostName: 'TheZukoStore'
      }
    ],
    systemRequirements: {
      minimum: {
        os: 'Windows 7 / 8 / 10 / 11 64-bit',
        processor: 'Intel Core 2 Duo 2.4 GHz ou AMD Athlon 64 X2',
        memory: '4 GB RAM',
        graphics: 'NVIDIA GeForce 6800 ou AMD Radeon X800 512MB',
        storage: '15 GB de espaço livre',
        directx: 'Versão 11'
      },
      recommended: {
        os: 'Windows 10 / 11 64-bit',
        processor: 'Intel Core i5-6500 ou AMD Ryzen 5 1600',
        memory: '8 GB RAM',
        graphics: 'NVIDIA GeForce GTX 1060 ou AMD Radeon RX 580',
        storage: '15 GB SSD de alta velocidade',
        directx: 'Versão 11'
      }
    },
    rating: 0,
    totalVotes: 0,
    imdbRating: 9.4,
    screenshots: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80'
    ],
    trailerYoutubeId: 'v12345',
    tags: ['Grim Dawn', 'Definitive Edition', 'ARPG', 'Crate Entertainment', 'GameFAQs', 'Nexus Mods', 'Dublado PT-BR', 'PKG', 'Torrent'],
    downloadsCount: 78500,
    viewsCount: 224000,
    createdAt: '2024-02-15T10:00:00Z',
    isFeatured: true,
    isTrending: true,
    hasPtBrAudio: false,
    hasPtBrSubs: true,
    hasPkgFormat: true,
    hasPcTorrent: true,
    titleId: 'BLUS-31622',
    sourceOrigin: 'TheZukoStore',
    originalTrackerUrl: 'https://thezukostore.com',
    dlcIncluded: ['Ashes of Malmouth Expansion', 'Forgotten Gods Expansion', 'Crucible Mode DLC', 'Loyalist Items Pack 1 & 2'],
    languages: ['Português (Brasil) Legendado', 'Inglês', 'Espanhol', 'Francês', 'Alemão'],
    gamefaqsCheatsUrl: 'https://gamefaqs.gamespot.com/pc/995472-grim-dawn/cheats',
    nexusModsUrl: 'https://www.nexusmods.com/grimdawn',
    cheats: [
      {
        id: 'gd-cheat-1',
        title: 'Modo Deus / Invulnerabilidade Total (Console)',
        codeOrEffect: 'Pressione ` (til) ou F1 para abrir o console e digite: game.god true',
        category: 'Vidas/Energia',
        description: 'Torna o herói 100% imune a qualquer dano de monstros, chefes e poças de éter radioativo.',
        source: 'GameFAQs'
      },
      {
        id: 'gd-cheat-2',
        title: 'Adicionar 1.000.000 de Iron Bits (Dinheiro)',
        codeOrEffect: 'No console de comandos: game.give IronBits 1000000',
        category: 'Dinheiro',
        description: 'Deposita instantaneamente um milhão de moedas no inventário para compras imediatas.',
        source: 'GameFAQs'
      },
      {
        id: 'gd-cheat-3',
        title: 'Desbloquear Todos os 55 Pontos de Devoção',
        codeOrEffect: 'No console de comandos: character.grantpow 55',
        category: 'Desbloqueáveis',
        description: 'Concede todos os 55 pontos máximos de Devoção para completar constelações celestiais.',
        source: 'GameFAQs'
      },
      {
        id: 'gd-cheat-4',
        title: 'Revelar Todo o Mapa de Cairn',
        codeOrEffect: 'No console de comandos: game.revealmap true',
        category: 'Segredos',
        description: 'Dissipa toda a névoa do mapa revelando passagens secretas, altares e masmorras.',
        source: 'GameFAQs'
      }
    ],
    mods: [
      {
        id: 'gd-mod-1',
        title: 'Grim Internals (Auto-Loot, DPS & Teleporte Rápido)',
        description: 'Ferramenta indispensável da comunidade com coleta automática de componentes, estatísticas de dano em tempo real e atalhos rápidos.',
        nexusUrl: 'https://www.nexusmods.com/grimdawn/mods/40',
        category: 'Gameplay',
        author: 'GlockenGerda',
        downloadsCount: '340k'
      },
      {
        id: 'gd-mod-2',
        title: 'Reign of Terror (Diablo 2 Total Conversion)',
        description: 'Recriação completa do lendário Diablo II e Lord of Destruction dentro da engine do Grim Dawn com todas as classes clássicas.',
        nexusUrl: 'https://www.nexusmods.com/grimdawn/mods/144',
        category: 'Total Conversion',
        author: 'Ram & RoT Team',
        downloadsCount: '280k'
      },
      {
        id: 'gd-mod-3',
        title: 'Grim Dawn Item Assistant (Armazenamento Infinito)',
        description: 'Gerenciador externo seguro que permite guardar itens ilimitados sem depender do baú pequeno do jogo.',
        nexusUrl: 'https://www.nexusmods.com/grimdawn/mods/4',
        category: 'Utilitário',
        author: 'SlipperyPete',
        downloadsCount: '410k'
      },
      {
        id: 'gd-mod-4',
        title: 'Dawn of Masteries (Mais de 30 Novas Classes)',
        description: 'Mega mod que funde classes do Titan Quest, Diablo 3, Zenith e Cataclysm no Grim Dawn com balanceamento refinado.',
        nexusUrl: 'https://www.nexusmods.com/grimdawn/mods/82',
        category: 'Classes/Gameplay',
        author: 'mamba',
        downloadsCount: '190k'
      }
    ]
  },
  {
    id: 'elden-ring',
    title: 'Elden Ring: Shadow of the Erdtree',
    slug: 'elden-ring-shadow-of-the-erdtree',
    coverUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/library_600x900.jpg',
    bannerUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg',
    shortDescription: 'Aventure-se na Terra das Sombras guiado por Miquella. Um dos maiores épicos soulslike da história dos videogames.',
    description: 'Vencedor de centenas de prêmios de Jogo do Ano, ELDEN RING convida você a explorar as Terras Intermédias e agora a Terra das Sombras na monumental expansão Shadow of the Erdtree. Descubra os segredos obscuros do mundo e encontre novos chefes mortais com novas armas, feitiços e armaduras.',
    genres: ['RPG', 'Ação', 'Soulslike', 'Mundo Aberto', 'Fantasia'],
    categories: ['AAA', 'Lançamentos', 'Mais Populares'],
    releaseYear: 2024,
    releaseDate: '21/06/2024',
    developer: 'FromSoftware Inc.',
    publisher: 'Bandai Namco Entertainment',
    repackInfo: {
      repacker: 'DODI Repack',
      version: 'v1.12.3 + Shadow of the Erdtree Deluxe',
      repackSize: '49.8 GB',
      originalSize: '65.5 GB',
      crackStatus: 'Crackeado',
      crackGroup: 'RUNE'
    },
    downloadLinks: [
      {
        id: 'dl-er-1',
        type: 'magnet',
        label: 'Torrent Magnet Rápido (Mais de 4.000 Peers)',
        url: 'magnet:?xt=urn:btih:9ab4812301928471029384710293847102938471&dn=Elden.Ring.Shadow.of.the.Erdtree-RUNE-DODI&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80',
        seeders: 4120,
        leechers: 680,
        size: '49.8 GB'
      },
      {
        id: 'dl-er-2',
        type: 'torrent',
        label: 'Download .torrent Link Direto',
        url: '#torrent-download',
        seeders: 3200,
        leechers: 450,
        size: '49.8 GB'
      },
      {
        id: 'dl-er-3',
        type: 'direct',
        label: 'Download Direto: Qiwi / MegaNZ',
        url: 'https://mega.nz',
        size: '49.8 GB',
        hostName: 'Mega.nz'
      }
    ],
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit',
        processor: 'Intel Core i5-8400 ou AMD Ryzen 3 3300X',
        memory: '12 GB RAM',
        graphics: 'NVIDIA GeForce GTX 1060 3GB ou AMD Radeon RX 580 4GB',
        storage: '60 GB livres',
        directx: 'Versão 12'
      },
      recommended: {
        os: 'Windows 10/11 64-bit',
        processor: 'Intel Core i7-8700K ou AMD Ryzen 5 3600X',
        memory: '16 GB RAM',
        graphics: 'NVIDIA GeForce RTX 2070 8GB ou AMD Radeon RX 5700 XT 8GB',
        storage: '60 GB SSD',
        directx: 'Versão 12'
      }
    },
    imdbRating: 9.5,
    rating: 0,
    totalVotes: 0,
    screenshots: [
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'
    ],
    trailerYoutubeId: 'qLZenOn7WUo',
    tags: ['Soulslike', 'FromSoftware', 'Mundo Aberto', 'Altíssima Dificuldade', 'Legendas PT-BR'],
    downloadsCount: 65100,
    viewsCount: 210400,
    createdAt: '2024-06-22T10:00:00Z',
    isFeatured: true,
    isTrending: true,
    dlcIncluded: ['Shadow of the Erdtree Expansion', 'Adventure Guide', 'Artbook & Soundtrack'],
    languages: ['Português (Brasil) Interface/Legendas', 'Inglês', 'Japonês']
  },
  {
    id: 'black-myth-wukong',
    title: 'Black Myth: Wukong',
    slug: 'black-myth-wukong',
    coverUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2358720/library_600x900.jpg',
    bannerUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2358720/header.jpg',
    shortDescription: 'Assuma o bastão lendário do Rei Macaco numa jornada épica inspirada na mitologia chinesa em Unreal Engine 5.',
    description: 'Black Myth: Wukong é um RPG de ação baseado na clássica mitologia chinesa e no romance "Jornada ao Oeste". Você assumirá o papel do Predestinado, partindo em uma aventura repleta de maravilhas e perigos colossais para desvendar a verdade oculta sob o véu de uma lenda gloriosa do passado.',
    genres: ['Ação', 'RPG', 'Aventura', 'Mitologia', 'Hack and Slash'],
    categories: ['AAA', 'Lançamentos', 'Mais Populares'],
    releaseYear: 2024,
    releaseDate: '20/08/2024',
    developer: 'Game Science',
    publisher: 'Game Science',
    repackInfo: {
      repacker: 'ElAmigos',
      version: 'v1.0.8.14860 Multilingual',
      repackSize: '88.5 GB',
      originalSize: '128.0 GB',
      crackStatus: 'Crackeado',
      crackGroup: 'Bypass / Rune'
    },
    downloadLinks: [
      {
        id: 'dl-bm-1',
        type: 'magnet',
        label: 'Torrent Magnet Super Seeders',
        url: 'magnet:?xt=urn:btih:8821948192847192847192847192847192847192&dn=Black.Myth.Wukong-ElAmigos&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce',
        seeders: 5200,
        leechers: 940,
        size: '88.5 GB'
      },
      {
        id: 'dl-bm-2',
        type: 'torrent',
        label: 'Arquivo Torrent (.torrent)',
        url: '#torrent-download',
        seeders: 4500,
        leechers: 720,
        size: '88.5 GB'
      }
    ],
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit',
        processor: 'Intel Core i5-8400 ou AMD Ryzen 5 1600',
        memory: '16 GB RAM',
        graphics: 'NVIDIA GeForce GTX 1060 6GB ou AMD Radeon RX 580 8GB',
        storage: '130 GB livres (SSD obrigatório)',
        directx: 'Versão 12'
      },
      recommended: {
        os: 'Windows 10/11 64-bit',
        processor: 'Intel Core i7-9700 ou AMD Ryzen 5 5500',
        memory: '16 GB RAM',
        graphics: 'NVIDIA GeForce RTX 2060 ou AMD Radeon RX 5700 XT',
        storage: '130 GB NVMe SSD',
        directx: 'Versão 12'
      }
    },
    imdbRating: 8.9,
    rating: 0,
    totalVotes: 0,
    screenshots: [
      'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80'
    ],
    trailerYoutubeId: 'pnSsgRJmsCc',
    tags: ['Unreal Engine 5', 'Rei Macaco', 'Dublagem Chinesa/Inglesa', 'Legendas PT-BR'],
    downloadsCount: 78200,
    viewsCount: 289000,
    createdAt: '2024-08-21T08:00:00Z',
    isFeatured: true,
    isTrending: true,
    languages: ['Português (Brasil)', 'Inglês', 'Chinês']
  },
  {
    id: 'baldurs-gate-3',
    title: 'Baldur’s Gate 3: Digital Deluxe Edition',
    slug: 'baldurs-gate-3-deluxe',
    coverUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/library_600x900.jpg',
    bannerUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg',
    shortDescription: 'O RPG definitivo ganhador do GOTY 2023. Liberdade sem precedentes no universo de Dungeons & Dragons.',
    description: 'Reúna seu grupo e retorne aos Reinos Esquecidos em uma narrativa de companheirismo e traição, sacrifício e sobrevivência, além do fascínio pelo poder supremo. Habilidades misteriosas estão despertando dentro de você, extraídas de um parasita do Devorador de Mentes implantado em seu cérebro.',
    genres: ['RPG', 'Estratégia', 'Turnos', 'Fantasia', 'Mundo Aberto'],
    categories: ['AAA', 'Mais Populares', 'Repacks'],
    releaseYear: 2023,
    releaseDate: '03/08/2023',
    developer: 'Larian Studios',
    publisher: 'Larian Studios',
    repackInfo: {
      repacker: 'FitGirl Repack',
      version: 'v4.1.1.5022896 (Patch 7 Oficial com Mod Manager)',
      repackSize: '95.2 GB',
      originalSize: '141.0 GB',
      crackStatus: 'DRM Free',
      crackGroup: 'GOG DRM-Free'
    },
    downloadLinks: [
      {
        id: 'dl-bg3-1337x',
        type: 'magnet',
        format: 'torrent',
        platform: 'PC',
        label: '1337x | [magnet] (29.800 Seeds Verificados FitGirl)',
        url: 'magnet:?xt=urn:btih:1182749102938471029384710293847102938471&dn=Baldurs.Gate.3.Patch.7-FitGirl&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce',
        seeders: 29800,
        leechers: 1310,
        size: '95.2 GB',
        hostName: '1337x (FitGirl Repack)'
      },
      {
        id: 'dl-bg3-rutor',
        type: 'magnet',
        format: 'torrent',
        platform: 'PC',
        label: 'RuTor | [magnet] (Mirror Alternativo Torrent)',
        url: 'magnet:?xt=urn:btih:1182749102938471029384710293847102938472&dn=Baldurs.Gate.3.Patch.7-FitGirl-RuTor&tr=udp%3A%2F%2Fopentor.net%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce',
        seeders: 12400,
        leechers: 520,
        size: '95.2 GB',
        hostName: 'RuTor Tracker'
      },
      {
        id: 'dl-bg3-datanodes',
        type: 'direct',
        format: 'direct',
        platform: 'PC',
        label: 'Mirror Direto: DataNodes (Speed & Usability) [Use IDM]',
        url: 'https://datanodes.to',
        size: '95.2 GB',
        hostName: 'DataNodes'
      },
      {
        id: 'dl-bg3-fuckingfast',
        type: 'direct',
        format: 'direct',
        platform: 'PC',
        label: 'Mirror Direto: FuckingFast (REALLY Fucking Fast)',
        url: 'https://fuckingfast.co',
        size: '95.2 GB',
        hostName: 'FuckingFast'
      },
      {
        id: 'dl-bg3-filekeeper',
        type: 'direct',
        format: 'direct',
        platform: 'PC',
        label: 'Mirror Direto: FileKeeper.net (Servidor Alternativo)',
        url: 'https://filekeeper.net',
        size: '95.2 GB',
        hostName: 'FileKeeper'
      }
    ],
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit',
        processor: 'Intel Core i5-4690 / AMD FX 8350',
        memory: '8 GB RAM',
        graphics: 'NVIDIA GTX 970 / AMD RX 480 (4GB+ VRAM)',
        storage: '150 GB SSD obrigatório',
        directx: 'Versão 11'
      },
      recommended: {
        os: 'Windows 10/11 64-bit',
        processor: 'Intel Core i7-8700K / AMD Ryzen 5 3600',
        memory: '16 GB RAM',
        graphics: 'NVIDIA RTX 2060 Super / AMD RX 5700 XT (8GB+ VRAM)',
        storage: '150 GB SSD',
        directx: 'Versão 11'
      }
    },
    imdbRating: 9.6,
    rating: 0,
    totalVotes: 0,
    screenshots: [
      'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80'
    ],
    trailerYoutubeId: '1T22wN1JL4Q',
    tags: ['GOTY', 'D&D', 'Co-op Online', 'Mod Support', 'Textos em PT-BR'],
    downloadsCount: 89000,
    viewsCount: 312000,
    createdAt: '2023-08-04T12:00:00Z',
    isFeatured: true,
    isTrending: true,
    dlcIncluded: ['Digital Deluxe Items', 'Divinity Bard Song Pack', 'Paintings from Rivellon', 'Adventurer\'s Pouch'],
    languages: ['Português (Brasil)', 'Inglês', 'Espanhol', 'Russo']
  },
  {
    id: 'god-of-war-ragnarok',
    title: 'God of War Ragnarök: Digital Deluxe',
    slug: 'god-of-war-ragnarok',
    coverUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2322010/library_600x900.jpg',
    bannerUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2322010/header.jpg',
    shortDescription: 'Kratos e Atreus embarcam numa jornada mítica pelos Nove Reinos enquanto o Ragnarök se aproxima.',
    description: 'Embarque em uma jornada épica e emocionante com Kratos e Atreus na versão definitiva para PC de God of War Ragnarök. Inclui a aclamada expansão Valhalla com mecânicas roguelite e suporte a resoluções ultrawide e tecnologias de upscaling modernas (DLSS 3.7, FSR 3.1, XeSS).',
    genres: ['Ação', 'Aventura', 'Mitologia', 'Hack and Slash'],
    categories: ['AAA', 'Lançamentos'],
    releaseYear: 2024,
    releaseDate: '19/09/2024',
    developer: 'Santa Monica Studio / Jetpack Interactive',
    publisher: 'PlayStation Publishing LLC',
    repackInfo: {
      repacker: 'DODI Repack',
      version: 'v1.0.614.0 + Valhalla DLC + No-PSN Bypass',
      repackSize: '102.5 GB',
      originalSize: '175.0 GB',
      crackStatus: 'Crackeado',
      crackGroup: 'RUNE'
    },
    downloadLinks: [
      {
        id: 'dl-gow-1',
        type: 'magnet',
        format: 'torrent',
        platform: 'PC',
        label: 'Torrent Magnet PC (DODI Repack - RUNE)',
        url: 'magnet:?xt=urn:btih:9920194810293847102938471029384710293847&dn=God.of.War.Ragnarok.PC-RUNE&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce',
        seeders: 3950,
        leechers: 580,
        size: '102.5 GB',
        isPtBrAudio: true,
        isPtBrSubs: true
      },
      {
        id: 'dl-gow-pkg',
        type: 'pkg',
        format: 'pkg',
        platform: 'PS4',
        label: 'Arquivo PKG PlayStation 4 (CUSA-34388 - TheZukoStore)',
        url: 'https://thezukostore.com',
        size: '84.0 GB',
        titleId: 'CUSA-34388',
        firmware: 'FW 9.00 - 11.00 (Dublagem Oficial BR)',
        isPtBrAudio: true,
        isPtBrSubs: true,
        hostName: 'TheZukoStore'
      },
      {
        id: 'dl-gow-2',
        type: 'direct',
        format: 'torrent',
        platform: 'PC',
        label: 'Mirror Direto: MultiUpload & Qiwi (Servidor Rápido)',
        url: 'magnet:?xt=urn:btih:3438812093847102938471029384710293847102&dn=God.of.War.Ragnarok.DirectMirror&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce',
        seeders: 3100,
        leechers: 420,
        size: '102.5 GB',
        hostName: 'MultiUpload Server'
      },
      {
        id: 'dl-gow-patch-ptbr',
        type: 'pt_br_patch',
        format: 'pt_br_patch',
        platform: 'PC',
        label: 'Pacote de Vozes e Dublagem PT-BR (Ricardo Juarez / Kratos)',
        url: 'https://thezukostore.com',
        size: '4.2 GB',
        isPtBrAudio: true,
        isPtBrSubs: true,
        hostName: 'ZukoStore Dublagens'
      }
    ],
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit',
        processor: 'Intel Core i5-4670K ou AMD Ryzen 3 1200',
        memory: '8 GB RAM',
        graphics: 'NVIDIA GeForce GTX 1060 (6 GB) ou AMD Radeon RX 5500 XT (8 GB)',
        storage: '190 GB SSD requerido',
        directx: 'Versão 12'
      },
      recommended: {
        os: 'Windows 10/11 64-bit',
        processor: 'Intel Core i5-8600 ou AMD Ryzen 5 3600',
        memory: '16 GB RAM',
        graphics: 'NVIDIA GeForce RTX 2060 Super ou AMD Radeon RX 5700',
        storage: '190 GB SSD',
        directx: 'Versão 12'
      }
    },
    imdbRating: 9.4,
    rating: 0,
    totalVotes: 0,
    screenshots: [
      'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'
    ],
    trailerYoutubeId: 'EE-4GvjKcfs',
    tags: ['PlayStation PC', 'Dublado PT-BR', 'Valhalla DLC', 'Ray Tracing', 'DualSense Suportado'],
    downloadsCount: 52400,
    viewsCount: 168000,
    createdAt: '2024-09-20T11:00:00Z',
    isFeatured: true,
    isTrending: true,
    hasPtBrAudio: true,
    hasPtBrSubs: true,
    hasPkgFormat: true,
    hasPcTorrent: true,
    titleId: 'CUSA-34388',
    sourceOrigin: 'TheZukoStore',
    originalTrackerUrl: 'https://thezukostore.com',
    dlcIncluded: ['God of War Ragnarök: Valhalla DLC', 'Darkdale Armor Set', 'Darkdale Attire (Cosmetic)', 'Digital Soundtrack'],
    languages: ['Português (Brasil) Dublagem Completa', 'Inglês', 'Espanhol']
  },
  {
    id: 'red-dead-redemption-2',
    title: 'Red Dead Redemption 2: Ultimate Edition',
    slug: 'red-dead-redemption-2-ultimate',
    coverUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/library_600x900.jpg',
    bannerUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg',
    shortDescription: 'A obra-prima cinematográfica da Rockstar Games no Velho Oeste americano de 1899.',
    description: 'Estados Unidos, 1899. O fim da era do Velho Oeste começou. Após um assalto dar errado na cidade de Blackwater, Arthur Morgan e a gangue Van der Linde são forçados a fugir. Com agentes federais e os melhores caçadores de recompensa do país em seu encalço, a gangue precisa roubar, assaltar e lutar para sobreviver.',
    genres: ['Mundo Aberto', 'Ação', 'Aventura', 'Faroeste', 'História Rica'],
    categories: ['AAA', 'Mais Populares', 'Repacks'],
    releaseYear: 2019,
    releaseDate: '05/11/2019',
    developer: 'Rockstar Games',
    publisher: 'Rockstar Games',
    repackInfo: {
      repacker: 'FitGirl Repack',
      version: 'v1491.50 Ultimate Edition + All Bonuses',
      repackSize: '66.3 GB',
      originalSize: '119.0 GB',
      crackStatus: 'Crackeado',
      crackGroup: 'EMPRESS'
    },
    downloadLinks: [
      {
        id: 'dl-rdr2-1337x',
        type: 'magnet',
        format: 'torrent',
        platform: 'PC',
        label: '1337x | [magnet] (35.890 Seeds Verificados FitGirl)',
        url: 'magnet:?xt=urn:btih:3399120938471029384710293847102938471029&dn=Red.Dead.Redemption.2.Ultimate-FitGirl&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce',
        seeders: 35890,
        leechers: 1810,
        size: '66.3 GB',
        hostName: '1337x (FitGirl Repack)'
      },
      {
        id: 'dl-rdr2-rutor',
        type: 'magnet',
        format: 'torrent',
        platform: 'PC',
        label: 'RuTor | [magnet] (Mirror Alternativo Torrent)',
        url: 'magnet:?xt=urn:btih:3399120938471029384710293847102938471030&dn=Red.Dead.Redemption.2.Ultimate-FitGirl-RuTor&tr=udp%3A%2F%2Fopentor.net%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce',
        seeders: 15400,
        leechers: 640,
        size: '66.3 GB',
        hostName: 'RuTor Tracker'
      },
      {
        id: 'dl-rdr2-datanodes',
        type: 'direct',
        format: 'direct',
        platform: 'PC',
        label: 'Mirror Direto: DataNodes (Speed & Usability) [Use IDM]',
        url: 'https://datanodes.to',
        size: '66.3 GB',
        hostName: 'DataNodes'
      },
      {
        id: 'dl-rdr2-fuckingfast',
        type: 'direct',
        format: 'direct',
        platform: 'PC',
        label: 'Mirror Direto: FuckingFast (REALLY Fucking Fast)',
        url: 'https://fuckingfast.co',
        size: '66.3 GB',
        hostName: 'FuckingFast'
      },
      {
        id: 'dl-rdr2-filekeeper',
        type: 'direct',
        format: 'direct',
        platform: 'PC',
        label: 'Mirror Direto: FileKeeper.net (Servidor Alternativo)',
        url: 'https://filekeeper.net',
        size: '66.3 GB',
        hostName: 'FileKeeper'
      }
    ],
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit',
        processor: 'Intel Core i5-2500K / AMD FX-6300',
        memory: '8 GB RAM',
        graphics: 'Nvidia GeForce GTX 770 2GB / AMD Radeon R9 280 3GB',
        storage: '150 GB de espaço',
        directx: 'Versão 11'
      },
      recommended: {
        os: 'Windows 10/11 64-bit',
        processor: 'Intel Core i7-4770K / AMD Ryzen 5 1500X',
        memory: '12 GB RAM',
        graphics: 'Nvidia GeForce GTX 1060 6GB / AMD Radeon RX 480 4GB',
        storage: '150 GB SSD',
        directx: 'Versão 12'
      }
    },
    imdbRating: 9.8,
    rating: 0,
    totalVotes: 0,
    screenshots: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80'
    ],
    trailerYoutubeId: 'eaW0tYpxyp0',
    tags: ['Rockstar', 'Obra Prima', 'Arthur Morgan', 'Mundo Vivo', 'Legendas PT-BR'],
    downloadsCount: 142000,
    viewsCount: 490000,
    createdAt: '2023-01-15T09:00:00Z',
    isFeatured: false,
    isTrending: true,
    dlcIncluded: ['Story Mode Bank Robbery Mission', 'Dappled Black Thoroughbred Horse', 'Nuevo Paraiso Gunslinger Outfit', 'Free Weapons'],
    languages: ['Português (Brasil)', 'Inglês', 'Espanhol', 'Francês']
  },
  {
    id: 'resident-evil-4-remake',
    title: 'Resident Evil 4 Remake: Gold Edition',
    slug: 'resident-evil-4-gold-edition',
    coverUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2050650/library_600x900.jpg',
    bannerUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2050650/header.jpg',
    shortDescription: 'O clássico supremo do survival horror renascido com gráficos fotorrealistas e a expansão Separate Ways.',
    description: 'A sobrevivência é apenas o começo. Seis anos se passaram desde o desastre biológico em Raccoon City. O agente Leon S. Kennedy é enviado para resgatar a filha do presidente, que foi raptada em um vilarejo isolado na Europa, onde há algo terrivelmente errado com os habitantes locais.',
    genres: ['Terror', 'Sobrevivência', 'Ação', 'Zumbis', 'Tiro em 3ª Pessoa'],
    categories: ['AAA', 'Mais Populares', 'Repacks'],
    releaseYear: 2023,
    releaseDate: '24/03/2023',
    developer: 'CAPCOM Co., Ltd.',
    publisher: 'CAPCOM Co., Ltd.',
    repackInfo: {
      repacker: 'ElAmigos',
      version: 'v1.10 Gold Edition + Separate Ways DLC',
      repackSize: '41.2 GB',
      originalSize: '68.0 GB',
      crackStatus: 'Crackeado',
      crackGroup: 'EMPRESS'
    },
    downloadLinks: [
      {
        id: 'dl-re4-1',
        type: 'magnet',
        label: 'Torrent Magnet Oficial Gold Edition',
        url: 'magnet:?xt=urn:btih:8839201948102938471029384710293847102938&dn=Resident.Evil.4.Gold.Edition-ElAmigos&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce',
        seeders: 2750,
        leechers: 390,
        size: '41.2 GB'
      },
      {
        id: 'dl-re4-2',
        type: 'torrent',
        label: 'Baixar arquivo .torrent',
        url: '#torrent-download',
        seeders: 2100,
        leechers: 280,
        size: '41.2 GB'
      }
    ],
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit',
        processor: 'AMD Ryzen 3 1200 / Intel Core i5-7500',
        memory: '8 GB RAM',
        graphics: 'AMD Radeon RX 560 4GB / NVIDIA GeForce GTX 1050 Ti 4GB',
        storage: '60 GB livres',
        directx: 'Versão 12'
      },
      recommended: {
        os: 'Windows 10/11 64-bit',
        processor: 'AMD Ryzen 5 3600 / Intel Core i7 8700',
        memory: '16 GB RAM',
        graphics: 'AMD Radeon RX 5700 / NVIDIA GeForce GTX 1070',
        storage: '60 GB SSD',
        directx: 'Versão 12'
      }
    },
    imdbRating: 9.3,
    rating: 0,
    totalVotes: 0,
    screenshots: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80'
    ],
    trailerYoutubeId: 'Id2EaH_0j0M',
    tags: ['Survival Horror', 'Leon Kennedy', 'Dublado PT-BR', 'Capcom', 'Separate Ways'],
    downloadsCount: 56900,
    viewsCount: 198000,
    createdAt: '2023-04-01T15:00:00Z',
    isFeatured: false,
    isTrending: true,
    dlcIncluded: ['Separate Ways (Ada Wong Story)', 'The Mercenaries Mode', 'Extra DLC Pack Costumes & Weapons', 'Original Soundtrack Swap'],
    languages: ['Português (Brasil) Dublado', 'Inglês', 'Japonês', 'Espanhol']
  },
  {
    id: 'forza-horizon-5',
    title: 'Forza Horizon 5: Premium Edition',
    slug: 'forza-horizon-5-premium',
    coverUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1551360/library_600x900.jpg',
    bannerUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1551360/header.jpg',
    shortDescription: 'O festival de corrida automotiva em mundo aberto mais vibrante do mundo, ambientado nas paisagens do México.',
    description: 'Sua maior aventura Horizon te espera! Explore as paisagens vibrantes e em constante evolução do mundo aberto do México, com uma ação de direção divertida e sem limites em centenas dos melhores carros do mundo.',
    genres: ['Corrida', 'Mundo Aberto', 'Simulador', 'Esporte', 'Multiplayer'],
    categories: ['AAA', 'Repacks'],
    releaseYear: 2021,
    releaseDate: '09/11/2021',
    developer: 'Playground Games',
    publisher: 'Xbox Game Studios',
    repackInfo: {
      repacker: 'DODI Repack',
      version: 'v1.656.386.0 + Rally Adventure + Hot Wheels',
      repackSize: '89.0 GB',
      originalSize: '145.0 GB',
      crackStatus: 'Emulação Steam',
      crackGroup: 'Online-Fix / Rune'
    },
    downloadLinks: [
      {
        id: 'dl-fh5-1',
        type: 'magnet',
        label: 'Torrent Magnet DODI Repack',
        url: 'magnet:?xt=urn:btih:4719201948102938471029384710293847102938&dn=Forza.Horizon.5.Premium-DODI&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce',
        seeders: 3100,
        leechers: 450,
        size: '89.0 GB'
      }
    ],
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit',
        processor: 'Intel i5-4460 / AMD Ryzen 3 1200',
        memory: '8 GB RAM',
        graphics: 'NVidia GTX 970 / AMD RX 470',
        storage: '110 GB livres',
        directx: 'Versão 12'
      },
      recommended: {
        os: 'Windows 10/11 64-bit',
        processor: 'Intel i7-10700K / AMD Ryzen 7 3800XT',
        memory: '16 GB RAM',
        graphics: 'NVidia RTX 3070 / AMD RX 6800 XT',
        storage: '110 GB SSD',
        directx: 'Versão 12'
      }
    },
    imdbRating: 9,
    rating: 0,
    totalVotes: 0,
    screenshots: [
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    ],
    trailerYoutubeId: 'FYH9n3Ov126',
    tags: ['Carros', 'Gráficos Hiper-realistas', 'Dublado PT-BR', 'México', 'Hot Wheels'],
    downloadsCount: 68400,
    viewsCount: 220000,
    createdAt: '2023-05-10T10:00:00Z',
    isFeatured: false,
    isTrending: false,
    dlcIncluded: ['Hot Wheels Expansion', 'Rally Adventure Expansion', 'VIP Membership', 'Welcome Pack', 'All Car Passes'],
    languages: ['Português (Brasil) Dublado', 'Inglês', 'Espanhol']
  },
  {
    id: 'hollow-knight-voidheart',
    title: 'Hollow Knight: Voidheart Edition',
    slug: 'hollow-knight-voidheart',
    coverUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/367520/library_600x900.jpg',
    bannerUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/367520/header.jpg',
    shortDescription: 'Desça até as profundezas de Hallownest no metroidvania mais aclamado de todos os tempos. Leve e otimizado para qualquer PC.',
    description: 'Forje seu próprio caminho em Hollow Knight! Uma aventura épica através de um vasto reino em ruínas de insetos e heróis. Explore cavernas sinuosas, lute contra criaturas corrompidas e faça amizade com insetos bizarros em um estilo 2D desenhado à mão.',
    genres: ['Metroidvania', 'Ação', 'Aventura', 'Indie', 'Plataforma'],
    categories: ['Indiezinhos', 'Repacks Leves', 'Mais Populares'],
    releaseYear: 2017,
    releaseDate: '24/02/2017',
    developer: 'Team Cherry',
    publisher: 'Team Cherry',
    repackInfo: {
      repacker: 'FitGirl Repack',
      version: 'v1.5.78.11833 + All 4 DLC Packs',
      repackSize: '1.2 GB',
      originalSize: '7.5 GB',
      crackStatus: 'DRM Free',
      crackGroup: 'GOG DRM-Free'
    },
    downloadLinks: [
      {
        id: 'dl-hk-1337x',
        type: 'magnet',
        format: 'torrent',
        platform: 'PC',
        label: '1337x | [magnet] (18.400 Seeds Verificados FitGirl)',
        url: 'magnet:?xt=urn:btih:1029384710293847102938471029384710293847&dn=Hollow.Knight.Voidheart-FitGirl&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce',
        seeders: 18400,
        leechers: 620,
        size: '1.2 GB',
        hostName: '1337x (FitGirl Repack)'
      },
      {
        id: 'dl-hk-rutor',
        type: 'magnet',
        format: 'torrent',
        platform: 'PC',
        label: 'RuTor | [magnet] (Mirror Alternativo Torrent)',
        url: 'magnet:?xt=urn:btih:1029384710293847102938471029384710293848&dn=Hollow.Knight.Voidheart-FitGirl-RuTor&tr=udp%3A%2F%2Fopentor.net%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce',
        seeders: 7200,
        leechers: 280,
        size: '1.2 GB',
        hostName: 'RuTor Tracker'
      },
      {
        id: 'dl-hk-datanodes',
        type: 'direct',
        format: 'direct',
        platform: 'PC',
        label: 'Mirror Direto: DataNodes (Speed & Usability) [Use IDM]',
        url: 'https://datanodes.to',
        size: '1.2 GB',
        hostName: 'DataNodes'
      },
      {
        id: 'dl-hk-fuckingfast',
        type: 'direct',
        format: 'direct',
        platform: 'PC',
        label: 'Mirror Direto: FuckingFast (REALLY Fucking Fast)',
        url: 'https://fuckingfast.co',
        size: '1.2 GB',
        hostName: 'FuckingFast'
      },
      {
        id: 'dl-hk-filekeeper',
        type: 'direct',
        format: 'direct',
        platform: 'PC',
        label: 'Mirror Direto: FileKeeper.net (Servidor Alternativo)',
        url: 'https://filekeeper.net',
        size: '1.2 GB',
        hostName: 'FileKeeper'
      }
    ],
    systemRequirements: {
      minimum: {
        os: 'Windows 7 / 8 / 10 / 11',
        processor: 'Intel Core 2 Duo E5200',
        memory: '4 GB RAM',
        graphics: 'GeForce 9800GTX+ (1GB)',
        storage: '9 GB de espaço',
        directx: 'Versão 10'
      },
      recommended: {
        os: 'Windows 10 64-bit',
        processor: 'Intel Core i5',
        memory: '8 GB RAM',
        graphics: 'GeForce GTX 560',
        storage: '9 GB de espaço',
        directx: 'Versão 11'
      }
    },
    imdbRating: 9.4,
    rating: 0,
    totalVotes: 0,
    screenshots: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'
    ],
    trailerYoutubeId: 'UAO2urG23S4',
    tags: ['Metroidvania', 'Obra Prima', 'PC Fraco Roda', 'Trilha Sonora Lendária', 'PT-BR'],
    downloadsCount: 94000,
    viewsCount: 380000,
    createdAt: '2023-01-01T00:00:00Z',
    isFeatured: false,
    isTrending: false,
    dlcIncluded: ['Hidden Dreams', 'The Grimm Troupe', 'Lifeblood', 'Godmaster'],
    languages: ['Português (Brasil)', 'Inglês', 'Francês', 'Alemão', 'Japonês']
  }
];
