import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  CheckCircle2, 
  UserPlus, 
  LogIn, 
  ShieldCheck, 
  Download, 
  Gamepad2, 
  Zap, 
  ArrowRight,
  CloudCheck
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { signUpUserWithSupabase, signInUserWithSupabase } from '../services/supabaseClient';

interface AuthModalProps {
  onClose: () => void;
  initialMode?: 'register' | 'login';
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, initialMode = 'login' }) => {
  const { 
    login, 
    register, 
    syncToCloud 
  } = useGame();

  const [mode, setMode] = useState<'register' | 'login'>(initialMode);
  
  // Register fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Login fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!name.trim()) {
      setErrorMessage('Por favor, informe seu nome de usuário ou apelido.');
      return;
    }

    setIsLoading(true);
    // Registro local com sincronização automática
    const success = register(name.trim(), email.trim(), password);
    if (success) {
      if (email.trim() && password.trim().length >= 6) {
        try {
          await signUpUserWithSupabase(email.trim(), password.trim(), name.trim());
        } catch {
          // gracioso
        }
      }
      await syncToCloud();
      setIsLoading(false);
      setSuccessMessage('🎉 Conta criada com sucesso! Downloads liberados e sincronizados para acessar em qualquer aparelho.');
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setIsLoading(false);
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

    setIsLoading(true);
    // 1. Tenta login com verificação em nuvem
    const success = login(loginIdentifier.trim(), loginPassword);
    if (success) {
      if (loginIdentifier.includes('@') && loginPassword) {
        signInUserWithSupabase(loginIdentifier.trim(), loginPassword).catch(() => {});
      }
      setIsLoading(false);
      setSuccessMessage('✓ Conectado! Seus favoritos e downloads foram sincronizados.');
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      // 2. Se for o primeiro acesso neste aparelho (ex: celular), autentica com Supabase
      if (loginIdentifier.includes('@') && loginPassword) {
        const supaRes = await signInUserWithSupabase(loginIdentifier.trim(), loginPassword);
        if (supaRes.success && supaRes.user) {
          register(supaRes.user.user_metadata?.display_name || loginIdentifier.split('@')[0], loginIdentifier.trim(), loginPassword);
          setIsLoading(false);
          setSuccessMessage('✓ Conectado com sucesso via Nuvem!');
          setTimeout(() => {
            onClose();
          }, 1000);
          return;
        }
      }
      setIsLoading(false);
      setErrorMessage('Usuário ou senha inválidos. Verifique os dados ou crie uma conta gratuita.');
    }
  };

  const handleQuickDemoRegister = async () => {
    const randomNick = `Gamer_${Math.floor(100 + Math.random() * 900)}`;
    register(randomNick, `${randomNick.toLowerCase()}@vortex.gg`, 'demo123');
    await syncToCloud();
    setSuccessMessage('⚡ Conta rápida criada! Downloads liberados em todos os aparelhos.');
    setTimeout(() => {
      onClose();
    }, 1100);
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
        <div className="h-2 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600" />

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
              Área de Membros Vortex Games
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
              Entre com sua conta no computador ou celular para liberar downloads imediatos e manter seus favoritos sempre sincronizados.
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
              <ShieldCheck className="w-4 h-4 text-sky-500 shrink-0" />
              <span>Salva no Celular & PC</span>
            </div>
          </div>

          {/* Mode Switcher Tabs (Simples: Entrar / Criar Conta) */}
          <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMessage(''); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'login'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Entrar na Conta</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMessage(''); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'register'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Criar Conta Gratuita</span>
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

          {/* FORMULÁRIO 1: LOGIN SIMPLES */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Seu E-mail ou Nome de Usuário *
                </label>
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={e => setLoginIdentifier(e.target.value)}
                  placeholder="Ex: seunome ou seuemail@exemplo.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Sua Senha *
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/25 transition-all transform hover:scale-[1.01] cursor-pointer disabled:opacity-60"
              >
                <span>{isLoading ? 'Conectando...' : 'Entrar e Liberar Downloads'}</span>
                <LogIn className="w-4 h-4 stroke-[2.5]" />
              </button>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 text-center">
                💡 Basta usar este mesmo e-mail e senha no seu celular para abrir sua biblioteca.
              </div>
            </form>
          )}

          {/* FORMULÁRIO 2: CADASTRO RÁPIDO */}
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
                  placeholder="Ex: HunterGamer, Lucas_BR, Pedro"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  E-mail *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Criar Senha *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/25 transition-all transform hover:scale-[1.01] cursor-pointer disabled:opacity-60"
              >
                <span>{isLoading ? 'Cadastrando...' : 'Criar Conta & Liberar Acesso'}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={handleQuickDemoRegister}
                  className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
                >
                  ⚡ Criar Conta Rápida de Teste com 1 Clique
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
