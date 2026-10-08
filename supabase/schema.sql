-- ==============================================================================
-- SCHEMA COMPLETO DO SUPABASE / POSTGRESQL PARA VORTEXGAMES
-- ==============================================================================
-- Cole este script no SQL Editor do Supabase (Painel -> SQL Editor -> New Query)
-- e clique em "RUN".
-- ==============================================================================

-- 0. EXTENSÃO PARA GERAÇÃO DE UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. LIMPEZA / RECOMEÇO DO ZERO (DROP CASCADE)
-- Remove com segurança versões antigas das tabelas para evitar erros de colunas faltantes (como release_date)
DROP TABLE IF EXISTS public.site_notifications CASCADE;
DROP TABLE IF EXISTS public.user_library CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.games CASCADE;

-- 2. TABELA PRINCIPAL DE JOGOS (GAMES)
-- Suporta Torrents PC, Arquivos PKG de Console (TheZukoStore) e Localização PT-BR
CREATE TABLE public.games (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  cover_url TEXT NOT NULL,
  banner_url TEXT,
  short_description TEXT,
  description TEXT,
  genres TEXT[] DEFAULT '{}',
  categories TEXT[] DEFAULT '{}',
  release_year INT,
  release_date TEXT,
  developer TEXT,
  publisher TEXT,
  
  -- Informações da Release e Crack
  repacker TEXT DEFAULT 'FitGirl Repack',
  version TEXT,
  repack_size TEXT NOT NULL,
  original_size TEXT,
  crack_status TEXT DEFAULT 'Crackeado',
  crack_group TEXT,
  
  -- Campos Especiais Console & Scene (TheZukoStore / Tapochek)
  title_id TEXT, -- Ex: CUSA-30477, CUSA-34388 (PlayStation)
  firmware TEXT, -- Ex: FW 5.05 - 11.00 ou ShadPS4 / RPCS3
  source_origin TEXT DEFAULT 'Multi-Tracker', -- 'TheZukoStore', 'Tapochek.net', 'FitGirl'
  has_pkg_format BOOLEAN DEFAULT false,
  has_pc_torrent BOOLEAN DEFAULT true,
  has_pt_br_audio BOOLEAN DEFAULT false,
  has_pt_br_subs BOOLEAN DEFAULT false,
  
  -- Estruturas Complexas em JSONB
  download_links JSONB NOT NULL DEFAULT '[]'::jsonb,
  system_requirements JSONB DEFAULT '{}'::jsonb,
  screenshots TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  dlc_included TEXT[] DEFAULT '{}',
  trailer_youtube_id TEXT,
  
  -- Métricas da Comunidade
  rating NUMERIC(3,1) DEFAULT 5.0,
  total_votes INT DEFAULT 1,
  downloads_count INT DEFAULT 0,
  views_count INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABELA DE COMENTÁRIOS E AVALIAÇÕES DA COMUNIDADE
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id TEXT NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  author_role TEXT DEFAULT 'user',
  content TEXT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  likes INT DEFAULT 0,
  verified_download BOOLEAN DEFAULT false,
  replies JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABELA DE BIBLIOTECA PESSOAL DO USUÁRIO
CREATE TABLE IF NOT EXISTS public.user_library (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('wishlist', 'playing', 'completed', 'backlog', 'downloaded')),
  user_rating INT CHECK (user_rating >= 1 AND user_rating <= 5),
  personal_notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, game_id)
);

-- 5. TABELA DE NOTIFICAÇÕES GLOBAIS DE LANÇAMENTOS
CREATE TABLE IF NOT EXISTS public.site_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  game_id TEXT REFERENCES public.games(id) ON DELETE SET NULL,
  type TEXT DEFAULT 'new_game',
  cover_url TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  is_read BOOLEAN DEFAULT false
);

-- ==============================================================================
-- 6. ÍNDICES DE PERFORMANCE PARA BUSCA RÁPIDA
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_games_title ON public.games USING gin(to_tsvector('portuguese', title));
CREATE INDEX IF NOT EXISTS idx_games_genres ON public.games USING gin(genres);
CREATE INDEX IF NOT EXISTS idx_games_title_id ON public.games(title_id);
CREATE INDEX IF NOT EXISTS idx_comments_game_id ON public.comments(game_id);
CREATE INDEX IF NOT EXISTS idx_user_library_user_id ON public.user_library(user_id);

-- ==============================================================================
-- 7. POLÍTICAS DE SEGURANÇA (ROW LEVEL SECURITY - RLS)
-- ==============================================================================
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_notifications ENABLE ROW LEVEL SECURITY;

-- Games: Leitura pública para todos os visitantes do site
DROP POLICY IF EXISTS "Jogos públicos para leitura anônima" ON public.games;
CREATE POLICY "Jogos públicos para leitura anônima"
  ON public.games FOR SELECT
  TO public
  USING (true);

-- Games: Inserção e atualização liberadas para o Cron/API e Administrador
DROP POLICY IF EXISTS "Admin pode inserir e atualizar jogos" ON public.games;
CREATE POLICY "Admin pode inserir e atualizar jogos"
  ON public.games FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Comments: Leitura pública de comentários
DROP POLICY IF EXISTS "Comentários públicos para visualização" ON public.comments;
CREATE POLICY "Comentários públicos para visualização"
  ON public.comments FOR SELECT
  TO public
  USING (true);

-- Comments: Qualquer visitante ou usuário pode publicar comentários
DROP POLICY IF EXISTS "Visitantes podem enviar comentários" ON public.comments;
CREATE POLICY "Visitantes podem enviar comentários"
  ON public.comments FOR INSERT
  TO public
  WITH CHECK (true);

-- User Library: Usuário só pode ver e alterar sua própria biblioteca
DROP POLICY IF EXISTS "Usuários acessam apenas sua biblioteca" ON public.user_library;
CREATE POLICY "Usuários acessam apenas sua biblioteca"
  ON public.user_library FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Notifications: Leitura pública
DROP POLICY IF EXISTS "Notificações públicas para visualização" ON public.site_notifications;
CREATE POLICY "Notificações públicas para visualização"
  ON public.site_notifications FOR SELECT
  TO public
  USING (true);

-- ==============================================================================
-- 8. EXEMPLOS DE SEED INICIAL (JOGOS COM TORRENT + PKG + PT-BR)
-- ==============================================================================
INSERT INTO public.games (
  id, title, slug, cover_url, banner_url, short_description, description,
  genres, categories, release_year, release_date, developer, publisher,
  repacker, repack_size, original_size, crack_status,
  title_id, firmware, source_origin, has_pkg_format, has_pc_torrent, has_pt_br_audio, has_pt_br_subs,
  rating, total_votes, downloads_count,
  download_links
) VALUES (
  'tlou-part-1-deluxe',
  'The Last of Us Part I: Digital Deluxe',
  'the-last-of-us-part-1-deluxe-pkg-cusa',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80',
  'Reviva a inesquecível jornada de Joel e Ellie. Versão com dados originais TheZukoStore (PKG) e Torrent PC (Tapochek.net) com dublagem consagrada em PT-BR.',
  'Em uma civilização devastada onde infectados e sobreviventes implacáveis estão à solta, o protagonista cansado da vida Joel é contratado para tirar uma garota de 14 anos, Ellie, de uma zona de quarentena militar.',
  ARRAY['Ação', 'Aventura', 'Sobrevivência'],
  ARRAY['AAA', 'Mais Populares'],
  2023,
  '28/03/2023',
  'Naughty Dog LLC',
  'PlayStation Publishing LLC',
  'TheZukoStore & Tapochek Tracker',
  '68.5 GB',
  '79.0 GB',
  'DRM Free',
  'CUSA-30477',
  'FW 5.05 - 11.00',
  'TheZukoStore',
  true,
  true,
  true,
  true,
  5.0,
  6120,
  165000,
  '[
    {
      "id": "dl-tlou-torrent",
      "type": "magnet",
      "format": "torrent",
      "platform": "PC",
      "label": "Torrent PC Original (Tracker Tapochek.net)",
      "url": "magnet:?xt=urn:btih:6182910293847102938471029384710293847102&dn=The.Last.Of.Us.Part.I.v1.1.3-Tapochek",
      "seeders": 6420,
      "size": "68.5 GB",
      "isPtBrAudio": true
    },
    {
      "id": "dl-tlou-pkg",
      "type": "pkg",
      "format": "pkg",
      "platform": "PS4",
      "label": "Arquivo PKG Console (TheZukoStore CUSA-30477)",
      "url": "https://thezukostore.com",
      "size": "64.2 GB",
      "titleId": "CUSA-30477",
      "firmware": "FW 5.05 - 11.00",
      "isPtBrAudio": true
    },
    {
      "id": "dl-tlou-patch-ptbr",
      "type": "pt_br_patch",
      "format": "pt_br_patch",
      "platform": "PC",
      "label": "Pacote Oficial de Dublagem PT-BR (Áudio Brasileiro)",
      "url": "https://thezukostore.com",
      "size": "3.4 GB",
      "isPtBrAudio": true
    }
  ]'::jsonb
) ON CONFLICT (id) DO NOTHING;
