import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Check, 
  Copy, 
  Github, 
  Sparkles,
  ExternalLink,
  FileCode,
  ShieldCheck,
  FolderTree,
  Globe
} from 'lucide-react';
import { SUPABASE_SCHEMA_SQL } from '../services/supabaseSchemaService';

interface SupabaseGuideModalProps {
  onClose: () => void;
}

export const SupabaseGuideModal: React.FC<SupabaseGuideModalProps> = ({ onClose }) => {
  const [activeStep, setActiveStep] = useState<'overview' | 'github' | 'supabase' | 'vercel' | 'files'>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const gitCommands = `# 1. No terminal da sua máquina, dentro da pasta do projeto:
git init
git add .
git commit -m "feat: portal de torrents VortexGames com suporte a PKG e PT-BR"

# 2. Crie um repositório no seu GitHub (ex: vortex-games) e envie:
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/vortex-games.git
git push -u origin main`;

  const vercelEnvVars = `# Cole estas variáveis no painel da Vercel:
# Settings -> Environment Variables

VITE_SUPABASE_URL="https://seu-projeto.supabase.co"
VITE_SUPABASE_ANON_KEY="sua_chave_anonima_publica_do_supabase"
SUPABASE_SERVICE_ROLE_KEY="sua_chave_service_role_secreta"
TWITCH_CLIENT_ID="seu_client_id_da_twitch_para_igdb"
TWITCH_CLIENT_SECRET="seu_client_secret_da_twitch_para_igdb"`;

  const supabaseSqlSchema = SUPABASE_SCHEMA_SQL;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex justify-center items-start p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div 
        className="relative w-full max-w-5xl my-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 via-cyan-500 to-indigo-600 text-slate-950">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white font-display">
                Guia de Instalação: GitHub ➔ Supabase ➔ Vercel
              </h2>
              <p className="text-xs text-slate-400">
                Passo a passo com todos os arquivos, comandos e onde colar cada configuração para colocar seu portal no ar
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Navigation Tabs */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/60 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveStep('overview')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeStep === 'overview'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Visão Geral da Stack</span>
          </button>

          <button
            onClick={() => setActiveStep('github')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeStep === 'github'
                ? 'bg-slate-100 text-slate-950 shadow-md shadow-slate-100/20'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Github className="w-4 h-4" />
            <span>Passo 1: GitHub</span>
          </button>

          <button
            onClick={() => setActiveStep('supabase')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeStep === 'supabase'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Passo 2: Supabase</span>
          </button>

          <button
            onClick={() => setActiveStep('vercel')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeStep === 'vercel'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <span>▲ Passo 3: Vercel</span>
          </button>

          <button
            onClick={() => setActiveStep('files')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeStep === 'files'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Todos os Arquivos Prontos</span>
          </button>
        </div>

        {/* TAB CONTENTS */}
        <div className="p-6 space-y-6">

          {/* TAB 1: VISÃO GERAL */}
          {activeStep === 'overview' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  Arquitetura Completa de Produção
                </span>
                <h3 className="text-lg font-black text-white font-display">
                  Como GitHub, Supabase e Vercel trabalham juntos:
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                  Para migrar seu portal do Blogspot para uma infraestrutura profissional sem custos altos, utilizamos a stack moderna mais rápida e estável do mercado:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-white font-bold text-xs uppercase">
                      <Github className="w-4 h-4 text-cyan-400" />
                      <span>1. Repositório GitHub</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Guarda o código fonte do site, os arquivos de configuração (<code className="text-cyan-300">vercel.json</code>, <code className="text-cyan-300">package.json</code>) e histórico de alterações.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase">
                      <Database className="w-4 h-4" />
                      <span>2. Banco Supabase</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Banco de dados relacional PostgreSQL na nuvem. Armazena os links dos torrents, arquivos PKG, Title IDs CUSA, avaliações dos usuários, comentários e contador de downloads.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase">
                      <span>▲ 3. Hospedagem Vercel</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Hospeda o frontend com CDN global ultra rápida, roda o Cron Job automático a cada hora (<code className="text-indigo-300">/api/cron-sync</code>) e o proxy da IGDB (<code className="text-indigo-300">/api/igdb</code>).
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-xs text-slate-400">
                  Siga os 3 passos na ordem para configurar tudo em menos de 10 minutos.
                </span>
                <button
                  onClick={() => setActiveStep('github')}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                  <span>Iniciar Passo 1: GitHub</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: GITHUB */}
          {activeStep === 'github' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-white text-slate-950">
                    PASSO 1 DE 3
                  </span>
                  <h3 className="text-base font-black text-white font-display">
                    Subir o Projeto no seu Repositório do GitHub
                  </h3>
                </div>
                <p className="text-xs text-slate-400">
                  O GitHub servirá como a fonte que a Vercel lê automaticamente a cada atualização.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center text-[10px] font-black">1</span>
                    Crie um Novo Repositório no GitHub:
                  </h4>
                  <p className="text-slate-300 pl-7 leading-relaxed">
                    Acesse <strong>github.com/new</strong>, dê o nome de <strong>vortex-games</strong> (ou o nome que desejar), marque como <strong>Public</strong> (ou Private) e <strong>NÃO</strong> selecione "Add a README" nem ".gitignore".
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center text-[10px] font-black">2</span>
                      Comandos no seu Terminal:
                    </h4>

                    <button
                      onClick={() => copyToClipboard(gitCommands, 'gitCommands')}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-all border border-slate-700"
                    >
                      {copiedKey === 'gitCommands' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'gitCommands' ? 'Copiado!' : 'Copiar Comandos'}</span>
                    </button>
                  </div>

                  <p className="text-slate-300 pl-7">
                    Abra o terminal na pasta do projeto e execute os comandos abaixo:
                  </p>

                  <div className="pl-7 pt-1">
                    <pre className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-300 font-mono text-[11px] overflow-x-auto">
                      {gitCommands}
                    </pre>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center text-[10px] font-black">3</span>
                    Estrutura de Pastas Esperada no GitHub:
                  </h4>
                  <pre className="pl-7 text-[11px] font-mono text-slate-300 leading-relaxed">
{`├── api/                    # Serverless Functions (/api/igdb.ts, /api/cron-sync.ts)
├── supabase/               # Scripts SQL (/supabase/schema.sql)
├── src/                    # Código React completo
├── .env.example            # Exemplo de variáveis de ambiente
├── vercel.json             # Configuração de rotas e Cron da Vercel
├── package.json            # Dependências do app
└── index.html              # Entry point do site`}
                  </pre>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <button
                  onClick={() => setActiveStep('overview')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Voltar
                </button>
                <button
                  onClick={() => setActiveStep('supabase')}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <span>Avançar para Passo 2: Supabase</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: SUPABASE */}
          {activeStep === 'supabase' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-emerald-500 text-slate-950">
                    PASSO 2 DE 3
                  </span>
                  <h3 className="text-base font-black text-white font-display">
                    Configurar o Banco de Dados PostgreSQL no Supabase
                  </h3>
                </div>
                <p className="text-xs text-slate-400">
                  O Supabase é gratuito e armazena os jogos, links de torrents, arquivos PKG e avaliações.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[10px] font-black">1</span>
                    Crie um Novo Projeto no Supabase:
                  </h4>
                  <p className="text-slate-300 pl-7 leading-relaxed">
                    Acesse <strong>supabase.com/dashboard</strong>, clique em <strong>"New Project"</strong>, defina uma senha forte para o banco de dados e escolha a região mais próxima (ex: <em>São Paulo (sa-east-1)</em> ou <em>US East</em>).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[10px] font-black">2</span>
                      Execute o Script SQL no "SQL Editor":
                    </h4>

                    <button
                      onClick={() => copyToClipboard(supabaseSqlSchema, 'sqlSchema')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-sm"
                    >
                      {copiedKey === 'sqlSchema' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'sqlSchema' ? 'SQL Copiado!' : 'Copiar Script SQL'}</span>
                    </button>
                  </div>

                  <p className="text-slate-300 pl-7">
                    No menu lateral esquerdo do Supabase, clique em <strong>SQL Editor</strong> ➔ <strong>New Query</strong>, cole o código abaixo e clique no botão verde <strong>RUN</strong>:
                  </p>

                  <div className="pl-7 pt-1">
                    <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-emerald-300 font-mono text-[10px] overflow-x-auto max-h-48 scrollbar-thin">
                      {supabaseSqlSchema}
                    </pre>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[10px] font-black">3</span>
                    Onde pegar as Chaves de Acesso (API Keys):
                  </h4>
                  <p className="text-slate-300 pl-7 leading-relaxed">
                    No Supabase, vá em <strong>Project Settings</strong> (ícone de engrenagem) ➔ <strong>API</strong>. Copie os seguintes 3 valores para usar na Vercel:
                  </p>
                  <ul className="pl-12 list-disc space-y-1 text-slate-400 text-[11px]">
                    <li><strong>Project URL:</strong> ex: <code className="text-emerald-300">https://abcdefghij.supabase.co</code></li>
                    <li><strong>anon public key:</strong> chave pública usada pelo frontend.</li>
                    <li><strong>service_role key (secret):</strong> chave de administrador usada pelas funções da Vercel.</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <button
                  onClick={() => setActiveStep('github')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Voltar
                </button>
                <button
                  onClick={() => setActiveStep('vercel')}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                  <span>Avançar para Passo 3: Vercel</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: VERCEL */}
          {activeStep === 'vercel' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-indigo-500 text-white">
                    PASSO 3 DE 3
                  </span>
                  <h3 className="text-base font-black text-white font-display">
                    Publicar o Site na Vercel & Configurar Variáveis
                  </h3>
                </div>
                <p className="text-xs text-slate-400">
                  A Vercel compila seu código a cada commit e disponibiliza seu domínio online com HTTPS gratuito.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-black">1</span>
                    Importe seu Repositório do GitHub na Vercel:
                  </h4>
                  <p className="text-slate-300 pl-7 leading-relaxed">
                    Acesse <strong>vercel.com/new</strong>, faça login com seu GitHub, selecione o repositório <strong>vortex-games</strong> e clique em <strong>Import</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-black">2</span>
                      Configure as Variáveis de Ambiente (Environment Variables):
                    </h4>

                    <button
                      onClick={() => copyToClipboard(vercelEnvVars, 'vercelEnvVars')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-sm"
                    >
                      {copiedKey === 'vercelEnvVars' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'vercelEnvVars' ? 'Copiado!' : 'Copiar Variáveis'}</span>
                    </button>
                  </div>

                  <p className="text-slate-300 pl-7">
                    Antes de clicar em Deploy, expanda a seção <strong>Environment Variables</strong> e adicione as variáveis com os valores que você copiou do Supabase e da Twitch (para a API IGDB):
                  </p>

                  <div className="pl-7 pt-1">
                    <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-indigo-300 font-mono text-[11px] overflow-x-auto">
                      {vercelEnvVars}
                    </pre>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-black">3</span>
                    Clique em "Deploy" e Pronto!
                  </h4>
                  <p className="text-slate-300 pl-7 leading-relaxed">
                    Clique em <strong>Deploy</strong>. Em cerca de 1 minuto seu site estará online com domínio gratuito (ex: <code className="text-emerald-300">vortex-games.vercel.app</code>) ou seu domínio próprio personalizado configurado nas configurações de Domains!
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <button
                  onClick={() => setActiveStep('supabase')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Voltar
                </button>
                <button
                  onClick={() => setActiveStep('files')}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <span>Ver Todos os Arquivos Prontos</span>
                  <FolderTree className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: ARQUIVOS PRONTOS */}
          {activeStep === 'files' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-base font-black text-white font-display">
                  Arquivos Prontos do Projeto (Onde Salvar Cada Um)
                </h3>
                <p className="text-xs text-slate-400">
                  Todos os arquivos já foram criados e configurados neste projeto. Caso queira copiá-los individualmente:
                </p>
              </div>

              <div className="space-y-4 text-xs">
                {/* File 1: vercel.json */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-mono font-bold text-cyan-300">
                      <FileCode className="w-4 h-4 text-cyan-400" />
                      <span>/vercel.json (Salvar na raiz do projeto)</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(`{
  "version": 2,
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "crons": [
    {
      "path": "/api/cron-sync",
      "schedule": "0 * * * *"
    }
  ],
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}`, 'vercelJson')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 font-bold text-[11px]"
                    >
                      {copiedKey === 'vercelJson' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'vercelJson' ? 'Copiado!' : 'Copiar vercel.json'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Garante o funcionamento do SPA (evita erro 404 nas rotas) e ativa o Cron Job a cada 60 minutos na Vercel.
                  </p>
                </div>

                {/* File 2: supabase/schema.sql */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-mono font-bold text-emerald-300">
                      <Database className="w-4 h-4 text-emerald-400" />
                      <span>/supabase/schema.sql (Rodar no SQL Editor do Supabase)</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(supabaseSqlSchema, 'schemaSql')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 font-bold text-[11px]"
                    >
                      {copiedKey === 'schemaSql' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'schemaSql' ? 'Copiado!' : 'Copiar schema.sql'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Cria todas as tabelas (jogos, comentários, biblioteca) com suporte completo a arquivos PKG, Torrents PC e localização PT-BR.
                  </p>
                </div>

                {/* File 3: api/igdb.ts */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-mono font-bold text-indigo-300">
                      <FileCode className="w-4 h-4 text-indigo-400" />
                      <span>/api/igdb.ts (Serverless Function na Vercel)</span>
                    </div>
                    <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      Já Criado no Repositório
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Rota segura que consulta capas e metadados na API da Twitch/IGDB sem expor suas credenciais no navegador.
                  </p>
                </div>

                {/* File 4: api/cron-sync.ts */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-mono font-bold text-pink-300">
                      <FileCode className="w-4 h-4 text-pink-400" />
                      <span>/api/cron-sync.ts (Serverless Cron na Vercel)</span>
                    </div>
                    <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      Já Criado no Repositório
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Função acionada automaticamente a cada hora para capturar novos torrents e salvar no Supabase.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Stack 100% pronta para produção e totalmente escalável</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-all"
          >
            Fechar Guia
          </button>
        </div>

      </div>
    </div>
  );
};
