import { Game } from '../types';

export interface ThematicList {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  icon: string;
  badge: string;
  color: string;
  description: string;
  filterFn: (game: Game) => boolean;
}

export const THEMATIC_LISTS: ThematicList[] = [
  {
    id: 'dublados-ptbr',
    slug: 'dublados-ptbr',
    title: 'Top Jogos 100% Dublados em Português (Brasil)',
    shortTitle: '100% Dublados PT-BR',
    icon: '🇧🇷',
    badge: 'VOZES BRASILEIRAS',
    color: 'from-amber-500 to-emerald-500',
    description: 'Jogos completos com áudio oficial brasileiro gravado por dubladores consagrados. Imersão máxima no nosso idioma.',
    filterFn: (game: Game) => {
      const isDublado = game.hasPtBrAudio || 
        game.title.toLowerCase().includes('dublado') || 
        game.title.toLowerCase().includes('pt.br') || 
        game.title.toLowerCase().includes('pt-br') ||
        game.languages?.some(l => l.toLowerCase().includes('português')) ||
        game.downloadLinks?.some(l => l.isPtBrAudio || l.language?.includes('Dublado'));
      return !!isDublado;
    }
  },
  {
    id: 'ports-nativos',
    slug: 'ports-nativos',
    title: 'Ports Nativos de PC & Sem Emulador (60/120 FPS)',
    shortTitle: 'Ports PC (Sem Emulador)',
    icon: '⚡',
    badge: 'SEM EMULADOR',
    color: 'from-cyan-500 to-blue-600',
    description: 'Recompilações estáticas de PC nativo sem a sobrecarga de emuladores pesados. Roda liso a 60/120 FPS no Windows com suporte total a controles.',
    filterFn: (game: Game) => {
      const t = game.title.toLowerCase();
      const isPort = game.genres?.some(g => g.toLowerCase().includes('port')) ||
        game.categories?.some(c => c.toLowerCase().includes('brothergame')) ||
        game.tags?.some(tag => tag.toLowerCase().includes('port nativo')) ||
        t.includes('port nativo') ||
        t.includes('port pc') ||
        game.id.startsWith('bg-');
      return !!isPort;
    }
  },
  {
    id: 'pc-fraco',
    slug: 'pc-fraco',
    title: 'Jogos Incríveis que Rodam em PC Fraco & Notebooks',
    shortTitle: 'Para PC Fraco',
    icon: '💻',
    badge: 'LEVES & RÁPIDOS',
    color: 'from-emerald-500 to-teal-500',
    description: 'Títulos leves e super otimizados que rodam fluidos em notebooks de estudo ou computadores com placas de vídeo integradas (Intel UHD / Vega).',
    filterFn: (game: Game) => {
      const numSize = parseFloat((game.repackInfo?.repackSize || '10').replace(/[^0-9.]/g, '')) || 10;
      const isLight = numSize <= 6.0 || 
        game.systemRequirements?.minimum?.memory?.includes('4 GB') ||
        game.genres?.includes('Port Nativo') ||
        game.releaseYear < 2016;
      return isLight;
    }
  },
  {
    id: 'repacks-leves',
    slug: 'repacks-leves',
    title: 'Repacks Ultra Compactos (Menos de 15 GB)',
    shortTitle: 'Repacks Compactos',
    icon: '📦',
    badge: 'DOWNLOAD RÁPIDO',
    color: 'from-purple-500 to-indigo-600',
    description: 'Jogos completos com compactação máxima feita por FitGirl e DODI para você economizar espaço no SSD e baixar na metade do tempo.',
    filterFn: (game: Game) => {
      const numSize = parseFloat((game.repackInfo?.repackSize || '20').replace(/[^0-9.]/g, '')) || 20;
      return numSize <= 15.0;
    }
  },
  {
    id: 'classicos-ouro',
    slug: 'classicos-ouro',
    title: 'Grandes Clássicos de Ouro Remasterizados',
    shortTitle: 'Clássicos de Ouro',
    icon: '👑',
    badge: 'OBRAS-PRIMAS',
    color: 'from-amber-400 to-orange-500',
    description: 'Jogos históricos que definiram gerações de consoles, totalmente adaptados para computadores modernos com alta resolução e 60 FPS.',
    filterFn: (game: Game) => {
      const t = game.title.toLowerCase();
      const isClassic = game.genres?.some(g => g.toLowerCase().includes('clássico')) ||
        game.tags?.some(tag => tag.toLowerCase().includes('clássico')) ||
        t.includes('zelda') ||
        t.includes('god of war') ||
        t.includes('star fox') ||
        t.includes('gran turismo') ||
        t.includes('castlevania') ||
        t.includes('mario') ||
        t.includes('resident evil') ||
        game.releaseYear < 2012;
      return !!isClassic;
    }
  }
];

export function findThematicListBySlug(slug: string): ThematicList | undefined {
  return THEMATIC_LISTS.find(l => l.slug === slug || l.id === slug);
}
