import { Game } from '../types';
import { ZUKO_TAPOCHEK_PRESETS } from './zukoTapochekPresets';
import { DODI_PRESET_GAMES } from './dodiPresets';

export const INITIAL_GAMES: Game[] = [
  ...DODI_PRESET_GAMES,
  ...ZUKO_TAPOCHEK_PRESETS,
  {
    id: 'bloodborne-complete',
    title: 'Bloodborne: Game of the Year Edition',
    slug: 'bloodborne-goty-pkg-cusa03173',
    coverUrl: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
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
    rating: 5.0,
    totalVotes: 4950,
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
    hasPtBrAudio: true,
    hasPtBrSubs: true,
    hasPkgFormat: true,
    hasPcTorrent: true,
    titleId: 'CUSA-03173',
    sourceOrigin: 'TheZukoStore',
    originalTrackerUrl: 'https://thezukostore.com',
    dlcIncluded: ['The Old Hunters DLC Expansion', 'Top Hat Hunter Skin', '60 FPS Unlocked Patch v1.09'],
    languages: ['Português (Brasil) Dublado', 'Inglês', 'Japonês', 'Espanhol']
  },
  {
    id: 'cyberpunk-2077',
    title: 'Cyberpunk 2077: Phantom Liberty',
    slug: 'cyberpunk-2077-phantom-liberty',
    coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80',
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
        id: 'dl-cp-1',
        type: 'magnet',
        format: 'torrent',
        platform: 'PC',
        label: 'Torrent Magnet PC (Alta Velocidade FitGirl)',
        url: 'magnet:?xt=urn:btih:3fa9128456123984712093847102938471029384&dn=Cyberpunk.2077.v2.13-Phantom.Liberty-FitGirl&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce',
        seeders: 3450,
        leechers: 420,
        size: '56.4 GB',
        isPtBrAudio: true,
        isPtBrSubs: true
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
        id: 'dl-cp-2',
        type: 'torrent',
        format: 'torrent',
        platform: 'PC',
        label: 'Arquivo .torrent Direto (Tapochek Tracker)',
        url: 'https://tapochek.net',
        seeders: 2890,
        leechers: 310,
        size: '56.4 GB',
        hostName: 'Tapochek.net'
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
    rating: 4.9,
    totalVotes: 1420,
    screenshots: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
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
    languages: ['Português (Brasil) Dublado', 'Inglês', 'Espanhol', 'Francês', 'Alemão', 'Japonês']
  },
  {
    id: 'elden-ring',
    title: 'Elden Ring: Shadow of the Erdtree',
    slug: 'elden-ring-shadow-of-the-erdtree',
    coverUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
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
    rating: 5.0,
    totalVotes: 2180,
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
    coverUrl: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1600&q=80',
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
    rating: 4.8,
    totalVotes: 1950,
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
    coverUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
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
        id: 'dl-bg3-1',
        type: 'magnet',
        label: 'Torrent Magnet Oficial FitGirl',
        url: 'magnet:?xt=urn:btih:1182749102938471029384710293847102938471&dn=Baldurs.Gate.3.Patch.7-FitGirl&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce',
        seeders: 2980,
        leechers: 310,
        size: '95.2 GB'
      },
      {
        id: 'dl-bg3-2',
        type: 'torrent',
        label: 'Baixar .torrent Rápido',
        url: '#torrent-download',
        seeders: 2400,
        leechers: 210,
        size: '95.2 GB'
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
    rating: 5.0,
    totalVotes: 3200,
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
    coverUrl: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
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
        type: 'torrent',
        format: 'torrent',
        platform: 'PC',
        label: 'Download .torrent Direto (Tapochek Tracker)',
        url: 'https://tapochek.net',
        seeders: 3100,
        leechers: 420,
        size: '102.5 GB',
        hostName: 'Tapochek.net'
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
    rating: 4.9,
    totalVotes: 1820,
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
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
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
        id: 'dl-rdr2-1',
        type: 'magnet',
        label: 'Torrent Magnet FitGirl (Mais de 5.000 Seeds)',
        url: 'magnet:?xt=urn:btih:3399120938471029384710293847102938471029&dn=Red.Dead.Redemption.2.Ultimate-FitGirl&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce',
        seeders: 5890,
        leechers: 810,
        size: '66.3 GB'
      },
      {
        id: 'dl-rdr2-2',
        type: 'direct',
        label: 'Links Rápidos Google Drive & Qiwi',
        url: 'https://drive.google.com',
        size: '66.3 GB',
        hostName: 'Google Drive'
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
    rating: 5.0,
    totalVotes: 4890,
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
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80',
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
    rating: 4.9,
    totalVotes: 1640,
    screenshots: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80'
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
    coverUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80',
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
    rating: 4.8,
    totalVotes: 1320,
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
    coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
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
        id: 'dl-hk-1',
        type: 'magnet',
        label: 'Torrent Magnet Super Rápido (1.2 GB)',
        url: 'magnet:?xt=urn:btih:1029384710293847102938471029384710293847&dn=Hollow.Knight.Voidheart-FitGirl&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce',
        seeders: 6400,
        leechers: 220,
        size: '1.2 GB'
      },
      {
        id: 'dl-hk-2',
        type: 'direct',
        label: 'Download Direto Mediafire / GDrive',
        url: 'https://mediafire.com',
        size: '1.2 GB',
        hostName: 'Mediafire'
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
    rating: 5.0,
    totalVotes: 3500,
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
