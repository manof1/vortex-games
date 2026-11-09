import { createClient } from '@supabase/supabase-js';

interface VercelRequest {
  method?: string;
  query: Record<string, string | string[] | undefined>;
  headers: Record<string, string | string[] | undefined>;
}

interface VercelResponse {
  status: (code: number) => VercelResponse;
  setHeader: (name: string, value: string) => void;
  send: (body: string) => void;
  end: () => void;
}

const DEFAULT_SUPABASE_URL = 'https://vcegxjfqmufdmyrhufan.supabase.co';
const DEFAULT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjZWd4amZxbXVmZG15cmh1ZmFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzMjgzOTAsImV4cCI6MjEwNjkwNDM5MH0.t-QVE78O6Clb4KKo8hhb1iXnIxXqhnxZgIoMK3D6Tdw';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

  const baseUrl = 'https://vortex-games-seven.vercel.app';
  const today = new Date().toISOString().split('T')[0];

  let gamesList: { slug: string; created_at?: string }[] = [];

  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data } = await supabase
      .from('games')
      .select('slug, created_at')
      .order('created_at', { ascending: false })
      .limit(1000);

    if (data && data.length > 0) {
      gamesList = data;
    }
  } catch (err) {
    console.error('Erro ao buscar jogos para sitemap:', err);
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Página Inicial Vortex Games -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Biblioteca Gamer -->
  <url>
    <loc>${baseUrl}/library</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;

  const seenSlugs = new Set<string>();

  for (const game of gamesList) {
    if (!game.slug || seenSlugs.has(game.slug)) continue;
    seenSlugs.add(game.slug);

    const gameDate = game.created_at ? new Date(game.created_at).toISOString().split('T')[0] : today;
    const gameUrl = `${baseUrl}/game/${encodeURIComponent(game.slug)}`;

    xml += `  <url>
    <loc>${gameUrl}</loc>
    <lastmod>${gameDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;
  }

  xml += `</urlset>`;

  return res.status(200).send(xml);
}
