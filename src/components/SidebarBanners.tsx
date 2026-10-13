import React, { useState } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ADSTERRA_IFRAME_DOC = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <base target="_blank">
  <style>
    * { box-sizing: border-box; }
    body, html {
      margin: 0;
      padding: 0;
      width: 160px;
      height: 600px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      background: transparent;
      font-family: sans-serif;
    }
  </style>
</head>
<body>
  <script type="text/javascript">
    atOptions = {
      'key' : '3255af1a278f28d25015424fd6d0c3bc',
      'format' : 'iframe',
      'height' : 600,
      'width' : 160,
      'params' : {}
    };
  </script>
  <script type="text/javascript" src="https://www.highrevenueformat.com/3255af1a278f28d25015424fd6d0c3bc/invoke.js"></script>
</body>
</html>`;

export const SidebarBanners: React.FC = () => {
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);
  const { t } = useLanguage();

  return (
    <>
      {/* BANNER LATERAL ESQUERDO (Skyscraper 160x600 - Adsterra) */}
      {showLeft && (
        <aside 
          className="fixed left-2 top-24 z-30 hidden 2xl:flex flex-col w-[160px] h-[630px] rounded-2xl overflow-hidden bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-md transition-all animate-fadeIn"
          aria-label="Espaço de Publicidade Lateral Esquerda"
        >
          {/* Header discreto com aviso e botão fechar */}
          <div className="flex items-center justify-between px-2.5 py-1 bg-slate-100 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 font-bold shrink-0">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-cyan-500" />
              {t('banner.ad', 'Anúncio')}
            </span>
            <button
              onClick={() => setShowLeft(false)}
              className="hover:text-rose-500 p-0.5 rounded transition-colors cursor-pointer"
              title={t('banner.close', 'Ocultar este anúncio')}
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* ÁREA DO ANÚNCIO ADSTERRA (160x600) */}
          <div className="w-[160px] h-[600px] flex items-center justify-center bg-slate-950/20 overflow-hidden">
            <iframe
              title="Adsterra Ad Left"
              srcDoc={ADSTERRA_IFRAME_DOC}
              width="160"
              height="600"
              style={{ border: 'none', overflow: 'hidden' }}
              scrolling="no"
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox"
            />
          </div>
        </aside>
      )}

      {/* BANNER LATERAL DIREITO (Skyscraper 160x600 - Adsterra) */}
      {showRight && (
        <aside 
          className="fixed right-2 top-24 z-30 hidden 2xl:flex flex-col w-[160px] h-[630px] rounded-2xl overflow-hidden bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-md transition-all animate-fadeIn"
          aria-label="Espaço de Publicidade Lateral Direita"
        >
          {/* Header discreto com aviso e botão fechar */}
          <div className="flex items-center justify-between px-2.5 py-1 bg-slate-100 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 font-bold shrink-0">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-indigo-500" />
              {t('banner.ad', 'Anúncio')}
            </span>
            <button
              onClick={() => setShowRight(false)}
              className="hover:text-rose-500 p-0.5 rounded transition-colors cursor-pointer"
              title={t('banner.close', 'Ocultar este anúncio')}
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* ÁREA DO ANÚNCIO ADSTERRA (160x600) */}
          <div className="w-[160px] h-[600px] flex items-center justify-center bg-slate-950/20 overflow-hidden">
            <iframe
              title="Adsterra Ad Right"
              srcDoc={ADSTERRA_IFRAME_DOC}
              width="160"
              height="600"
              style={{ border: 'none', overflow: 'hidden' }}
              scrolling="no"
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox"
            />
          </div>
        </aside>
      )}
    </>
  );
};
