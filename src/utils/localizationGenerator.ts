import { Game, GameLocalization } from '../types';

/**
 * Gerador de Matriz de Localizações padrão PCGamingWiki.
 * Exibe exatamente o quadro: Language | UI | Audio | Sub | Notes & Patches
 */

const FAMOUS_PTBR_DUBBED = [
  'god of war',
  'cyberpunk',
  'the last of us',
  'ghost of tsushima',
  'horizon',
  'uncharted',
  'forza',
  'gears',
  'halo',
  'mortal kombat',
  'spider-man',
  'days gone',
  'death stranding',
  'detroit: become human',
  'the division',
  'far cry',
  'assassin',
  'watch dogs',
  'ratchet',
  'shadow of the tomb raider',
  'rise of the tomb raider',
  'resident evil 4 remake',
  'injustice',
  'hogwarts legacy'
];

export function generatePcGamingWikiLocalizations(game: Partial<Game>): GameLocalization[] {
  const title = (game.title || '').toLowerCase();
  const hasOfficialPtAudio = FAMOUS_PTBR_DUBBED.some(k => title.includes(k)) || !!game.hasPtBrAudio;
  const isJapaneseOrigin = title.includes('elden ring') || title.includes('dark souls') || 
                           title.includes('resident evil') || title.includes('silent hill') || 
                           title.includes('sekiro') || title.includes('monster hunter') ||
                           title.includes('final fantasy') || title.includes('persona') ||
                           title.includes('dragon');

  const cleanTitle = (game.title || 'Game').replace(/[:\-–—\(\)].*$/, '').trim();

  const localizations: GameLocalization[] = [
    {
      language: 'Português do Brasil',
      flag: '🇧🇷',
      ui: true,
      audio: hasOfficialPtAudio,
      sub: true,
      notes: hasOfficialPtAudio 
        ? 'Dublagem e legendas oficiais em PT-BR inclusas no jogo' 
        : `Tradução para PT-BR disponível via Tribo Gamer / Comunidade Nexus`,
      patchUrl: hasOfficialPtAudio
        ? undefined
        : `https://www.google.com/search?q=${encodeURIComponent(cleanTitle + ' traducao pt br tribo gamer gamevicio')}`
    },
    {
      language: 'English (Inglês)',
      flag: '🇺🇸',
      ui: true,
      audio: true,
      sub: true,
      notes: 'Áudio original e interface nativa oficial',
      patchUrl: undefined
    },
    {
      language: 'Español (Espanhol)',
      flag: '🇪🇸',
      ui: true,
      audio: !isJapaneseOrigin,
      sub: true,
      notes: 'Castellano & Espanhol Latino-Americano',
      patchUrl: undefined
    },
    {
      language: 'Français (Francês)',
      flag: '🇫🇷',
      ui: true,
      audio: !isJapaneseOrigin,
      sub: true,
      notes: 'Localização integral oficial',
      patchUrl: undefined
    },
    {
      language: 'Deutsch (Alemão)',
      flag: '🇩🇪',
      ui: true,
      audio: !isJapaneseOrigin,
      sub: true,
      notes: 'Localização integral oficial',
      patchUrl: undefined
    },
    {
      language: 'Italiano',
      flag: '🇮🇹',
      ui: true,
      audio: false,
      sub: true,
      notes: 'Interface e legendas oficiais',
      patchUrl: undefined
    },
    {
      language: '日本語 (Japonês)',
      flag: '🇯🇵',
      ui: true,
      audio: isJapaneseOrigin,
      sub: true,
      notes: isJapaneseOrigin ? 'Dublagem original em Japonês disponível' : 'Interface e legendas oficiais',
      patchUrl: undefined
    }
  ];

  return localizations;
}

export function getPcGamingWikiUrl(gameTitle: string): string {
  const formatted = gameTitle
    .replace(/[^\w\s\-]/g, '')
    .trim()
    .replace(/\s+/g, '_');
  return `https://www.pcgamingwiki.com/wiki/${formatted}`;
}
