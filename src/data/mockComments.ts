import { Comment } from '../types';

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'c-1',
    gameId: 'cyberpunk-2077',
    authorName: 'Rodrigo_CyberGamer',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    authorRole: 'vip',
    content: 'O repack da FitGirl descompactou em cerca de 45 minutos aqui com um Ryzen 5 5600. Jogo rodando lisinho a 75 FPS no Ultra com FSR 3 Ativado. A DLC Phantom Liberty é uma obra prima com o Idris Elba!',
    rating: 5,
    createdAt: 'Há 2 dias',
    likes: 34,
    userLiked: false,
    verifiedDownload: true,
    replies: [
      {
        id: 'cr-1',
        authorName: 'Admin_Vortex',
        authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
        authorRole: 'admin',
        content: 'Obrigado pelo feedback, Rodrigo! Lembramos a todos de desativar o Windows Defender durante a instalação para evitar que a DLL do crack seja bloqueada por falso-positivo.',
        createdAt: 'Há 1 dia',
        likes: 18
      }
    ]
  },
  {
    id: 'c-2',
    gameId: 'cyberpunk-2077',
    authorName: 'Mariana_Tech',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    authorRole: 'user',
    content: 'Torrent super rápido, baixou a 25MB/s em menos de 40 minutos! Dublagem em português do Brasil inclusa e 100% sincronizada.',
    rating: 5,
    createdAt: 'Há 4 dias',
    likes: 19,
    userLiked: false,
    verifiedDownload: true
  },
  {
    id: 'c-3',
    gameId: 'elden-ring',
    authorName: 'DarkSouls_Vet',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    authorRole: 'user',
    content: 'Shadow of the Erdtree é brutalmente difícil mas maravilhoso! O save da versão anterior de Elden Ring foi reconhecido sem problemas no repack DODI. Dica: atualizem os drivers da placa de vídeo antes.',
    rating: 5,
    createdAt: 'Há 3 dias',
    likes: 42,
    userLiked: false,
    verifiedDownload: true
  },
  {
    id: 'c-4',
    gameId: 'black-myth-wukong',
    authorName: 'Kael_Gamer',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    authorRole: 'user',
    content: 'Jogo impecável! O combate tem peso e a movimentação é fluida. ElAmigos entregou uma instalação muito limpa. Se tiverem travadas no menu, ativem o gerador de quadros nas opções gráficas.',
    rating: 5,
    createdAt: 'Há 5 dias',
    likes: 27,
    userLiked: false,
    verifiedDownload: true
  },
  {
    id: 'c-5',
    gameId: 'baldurs-gate-3',
    authorName: 'Lucas_RPGista',
    authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    authorRole: 'user',
    content: 'Já passei das 120 horas e ainda não terminei o Ato 2. O Patch 7 com suporte a mods nativo deixou esse jogo perfeito. Podem baixar sem medo!',
    rating: 5,
    createdAt: 'Há 1 semana',
    likes: 51,
    userLiked: false,
    verifiedDownload: true
  }
];
