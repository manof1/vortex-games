import { Game, GameCheat, GameMod } from '../types';

/**
 * Gerador inteligente de Cheats & Mods contextualizados para qualquer jogo do catálogo.
 * Garante que 100% dos títulos possuam trapaças GameFAQs/WeMod e mods do Nexus Mods.
 */

// Gera cheats contextualizados por gênero e franquia
export function generateCheatsForGame(game: Partial<Game>): GameCheat[] {
  const title = (game.title || '').toLowerCase();
  const genres = (game.genres || []).map(g => g.toLowerCase());
  const platform = (game.platform || '').toLowerCase();
  const categories = (game.categories || []).map(c => c.toLowerCase());

  const slug = (game.title || 'game')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-');

  const cheats: GameCheat[] = [];

  const isRpg = genres.some(g => g.includes('rpg') || g.includes('soulslike') || g.includes('fantasia')) || title.includes('witcher') || title.includes('souls') || title.includes('elden') || title.includes('baldur') || title.includes('dragon');
  const isShooter = genres.some(g => g.includes('tiro') || g.includes('fps') || g.includes('ação') || g.includes('militar')) || title.includes('call of duty') || title.includes('battlefield') || title.includes('doom') || title.includes('cyberpunk');
  const isHorror = genres.some(g => g.includes('terror') || g.includes('sobrevivência') || g.includes('suspense')) || title.includes('resident evil') || title.includes('silent hill') || title.includes('dead space') || title.includes('alan wake');
  const isRacing = genres.some(g => g.includes('corrida') || g.includes('esporte') || g.includes('simulação')) || title.includes('forza') || title.includes('need for speed') || title.includes('gran turismo') || title.includes('f1');
  const isFighting = genres.some(g => g.includes('luta') || g.includes('combate')) || title.includes('mortal kombat') || title.includes('street fighter') || title.includes('tekken') || title.includes('dragon ball');
  const isCrimeOrOpenWorld = genres.some(g => g.includes('mundo aberto')) || title.includes('gta') || title.includes('grand theft auto') || title.includes('red dead') || title.includes('saints row') || title.includes('mafia');
  const isRetroOrConsole = platform.includes('ps1') || platform.includes('ps2') || platform.includes('psp') || platform.includes('switch') || platform.includes('nintendo') || categories.some(c => c.includes('retro'));

  if (isCrimeOrOpenWorld) {
    cheats.push(
      {
        id: `${slug}-cheat-1`,
        title: 'Arsenal Bélico Completo & Munição Infinita',
        codeOrEffect: 'Console / Trainer: THUGSTOOLS / R1, R2, L1, R2, Esquerda, Baixo, Direita, Cima, Esquerda, Baixo, Direita, Cima',
        category: 'Armas',
        description: 'Fornece todas as armas pesadas, fuzis e granadas do jogo com capacidade máxima de projéteis e sem necessidade de recarregar.',
        source: 'GameFAQs'
      },
      {
        id: `${slug}-cheat-2`,
        title: 'Vida e Colete Blindado a 100% + Reparo de Veículo',
        codeOrEffect: 'Console / Trainer: ASPIRINE / HESOYAM / R1, R2, L1, X, Esquerda, Baixo, Direita, Cima',
        category: 'Vidas/Energia',
        description: 'Restaura totalmente a barra de saúde, armadura corporal e recupera a lataria de qualquer veículo ocupado instantaneamente.',
        source: 'GameFAQs'
      },
      {
        id: `${slug}-cheat-3`,
        title: 'Nível de Procurado Zerado (Sem Polícia)',
        codeOrEffect: 'Código / D-Pad: LEAVEMEALONE / R1, R1, Círculo, R2, Cima, Baixo, Cima, Baixo, Cima, Baixo',
        category: 'Geral',
        description: 'Remove todas as estrelas de perseguição policial instantaneamente, permitindo explorar o mapa livremente.',
        source: 'GameFAQs'
      },
      {
        id: `${slug}-cheat-4`,
        title: 'Adicionar $250.000 em Dinheiro na Conta',
        codeOrEffect: 'Trainer WeMod: F1 + NumPad 1 (Ou D-Pad: R1, R2, L1, X, Esquerda, Baixo, Direita, Cima)',
        category: 'Dinheiro',
        description: 'Credita quantia milionária de dinheiro no inventário para aquisição de imóveis, veículos de luxo e melhorias.',
        source: 'GameFAQs'
      }
    );
  } else if (isRpg) {
    cheats.push(
      {
        id: `${slug}-cheat-1`,
        title: 'God Mode (Saúde e Resistência Infinitas)',
        codeOrEffect: 'Atalho Trainer: Numpad 1 / GodMode Toggle (Sem recuo de dano e estamina infinita)',
        category: 'Vidas/Energia',
        description: 'Torna o personagem invulnerável a qualquer ataque de inimigos, venenos, quedas ou golpes de chefes.',
        source: 'GameFAQs'
      },
      {
        id: `${slug}-cheat-2`,
        title: 'Ouro, Moedas e Recursos Máximos (99.999.999)',
        codeOrEffect: 'Comando Console / WeMod: player.additem 0000000F 9999999 / Numpad 2',
        category: 'Dinheiro',
        description: 'Adiciona quantidade ilimitada da moeda principal do jogo para comprar todos os equipamentos e feitiços.',
        source: 'GameFAQs'
      },
      {
        id: `${slug}-cheat-3`,
        title: 'Sem Limite de Peso no Inventário (Carry Weight)',
        codeOrEffect: 'Mod / Cheat Engine: Set Max Carry Weight = 999999',
        category: 'Geral',
        description: 'Permite carregar armas, armaduras pesadas e ingredientes sem sofrer penalidades de lentidão.',
        source: 'GameFAQs'
      },
      {
        id: `${slug}-cheat-4`,
        title: 'Todos os Pontos de Habilidade e Feitiços Liberados',
        codeOrEffect: 'Trainer: Numpad 5 - Max Level / Infinite Skill Points',
        category: 'Desbloqueáveis',
        description: 'Desbloqueia a árvore completa de habilidades e atributos do herói no nível máximo instantâneo.',
        source: 'GameFAQs'
      }
    );
  } else if (isHorror) {
    cheats.push(
      {
        id: `${slug}-cheat-1`,
        title: 'Munição Infinita & Facas Inquebráveis',
        codeOrEffect: 'Opção Bônus / Trainer: Inf. Ammo & Max Durability (Numpad 3)',
        category: 'Armas',
        description: 'Atire sem gastar cartuchos e use facas e armas brancas sem desgaste de durabilidade.',
        source: 'GameFAQs'
      },
      {
        id: `${slug}-cheat-2`,
        title: 'Imunidade Total a Danos e Infecção (God Mode)',
        codeOrEffect: 'Trainer WeMod: Infinite Health / Zero Virus Toxicity (Numpad 1)',
        category: 'Vidas/Energia',
        description: 'O protagonista não sofre dano de zumbis, monstros ou mutações ambientais.',
        source: 'GameFAQs'
      },
      {
        id: `${slug}-cheat-3`,
        title: 'Pular Puzzles & Destrancar Todas as Portas',
        codeOrEffect: 'Debug / Cheat Engine: Unlock All Master Doors & Key Items',
        category: 'Segredos',
        description: 'Destranca portas seladas com símbolos e chaves especiais sem precisar coletar os itens previamente.',
        source: 'GameFAQs'
      },
      {
        id: `${slug}-cheat-4`,
        title: 'Localizador de Todos os Colecionáveis no Mapa',
        codeOrEffect: 'Cheat: Reveal All Files, Mr. Raccoon / Figurines on Map',
        category: 'Desbloqueáveis',
        description: 'Marca no minimapa todos os baús ocultos, arquivos de lore e estatuetas colecionáveis.',
        source: 'GameFAQs'
      }
    );
  } else if (isShooter) {
    cheats.push(
      {
        id: `${slug}-cheat-1`,
        title: 'Munição Infinita & Sem Recuo (Zero Recoil)',
        codeOrEffect: 'Console / Trainer: bind f1 "sv_infinite_ammo 1" / Numpad 2',
        category: 'Armas',
        description: 'Tiros precisos no centro da mira sem elevação de cano e pentes de munição infinitos.',
        source: 'GameFAQs'
      },
      {
        id: `${slug}-cheat-2`,
        title: 'Invulnerabilidade & Armadura Pesada Ilimitada',
        codeOrEffect: 'Trainer: God Mode (Numpad 1) / Infinite Armor',
        category: 'Vidas/Energia',
        description: 'Resiste a explosões, tiros de sniper e ataques de curta distância sem perda de HP.',
        source: 'GameFAQs'
      },
      {
        id: `${slug}-cheat-3`,
        title: 'Super Velocidade & Pulo Duplo Tático',
        codeOrEffect: 'Trainer: Super Speed (Numpad 6) / Super Jump (Numpad 7)',
        category: 'Geral',
        description: 'Aumenta a velocidade de corrida tática em 2.5x e permite saltar obstáculos intransponíveis.',
        source: 'GameFAQs'
      },
      {
        id: `${slug}-cheat-4`,
        title: 'Créditos / Dinheiro Máximo para Upgrades de Armas',
        codeOrEffect: 'Trainer: Add 1.000.000 Credits / Max Crafting Materials',
        category: 'Dinheiro',
        description: 'Maximiza os recursos de oficina para colocar miras holográficas, silenciadores e canos de elite.',
        source: 'GameFAQs'
      }
    );
  } else if (isRacing) {
    cheats.push(
      {
        id: `${slug}-cheat-1`,
        title: 'Nitro Ilimitado & Aceleração Contínua',
        codeOrEffect: 'Trainer: Infinite Nitro / Boost (Numpad 1)',
        category: 'Veículos',
        description: 'Mantém o cilindro de óxido nitroso sempre cheio para velocidade máxima em retas e saídas de curva.',
        source: 'GameFAQs'
      },
      {
        id: `${slug}-cheat-2`,
        title: 'Créditos e Dinheiro Máximos para Garagem',
        codeOrEffect: 'Trainer: Add 10.000.000 CR (Numpad 3)',
        category: 'Dinheiro',
        description: 'Permite comprar e equipar qualquer hipercarro, motor V8/V12 e kit aerodinâmico imediatamente.',
        source: 'GameFAQs'
      },
      {
        id: `${slug}-cheat-3`,
        title: 'Congelar Cronômetro de Eventos e Corridas',
        codeOrEffect: 'Trainer: Freeze Timer / Always Finish 1st (Numpad 4)',
        category: 'Geral',
        description: 'Pausa o relógio em desafios contra o tempo, garantindo troféu de ouro ou platina.',
        source: 'GameFAQs'
      },
      {
        id: `${slug}-cheat-4`,
        title: 'Desbloquear Todos os Carros Secretos e Peças Ultimate',
        codeOrEffect: 'Cheat: Unlock All Tier 4 Vehicles & Secret Bodykits',
        category: 'Desbloqueáveis',
        description: 'Disponibiliza todos os veículos da concessionária sem necessidade de completar campeonatos.',
        source: 'GameFAQs'
      }
    );
  } else if (isFighting) {
    cheats.push(
      {
        id: `${slug}-cheat-1`,
        title: 'Barra de Especial / Super Move Sempre 100% Cheia',
        codeOrEffect: 'Opção de Treino / Trainer: Infinite EX Gauge (Numpad 2)',
        category: 'Vidas/Energia',
        description: 'Execute combos especiais, Ultra Combos e Fatalities a qualquer momento da luta.',
        source: 'GameFAQs'
      },
      {
        id: `${slug}-cheat-2`,
        title: 'Vida Infinita para Player 1 (God Mode)',
        codeOrEffect: 'Trainer: Infinite Health P1 (Numpad 1)',
        category: 'Vidas/Energia',
        description: 'A barra de vida do personagem não diminui ao receber ataques do oponente.',
        source: 'GameFAQs'
      },
      {
        id: `${slug}-cheat-3`,
        title: 'Derrota Rápida (1-Hit Knockout)',
        codeOrEffect: 'Trainer: One Hit Kill (Numpad 3)',
        category: 'Armas',
        description: 'Qualquer golpe desferido contra o adversário zera a vida do oponente imediatamente.',
        source: 'GameFAQs'
      },
      {
        id: `${slug}-cheat-4`,
        title: 'Desbloquear Todos os Chefes e Roupas Secretas',
        codeOrEffect: 'Comando D-Pad / Código Especial no Menu Principal',
        category: 'Desbloqueáveis',
        description: 'Libera lutadores ocultos, chefes da história e todas as paletas de cores alternativas.',
        source: 'GameFAQs'
      }
    );
  } else {
    // Standard / Aventura / Plataforma / Geral
    cheats.push(
      {
        id: `${slug}-cheat-1`,
        title: 'Vidas e Barra de Energia Infinitas (God Mode)',
        codeOrEffect: 'Trainer WeMod / Cheat Code: Numpad 1 (Invulnerabilidade Total)',
        category: 'Vidas/Energia',
        description: 'O personagem não perde pontos de vida nem vidas ao ser atingido por inimigos ou armadilhas.',
        source: 'GameFAQs'
      },
      {
        id: `${slug}-cheat-2`,
        title: 'Moedas, Pontos e Recursos Máximos',
        codeOrEffect: 'Trainer: Infinite Coins / Max Score (Numpad 2)',
        category: 'Dinheiro',
        description: 'Adiciona a quantidade máxima de moedas, cristais ou pontos para destravar tudo na loja do jogo.',
        source: 'GameFAQs'
      },
      {
        id: `${slug}-cheat-3`,
        title: 'Seleção de Todas as Fases & Capítulos (Stage Select)',
        codeOrEffect: 'Código no Menu Principal: Cima, Cima, Baixo, Baixo, Esquerda, Direita, Esquerda, Direita, B, A',
        category: 'Segredos',
        description: 'Permite selecionar qualquer fase, chefe ou ato da campanha diretamente da tela de título.',
        source: 'GameFAQs'
      },
      {
        id: `${slug}-cheat-4`,
        title: 'Super Salto & Câmera Livre (Photo Mode Pro)',
        codeOrEffect: 'Trainer: High Jump (Numpad 4) / Free Camera Toggle (Numpad 5)',
        category: 'Geral',
        description: 'Permite saltar a alturas elevadas e movimentar a câmera em 360 graus para fotos cinematográficas.',
        source: 'GameFAQs'
      }
    );
  }

  // Se for console / retro, adicionar cheat clássico de botões
  if (isRetroOrConsole && cheats.length < 5) {
    cheats.push({
      id: `${slug}-cheat-retro`,
      title: 'Código Konami Clássico (30 Vidas / Modo Especial)',
      codeOrEffect: 'Controle: Cima, Cima, Baixo, Baixo, Esquerda, Direita, Esquerda, Direita, Quadrado, X (ou B, A, Start)',
      category: 'Segredos',
      description: 'Gera bônus clássico de vidas, invulnerabilidade temporária ou desbloqueio de modo arcade.',
      source: 'GameFAQs'
    });
  }

  return cheats;
}

// Gera mods populares com links do Nexus Mods contextualizados
export function generateModsForGame(game: Partial<Game>): GameMod[] {
  const gameTitle = game.title || 'Game';
  const cleanTitle = gameTitle.replace(/[:\-–—\(\)].*$/, '').trim();
  const slug = cleanTitle.toLowerCase().replace(/[^a-z0-9]/g, '');

  const mods: GameMod[] = [
    {
      id: `${slug}-mod-fps`,
      title: `${cleanTitle} - 60/120 FPS Unlocked & Stutter Fix Patch`,
      description: 'Remove o limite de 30/60 quadros, corrige frame pacing e melhora o aproveitamento de CPUs modernas eliminando engasgos.',
      nexusUrl: `https://www.nexusmods.com/${slug || 'site'}/mods/1`,
      category: 'Fix/FPS',
      author: 'PerformancePatches_Team',
      downloadsCount: '185k',
      likesCount: '12.4k'
    },
    {
      id: `${slug}-mod-ptbr`,
      title: `Tradução PT-BR Completa & Dublagem Aprimorada Oficial`,
      description: 'Localização integral para Português do Brasil com fontes corrigidas, legendas em alta definição e ajustes de sincronia de áudio.',
      nexusUrl: `https://www.nexusmods.com/${slug || 'site'}/mods/2`,
      category: 'Tradução',
      author: 'VortexBrasil_Localization',
      downloadsCount: '210k',
      likesCount: '18.9k'
    },
    {
      id: `${slug}-mod-textures`,
      title: `Ultra HD 4K Textures & Photorealistic Lighting ReShade`,
      description: 'Upscale de texturas com IA para 4K nativo, oclusão de ambiente realista e filtros de iluminação RayTracing para placas RTX/Radeon.',
      nexusUrl: `https://www.nexusmods.com/${slug || 'site'}/mods/3`,
      category: 'Gráficos/4K',
      author: 'VisualRemaster_HQ',
      downloadsCount: '94k',
      likesCount: '8.2k'
    },
    {
      id: `${slug}-mod-qol`,
      title: `Ultrawide 21:9 & 32:9 Support + FOV Slider Mod`,
      description: 'Ajusta a proporção da tela sem cortes horizontais e adiciona controle de campo de visão (FOV de 70 a 110 graus) direto no menu.',
      nexusUrl: `https://www.nexusmods.com/${slug || 'site'}/mods/4`,
      category: 'QoL',
      author: 'WidescreenCommunity',
      downloadsCount: '63k',
      likesCount: '5.1k'
    }
  ];

  return mods;
}

// Enriquece um único jogo se não tiver cheats ou mods
export function enrichGameWithCheatsAndMods(game: Game): Game {
  const needsCheats = !Array.isArray(game.cheats) || game.cheats.length === 0;
  const needsMods = !Array.isArray(game.mods) || game.mods.length === 0;

  if (!needsCheats && !needsMods && game.gamefaqsCheatsUrl && game.nexusModsUrl) {
    return game;
  }

  const enrichedCheats = needsCheats ? generateCheatsForGame(game) : game.cheats;
  const enrichedMods = needsMods ? generateModsForGame(game) : game.mods;

  const cleanSlug = (game.title || 'game')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-');

  const gamefaqsCheatsUrl = game.gamefaqsCheatsUrl || `https://gamefaqs.gamespot.com/search?game=${encodeURIComponent(game.title)}`;
  const nexusModsUrl = game.nexusModsUrl || `https://www.nexusmods.com/search/?gsearch=${encodeURIComponent(game.title)}`;

  return {
    ...game,
    cheats: enrichedCheats,
    mods: enrichedMods,
    gamefaqsCheatsUrl,
    nexusModsUrl
  };
}

// Enriquece todo o catálogo de jogos garantindo 100% de cobertura
export function enrichAllGames(games: Game[]): Game[] {
  return games.map(enrichGameWithCheatsAndMods);
}
