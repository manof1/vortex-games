import { Game } from '../types';

export const ZUKO_TAPOCHEK_PRESETS: Game[] = [
  {
    id: 'tlou-part-1-deluxe',
    title: 'The Last of Us Part I: Digital Deluxe',
    slug: 'the-last-of-us-part-1-deluxe-pkg-cusa',
    coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80',
    shortDescription: 'Reviva a inesquecível jornada de Joel e Ellie. Versão com dados originais TheZukoStore (PKG) e Torrent PC (Tapochek.net) com dublagem consagrada em PT-BR.',
    description: 'Em uma civilização devastada onde infectados e sobreviventes implacáveis estão à solta, o protagonista cansado da vida Joel é contratado para tirar uma garota de 14 anos, Ellie, de uma zona de quarentena militar. No entanto, o que começa como um pequeno trabalho logo se transforma em uma jornada brutal pelos EUA.',
    genres: ['Ação', 'Aventura', 'Sobrevivência', 'Pós-Apocalíptico', 'História Rica'],
    categories: ['AAA', 'Mais Populares', 'Lançamentos'],
    releaseYear: 2023,
    releaseDate: '28/03/2023',
    developer: 'Naughty Dog LLC',
    publisher: 'PlayStation Publishing LLC',
    repackInfo: {
      repacker: 'TheZukoStore & Tapochek Tracker',
      version: 'v1.1.3 + Left Behind DLC + Modo Speedrun',
      repackSize: '68.5 GB',
      originalSize: '79.0 GB',
      crackStatus: 'DRM Free',
      crackGroup: 'CUSA PlayStation Scene'
    },
    downloadLinks: [
      {
        id: 'dl-tlou-torrent',
        type: 'magnet',
        format: 'torrent',
        platform: 'PC',
        label: 'Torrent PC Original (Magnet Tracker Tapochek.net)',
        url: 'magnet:?xt=urn:btih:6182910293847102938471029384710293847102&dn=The.Last.Of.Us.Part.I.v1.1.3-Tapochek&tr=udp%3A%2F%2Ftracker.tapochek.net%3A2710%2Fannounce',
        seeders: 6420,
        leechers: 850,
        size: '68.5 GB',
        isPtBrAudio: true,
        isPtBrSubs: true,
        hostName: 'Tapochek.net'
      },
      {
        id: 'dl-tlou-pkg',
        type: 'pkg',
        format: 'pkg',
        platform: 'PS4',
        label: 'Arquivo PKG Console (TheZukoStore Oficial CUSA-30477)',
        url: 'https://thezukostore.com',
        size: '64.2 GB',
        titleId: 'CUSA-30477',
        firmware: 'FW 5.05 - 11.00 (Backport Testado)',
        isPtBrAudio: true,
        isPtBrSubs: true,
        hostName: 'TheZukoStore'
      },
      {
        id: 'dl-tlou-patch-ptbr',
        type: 'pt_br_patch',
        format: 'pt_br_patch',
        platform: 'PC',
        label: 'Pacote Oficial de Dublagem PT-BR (Áudio Brasileiro Naughty Dog)',
        url: 'https://thezukostore.com',
        size: '3.4 GB',
        isPtBrAudio: true,
        isPtBrSubs: true,
        hostName: 'ZukoStore Dublagens'
      }
    ],
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit (v1909+)',
        processor: 'AMD Ryzen 5 1500X ou Intel Core i7-4770K',
        memory: '16 GB RAM',
        graphics: 'AMD Radeon RX 470 (4 GB) ou NVIDIA GeForce GTX 970 (4 GB)',
        storage: '100 GB SSD obrigatório',
        directx: 'Versão 12'
      },
      recommended: {
        os: 'Windows 10/11 64-bit',
        processor: 'AMD Ryzen 5 3600X ou Intel Core i7-8700',
        memory: '16 GB RAM',
        graphics: 'AMD Radeon RX 6600 XT (8 GB) ou NVIDIA GeForce RTX 2070 Super',
        storage: '100 GB NVMe SSD',
        directx: 'Versão 12'
      }
    },
    rating: 0,
    totalVotes: 0,
    screenshots: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80'
    ],
    trailerYoutubeId: 'WxjeV4QV4eo',
    tags: ['The Last of Us', 'CUSA-30477', 'TheZukoStore', 'Tapochek', 'Dublado PT-BR', 'PKG', 'Naughty Dog'],
    downloadsCount: 165000,
    viewsCount: 520000,
    createdAt: '2024-02-15T12:00:00Z',
    isFeatured: true,
    isTrending: true,
    hasPtBrAudio: true,
    hasPtBrSubs: true,
    hasPkgFormat: true,
    hasPcTorrent: true,
    titleId: 'CUSA-30477',
    sourceOrigin: 'TheZukoStore',
    originalTrackerUrl: 'https://thezukostore.com',
    dlcIncluded: ['Left Behind Prequel Chapter', 'D-Shot Pistol Skin', 'Modo Speedrun Desbloqueado', 'Filtros Gráficos Pontilhados'],
    languages: ['Português (Brasil) Dublagem Oficial', 'Inglês', 'Espanhol', 'Francês']
  },
  {
    id: 'ghost-of-tsushima-directors-cut',
    title: 'Ghost of Tsushima: Director\'s Cut',
    slug: 'ghost-of-tsushima-directors-cut-pkg-cusa24104',
    coverUrl: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1600&q=80',
    shortDescription: 'Forje um novo caminho e trave uma guerra não convencional pela liberdade de Tsushima. Inclui expansão Ilha Iki e Dublagem PT-BR.',
    description: 'No final do século XIII, o império mongol devastou nações inteiras durante sua campanha para conquistar o Oriente. A ilha de Tsushima é tudo o que resta entre o Japão continental e uma frota colossal de invasão mongol. Jin Sakai deve deixar de lado as tradições dos samurais para se tornar o Fantasma.',
    genres: ['Mundo Aberto', 'Ação', 'Aventura', 'Samurai', 'Histórico'],
    categories: ['AAA', 'Mais Populares', 'Lançamentos'],
    releaseYear: 2024,
    releaseDate: '16/05/2024',
    developer: 'Sucker Punch Productions / Nixxes Software',
    publisher: 'PlayStation Publishing LLC',
    repackInfo: {
      repacker: 'TheZukoStore / Tapochek Team',
      version: 'v1053.4.0520.1917 + Iki Island + Legends Co-op',
      repackSize: '52.3 GB',
      originalSize: '75.0 GB',
      crackStatus: 'Crackeado',
      crackGroup: 'RUNE / CUSA Scene'
    },
    downloadLinks: [
      {
        id: 'dl-got-torrent',
        type: 'magnet',
        format: 'torrent',
        platform: 'PC',
        label: 'Torrent Magnet PC (Tapochek Tracker de Alta Velocidade)',
        url: 'magnet:?xt=urn:btih:7291048102938471029384710293847102938471&dn=Ghost.Of.Tsushima.Directors.Cut-Tapochek&tr=udp%3A%2F%2Ftracker.tapochek.net%3A2710%2Fannounce',
        seeders: 5890,
        leechers: 710,
        size: '52.3 GB',
        isPtBrAudio: true,
        isPtBrSubs: true,
        hostName: 'Tapochek.net'
      },
      {
        id: 'dl-got-pkg',
        type: 'pkg',
        format: 'pkg',
        platform: 'PS4',
        label: 'Download PKG Console (TheZukoStore CUSA-24104 Completo)',
        url: 'https://thezukostore.com',
        size: '54.1 GB',
        titleId: 'CUSA-24104',
        firmware: 'FW 5.05 - 11.00',
        isPtBrAudio: true,
        isPtBrSubs: true,
        hostName: 'TheZukoStore'
      },
      {
        id: 'dl-got-patch-ptbr',
        type: 'pt_br_patch',
        format: 'pt_br_patch',
        platform: 'PC',
        label: 'Dublagem e Menus PT-BR (Instalação 1-Clique)',
        url: 'https://thezukostore.com',
        size: '2.8 GB',
        isPtBrAudio: true,
        isPtBrSubs: true,
        hostName: 'ZukoStore Dublagens'
      }
    ],
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit',
        processor: 'Intel Core i3-7100 ou AMD Ryzen 3 1200',
        memory: '8 GB RAM',
        graphics: 'NVIDIA GeForce GTX 960 (4 GB) ou AMD Radeon RX 5500 XT',
        storage: '75 GB espaço disponível (SSD recomendado)',
        directx: 'Versão 12'
      },
      recommended: {
        os: 'Windows 10/11 64-bit',
        processor: 'Intel Core i5-8600 ou AMD Ryzen 5 3600',
        memory: '16 GB RAM',
        graphics: 'NVIDIA GeForce RTX 2060 ou AMD Radeon RX 5600 XT',
        storage: '75 GB SSD',
        directx: 'Versão 12'
      }
    },
    rating: 0,
    totalVotes: 0,
    screenshots: [
      'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80'
    ],
    trailerYoutubeId: 'b73wU7T6q4U',
    tags: ['Ghost of Tsushima', 'CUSA-24104', 'TheZukoStore', 'Tapochek', 'Dublado PT-BR', 'PKG', 'Samurai'],
    downloadsCount: 92300,
    viewsCount: 295000,
    createdAt: '2024-05-18T14:00:00Z',
    isFeatured: true,
    isTrending: true,
    hasPtBrAudio: true,
    hasPtBrSubs: true,
    hasPkgFormat: true,
    hasPcTorrent: true,
    titleId: 'CUSA-24104',
    sourceOrigin: 'TheZukoStore',
    originalTrackerUrl: 'https://thezukostore.com',
    dlcIncluded: ['Iki Island Expansion', 'Legends Online Multiplayer', 'Comentários do Diretor', 'Traje do Herói de Tsushima'],
    languages: ['Português (Brasil) Dublado', 'Japonês com Sincronia Labial', 'Inglês']
  },
  {
    id: 'uncharted-legacy-of-thieves',
    title: 'UNCHARTED: Coleção Legado dos Ladrões',
    slug: 'uncharted-legacy-of-thieves-pkg-cusa',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80',
    shortDescription: 'Viva as aventuras cinematográficas mais aclamadas do mundo com Nathan Drake e Chloe Frazer. Dublagem brasileira lendária.',
    description: 'Procure sua fortuna e deixe sua marca no mapa em UNCHARTED: Coleção Legado dos Ladrões. Descubra a emocionante narrativa cinematográfica e as maiores sequências de ação blockbuster da franquia Naughty Dog, incluindo UNCHARTED 4: A Thief\'s End e UNCHARTED: O Legado Perdido.',
    genres: ['Ação', 'Aventura', 'Exploração', 'Cinematográfico', 'Tiro em 3ª Pessoa'],
    categories: ['AAA', 'Mais Populares'],
    releaseYear: 2022,
    releaseDate: '19/10/2022',
    developer: 'Naughty Dog LLC / Iron Galaxy Studios',
    publisher: 'PlayStation Publishing LLC',
    repackInfo: {
      repacker: 'TheZukoStore / Tapochek Team',
      version: 'v1.4.20935 + Uncharted 4 + The Lost Legacy',
      repackSize: '67.0 GB',
      originalSize: '126.0 GB',
      crackStatus: 'DRM Free',
      crackGroup: 'FLT / CUSA Scene'
    },
    downloadLinks: [
      {
        id: 'dl-unc-torrent',
        type: 'magnet',
        format: 'torrent',
        platform: 'PC',
        label: 'Torrent PC Magnet Oficial (Tracker Tapochek.net)',
        url: 'magnet:?xt=urn:btih:9912048102938471029384710293847102938471&dn=Uncharted.Legacy.Of.Thieves.Collection-Tapochek&tr=udp%3A%2F%2Ftracker.tapochek.net%3A2710%2Fannounce',
        seeders: 4210,
        leechers: 490,
        size: '67.0 GB',
        isPtBrAudio: true,
        isPtBrSubs: true,
        hostName: 'Tapochek.net'
      },
      {
        id: 'dl-unc-pkg',
        type: 'pkg',
        format: 'pkg',
        platform: 'PS4',
        label: 'Download PKG Console (TheZukoStore CUSA-00341 + CUSA-07737)',
        url: 'https://thezukostore.com',
        size: '72.8 GB',
        titleId: 'CUSA-00341',
        firmware: 'FW 5.05 - 11.00',
        isPtBrAudio: true,
        isPtBrSubs: true,
        hostName: 'TheZukoStore'
      },
      {
        id: 'dl-unc-patch-ptbr',
        type: 'pt_br_patch',
        format: 'pt_br_patch',
        platform: 'PC',
        label: 'Pacote de Vozes PT-BR (Dublagem Oficial dos Atores Brasileiros)',
        url: 'https://thezukostore.com',
        size: '3.1 GB',
        isPtBrAudio: true,
        isPtBrSubs: true,
        hostName: 'ZukoStore Dublagens'
      }
    ],
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit',
        processor: 'Intel i5-4330 ou AMD Ryzen 3 1200',
        memory: '8 GB RAM',
        graphics: 'NVIDIA GTX 960 (4 GB) ou AMD R9 290X (4 GB)',
        storage: '126 GB HDD (SSD recomendado)',
        directx: 'Versão 12'
      },
      recommended: {
        os: 'Windows 10/11 64-bit',
        processor: 'Intel i7-4770 ou AMD Ryzen 5 1500X',
        memory: '16 GB RAM',
        graphics: 'NVIDIA GTX 1060 (6 GB) ou AMD RX 570 (4 GB)',
        storage: '126 GB SSD',
        directx: 'Versão 12'
      }
    },
    rating: 0,
    totalVotes: 0,
    screenshots: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80'
    ],
    trailerYoutubeId: 'dy5_f3vS_vM',
    tags: ['Uncharted', 'CUSA-00341', 'TheZukoStore', 'Tapochek', 'Dublado PT-BR', 'PKG', 'Naughty Dog'],
    downloadsCount: 71200,
    viewsCount: 220000,
    createdAt: '2023-11-10T10:00:00Z',
    isFeatured: false,
    isTrending: true,
    hasPtBrAudio: true,
    hasPtBrSubs: true,
    hasPkgFormat: true,
    hasPcTorrent: true,
    titleId: 'CUSA-00341',
    sourceOrigin: 'TheZukoStore',
    originalTrackerUrl: 'https://thezukostore.com',
    dlcIncluded: ['UNCHARTED 4: A Thief\'s End', 'UNCHARTED: The Lost Legacy', 'Artbook Digital'],
    languages: ['Português (Brasil) Dublagem Completa', 'Inglês', 'Espanhol', 'Italiano']
  },
  {
    id: 'horizon-forbidden-west-complete',
    title: 'Horizon Forbidden West: Complete Edition',
    slug: 'horizon-forbidden-west-pkg-cusa24705',
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1600&q=80',
    shortDescription: 'Explore terras distantes, enfrente máquinas maiores e mais imponentes e encontre novas tribos surpreendentes com Aloy.',
    description: 'Junte-se a Aloy enquanto ela desbrava o Oeste Proibido — uma fronteira majestosa, mas perigosa, que esconde novas ameaças misteriosas. A terra está morrendo, tempestades terríveis e uma praga incontrolável devastam o que sobrou da humanidade.',
    genres: ['Mundo Aberto', 'RPG', 'Ação', 'Ficção Científica', 'Pós-Apocalíptico'],
    categories: ['AAA', 'Mais Populares', 'Lançamentos'],
    releaseYear: 2024,
    releaseDate: '21/03/2024',
    developer: 'Guerrilla Games / Nixxes Software',
    publisher: 'PlayStation Publishing LLC',
    repackInfo: {
      repacker: 'TheZukoStore / Tapochek Team',
      version: 'v1.3.57.0 Complete Edition + Burning Shores',
      repackSize: '98.5 GB',
      originalSize: '150.0 GB',
      crackStatus: 'Crackeado',
      crackGroup: 'RUNE / CUSA Scene'
    },
    downloadLinks: [
      {
        id: 'dl-hfw-torrent',
        type: 'magnet',
        format: 'torrent',
        platform: 'PC',
        label: 'Torrent PC Magnet Completo (Tapochek.net Tracker)',
        url: 'magnet:?xt=urn:btih:3819204810293847102938471029384710293847&dn=Horizon.Forbidden.West.Complete.Edition-Tapochek&tr=udp%3A%2F%2Ftracker.tapochek.net%3A2710%2Fannounce',
        seeders: 4950,
        leechers: 620,
        size: '98.5 GB',
        isPtBrAudio: true,
        isPtBrSubs: true,
        hostName: 'Tapochek.net'
      },
      {
        id: 'dl-hfw-pkg',
        type: 'pkg',
        format: 'pkg',
        platform: 'PS4',
        label: 'Download Arquivo PKG Console (TheZukoStore CUSA-24705)',
        url: 'https://thezukostore.com',
        size: '89.4 GB',
        titleId: 'CUSA-24705',
        firmware: 'FW 9.00 - 11.00',
        isPtBrAudio: true,
        isPtBrSubs: true,
        hostName: 'TheZukoStore'
      },
      {
        id: 'dl-hfw-patch-ptbr',
        type: 'pt_br_patch',
        format: 'pt_br_patch',
        platform: 'PC',
        label: 'Dublagem Brasileira Aloy (Vozes e Textos PT-BR)',
        url: 'https://thezukostore.com',
        size: '3.8 GB',
        isPtBrAudio: true,
        isPtBrSubs: true,
        hostName: 'ZukoStore Dublagens'
      }
    ],
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit (v1909+)',
        processor: 'Intel Core i3-8100 ou AMD Ryzen 3 1300X',
        memory: '16 GB RAM',
        graphics: 'NVIDIA GeForce GTX 1650 4GB ou AMD Radeon RX 5500 XT 4GB',
        storage: '150 GB SSD obrigatório',
        directx: 'Versão 12'
      },
      recommended: {
        os: 'Windows 10/11 64-bit',
        processor: 'Intel Core i5-8600 ou AMD Ryzen 5 3600',
        memory: '16 GB RAM',
        graphics: 'NVIDIA GeForce RTX 3060 ou AMD Radeon RX 5700',
        storage: '150 GB NVMe SSD',
        directx: 'Versão 12'
      }
    },
    rating: 0,
    totalVotes: 0,
    screenshots: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80'
    ],
    trailerYoutubeId: 'Lq594XmpPBg',
    tags: ['Horizon', 'CUSA-24705', 'TheZukoStore', 'Tapochek', 'Dublado PT-BR', 'PKG', 'Guerrilla'],
    downloadsCount: 58900,
    viewsCount: 185000,
    createdAt: '2024-03-25T11:00:00Z',
    isFeatured: false,
    isTrending: true,
    hasPtBrAudio: true,
    hasPtBrSubs: true,
    hasPkgFormat: true,
    hasPcTorrent: true,
    titleId: 'CUSA-24705',
    sourceOrigin: 'TheZukoStore',
    originalTrackerUrl: 'https://thezukostore.com',
    dlcIncluded: ['Burning Shores Expansion', 'Blacktide Outfit and Bow', 'Nora Legacy Outfit and Spear', 'Digital Art Book'],
    languages: ['Português (Brasil) Dublagem Completa', 'Inglês', 'Espanhol', 'Francês']
  }
];
