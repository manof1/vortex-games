import React from 'react';
import { Gamepad2, ShieldAlert, Heart, HardDrive, Sparkles } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const Footer: React.FC = () => {
  const { setFilters, setIsAdminOpen, setIsSupabaseGuideOpen } = useGame();

  return (
    <footer className="w-full mt-20 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-slate-950">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <span className="text-lg font-black text-white font-display">
                VORTEX<span className="text-cyan-400">GAMES</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              O portal definitivo de arquivamento e indexação torrent de jogos para PC com repacks rápidos, avaliações da comunidade e integração IGDB.
            </p>
          </div>

          {/* Quick categories */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Categorias</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button 
                  onClick={() => setFilters(prev => ({ ...prev, category: 'Lançamentos' }))}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Lançamentos Recentes
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setFilters(prev => ({ ...prev, category: 'Mais Populares' }))}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Mais Populares & GOTY
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setFilters(prev => ({ ...prev, category: 'Repacks Leves' }))}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Repacks Super Leves
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setFilters(prev => ({ ...prev, category: 'AAA' }))}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Grandes Produções (AAA)
                </button>
              </li>
            </ul>
          </div>

          {/* Repack groups */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Grupos & Repackers</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button 
                  onClick={() => setFilters(prev => ({ ...prev, repacker: 'FitGirl Repack' }))}
                  className="hover:text-cyan-400 transition-colors"
                >
                  FitGirl Repacks
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setFilters(prev => ({ ...prev, repacker: 'DODI Repack' }))}
                  className="hover:text-cyan-400 transition-colors"
                >
                  DODI Repacks
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setFilters(prev => ({ ...prev, repacker: 'ElAmigos' }))}
                  className="hover:text-cyan-400 transition-colors"
                >
                  ElAmigos Releases
                </button>
              </li>
            </ul>
          </div>

          {/* Administration & Technical */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Administração & Stack</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button 
                  onClick={() => setIsAdminOpen(true)}
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1 text-cyan-300 font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Painel Administrativo</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setIsSupabaseGuideOpen(true)}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Migração Vercel + Supabase
                </button>
              </li>
              <li>
                <span className="text-emerald-400 font-medium">Status dos Trackers: 100% Online</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Legal DMCA Notice */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-500 leading-relaxed space-y-1">
          <p className="flex items-center gap-1.5 font-bold text-slate-400">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            Aviso Legal e Notificação DMCA
          </p>
          <p>
            O VortexGames funciona exclusivamente como um indexador e catálogo de metadados da cultura gamer via IGDB. Nenhum arquivo binário ou imagem de disco com direitos autorais está hospedado em nossos servidores. O compartilhamento de arquivos P2P (Peer-to-Peer) é de responsabilidade exclusiva dos usuários da rede BitTorrent. Recomendamos apoiar os desenvolvedores e criadores comprando os jogos oficiais na Steam, GOG ou Epic Games Store quando puder.
          </p>
        </div>

        {/* Copyright */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 VortexGames. Todos os direitos reservados aos respectivos estúdios.</p>
          <p className="flex items-center gap-1">
            Desenvolvido para máxima velocidade e experiência gamer.
          </p>
        </div>

      </div>
    </footer>
  );
};
