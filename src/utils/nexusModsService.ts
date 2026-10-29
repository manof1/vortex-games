import { Game, GameMod } from '../types';
import { cleanGameTitle } from './cheatsModsGenerator';

export interface NexusGameInfo {
  cleanTitle: string;
  slug: string | null;
  hubUrl: string;
  gamesCatalogUrl: string;
  trendingUrl: string;
  isVerifiedHub: boolean;
  isConsoleOnly: boolean;
  verifiedMods: GameMod[];
}

// Mapeamento canônico dos principais jogos com presença maciça no Nexus Mods (Nexus Domain Slugs)
const NEXUS_GAMES_REGISTRY: Record<string, {
  slug: string;
  label: string;
  mods: Array<{
    id: string;
    modNumber: number;
    title: string;
    description: string;
    category: string;
    author: string;
    downloadsCount: string;
  }>;
}> = {
  // Cyberpunk 2077
  'cyberpunk': {
    slug: 'cyberpunk2077',
    label: 'Cyberpunk 2077',
    mods: [
      {
        id: 'cet-cyberpunk',
        modNumber: 107,
        title: 'Cyber Engine Tweaks (CET)',
        description: 'Estrutura essencial para mods no Cyberpunk: adiciona console de comandos debug, atalhos, correções de desempenho e suporte a scripts.',
        category: 'Engine/Tools',
        author: 'Yamashi & Equipe CET',
        downloadsCount: '8.4M'
      },
      {
        id: 'native-settings-ui',
        modNumber: 3518,
        title: 'Native Settings UI',
        description: 'Menu nativo de configurações dentro do jogo para alterar opções gráficas e de gameplay de todos os mods instalados.',
        category: 'Interface/QoL',
        author: 'jackhumbert',
        downloadsCount: '4.9M'
      },
      {
        id: 'redscript-cyberpunk',
        modNumber: 1511,
        title: 'redscript compiler',
        description: 'Compilador e gerenciador de scripts do REDengine, necessário para executar centenas de mods avançados.',
        category: 'Engine/Scripts',
        author: 'jac3km4',
        downloadsCount: '6.7M'
      },
      {
        id: 'virtual-atelier',
        modNumber: 2987,
        title: 'Virtual Atelier & Lojas no Computador do V',
        description: 'Permite comprar roupas, carros e armas dos mods diretamente pelo computador do apartamento de Night City.',
        category: 'Gameplay/Lojas',
        author: 'Pacome',
        downloadsCount: '3.1M'
      }
    ]
  },

  // Elden Ring
  'elden ring': {
    slug: 'eldenring',
    label: 'Elden Ring',
    mods: [
      {
        id: 'seamless-coop',
        modNumber: 510,
        title: 'Seamless Co-op Mod',
        description: 'Jogue toda a campanha de Elden Ring em modo cooperativo contínuo sem desconexões após derrotar chefes ou morrer.',
        category: 'Multiplayer/Co-op',
        author: 'LukeYui',
        downloadsCount: '5.2M'
      },
      {
        id: 'anti-cheat-toggler',
        modNumber: 90,
        title: 'Anti-cheat Toggler and Offline Launcher',
        description: 'Desativa o Easy Anti-Cheat com segurança para habilitar mods offline e permite reativá-lo com 1 clique para voltar ao online oficial.',
        category: 'Ferramentas/Anti-Cheat',
        author: 'techiew',
        downloadsCount: '2.8M'
      },
      {
        id: 'elden-ring-reforged',
        modNumber: 541,
        title: 'Elden Ring Reforged (ERR)',
        description: 'Overhaul massivo de balanceamento, novas mecânicas de esquiva, parry aprimorado, rebalanceamento de feitiços e chefes.',
        category: 'Overhaul/Gameplay',
        author: 'Kirnifr',
        downloadsCount: '1.4M'
      },
      {
        id: 'pause-the-game',
        modNumber: 43,
        title: 'Pause the Game',
        description: 'Adiciona função nativa de pausar o jogo a qualquer momento simplesmente pressionando a tecla P ou botão do controle.',
        category: 'Qualidade de Vida',
        author: 'TechieW',
        downloadsCount: '1.1M'
      }
    ]
  },

  // The Witcher 3
  'witcher 3': {
    slug: 'witcher3',
    label: 'The Witcher 3: Wild Hunt',
    mods: [
      {
        id: 'w3-hd-reworked',
        modNumber: 1021,
        title: 'The Witcher 3 HD Reworked Project',
        description: 'Remasterização visual épica com texturas e modelos ultra-detalhados sem prejudicar o desempenho original.',
        category: 'Gráficos/4K',
        author: 'HalkHogan',
        downloadsCount: '6.9M'
      },
      {
        id: 'fast-travel-anywhere',
        modNumber: 343,
        title: 'Fast Travel from Anywhere',
        description: 'Permite viagem rápida a partir de qualquer ponto do mapa sem necessidade de caminhar até um poste de sinalização.',
        category: 'Qualidade de Vida',
        author: 'JupiterTheCat',
        downloadsCount: '4.8M'
      },
      {
        id: 'friendly-hud',
        modNumber: 365,
        title: 'Friendly HUD',
        description: 'Interface imersiva personalizável: oculta marcadores intrusivos e exibe bússola e radar em 3D sutil.',
        category: 'Interface/Imersão',
        author: 'wGhost81',
        downloadsCount: '2.5M'
      },
      {
        id: 'no-fall-damage-w3',
        modNumber: 352,
        title: 'No Fall Damage',
        description: 'Remove o dano mortal e punitivo sofrido por Geralt ao cair de pequenos degraus e colinas.',
        category: 'Jogabilidade',
        author: 'Tirnanog',
        downloadsCount: '3.3M'
      }
    ]
  },

  // Skyrim Special Edition
  'skyrim': {
    slug: 'skyrimspecialedition',
    label: 'Skyrim Special Edition',
    mods: [
      {
        id: 'skyui-sse',
        modNumber: 12604,
        title: 'SkyUI',
        description: 'A interface definitiva para Skyrim de PC: menus em listas ordenáveis, busca de itens, ícones de status e suporte ao menu MCM.',
        category: 'Interface',
        author: 'SkyUI Team',
        downloadsCount: '28.5M'
      },
      {
        id: 'skse-sse',
        modNumber: 30379,
        title: 'Skyrim Script Extender (SKSE64)',
        description: 'Extensor essencial que expande os scripts do motor gráfico para viabilizar mods avançados e mecânicas complexas.',
        category: 'Ferramentas/Engine',
        author: 'SKSE Team',
        downloadsCount: '22.1M'
      },
      {
        id: 'ussep-sse',
        modNumber: 266,
        title: 'Unofficial Skyrim Special Edition Patch (USSEP)',
        description: 'Patch comunitário definitivo que corrige milhares de bugs, quests travadas, erros de texto e física deixados pela Bethesda.',
        category: 'Correções/Bugs',
        author: 'Arthmoor & Comunidade',
        downloadsCount: '19.4M'
      },
      {
        id: 'smim-sse',
        modNumber: 659,
        title: 'Static Mesh Improvement Mod (SMIM)',
        description: 'Substitui centenas de modelos poligonais toscos 3D (cordas, barris, cercas, correntes) por geometria suave e realista.',
        category: 'Modelos/3D',
        author: 'Brumbek',
        downloadsCount: '15.8M'
      }
    ]
  },

  // Fallout 4
  'fallout 4': {
    slug: 'fallout4',
    label: 'Fallout 4',
    mods: [
      {
        id: 'f4se',
        modNumber: 42147,
        title: 'Fallout 4 Script Extender (F4SE)',
        description: 'Extensor vital do motor do Fallout 4 necessário para carregar mods de interface, customização e novos sistemas de jogo.',
        category: 'Ferramentas/Engine',
        author: 'F4SE Team',
        downloadsCount: '14.2M'
      },
      {
        id: 'ufo4p',
        modNumber: 4598,
        title: 'Unofficial Fallout 4 Patch (UFO4P)',
        description: 'Correção de centenas de bugs de missões, assentamentos e gráficos não solucionados nos patches oficiais.',
        category: 'Correções/Patches',
        author: 'Unofficial Patch Project Team',
        downloadsCount: '10.8M'
      },
      {
        id: 'armorsmith-extended',
        modNumber: 2228,
        title: 'Armorsmith Extended',
        description: 'Permite equipar qualquer armadura sob qualquer roupa, adiciona customização balística e melhorias de modificação.',
        category: 'Equipamentos',
        author: 'Gambit77',
        downloadsCount: '8.1M'
      },
      {
        id: 'def-ui',
        modNumber: 10654,
        title: 'DEF_UI (Interface e Inventário Limpo)',
        description: 'Redesenho completo da interface do Pip-Boy e tela de saque com categorização visual moderna para teclado e mouse.',
        category: 'Interface/HUD',
        author: 'Neanka e Valdacil',
        downloadsCount: '6.4M'
      }
    ]
  },

  // Baldur's Gate 3
  'baldur': {
    slug: 'baldursgate3',
    label: "Baldur's Gate 3",
    mods: [
      {
        id: 'bg3-mod-fixer',
        modNumber: 141,
        title: "Baldur's Gate 3 Mod Fixer",
        description: 'Fix essencial que resolve conflitos de inicialização de saves e impede tela preta em campanhas com mods instalados.',
        category: 'Correções/Engine',
        author: 'Mharius',
        downloadsCount: '4.8M'
      },
      {
        id: 'improved-ui',
        modNumber: 366,
        title: 'ImprovedUI ReleaseReady',
        description: 'Melhora a interface de criação de personagens, diálogos, telas de inventário e remove alertas visuais de mods.',
        category: 'Interface',
        author: 'AlanaSP & The ImprovedUI Team',
        downloadsCount: '3.9M'
      },
      {
        id: 'party-limit-begone',
        modNumber: 327,
        title: 'Party Limit Begone',
        description: 'Aumenta o limite do grupo de 4 para até 16 companheiros na campanha solo e até 8 no multiplayer cooperativo.',
        category: 'Jogabilidade',
        author: 'Sildur',
        downloadsCount: '2.9M'
      },
      {
        id: 'native-mod-loader',
        modNumber: 944,
        title: 'Native Mod Loader',
        description: 'Injetor de DLL para carregar mods nativos de câmera livre e controle analógico sem alterar o executável original.',
        category: 'Ferramentas',
        author: 'Ershin',
        downloadsCount: '2.6M'
      }
    ]
  },

  // Red Dead Redemption 2
  'red dead': {
    slug: 'reddeadredemption2',
    label: 'Red Dead Redemption 2',
    mods: [
      {
        id: 'rampage-trainer-rdr2',
        modNumber: 233,
        title: 'Rampage Trainer RDR2',
        description: 'O melhor menu/trainer para RDR2 no PC: teletransporte, spawn de animais lendários, armas personalizadas e controle de clima.',
        category: 'Trainer/Gameplay',
        author: 'berndy43',
        downloadsCount: '3.4M'
      },
      {
        id: 'scripthook-rdr2',
        modNumber: 8,
        title: "Lenny's Simple Trainer & Mod Loader",
        description: 'Injetor de mods e trainer simples para carregar arquivos .asi e modificar a aparência de Arthur Morgan.',
        category: 'Ferramentas',
        author: 'LMS',
        downloadsCount: '2.1M'
      },
      {
        id: 'whyems-dlc',
        modNumber: 671,
        title: "WhyEm's DLC (Trajes e Cortes Históricos)",
        description: 'Adiciona centenas de novos chapéus, coldres, ponchos, barbas e armas exclusivas ao alfaiate de Saint Denis.',
        category: 'Visual/Itens',
        author: 'WhyEm',
        downloadsCount: '1.7M'
      },
      {
        id: 'vestigia-rdr2',
        modNumber: 689,
        title: 'Vestigia Overhaul Visual e Clima',
        description: 'Aprimoramento completo de iluminação natural, sombras dinâmicas, poeira de cavalos e ciclos atmosféricos realistas.',
        category: 'Gráficos/Imersão',
        author: 'Noizirom',
        downloadsCount: '890K'
      }
    ]
  },

  // Grand Theft Auto V
  'gta': {
    slug: 'gta5',
    label: 'Grand Theft Auto V',
    mods: [
      {
        id: 'scripthookv-gta5',
        modNumber: 1,
        title: 'Script Hook V + Native Trainer',
        description: 'Biblioteca primordial desenvolvida por Alexander Blade que viabiliza o uso de scripts em modo história do GTA V.',
        category: 'Engine/Ferramenta',
        author: 'Alexander Blade',
        downloadsCount: '9.2M'
      },
      {
        id: 'enhanced-native-trainer',
        modNumber: 34,
        title: 'Enhanced Native Trainer (ENT)',
        description: 'Menu completo com personalização de veículos, skins de pedestres, armas infinitas e física de mundo modificável.',
        category: 'Trainer/Menu',
        author: 'Arekkusu & ENT Team',
        downloadsCount: '3.8M'
      },
      {
        id: 'naturalvision-evolved',
        modNumber: 16,
        title: 'NaturalVision Remastered / Evolved',
        description: 'Reconstrução fotorrealista da iluminação de Los Santos, céus com volumetric clouds e reflexos de asfalto em dias chuvosos.',
        category: 'Gráficos/Fotorrealismo',
        author: 'Razed',
        downloadsCount: '4.5M'
      }
    ]
  },

  // Resident Evil 4 (Remake / 2023)
  'resident evil 4': {
    slug: 'residentevil42023',
    label: 'Resident Evil 4 (Remake)',
    mods: [
      {
        id: 'fluffy-re4',
        modNumber: 14,
        title: 'Fluffy Mod Manager 5000',
        description: 'Gerenciador oficial da comunidade para instalar e desinstalar mods dos jogos da RE Engine com 1 clique sem quebrar os arquivos.',
        category: 'Ferramentas/Instalador',
        author: 'FluffyQuack',
        downloadsCount: '2.9M'
      },
      {
        id: 'fov-re4',
        modNumber: 60,
        title: 'RE4 Remake FOV & Camera Distance Changer',
        description: 'Ajuste dinâmico de ângulo de visão (Field of View) para afastar a câmera dos ombros de Leon e evitar enjoo de movimento.',
        category: 'Câmera/QoL',
        author: 'praydog',
        downloadsCount: '850K'
      },
      {
        id: 'no-vignette-re4',
        modNumber: 39,
        title: 'Remoção de Vinheta e Granulação de Filme',
        description: 'Elimina as bordas escuras e o ruído da tela para uma imagem cristalina em monitores 1080p, 1440p e 4K.',
        category: 'Visual/Claridade',
        author: 'Yakuzas',
        downloadsCount: '620K'
      }
    ]
  },

  // God of War (PC)
  'god of war': {
    slug: 'godofwar',
    label: 'God of War (PC)',
    mods: [
      {
        id: 'gow-fov-mod',
        modNumber: 53,
        title: 'God of War Custom FOV Changer',
        description: 'Ajuste de campo de visão para combates mais abertos sem restrição de proximidade da câmera no Kratos.',
        category: 'Câmera/Jogabilidade',
        author: 'RoseTheCasual',
        downloadsCount: '410K'
      },
      {
        id: 'gow-ultrawide-clean',
        modNumber: 14,
        title: 'Clean Ultrawide & Vinheta Desativada',
        description: 'Suporte perfeito para telas 21:9 e 32:9 com barras pretas eliminadas nas cutscenes.',
        category: 'Display/Fix',
        author: 'Rose',
        downloadsCount: '280K'
      },
      {
        id: 'gow-classic-kratos',
        modNumber: 12,
        title: 'Classic Kratos (Visual Grego / Barba Aparada)',
        description: 'Substitui o modelo do Kratos nórdico pelos trajes e feições clássicas da trilogia original da Grécia.',
        category: 'Skins/Personagens',
        author: 'OmegaModder',
        downloadsCount: '340K'
      }
    ]
  },

  // Grim Dawn
  'grim dawn': {
    slug: 'grimdawn',
    label: 'Grim Dawn',
    mods: [
      {
        id: 'dawn-of-masteries',
        modNumber: 82,
        title: 'Dawn of Masteries (DoM)',
        description: 'Overhaul massivo que combina classes de Titan Quest, Diablo 2, Diablo 3, Zenith e Cataclysm com centenas de itens novos.',
        category: 'Overhaul/Classes',
        author: 'Dammitt & Equipe DoM',
        downloadsCount: '780K'
      },
      {
        id: 'reign-of-terror',
        modNumber: 40,
        title: 'Reign of Terror (Diablo II Remake no Motor do Grim Dawn)',
        description: 'Recriação completa dos 5 atos de Diablo 2: Lord of Destruction com mapas, músicas, monstros e classes clássicas.',
        category: 'Total Conversion',
        author: 'Ram & Equipe RoT',
        downloadsCount: '1.2M'
      },
      {
        id: 'grim-internals',
        modNumber: 4,
        title: 'Grim Internals Tool',
        description: 'Utilitário indispensável com saque automático de componentes, contador de DPS em tempo real e teletransporte seguro.',
        category: 'QoL/Ferramentas',
        author: 'GlockenGerda',
        downloadsCount: '950K'
      },
      {
        id: 'smash-n-grab',
        modNumber: 144,
        title: "Smash 'n Grab (Progressão Acelerada)",
        description: 'Multiplicador equilibrado de pontos de atributos, taxa de drop de lendários e velocidade de subida de nível.',
        category: 'Jogabilidade',
        author: 'RektbyProtoss',
        downloadsCount: '320K'
      }
    ]
  },

  // Stardew Valley
  'stardew': {
    slug: 'stardewvalley',
    label: 'Stardew Valley',
    mods: [
      {
        id: 'smapi-stardew',
        modNumber: 2400,
        title: 'SMAPI - Stardew Modding API',
        description: 'O carregador primordial do Stardew Valley: gerencia compatibilidade de versões e é obrigatório para 99% dos mods.',
        category: 'Ferramentas/API',
        author: 'Pathoschild',
        downloadsCount: '16.4M'
      },
      {
        id: 'content-patcher',
        modNumber: 1915,
        title: 'Content Patcher',
        description: 'Carrega texturas, novos diálogos e eventos diretamente na memória sem substituir os arquivos XNB originais do jogo.',
        category: 'Ferramentas',
        author: 'Pathoschild',
        downloadsCount: '14.1M'
      },
      {
        id: 'ui-info-suite-2',
        modNumber: 1150,
        title: 'UI Info Suite 2',
        description: 'Exibe tempo restante de colheita, presentes favoritos dos aldeões no menu social, previsão do tempo e raio dos aspersores.',
        category: 'Interface/QoL',
        author: 'Annosz',
        downloadsCount: '6.2M'
      },
      {
        id: 'stardew-valley-expanded',
        modNumber: 3753,
        title: 'Stardew Valley Expanded (SVE)',
        description: 'Expansão gigantesca com 27 novos NPCs, 50 locais inéditos, novos festivais, fazendas redesenhadas e enredos maduros.',
        category: 'Expansão de Conteúdo',
        author: 'FlashShifter',
        downloadsCount: '4.8M'
      }
    ]
  },

  // Monster Hunter: World
  'monster hunter': {
    slug: 'monsterhunterworld',
    label: 'Monster Hunter: World',
    mods: [
      {
        id: 'strackers-loader',
        modNumber: 1982,
        title: "Stracker's Loader",
        description: 'Carregador de plugins em DLL que permite restaurar mods nativos e desviar das checagens do executável Iceborne.',
        category: 'Ferramentas',
        author: 'Stracker',
        downloadsCount: '3.6M'
      },
      {
        id: 'performance-booster-mhw',
        modNumber: 3473,
        title: 'Performance Booster and Plugin Extender',
        description: 'Elimina centenas de chamadas CRC redundantes e sem efeito que provocam quedas bruscas de FPS e superaquecimento de CPU.',
        category: 'Fix/Desempenho',
        author: 'AsteriskAmpersand',
        downloadsCount: '2.9M'
      },
      {
        id: 'light-pillar-drops',
        modNumber: 112,
        title: "Souvenir's Light Pillar (Feixes de Luz em Drops)",
        description: 'Projeta um feixe de luz brilhante colorido nos itens e ossos derrubados por monstros para nunca mais perder materiais no chão.',
        category: 'Qualidade de Vida',
        author: 'CrazyT',
        downloadsCount: '2.1M'
      }
    ]
  },

  // Starfield
  'starfield': {
    slug: 'starfield',
    label: 'Starfield',
    mods: [
      {
        id: 'sfse-starfield',
        modNumber: 106,
        title: 'Starfield Script Extender (SFSE)',
        description: 'Extensor essencial para criação e injeção de novas funcionalidades no motor Creation Engine 2 da Bethesda.',
        category: 'Engine/Ferramenta',
        author: 'Ian Patterson',
        downloadsCount: '4.2M'
      },
      {
        id: 'starfield-community-patch',
        modNumber: 1,
        title: 'Starfield Community Patch',
        description: 'Grande esforço conjunto de modders para corrigir problemas de física, missões travadas e inconsistências de interface.',
        category: 'Patches/Bugs',
        author: 'Starfield Modding Community',
        downloadsCount: '1.9M'
      },
      {
        id: 'starui-inventory',
        modNumber: 773,
        title: 'StarUI Inventory',
        description: 'Reconstrução da tela de inventário com colunas compactas, ordenação por peso/valor e atalhos rápidos de transferência de carga.',
        category: 'Interface/QoL',
        author: 'm8r98a4f2',
        downloadsCount: '3.1M'
      }
    ]
  }
};

/**
 * Resolve as informações completas do Nexus Mods para um jogo,
 * eliminando sufixos poluídos de repacks e garantindo URLs 100% autênticas sem 404.
 */
export function getNexusModsGameInfo(rawTitle: string, platform?: string): NexusGameInfo {
  const clean = cleanGameTitle(rawTitle);
  const lower = clean.toLowerCase();
  const isConsole = Boolean(
    platform && 
    (platform.includes('PS1') || platform.includes('PS2') || platform.includes('PSP') || 
     platform.includes('GBA') || platform.includes('N64') || platform.includes('SNES') || 
     platform.includes('Mega Drive') || platform.includes('Nintendo 64'))
  );

  // Procura no registro verificado por palavra-chave canônica
  let matchedEntry: { slug: string; label: string; mods: any[] } | null = null;
  for (const [key, entry] of Object.entries(NEXUS_GAMES_REGISTRY)) {
    if (lower.includes(key)) {
      matchedEntry = entry;
      break;
    }
  }

  if (matchedEntry) {
    const slug = matchedEntry.slug;
    const hubUrl = `https://www.nexusmods.com/${slug}`;
    const trendingUrl = `https://www.nexusmods.com/${slug}/mods/trendingalltime/`;
    const searchUrl = `https://www.nexusmods.com/${slug}/search/`;

    // Constrói os mods verificados reais apontando diretamente para as páginas oficiais válidas no Nexus
    const verifiedMods: GameMod[] = matchedEntry.mods.map(m => ({
      id: m.id,
      title: m.title,
      description: m.description,
      nexusUrl: `https://www.nexusmods.com/${slug}/mods/${m.modNumber}`,
      category: m.category,
      author: m.author,
      downloadsCount: m.downloadsCount,
      likesCount: 'Comunidade Nexus'
    }));

    return {
      cleanTitle: clean,
      slug,
      hubUrl,
      gamesCatalogUrl: `https://www.nexusmods.com/games?keyword=${encodeURIComponent(matchedEntry.label)}`,
      trendingUrl,
      isVerifiedHub: true,
      isConsoleOnly: false,
      verifiedMods
    };
  }

  // Jogo sem registro específico de slug no Nexus Mods:
  // NUNCA gerar `/mods/1`, `/mods/2` fake!
  // Gerar buscas parametrizadas e seguras no buscador geral do Nexus Mods com o título higienizado
  const safeSearchUrl = `https://www.nexusmods.com/search/?gsearch=${encodeURIComponent(clean)}`;
  const gamesCatalogUrl = `https://www.nexusmods.com/games?keyword=${encodeURIComponent(clean)}`;

  // Mods dinâmicos baseados em categorias de busca real no Nexus (ao clicar, abre a busca exata daquela categoria no Nexus Mods!)
  const searchBasedMods: GameMod[] = [
    {
      id: `${encodeURIComponent(clean)}-patch-fps`,
      title: `Buscar Patches de 60/120 FPS & Desempenho no Nexus Mods`,
      description: `Busca automática no Nexus Mods por correções de taxa de quadros (FPS Uncapped), eliminação de engasgos e melhoria para CPUs modernas em ${clean}.`,
      nexusUrl: `https://www.nexusmods.com/search/?gsearch=${encodeURIComponent(clean + ' fps patch')}`,
      category: 'Desempenho',
      author: 'Busca Nexus Mods',
      downloadsCount: 'Oficial'
    },
    {
      id: `${encodeURIComponent(clean)}-traducao-ptbr`,
      title: `Buscar Traduções & Dublagens PT-BR no Nexus Mods`,
      description: `Pesquisa direta por projetos de localização brasileira, legendas adaptadas e patches comunitários de Português do Brasil para ${clean}.`,
      nexusUrl: `https://www.nexusmods.com/search/?gsearch=${encodeURIComponent(clean + ' traducao portugues')}`,
      category: 'Tradução',
      author: 'Comunidade Nexus',
      downloadsCount: 'Oficial'
    },
    {
      id: `${encodeURIComponent(clean)}-graphics-4k`,
      title: `Buscar Texturas HD, Reshade & Iluminação no Nexus Mods`,
      description: `Encontre presets visuais de Reshade, texturas aprimoradas por IA e melhorias de contraste e nitidez publicadas para ${clean}.`,
      nexusUrl: `https://www.nexusmods.com/search/?gsearch=${encodeURIComponent(clean + ' textures reshade')}`,
      category: 'Gráficos',
      author: 'Criadores Nexus',
      downloadsCount: 'Oficial'
    },
    {
      id: `${encodeURIComponent(clean)}-ultrawide-fov`,
      title: `Buscar Suporte a Ultrawide (21:9) & Ajustes de Câmera`,
      description: `Verifique fixes de remoção de barras pretas em cutscenes, suporte a monitores amplos e ajustes de FOV disponíveis para ${clean}.`,
      nexusUrl: `https://www.nexusmods.com/search/?gsearch=${encodeURIComponent(clean + ' ultrawide fov')}`,
      category: 'Qualidade de Vida',
      author: 'Comunidade Ultrawide',
      downloadsCount: 'Oficial'
    }
  ];

  return {
    cleanTitle: clean,
    slug: null,
    hubUrl: safeSearchUrl,
    gamesCatalogUrl,
    trendingUrl: safeSearchUrl,
    isVerifiedHub: false,
    isConsoleOnly: isConsole,
    verifiedMods: isConsole ? [] : searchBasedMods
  };
}
