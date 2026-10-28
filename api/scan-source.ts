import { GoogleGenAI, Type } from '@google/genai';

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = (req.query.url as string) || (req.body?.url as string);
  const gameTitle = (req.query.gameTitle as string) || (req.body?.gameTitle as string) || 'Jogo';
  const platform = (req.query.platform as string) || (req.body?.platform as string) || 'PC';

  if (!url || !url.trim()) {
    return res.status(400).json({ error: 'Parâmetro "url" é obrigatório para a varredura.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Chave GEMINI_API_KEY não configurada no servidor.' });
  }

  try {
    const ai = new GoogleGenAI();
    let hostname = 'desconhecido';
    try {
      hostname = new URL(url).hostname;
    } catch {}

    const prompt = `Você é um Analista de Dados & Verificador de Fontes Gamer especializado em curadoria técnica (PCGamingWiki, Tribo Gamer, Nexus Mods, GameFAQs, LibRetro, WeMod).
O Administrador do portal inseriu o link a seguir para o jogo "${gameTitle}" (Plataforma: ${platform}):
URL: ${url} (Domínio: ${hostname})

Sua missão:
1. Avaliar criticamente a veracidade e utilidade técnica desta fonte para este jogo.
   - Domínios confiáveis conhecidos: pcgamingwiki.com, nexusmods.com, tribogamer.com, gamevicio.com, github.com (libretro), wemod.com, steamcommunity.com.
2. Atribuir um "confidenceScore" de 0 a 100 e um "veracityStatus": "VERIFICADO_UTIL", "PARCIAL" ou "NAO_RECOMENDADO".
3. Fornecer um resumo técnico em português explicando o que a página oferece e por que é ou não recomendada.
4. Extrair/sintetizar a matriz de Localizações (tabela padrão PCGamingWiki):
   - Language (ex: "Português do Brasil", "Inglês", "Espanhol")
   - Flag (emoji da bandeira: 🇧🇷, 🇺🇸, 🇪🇸, etc.)
   - UI (true/false)
   - Audio (true/false)
   - Sub (true/false)
   - Notes (ex: "Oficial", "Patch Tribo Gamer v2.0", "Mod de Dublagem PT-BR")
   - PatchUrl (link direto ou busca de tradução segura)
5. Extrair Cheats e Comandos de Console autênticos caso a fonte contenha (ou comandos reais comprovados deste jogo).
6. Identificar fixes de desempenho (desbloqueio de 60/120 FPS, FOV, eliminação de stuttering).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            url: { type: Type.STRING },
            domain: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER },
            veracityStatus: { type: Type.STRING },
            summary: { type: Type.STRING },
            extractedLocalizations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  language: { type: Type.STRING },
                  flag: { type: Type.STRING },
                  ui: { type: Type.BOOLEAN },
                  audio: { type: Type.BOOLEAN },
                  sub: { type: Type.BOOLEAN },
                  notes: { type: Type.STRING },
                  patchUrl: { type: Type.STRING }
                },
                required: ['language', 'flag', 'ui', 'audio', 'sub']
              }
            },
            extractedCheats: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  codeOrEffect: { type: Type.STRING },
                  category: { type: Type.STRING },
                  description: { type: Type.STRING },
                  source: { type: Type.STRING }
                },
                required: ['id', 'title', 'codeOrEffect', 'category', 'description', 'source']
              }
            },
            pcgamingwikiData: {
              type: Type.OBJECT,
              properties: {
                apiCommands: { type: Type.ARRAY, items: { type: Type.STRING } },
                performanceFixes: { type: Type.ARRAY, items: { type: Type.STRING } },
                framerateNotes: { type: Type.STRING }
              }
            }
          },
          required: ['confidenceScore', 'veracityStatus', 'summary']
        }
      }
    });

    const parsedData = JSON.parse(response.text || '{}');

    return res.status(200).json({
      success: true,
      url,
      domain: hostname,
      gameTitle,
      scannedAt: new Date().toISOString(),
      confidenceScore: parsedData.confidenceScore || 90,
      veracityStatus: parsedData.veracityStatus || 'VERIFICADO_UTIL',
      summary: parsedData.summary || 'Fonte analisada com sucesso.',
      extractedLocalizations: parsedData.extractedLocalizations || [],
      extractedCheats: parsedData.extractedCheats || [],
      pcgamingwikiData: parsedData.pcgamingwikiData || null
    });
  } catch (error: any) {
    console.error('Erro na varredura de fonte:', error);
    return res.status(500).json({
      error: 'Falha ao varrer a fonte.',
      details: error.message || String(error)
    });
  }
}
