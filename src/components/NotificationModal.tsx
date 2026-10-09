import React from 'react';
import { X, Bell, CheckCheck, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { useGame } from '../context/GameContext';

interface NotificationModalProps {
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ onClose }) => {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    games, 
    setActiveGame 
  } = useGame();

  const handleNotificationClick = (notif: any) => {
    markNotificationAsRead(notif.id);
    if (notif.gameId) {
      const target = games.find(g => g.id === notif.gameId);
      if (target) {
        setActiveGame(target);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex justify-center items-start p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative w-full max-w-lg my-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white font-display">Notificações do Portal</h3>
              <p className="text-xs text-slate-400">
                Novos lançamentos de jogos, atualizações e avisos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsAsRead}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 p-1"
              title="Marcar todas como lidas"
            >
              <CheckCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Marcar lidas</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="p-4 space-y-2.5 max-h-[65vh] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Nenhuma notificação no momento.
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex gap-3.5 items-start ${
                  notif.read
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-75 hover:opacity-100'
                    : 'bg-slate-950/90 border-cyan-500/40 shadow-sm shadow-cyan-950/40'
                }`}
              >
                {/* Thumbnail or icon */}
                {notif.coverUrl ? (
                  <img
                    src={notif.coverUrl}
                    alt={notif.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=200&q=80';
                    }}
                    className="w-12 h-16 rounded-lg object-cover border border-slate-800 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 text-cyan-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                )}

                {/* Text Content */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-white font-display">
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                      {notif.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-snug">
                    {notif.message}
                  </p>

                  {notif.gameId && (
                    <div className="pt-1 flex items-center gap-1 text-[11px] font-bold text-cyan-400">
                      <span>Ver página do jogo</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  )}
                </div>

                {!notif.read && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-1" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/40 text-center">
          <p className="text-[11px] text-slate-500">
            Você recebe alertas em tempo real sempre que um jogo novo ou patch for adicionado pelo admin.
          </p>
        </div>

      </div>
    </div>
  );
};
