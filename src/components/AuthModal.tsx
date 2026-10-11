import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Unlock, 
  Sparkles, 
  CheckCircle2, 
  UserPlus, 
  LogIn, 
  ShieldCheck, 
  Download, 
  Gamepad2, 
  Zap,
  ArrowRight,
  Cloud,
  Smartphone,
  Laptop,
  KeyRound,
  RefreshCw
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { signUpUserWithSupabase, signInUserWithSupabase } from '../services/supabaseClient';

interface AuthModalProps {
  onClose: () => void;
  initialMode?: 'register' | 'login' | 'cloud_sync';
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, initialMode = 'register' }) => {
  const { 
    login, 
    register, 
    cloudSyncCode, 
    syncToCloud, 
    restoreFromCloudCode 
  } = useGame();

  const [mode, setMode] = useState<'register' | 'login' | 'cloud_sync'>(initialMode);
  
  // Register fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [useCloudBackup, setUseCloudBackup] = useState(true);
  
  // Login fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Cloud Sync fields
  const [syncCodeInput, setSyncCodeInput] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!name.trim()) {
      setErrorMessage('Por favor, informe seu nome de usuário ou apelido.');
      return;
    }

    const success = register(name.trim(), email.trim(), password);
    if (success) {
      if (useCloudBackup) {
        // Tenta salvar também no Supabase Auth se houver email e senha
        if (email.trim() && password.trim().length >= 6) {
          try {
            await signUpUserWithSupabase(email.trim(), password.trim(), name.trim());
          } catch (e) {
            // gracioso
          }
        }
        await syncToCloud();
      }

      setSuccessMessage('🎉 Conta criada com sucesso! Downloads liberados e sincronizados com a nuvem.');
      setTimeout(() => {
        onClose();
      }, 1300);
    } else {
      setErrorMessage('Erro ao criar conta. Tente novamente.');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!loginIdentifier.trim()) {
      setErrorMessage('Por favor, informe seu usuário ou e-mail.');
      return;
    }

    // Tenta primeiro no login local/cache
    const success = login(loginIdentifier.trim(), loginPassword);
    if (success) {
      // Se houver conexão com Supabase, tenta logar lá em background
      if (loginIdentifier.includes('@') && loginPassword) {
        signInUserWithSupabase(loginIdentifier.trim(), loginPassword).catch(() => {});
      }
      setSuccessMessage('✓ Login realizado! Downloads desbloqueados.');
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      // Se não encontrou no local, tenta via Supabase Auth
      if (loginIdentifier.includes('@') && loginPassword) {
        const supaRes = await signInUserWithSupabase(loginIdentifier.trim(), loginPassword);
        if (supaRes.success && supaRes.user) {
          register(supaRes.user.user_metadata?.display_name || loginIdentifier.split('@')[0], loginIdentifier.trim(), loginPassword);
          setSuccessMessage('✓ Login em Nuvem Supabase autenticado!');
          setTimeout(() => {
            onClose();
          }, 1000);
          return;
        }
      }
      setErrorMessage('Usuário ou e-mail inválido. Se você criou a conta em outro aparelho, use a aba "Nuvem (Celular)".');
    }
  };

  const handleCloudSyncSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!syncCodeInput.trim()) {
      setErrorMessage('Por favor, digite seu código de sincronização (ex: VX-1234-BR).');
      return;
    }

    setIsSyncing(true);
    const res = await restoreFromCloudCode(syncCodeInput.trim());
    setIsSyncing(false);

    if (res.success) {
      setSuccessMessage('⚡ ' + res.message);
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleQuickDemoRegister = async () => {
    const randomNick = `GamerVortex_${Math.floor(100 + Math.random() * 900)}`;
    register(randomNick, `${randomNick.toLowerCase()}@vortex.gg`, 'demo123');
    await syncToCloud();
    setSuccessMessage('⚡ Conta rápida criada e sincronizada! Todos os links liberados!');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all text-slate-900 dark:text-slate-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Accent Gradient */}
        <div className="h-2 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-5">
          {/* Header Icon & Title */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 dark:bg-cyan-950/60 border border-cyan-500/30 text-cyan-500 mb-1">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black font-display text-slate-900 dark:text-white">
              Área Exclusiva para Membros
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
              Cadastre-se grátis para liberar todos os downloads torrents, magnets e arquivos PKG em alta velocidade.
            </p>
          </div>

          {/* Value Perks Grid */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <Download className="w-4 h-4 text-cyan-500 shrink-0" />
              <span>Downloads Imediatos</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>+50 Seeds Garantidos</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-purple-500 shrink-0" />
              <span>Dublado e Legendado PT-BR</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <Cloud className="w-4 h-4 text-sky-500 shrink-0" />
              <span>Sincronização PC & Celular</span>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 gap-1">
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMessage(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'register'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Criar Conta</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMessage(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'login'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Entrar</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('cloud_sync'); setErrorMessage(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'cloud_sync'
                  ? 'bg-indigo-600 text-white shadow-md font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Entrar no celular com os mesmos favoritos e dados do PC"
            >
              <Cloud className="w-3.5 h-3.5 text-cyan-300" />
              <span>Nuvem</span>
            </button>
          </div>

          {/* Alert Messages */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold flex items-center gap-2">
              <span>✕</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-pulse">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: REGISTRATION FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nome de Usuário ou Apelido Gamer *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex: HunterGamer, Lucas_BR, Valkyrie"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  E-mail (para login em nuvem)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Senha
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="cloudBackupCheck"
                  checked={useCloudBackup}
                  onChange={e => setUseCloudBackup(e.target.checked)}
                  className="rounded text-cyan-500 focus:ring-cyan-500 cursor-pointer"
                />
                <label htmlFor="cloudBackupCheck" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                  Sincronizar conta na nuvem (permite acessar no celular)
                </label>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/25 transition-all transform hover:scale-[1.01] cursor-pointer"
              >
                <span>Concluir Cadastro & Liberar Downloads</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleQuickDemoRegister}
                  className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
                >
                  ⚡ Criar Conta Instantânea com 1 Clique (Teste Rápido)
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nome de Usuário ou E-mail
                </label>
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={e => setLoginIdentifier(e.target.value)}
                  placeholder="Nome de usuário ou seuemail@exemplo.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Senha
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/25 transition-all transform hover:scale-[1.01] cursor-pointer"
              >
                <span>Entrar na Minha Conta</span>
                <LogIn className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          )}

          {/* TAB 3: CLOUD SYNC (MULTI-DISPOSITIVO PC ⇄ CELULAR) */}
          {mode === 'cloud_sync' && (
            <form onSubmit={handleCloudSyncSubmit} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-indigo-400">
                  <Smartphone className="w-4 h-4" />
                  <span>Acessando pelo celular ou outro navegador?</span>
                </div>
                <p className="text-slate-300">
                  Digite seu <strong>Código de Sincronização em Nuvem</strong> gerado no seu computador para transferir automaticamente seus favoritos, downloads e avaliações.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Código de Sincronização em Nuvem *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={syncCodeInput}
                    onChange={e => setSyncCodeInput(e.target.value.toUpperCase())}
                    placeholder="Ex: VX-4820-BR"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 font-mono font-bold text-sm text-slate-900 dark:text-white placeholder-slate-400 uppercase tracking-widest focus:outline-none focus:border-indigo-500"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSyncing}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white shadow-lg shadow-indigo-500/25 transition-all transform hover:scale-[1.01] cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Conectando à Nuvem...' : 'Restaurar Dados & Entrar'}</span>
              </button>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                💡 Onde acho meu código? No computador, clique no seu Perfil no canto superior direito e vá na aba <strong>"Nuvem & Celular"</strong>.
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
