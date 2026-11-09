import React from 'react';
import { 
  X, 
  Wrench, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  HelpCircle,
  FileCode,
  Layers,
  Gamepad2,
  HardDrive,
  Monitor
} from 'lucide-react';

interface GamerUtilitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UtilityItem {
  id: string;
  category: 'runtimes' | 'tools' | 'drivers';
  title: string;
  version: string;
  description: string;
  fixesProblem: string;
  downloadUrl: string;
  sourceName: string;
  size: string;
  badge?: string;
}

export const GAMER_UTILITIES: UtilityItem[] = [
  {
    id: 'vcredist',
    category: 'runtimes',
    title: 'Visual C++ All-in-One Runtimes (2005 – 2026)',
    version: 'Pacote Oficial Completo x86/x64',
    description: 'Instala todas as versões do Microsoft Visual C++ necessárias para a execução de praticamente todos os jogos modernos e repacks.',
    fixesProblem: 'Resolve os famosos erros: MSVCP140.dll, VCRUNTIME140.dll, MSVCP120.dll ausentes e erro 0xc000007b.',
    downloadUrl: 'https://www.techpowerup.com/download/visual-c-redistributable-runtime-package-all-in-one/',
    sourceName: 'TechPowerUp / GitHub (Verificado)',
    size: '28 MB',
    badge: 'INDISPENSÁVEL'
  },
  {
    id: 'directx',
    category: 'runtimes',
    title: 'DirectX End-User Runtimes (June 2010 Offline)',
    version: 'Instalador Completo Microsoft',
    description: 'Contém todas as bibliotecas legadas de DirectX 9.0c, 10 e 11 que não vêm pré-instaladas por padrão no Windows 10 e 11.',
    fixesProblem: 'Resolve erros como: d3dx9_43.dll, xinput1_3.dll, d3dcompiler_43.dll não encontrados ao iniciar games clássicos e ports.',
    downloadUrl: 'https://www.microsoft.com/en-us/download/details.aspx?id=8109',
    sourceName: 'Microsoft Download Center Oficial',
    size: '95 MB',
    badge: 'OFICIAL MICROSOFT'
  },
  {
    id: 'qbittorrent',
    category: 'tools',
    title: 'qBittorrent (Cliente Torrent Recomendado)',
    version: 'v4.6+ Oficial Sem Anúncios',
    description: 'O cliente de torrent mais rápido, limpo e seguro para baixar seus jogos. Código aberto, livre de anúncios irritantes e sem mineradores.',
    fixesProblem: 'Substitui o uTorrent antigo (que tem anúncios pesados) por um cliente leve com suporte nativo a links magnéticos rápidos.',
    downloadUrl: 'https://www.qbittorrent.org/download',
    sourceName: 'qBittorrent Official Site',
    size: '34 MB',
    badge: 'RECOMENDADO VORTEX'
  },
  {
    id: 'sevenzip',
    category: 'tools',
    title: '7-Zip x64 (Descompactador de Alta Performance)',
    version: 'v24+ Gratuito',
    description: 'Software leve e de altíssima velocidade para extrair arquivos `.rar`, `.zip`, `.7z` e descompactar instaladores de ports e repacks.',
    fixesProblem: 'Elimina corrupção de descompactação e abre arquivos compactados sem avisos de compra expirada.',
    downloadUrl: 'https://www.7-zip.org/download.html',
    sourceName: '7-Zip.org Oficial',
    size: '1.5 MB',
    badge: 'GRÁTIS'
  },
  {
    id: 'ds4windows',
    category: 'tools',
    title: 'DS4Windows (Suporte a Controles de PS4 / PS5 no PC)',
    version: 'Ryochan7 Release',
    description: 'Permite conectar controles DualShock 4 e DualSense no computador via Bluetooth ou USB, emulando um controle de Xbox 360 com vibração e giroscópio.',
    fixesProblem: 'Faz jogos de PC que não reconhecem controle de PlayStation funcionarem perfeitamente no Windows.',
    downloadUrl: 'https://github.com/Ryochan7/DS4Windows/releases',
    sourceName: 'GitHub Oficial Ryochan7',
    size: '5 MB',
    badge: 'GAMER'
  },
  {
    id: 'nvidia-drivers',
    category: 'drivers',
    title: 'NVIDIA GeForce Drivers & App Oficial',
    version: 'Game Ready Drivers',
    description: 'Drivers oficiais para placas de vídeo GeForce GTX e RTX com suporte a DLSS, Reflex e atualizações de desempenho para lançamentos.',
    fixesProblem: 'Aumenta a taxa de quadros (FPS) e resolve travamentos em placas NVIDIA.',
    downloadUrl: 'https://www.nvidia.com.br/Download/index.aspx?lang=br',
    sourceName: 'NVIDIA Brasil Oficial',
    size: 'Web Installer'
  },
  {
    id: 'amd-drivers',
    category: 'drivers',
    title: 'AMD Software: Adrenalin Edition',
    version: 'Radeon Software',
    description: 'Drivers oficiais para placas de vídeo Radeon RX e processadores Ryzen com gráficos integrados Radeon Vega.',
    fixesProblem: 'Otimiza desempenho, ativa FSR (FidelityFX Super Resolution) e corrige bugs visuais em GPUs AMD.',
    downloadUrl: 'https://www.amd.com/pt/support',
    sourceName: 'AMD Oficial',
    size: 'Web Installer'
  }
];

export const GamerUtilitiesModal: React.FC<GamerUtilitiesModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-emerald-500/30 rounded-3xl shadow-2xl shadow-emerald-500/10 overflow-hidden flex flex-col my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20">
              <Wrench className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500 text-slate-950">
                  TOOLBOX GAMER
                </span>
                <span className="text-xs text-emerald-400 font-bold">100% Seguros & Oficiais</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white font-display">
                Utilitários Essenciais do Gamer PC
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Banner de Ajuda Rápida */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-white">
                Seus jogos estão fechando sozinhos ou dando erro de DLL ausente?
              </p>
              <p className="text-slate-300">
                Baixe e instale o <strong>Visual C++ All-in-One</strong> e o <strong>DirectX End-User Runtimes</strong> abaixo. Eles contêm todas as bibliotecas que o Windows precisa para rodar qualquer jogo sem falhas.
              </p>
            </div>
          </div>

          {/* Grid de Utilitários */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GAMER_UTILITIES.map((item) => (
              <div 
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-400 font-mono">
                      {item.size} · {item.sourceName}
                    </span>
                    {item.badge && (
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-white font-display group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-amber-300/90 flex items-start gap-2">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>O que corrige:</strong> {item.fixesProblem}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={item.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20 transition-all cursor-pointer transform hover:scale-[1.02]"
                  >
                    <Download className="w-4 h-4 stroke-[2.5]" />
                    <span>Baixar Utilitário Oficial</span>
                    <ExternalLink className="w-3.5 h-3.5 stroke-[2] opacity-80" />
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
