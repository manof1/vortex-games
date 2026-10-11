import React, { useState } from 'react';
import { X, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';

export const SidebarBanners: React.FC = () => {
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);

  return (
    <>
      {/* BANNER LATERAL ESQUERDO (Skyscraper 160x600) */}
      {showLeft && (
        <aside 
          className="fixed left-2 top-24 z-30 hidden 2xl:flex flex-col w-[160px] h-[600px] rounded-2xl overflow-hidden bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-sm transition-all animate-fadeIn"
          aria-label="Espaço de Publicidade Lateral Esquerda"
        >
          {/* Header discreto com aviso e botão fechar */}
          <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-100 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800/80 text-[10px] text-slate-500 dark:text-slate-400 font-bold">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-cyan-500" />
              Anúncio
            </span>
            <button
              onClick={() => setShowLeft(false)}
              className="hover:text-rose-500 p-0.5 rounded transition-colors cursor-pointer"
              title="Ocultar este anúncio"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* ÁREA DO ANÚNCIO ADSTERRA (160x600) */}
          <div className="flex-1 flex flex-col items-center justify-center p-3 text-center bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent relative group">
            
            {/* INSTRUÇÃO: Cole o código do banner Adsterra 160x600 aqui */}
            {/* Exemplo de integração Adsterra:
                <div id="adsterra-left-slot">
                  <script type="text/javascript">
                    atOptions = {
                      'key' : 'SUA_CHAVE_AQUI',
                      'format' : 'iframe',
                      'height' : 600,
                      'width' : 160,
                      'params' : {}
                    };
                  </script>
                  <script type="text/javascript" src="//www.highperformanceformat.com/SUA_CHAVE/invoke.js"></script>
                </div>
            */}

            {/* Placeholder Visual Gamer e Discreto */}
            <div className="space-y-3">
              <div className="w-10 h-10 mx-auto rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase text-cyan-500 dark:text-cyan-400 block tracking-wider">
                  Espaço Adsterra
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight">
                  Banner Lateral 160x600 (Sem pop-ups)
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-[9px] text-slate-400">
                Pronto para receber sua tag oficial do Adsterra
              </div>
            </div>

            <span className="text-[9px] text-slate-400 dark:text-slate-500 absolute bottom-2 font-mono">
              160 × 600
            </span>
          </div>
        </aside>
      )}

      {/* BANNER LATERAL DIREITO (Skyscraper 160x600) */}
      {showRight && (
        <aside 
          className="fixed right-2 top-24 z-30 hidden 2xl:flex flex-col w-[160px] h-[600px] rounded-2xl overflow-hidden bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-sm transition-all animate-fadeIn"
          aria-label="Espaço de Publicidade Lateral Direita"
        >
          {/* Header discreto com aviso e botão fechar */}
          <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-100 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800/80 text-[10px] text-slate-500 dark:text-slate-400 font-bold">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-indigo-500" />
              Anúncio
            </span>
            <button
              onClick={() => setShowRight(false)}
              className="hover:text-rose-500 p-0.5 rounded transition-colors cursor-pointer"
              title="Ocultar este anúncio"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* ÁREA DO ANÚNCIO ADSTERRA (160x600) */}
          <div className="flex-1 flex flex-col items-center justify-center p-3 text-center bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent relative group">
            
            {/* INSTRUÇÃO: Cole o código do segundo banner Adsterra 160x600 aqui */}
            <div className="space-y-3">
              <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase text-indigo-500 dark:text-indigo-400 block tracking-wider">
                  Espaço Adsterra
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight">
                  Banner Lateral 160x600 (Sem pop-ups)
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-[9px] text-slate-400">
                Pronto para receber sua tag oficial do Adsterra
              </div>
            </div>

            <span className="text-[9px] text-slate-400 dark:text-slate-500 absolute bottom-2 font-mono">
              160 × 600
            </span>
          </div>
        </aside>
      )}
    </>
  );
};
