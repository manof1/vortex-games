# Vortex Games - Portal de Jogos & Repacks

Portal gamer moderno com suporte a catálogo de jogos, lançamentos Repack (FitGirl), dados de console (TheZukoStore PKG) e trackers originais (Tapochek), com localização PT-BR e integração com Supabase e Vercel.

## 🚀 Como Rodar Localmente

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Abra no navegador: `http://localhost:3000`

## 📦 Como Publicar na Vercel

1. Suba este repositório para o seu GitHub.
2. No painel da [Vercel](https://vercel.com), clique em **Add New... -> Project** e importe o repositório.
3. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`: URL da sua instância Supabase
   - `VITE_SUPABASE_ANON_KEY`: Chave anônima pública do Supabase
4. Clique em **Deploy**.
