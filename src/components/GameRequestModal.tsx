import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  Gamepad2, 
  Flame, 
  ThumbsUp, 
  Clock, 
  Sparkles, 
  Search, 
  Filter,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { GameRequest } from '../types';

interface GameRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_REQUESTS: GameRequest[] = [
  {
    id: 'req-1',
    gameTitle: 'Silent Hill 2 Remake',
    platform: 'PC',
    formatPreference: 'Dublado PT-BR',
    requestedBy: 'DarkHunter_BR',
    notes: 'Por favor adicionar versão com patch de dublagem IA em português!',
    status: 'testando_seeds',
    votesCount: 47,
    hasVoted: false,
    createdAt: 'Há 2 dias'
  },
  {
    id: 'req-2',
    gameTitle: 'Final Fantasy VII Rebirth',
    platform: 'PC',
    formatPreference: 'Torrent PC',
    requestedBy: 'CloudStrife99',
    notes: 'Aguardando crack e repack leve com DLCs.',
    status: 'buscando',
    votesCount: 39,
    hasVoted: false,
    createdAt: 'Há 4 dias'
  },
  {
    id: 'req-3',
    gameTitle: 'Dragon Ball: Sparking! ZERO',
    platform: 'PC',
    formatPreference: 'Dublado PT-BR',
    requestedBy: 'GokuGamer',
    notes: 'Jogo de luta épico, versão FitGirl ou ElAmigos.',
    status: 'adicionado',
    votesCount: 68,
    hasVoted: true,
    createdAt: 'Há 6 dias'
  },
  {
    id: 'req-4',
    gameTitle: 'Marvel\'s Spider-Man 2',
    platform: 'PS4',
    formatPreference: 'PKG Console',
    requestedBy: 'ZukoFan',
    notes: 'Port ou PKG para PlayStation 4/5.',
    status: 'analise',
    votesCount: 31,
    hasVoted: false,
    createdAt: 'Há 1 semana'
  }
];

export const GameRequestModal: React.FC<GameRequestModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, isLoggedIn, setIsAuthModalOpen } = useGame();
  
  const [activeTab, setActiveTab] = useState<'form' | 'list'>('form');
  const [gameTitle, setGameTitle] = useState('');
  const [platform, setPlatform] = useState<GameRequest['platform']>('PC');
  const [formatPreference, setFormatPreference] = useState<GameRequest['formatPreference']>('Torrent PC');
  const [notes, setNotes] = useState('');
  const [userEmail, setUserEmail] = useState(userProfile.email || '');

  const [requests, setRequests] = useState<GameRequest[]>(() => {
    try {
      const saved = localStorage.getItem('vortex_game_requests');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_REQUESTS;
  });

  const [submitted, setSubmitted] = useState(false);
  const [filterSearch, setFilterSearch] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('vortex_game_requests', JSON.stringify(requests));
    } catch {
      // ignore
    }
  }, [requests]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameTitle.trim()) return;

    const newReq: GameRequest = {
      id: `req-${Date.now()}`,
      gameTitle: gameTitle.trim(),
      platform,
      formatPreference,
      requestedBy: isLoggedIn ? userProfile.name : 'Membro Vortex',
      userEmail: userEmail.trim(),
      notes: notes.trim(),
      status: 'analise',
      votesCount: 1,
      hasVoted: true,
      createdAt: 'Agora mesmo'
    };

    setRequests(prev => [newReq, ...prev]);
    setSubmitted(true);
    setGameTitle('');
    setNotes('');

    setTimeout(() => {
      setSubmitted(false);
      setActiveTab('list');
    }, 1500);
  };

  const handleVote = (id: string) => {
    setRequests(prev =>
      prev.map(req => {
        if (req.id === id) {
          const alreadyVoted = req.hasVoted;
          return {
            ...req,
            votesCount: alreadyVoted ? req.votesCount - 1 : req.votesCount + 1,
            hasVoted: !alreadyVoted
          };
        }
        return req;
      })
    );
  };

  const getStatusBadge = (status: GameRequest['status']) => {
    switch (status) {
      case 'adicionado':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Adicionado ao Site
          </span>
        );
      case 'testando_seeds':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
            <Sparkles className="w-3 h-3 animate-spin" /> Testando Seeds (+50)
          </span>
        );
      case 'buscando':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Buscando Torrent Confiável
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-500/20 text-slate-300 border border-slate-500/30 flex items-center gap-1">
            <HelpCircle className="w-3 h-3" /> Em Análise
          </span>
        );
    }
  };

  const filteredRequests = requests.filter(r =>
    r.gameTitle.toLowerCase().includes(filterSearch.toLowerCase()) ||
    r.platform.toLowerCase().includes(filterSearch.toLowerCase())
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all text-slate-900 dark:text-slate-100 flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Accent top gradient */}
        <div className="h-2 w-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black font-display text-slate-900 dark:text-white flex items-center gap-2">
                Pedir um Jogo
                <span className="text-xs px-2 py-0.5 rounded-md bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-800">
                  Comunidade
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Não encontrou seu jogo favorito? Sugira para a equipe ou robô indexar!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center px-6 pt-3 border-b border-slate-200 dark:border-slate-800 gap-4">
          <button
            onClick={() => setActiveTab('form')}
            className={`pb-3 text-xs font-bold transition-all relative cursor-pointer ${
              activeTab === 'form'
                ? 'text-cyan-600 dark:text-cyan-400'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4" />
              Sugerir Novo Jogo
            </span>
            {activeTab === 'form' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('list')}
            className={`pb-3 text-xs font-bold transition-all relative cursor-pointer ${
              activeTab === 'list'
                ? 'text-cyan-600 dark:text-cyan-400'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500" />
              Pedidos da Comunidade ({requests.length})
            </span>
            {activeTab === 'list' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                  <h4 className="text-base font-bold text-emerald-400">Pedido Enviado com Sucesso!</h4>
                  <p className="text-xs text-slate-300">
                    Seu pedido foi adicionado à fila da comunidade. Nosso robô e equipe testarão os seeds e adicionarão em breve!
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Nome do Jogo ou Título Desejado *
                    </label>
                    <input
                      type="text"
                      required
                      value={gameTitle}
                      onChange={e => setGameTitle(e.target.value)}
                      placeholder="Ex: Silent Hill 2, Black Myth Wukong, Kingdom Come 2..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Plataforma
                      </label>
                      <select
                        value={platform}
                        onChange={e => setPlatform(e.target.value as any)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                      >
                        <option value="PC">PC (Windows)</option>
                        <option value="PS4">PlayStation 4 (PKG)</option>
                        <option value="PS5">PlayStation 5</option>
                        <option value="Emulador">Emulador (Switch / PS3 / ShadPS4)</option>
                        <option value="Qualquer">Qualquer Plataforma</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Preferência de Idioma / Formato
                      </label>
                      <select
                        value={formatPreference}
                        onChange={e => setFormatPreference(e.target.value as any)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                      >
                        <option value="Torrent PC">Torrent PC (.torrent / magnet)</option>
                        <option value="Dublado PT-BR">Dublado em Português (PT-BR)</option>
                        <option value="PKG Console">Arquivo PKG (Console / ZukoStore)</option>
                        <option value="Qualquer">Qualquer versão funcional</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Observações / Detalhes (Opcional)
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Ex: Gostaria da versão com todos os DLCs, ou preferência por repack da FitGirl ou DODI..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/25 transition-all transform hover:scale-[1.01] cursor-pointer"
                    >
                      <Send className="w-4 h-4 stroke-[2.5]" />
                      <span>Enviar Pedido de Jogo</span>
                    </button>
                  </div>
                </>
              )}
            </form>
          ) : (
            <div className="space-y-3">
              {/* Search box for community requests */}
              <div className="relative">
                <input
                  type="text"
                  value={filterSearch}
                  onChange={e => setFilterSearch(e.target.value)}
                  placeholder="Pesquisar pedidos da comunidade..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>

              {filteredRequests.map(req => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                          {req.gameTitle}
                        </h4>
                        <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {req.platform}
                        </span>
                        <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-slate-500/10 text-slate-400">
                          {req.formatPreference}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        Sugerido por <strong className="text-cyan-400">{req.requestedBy}</strong> • {req.createdAt}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      {getStatusBadge(req.status)}
                      <button
                        type="button"
                        onClick={() => handleVote(req.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          req.hasVoted
                            ? 'bg-cyan-500 text-slate-950 shadow-sm'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-cyan-500/20 hover:text-cyan-400'
                        }`}
                        title="Votar para acelerar a adição deste jogo"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{req.votesCount} {req.votesCount === 1 ? 'voto' : 'votos'}</span>
                      </button>
                    </div>
                  </div>

                  {req.notes && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 italic">
                      "{req.notes}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-100 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>⚡ Os pedidos com mais votos sobem de prioridade para teste e adição imediata.</span>
          <button
            onClick={() => setActiveTab('form')}
            className="text-cyan-500 hover:underline font-bold cursor-pointer"
          >
            Fazer Nova Sugestão →
          </button>
        </div>
      </div>
    </div>
  );
};
