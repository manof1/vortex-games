interface VercelRequest {
  method?: string;
  query: Record<string, string | string[] | undefined>;
  body?: any;
  headers: Record<string, string | string[] | undefined>;
}

interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (data: any) => void;
  setHeader: (name: string, value: string) => void;
  end: () => void;
}

// Cache in-memory for Twitch OAuth token
let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function getTwitchToken(clientId: string, clientSecret: string): Promise<string> {
  const now = Date.now();
  if (cachedToken && tokenExpiresAt > now + 60000) {
    return cachedToken;
  }

  const tokenRes = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    { method: 'POST' }
  );

  if (!tokenRes.ok) {
    throw new Error(`Falha ao obter token da Twitch: ${tokenRes.statusText}`);
  }

  const data = await tokenRes.json();
  cachedToken = data.access_token;
  tokenExpiresAt = now + data.expires_in * 1000;
  return cachedToken as string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const query = (req.query.search as string) || (req.body?.search as string);
  if (!query) {
    return res.status(400).json({ error: 'Parâmetro "search" é obrigatório.' });
  }

  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ 
      error: 'Variáveis TWITCH_CLIENT_ID ou TWITCH_CLIENT_SECRET não configuradas na Vercel.' 
    });
  }

  try {
    const token = await getTwitchToken(clientId, clientSecret);

    // Consulta à API IGDB
    const igdbQuery = `
      search "${query.replace(/"/g, '')}";
      fields name, summary, first_release_date, cover.url, genres.name, involved_companies.company.name, screenshots.url, total_rating;
      limit 10;
    `;

    const igdbRes = await fetch('https://api.igdb.com/v4/games', {
      method: 'POST',
      headers: {
        'Client-ID': clientId,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'text/plain'
      },
      body: igdbQuery
    });

    if (!igdbRes.ok) {
      const errText = await igdbRes.text();
      return res.status(igdbRes.status).json({ error: 'Erro IGDB API', details: errText });
    }

    const games = await igdbRes.json();

    // Formatar dados para o frontend do VortexGames
    const formatted = games.map((g: any) => {
      const coverUrl = g.cover?.url 
        ? `https:${g.cover.url.replace('t_thumb', 't_cover_big')}` 
        : 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80';

      const screenshots = (g.screenshots || []).map((s: any) => `https:${s.url.replace('t_thumb', 't_screenshot_big')}`);
      const releaseYear = g.first_release_date ? new Date(g.first_release_date * 1000).getFullYear() : new Date().getFullYear();
      const developer = g.involved_companies?.[0]?.company?.name || 'Estúdio Desconhecido';

      return {
        id: g.id,
        name: g.name,
        coverUrl,
        bannerUrl: screenshots[0] || coverUrl,
        summary: g.summary || 'Sem sinopse disponível.',
        genres: (g.genres || []).map((gen: any) => gen.name),
        releaseYear,
        releaseDate: g.first_release_date ? new Date(g.first_release_date * 1000).toLocaleDateString('pt-BR') : 'Lançamento',
        developer,
        publisher: developer,
        screenshots,
        rating: g.total_rating ? parseFloat((g.total_rating / 20).toFixed(1)) : 4.8
      };
    });

    return res.status(200).json(formatted);
  } catch (error: any) {
    console.error('Erro na rota IGDB:', error);
    return res.status(500).json({ error: error.message || 'Erro interno no servidor' });
  }
}
