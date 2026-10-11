import { SiteNotification } from '../types';

export const INITIAL_NOTIFICATIONS: SiteNotification[] = [
  {
    id: 'notif-1',
    title: 'Novo Lançamento Disponível!',
    message: 'God of War Ragnarök: Digital Deluxe (PC) acabou de ser adicionado com crack RUNE e dublagem PT-BR!',
    gameId: 'god-of-war-ragnarok',
    type: 'new_game',
    timestamp: 'Há 2 horas',
    read: false,
    coverUrl: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'notif-2',
    title: 'Atualização de Patch Repack',
    message: 'Baldur’s Gate 3 atualizado para o Patch 7 Oficial com gerenciador de mods e novos finais malignos.',
    gameId: 'baldurs-gate-3',
    type: 'update',
    timestamp: 'Há 1 dia',
    read: false,
    coverUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'notif-3',
    title: 'Novo Repack Rápido FitGirl',
    message: 'Cyberpunk 2077 v2.13 Phantom Liberty re-empacotado com 30% menos tamanho e instalação mais veloz.',
    gameId: 'cyberpunk-2077',
    type: 'update',
    timestamp: 'Há 3 dias',
    read: true,
    coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'notif-4',
    title: 'Aviso da Comunidade Vortex',
    message: 'Lembrete: verifique sempre se tem o DirectX e os pacotes Visual C++ Redistributable 2015-2022 instalados em seu PC!',
    type: 'announcement',
    timestamp: 'Há 5 dias',
    read: true
  }
];
