import { Game } from '../types';

export interface UserHardwareSpec {
  cpuName: string;
  cpuTier: number; // 1 (Básico), 2 (Médio), 3 (Alto), 4 (Ultra)
  gpuName: string;
  gpuTier: number; // 1 (Integrada/Básica), 2 (GTX 1650/1660/RX 580), 3 (RTX 3060/4060/RX 6600), 4 (RTX 4070+)
  ramGb: number;
  storageType: 'hdd' | 'ssd';
  presetId?: string;
}

export interface HardwareCheckResult {
  verdict: 'recommended' | 'minimum' | 'below';
  score: number; // 0 - 100
  title: string;
  fpsEstimate: string;
  resolutionEstimate: string;
  details: {
    cpu: { pass: boolean; current: string; requiredMin: string; requiredRec: string };
    gpu: { pass: boolean; current: string; requiredMin: string; requiredRec: string };
    ram: { pass: boolean; current: string; requiredMin: string; requiredRec: string };
    storage: { pass: boolean; current: string; requiredMin: string };
  };
  tips: string[];
}

export const HARDWARE_PRESETS: { id: string; name: string; icon: string; desc: string; spec: UserHardwareSpec }[] = [
  {
    id: 'pc-fraco',
    name: 'Notebook / PC Básico',
    icon: '💻',
    desc: 'Intel UHD / Vega 7, 8 GB RAM, Core i3 ou Ryzen 3',
    spec: {
      cpuName: 'Intel Core i3 / AMD Ryzen 3',
      cpuTier: 1,
      gpuName: 'Gráficos Integrados (Intel UHD / Radeon Vega)',
      gpuTier: 1,
      ramGb: 8,
      storageType: 'ssd',
      presetId: 'pc-fraco'
    }
  },
  {
    id: 'pc-medio',
    name: 'PC Gamer Custo-Benefício',
    icon: '🎮',
    desc: 'GTX 1660 / RX 580 / RTX 3050, 16 GB RAM, Core i5 / Ryzen 5',
    spec: {
      cpuName: 'Intel Core i5 / AMD Ryzen 5',
      cpuTier: 2,
      gpuName: 'GeForce GTX 1660 Super / Radeon RX 580',
      gpuTier: 2,
      ramGb: 16,
      storageType: 'ssd',
      presetId: 'pc-medio'
    }
  },
  {
    id: 'pc-alto',
    name: 'PC Gamer Intermediário / Alto',
    icon: '🚀',
    desc: 'RTX 3060 / RTX 4060 / RX 6600, 16 GB RAM, Core i7 / Ryzen 7',
    spec: {
      cpuName: 'Intel Core i7 / AMD Ryzen 7',
      cpuTier: 3,
      gpuName: 'GeForce RTX 3060 / RTX 4060 / Radeon RX 6600',
      gpuTier: 3,
      ramGb: 16,
      storageType: 'ssd',
      presetId: 'pc-alto'
    }
  },
  {
    id: 'pc-ultra',
    name: 'PC Gamer High-End (4K)',
    icon: '👑',
    desc: 'RTX 4070 / RTX 4080 / RTX 4090, 32 GB RAM, Core i9 / Ryzen 9',
    spec: {
      cpuName: 'Intel Core i9 / AMD Ryzen 9',
      cpuTier: 4,
      gpuName: 'GeForce RTX 4070 / 4080 / 4090 / RX 7900 XTX',
      gpuTier: 4,
      ramGb: 32,
      storageType: 'ssd',
      presetId: 'pc-ultra'
    }
  }
];

const STORAGE_KEY = 'vortex_user_pc_specs';

/**
 * Tenta detectar a GPU e especificações usando WebGL e APIs de hardware do navegador
 */
export function detectBrowserHardware(): UserHardwareSpec {
  let detectedGpu = '';
  let detectedGpuTier = 2; // Default médio
  let detectedRam = 16;
  let detectedCpu = 'Processador Multi-core';
  let detectedCpuTier = 2;

  if (typeof window !== 'undefined') {
    // 1. Detecção de GPU via WebGL
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          detectedGpu = (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
        }
      }
    } catch {
      // ignore
    }

    // 2. Detecção de RAM (navigator.deviceMemory)
    if ('deviceMemory' in navigator && (navigator as any).deviceMemory) {
      detectedRam = Math.min(32, Math.max(4, (navigator as any).deviceMemory));
    }

    // 3. Detecção de Threads de CPU (navigator.hardwareConcurrency)
    if (navigator.hardwareConcurrency) {
      const cores = navigator.hardwareConcurrency;
      if (cores <= 4) {
        detectedCpu = `Processador ${cores} Threads (Básico)`;
        detectedCpuTier = 1;
      } else if (cores <= 8) {
        detectedCpu = `Processador ${cores} Threads (Gamer Médio)`;
        detectedCpuTier = 2;
      } else if (cores <= 16) {
        detectedCpu = `Processador ${cores} Threads (Alto Desempenho)`;
        detectedCpuTier = 3;
      } else {
        detectedCpu = `Processador ${cores} Threads (Topo de Linha)`;
        detectedCpuTier = 4;
      }
    }

    // Classificação da GPU detectada
    const gpuLower = detectedGpu.toLowerCase();
    if (
      gpuLower.includes('rtx 4070') || 
      gpuLower.includes('rtx 4080') || 
      gpuLower.includes('rtx 4090') || 
      gpuLower.includes('rx 7900') ||
      gpuLower.includes('rtx 3080') ||
      gpuLower.includes('rtx 3090')
    ) {
      detectedGpuTier = 4;
    } else if (
      gpuLower.includes('rtx 3060') || 
      gpuLower.includes('rtx 4060') || 
      gpuLower.includes('rtx 2060') || 
      gpuLower.includes('rtx 2070') || 
      gpuLower.includes('rx 6600') ||
      gpuLower.includes('rx 6700') ||
      gpuLower.includes('rtx 3070')
    ) {
      detectedGpuTier = 3;
    } else if (
      gpuLower.includes('gtx 1650') || 
      gpuLower.includes('gtx 1660') || 
      gpuLower.includes('gtx 1060') || 
      gpuLower.includes('rx 580') || 
      gpuLower.includes('rx 570') ||
      gpuLower.includes('rtx 3050')
    ) {
      detectedGpuTier = 2;
    } else if (
      gpuLower.includes('intel') || 
      gpuLower.includes('uhd') || 
      gpuLower.includes('iris') || 
      gpuLower.includes('vega') ||
      gpuLower.includes('gt 7') ||
      gpuLower.includes('gt 1030')
    ) {
      detectedGpuTier = 1;
    }
  }

  return {
    cpuName: detectedCpu,
    cpuTier: detectedCpuTier,
    gpuName: detectedGpu || 'Placa de Vídeo Dedicada / Integrada',
    gpuTier: detectedGpuTier,
    ramGb: detectedRam,
    storageType: 'ssd',
    presetId: 'custom'
  };
}

/**
 * Carrega a configuração do PC salva pelo usuário no localStorage
 */
export function getSavedUserHardware(): UserHardwareSpec {
  if (typeof window === 'undefined') return HARDWARE_PRESETS[1].spec;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  // Se não tem nada salvo, usa preset médio como padrão
  return HARDWARE_PRESETS[1].spec;
}

/**
 * Salva a configuração de hardware do usuário no localStorage
 */
export function saveUserHardware(spec: UserHardwareSpec): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(spec));
  } catch {
    // ignore
  }
}

/**
 * Avalia o jogo contra as especificações do usuário
 */
export function evaluateGamePerformance(game: Game, spec: UserHardwareSpec): HardwareCheckResult {
  const req = game.systemRequirements;
  
  // Extrai RAM requerida em GB
  const parseRam = (ramStr?: string): number => {
    if (!ramStr) return 8;
    const match = ramStr.match(/(\d+)\s*GB/i);
    return match ? parseInt(match[1], 10) : 8;
  };

  const minRam = parseRam(req?.minimum?.memory);
  const recRam = parseRam(req?.recommended?.memory);

  // Determina o tier de GPU exigido pelo jogo
  const assessGpuTierRequirement = (gpuStr?: string): number => {
    if (!gpuStr) return 2;
    const s = gpuStr.toLowerCase();
    if (s.includes('rtx 3080') || s.includes('rtx 4070') || s.includes('rx 6800') || s.includes('rtx 3070')) return 4;
    if (s.includes('rtx 2060') || s.includes('rtx 3060') || s.includes('rx 6600') || s.includes('gtx 1070')) return 3;
    if (s.includes('gtx 1060') || s.includes('gtx 1650') || s.includes('gtx 1660') || s.includes('rx 580') || s.includes('gtx 970')) return 2;
    return 1;
  };

  const minGpuTier = assessGpuTierRequirement(req?.minimum?.graphics);
  const recGpuTier = assessGpuTierRequirement(req?.recommended?.graphics);

  // Verificações
  const ramPassMin = spec.ramGb >= minRam;
  const ramPassRec = spec.ramGb >= recRam;

  const gpuPassMin = spec.gpuTier >= minGpuTier;
  const gpuPassRec = spec.gpuTier >= recGpuTier;

  const cpuPassMin = spec.cpuTier >= 1;
  const cpuPassRec = spec.cpuTier >= 2;

  const storagePass = true;

  // Cálculo da pontuação
  let score = 0;
  if (ramPassMin) score += 30;
  if (ramPassRec) score += 10;
  if (gpuPassMin) score += 40;
  if (gpuPassRec) score += 10;
  if (cpuPassMin) score += 10;

  // Veredito
  let verdict: 'recommended' | 'minimum' | 'below' = 'below';
  let title = 'Requer Upgrade de Hardware';
  let fpsEstimate = '< 25 FPS (Instável)';
  let resolutionEstimate = 'Abaixo do Mínimo';

  if (ramPassRec && gpuPassRec && cpuPassRec) {
    verdict = 'recommended';
    title = 'Roda com Folga no Recomendado!';
    fpsEstimate = spec.gpuTier >= 4 ? '90 - 144+ FPS (Ultra / 4K)' : '60+ FPS Estáveis (1080p / 1440p Alto)';
    resolutionEstimate = spec.gpuTier >= 4 ? '4K / Quad HD' : '1080p Full HD';
  } else if (ramPassMin && gpuPassMin) {
    verdict = 'minimum';
    title = 'Roda nos Requisitos Mínimos';
    fpsEstimate = '30 - 50 FPS (Médio / Baixo)';
    resolutionEstimate = '720p HD / 1080p Médio';
  }

  // Dicas contextuais inteligentes
  const tips: string[] = [];

  const isNativePort = game.genres?.includes('Port Nativo') || game.categories?.includes('BrotherGame') || game.title.toLowerCase().includes('port');

  if (isNativePort) {
    tips.push('🚀 Este jogo é um Port Nativo direto para Windows: física desacoplada e 60 FPS lisos sem sobrecarga de emulador.');
  }

  if (verdict === 'recommended') {
    tips.push('✨ Seu PC atende ou supera todas as especificações recomendadas para jogar com gráficos de alta qualidade.');
  } else if (verdict === 'minimum') {
    tips.push('💡 Para ganhar mais fluidez, desative Motion Blur, configure sombras no Médio e ative FSR / DLSS se disponível.');
  } else {
    if (!ramPassMin) {
      tips.push(`⚠️ O jogo pede no mínimo ${minRam} GB de RAM. Seu PC tem ${spec.ramGb} GB.`);
    }
    if (!gpuPassMin) {
      tips.push('⚠️ Sua placa de vídeo pode sofrer quedas de quadros em cenas com muitos efeitos 3D.');
    }
  }

  return {
    verdict,
    score,
    title,
    fpsEstimate,
    resolutionEstimate,
    details: {
      cpu: {
        pass: cpuPassMin,
        current: spec.cpuName,
        requiredMin: req?.minimum?.processor || 'Core i3 / Ryzen 3',
        requiredRec: req?.recommended?.processor || 'Core i5 / Ryzen 5'
      },
      gpu: {
        pass: gpuPassMin,
        current: spec.gpuName,
        requiredMin: req?.minimum?.graphics || 'GTX 750 / Vega 7',
        requiredRec: req?.recommended?.graphics || 'GTX 1060 / RX 580'
      },
      ram: {
        pass: ramPassMin,
        current: `${spec.ramGb} GB RAM`,
        requiredMin: `${minRam} GB RAM`,
        requiredRec: `${recRam} GB RAM`
      },
      storage: {
        pass: storagePass,
        current: spec.storageType.toUpperCase(),
        requiredMin: req?.minimum?.storage || 'Espaço em disco livre'
      }
    },
    tips
  };
}
