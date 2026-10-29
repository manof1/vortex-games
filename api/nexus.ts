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

const NEXUS_API_BASE = 'https://api.nexusmods.com/v1';
const DEFAULT_NEXUS_API_KEY = process.env.NEXUSMODS_API_KEY || '/yRBULn8ic7+rpVMO63geT4EXIBi2z7aQ8rXmfx5kamz--BLoXrBunJxRmi3CX--FO0JMmR6GvUf90SPk+ALhw==';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, apikey');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const slug = (req.query.slug as string) || (req.body?.slug as string);
  const action = (req.query.action as string) || (req.body?.action as string) || 'trending';
  const apiKey = (req.headers.apikey as string) || DEFAULT_NEXUS_API_KEY;

  if (action === 'validate') {
    try {
      const response = await fetch(`${NEXUS_API_BASE}/users/validate.json`, {
        headers: {
          'apikey': apiKey,
          'Application-Name': 'VortexGames',
          'Application-Version': '2.5.0'
        }
      });

      if (!response.ok) {
        return res.status(response.status).json({ valid: false, error: 'Chave de API inválida' });
      }

      const userData = await response.json();
      return res.status(200).json({ valid: true, user: userData });
    } catch (err: any) {
      return res.status(500).json({ valid: false, error: err.message || 'Falha ao conectar com o Nexus Mods' });
    }
  }

  if (!slug) {
    return res.status(400).json({ error: 'Parâmetro "slug" do jogo é obrigatório (ex: cyberpunk2077, eldenring, witcher3).' });
  }

  try {
    const endpoint = action === 'latest' 
      ? `${NEXUS_API_BASE}/games/${slug}/mods/latest_added.json`
      : `${NEXUS_API_BASE}/games/${slug}/mods/trending.json`;

    const response = await fetch(endpoint, {
      headers: {
        'apikey': apiKey,
        'Application-Name': 'VortexGames',
        'Application-Version': '2.5.0'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Erro na API do Nexus Mods: HTTP ${response.status}`,
        slug
      });
    }

    const items = await response.json();
    return res.status(200).json({
      success: true,
      slug,
      action,
      count: Array.isArray(items) ? items.length : 0,
      mods: items
    });
  } catch (err: any) {
    return res.status(500).json({
      error: err.message || 'Erro interno ao consultar Nexus Mods'
    });
  }
}
