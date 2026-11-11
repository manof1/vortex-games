import React, { useState } from 'react';
import { 
  Share2, 
  CheckCircle2, 
  X, 
  Sparkles, 
  Flame, 
  MessageCircle, 
  Copy 
} from 'lucide-react';
import { THEMATIC_LISTS, ThematicList } from '../data/thematicLists';

interface ThematicListsBarProps {
  activeListId: string | null;
  onSelectList: (listId: string | null) => void;
  gamesCount?: number;
}

export const ThematicListsBar: React.FC<ThematicListsBarProps> = ({
  activeListId,
  onSelectList,
  gamesCount = 0
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const activeList = THEMATIC_LISTS.find(l => l.id === activeListId);

  const getShareUrl = (listSlug: string) => {
    if (typeof window === 'undefined') return `https://vortex-games-seven.vercel.app/?list=${listSlug}`;
    return `${window.location.origin}/?list=${listSlug}`;
  };

  const handleCopyShareLink = () => {
    if (!activeList) return;
    const url = getShareUrl(activeList.slug);
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareWhatsApp = () => {
    if (!activeList) return;
    const url = getShareUrl(activeList.slug);
    const text = `🔥 Confira a lista oficial: *${activeList.title}* no Vortex Games!\n\n${url}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareDiscord = () => {
    handleCopyShareLink();
  };

  return (
    <div className="w-full space-y-3 mb-6">
      {/* Horizontal Strip Selector */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1.5 pt-1">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 shrink-0 flex items-center gap-1.5 mr-1">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Coleções:</span>
        </span>

        {THEMATIC_LISTS.map((list) => {
          const isActive = activeListId === list.id;
          return (
            <button
              key={list.id}
              type="button"
              onClick={() => onSelectList(isActive ? null : list.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 border ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/30 font-black scale-[1.02]'
                  : 'bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border-slate-200 dark:bg-slate-900/80 dark:hover:bg-slate-800 dark:text-slate-300 dark:hover:text-white dark:border-slate-800'
              }`}
            >
              <span className="text-sm">{list.icon}</span>
              <span>{list.shortTitle}</span>
              {isActive && (
                <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse" />
              )}
            </button>
          );
        })}

        {activeListId && (
          <button
            type="button"
            onClick={() => onSelectList(null)}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-200/80 dark:bg-slate-800/80 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all cursor-pointer flex items-center gap-1 shrink-0"
            title="Limpar seleção de lista temática"
          >
            <X className="w-3.5 h-3.5" />
            <span>Ver Todos</span>
          </button>
        )}
      </div>

      {/* Active Thematic Banner (Quando uma lista está selecionada) */}
      {activeList && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-white via-cyan-50/40 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-2 border-cyan-500/40 shadow-xl shadow-cyan-500/10 space-y-3 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <span className="text-3xl sm:text-4xl p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-md shrink-0">
                {activeList.icon}
              </span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500 text-slate-950">
                    {activeList.badge}
                  </span>
                  <span className="text-xs text-cyan-600 dark:text-cyan-400 font-bold">
                    {gamesCount} jogos catalogados nesta coleção
                  </span>
                </div>
                <h3 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white font-display mt-0.5">
                  {activeList.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  {activeList.description}
                </p>
              </div>
            </div>

            {/* Ações de Compartilhamento */}
            <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
              <button
                type="button"
                onClick={handleCopyShareLink}
                className="px-3.5 py-2.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:hover:text-white transition-all flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 cursor-pointer shadow-sm"
                title="Copiar link permanente desta lista"
              >
                {copiedLink ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-black">Link Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Link</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="px-3.5 py-2.5 rounded-xl font-black text-xs bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
                title="Compartilhar no WhatsApp"
              >
                <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectList(null)}
                className="p-2.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                title="Fechar lista temática"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
