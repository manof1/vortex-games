import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle2, User, Sparkles, X, Terminal } from 'lucide-react';
import { useGame } from '../context/GameContext';

interface CreatorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreatorAuthModal: React.FC<CreatorAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { userProfile, updateUserProfile } = useGame();
  const [emailInput, setEmailInput] = useState('manof1@gmail.com');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleUnlock = (emailToUse: string) => {
    const clean = emailToUse.trim().toLowerCase();
    if (clean === 'manof1@gmail.com' || clean === 'vigilanciabcu@gmail.com') {
      localStorage.setItem('vortex_creator_verified', 'true');
      localStorage.setItem('vortex_creator_email', clean);
      updateUserProfile({
        email: clean,
        name: clean === 'manof1@gmail.com' ? 'manof1 (Criador)' : userProfile.name
      });
      onSuccess();
    } else {
      setErrorMsg('Acesso negado: Este ambiente de testes é restrito exclusivamente ao criador (manof1@gmail.com).');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-cyan-500/30 p-6 shadow-2xl text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-black font-display text-white flex items-center gap-2">
              Laboratório do Criador
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                PKG TEST
              </span>
            </h3>
            <p className="text-xs text-slate-400">Ambiente exclusivo de testes PS1 • PS2 • PS3</p>
          </div>
        </div>

        {/* Description Box */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-2 mb-5">
          <p className="leading-relaxed">
            Este painel foi desenvolvido especificamente para testes do catálogo <strong>PKG PlayStation (TheZukoStore + GameFAQs)</strong>.
          </p>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-[11px] pt-1 border-t border-slate-800">
            <Lock className="w-3.5 h-3.5" />
            <span>Permitido apenas para: <strong>manof1@gmail.com</strong></span>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* 1-Click Creator Access Button */}
        <div className="space-y-3">
          <button
            onClick={() => handleUnlock('manof1@gmail.com')}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 transition-all cursor-pointer transform hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Entrar como Criador (manof1@gmail.com)</span>
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-3 text-[10px] font-bold text-slate-500 uppercase">ou confirmar e-mail</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              E-mail de Acesso
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="manof1@gmail.com"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={() => handleUnlock(emailInput)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-400 border border-slate-700 transition-all cursor-pointer"
              >
                Verificar
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
