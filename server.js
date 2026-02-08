process.env.GOOGLE_APPLICATION_CREDENTIALS = "./google-creds.json";
import express from 'express';
import cors from 'cors';
import { GoogleAuth } from 'google-auth-library';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(express.json());

// ✅ CONFIGURAÇÕES DO SEU PROJETO (PEGUE DAQUI!)
const PROJECT_ID = 'gen-lang-client-0452653252';
const LOCATION = 'us-central1'; // ← SUA REGIÃO QUE FUNCIONOU
const API_ENDPOINT = 'us-central1-aiplatform.googleapis.com';

// ✅ MODELOS VERTEX AI DISPONÍVEIS
const MODELS = {
  IMAGEN_3: 'imagen-3.0-generate-001',
  IMAGEN_3_FAST: 'imagen-3.0-fast-generate-001',
  GEMINI_15_FLASH: 'gemini-1.5-flash-001',
  GEMINI_15_PRO: 'gemini-1.5-pro-001',
};

// ✅ AUTENTICAÇÃO COM SERVICE ACCOUNT
const auth = new GoogleAuth({
  keyFile: './google-credentials.json',
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});

// ✅ FUNÇÃO PARA OBTER TOKEN
async function getAccessToken() {
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  return token.token;
}

// ✅ ROTA PARA GERAÇÃO DE IMAGENS COM IMAGEN 3 (VERTEX AI)
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, aspectRatio = "16:9", numberOfImages = 1 } = req.body;
    
    if (!prompt || prompt.trim().length < 5) {
      return res.status(400).json({ 
        error: 'Prompt é obrigatório (mínimo 5 caracteres)',
        example: 'A professional architectural 3D render of a sustainable living room with natural lighting'
      });
    }

    console.log(`🎨 Gerando imagem Vertex AI: "${prompt.substring(0, 50)}..."`);
    
    const accessToken = await getAccessToken();
    
    // ✅ ENDPOINT CORRETO DO VERTEX AI
    const vertexUrl = `https://${API_ENDPOINT}/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODELS.IMAGEN_3_FAST}:predict`;
    
    console.log(`🔗 Chamando Vertex AI: ${MODELS.IMAGEN_3_FAST}`);
    
    const response = await fetch(vertexUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instances: [
          {
            prompt: prompt,
            // Parâmetros do Imagen 3
            aspectRatio: aspectRatio,
          }
        ],
        parameters: {
          sampleCount: parseInt(numberOfImages),
          safetyFilterLevel: "block_some",
          personGeneration: "allow_adult",
          addWatermark: false,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erro Vertex AI (${response.status}):`, errorText.substring(0, 200));
      
      // Tentar modelo principal se o fast falhar
      if (response.status === 404 || response.status === 400) {
        console.log('🔄 Tentando modelo Imagen 3 principal...');
        return await generateWithImagen3(prompt, aspectRatio, res);
      }
      
      return res.status(response.status).json({ 
        error: `Erro Vertex AI: ${response.statusText}`,
        details: errorText.substring(0, 500)
      });
    }

    const data = await response.json();
    
    // ✅ PROCESSAR RESPOSTA DO VERTEX AI
    if (data.predictions && data.predictions[0]) {
      const images = data.predictions.map((prediction, index) => {
        const base64Data = prediction.bytesBase64Encoded || prediction.bytes;
        return {
          index,
          mimeType: "image/png",
          base64: base64Data,
          imageUrl: `data:image/png;base64,${base64Data}`,
        };
      });

      console.log(`✅ Imagem gerada com sucesso! Modelo: ${MODELS.IMAGEN_3_FAST}`);
      
      res.json({
        success: true,
        images: images,
        model: MODELS.IMAGEN_3_FAST,
        prompt: prompt,
        aspectRatio: aspectRatio,
        timestamp: new Date().toISOString(),
      });
      
    } else {
      console.error("❌ Estrutura inesperada:", JSON.stringify(data).substring(0, 200));
      res.status(500).json({ 
        error: "Estrutura de resposta inesperada do Vertex AI",
        note: "Tente usar o modelo principal em vez do fast",
        data: data 
      });
    }
    
  } catch (error) {
    console.error("🔥 Erro na geração de imagem:", error.message);
    res.status(500).json({ 
      error: error.message,
      suggestion: "Verifique: 1) Credenciais 2) Permissões 3) Região"
    });
  }
});

// ✅ FUNÇÃO FALLBACK PARA IMAGEN 3 PRINCIPAL
async function generateWithImagen3(prompt, aspectRatio, res) {
  try {
    const accessToken = await getAccessToken();
    const vertexUrl = `https://${API_ENDPOINT}/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODELS.IMAGEN_3}:predict`;
    
    console.log(`🔗 Chamando: ${MODELS.IMAGEN_3}`);
    
    const response = await fetch(vertexUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instances: [{ 
          prompt: prompt,
          aspectRatio: aspectRatio,
        }],
        parameters: {
          sampleCount: 1,
          safetyFilterLevel: "block_some",
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Imagen 3 também falhou: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.predictions && data.predictions[0]) {
      const base64Data = data.predictions[0].bytesBase64Encoded;
      
      res.json({
        success: true,
        images: [{
          base64: base64Data,
          imageUrl: `data:image/png;base64,${base64Data}`,
        }],
        model: MODELS.IMAGEN_3,
        prompt: prompt,
        note: "Usado modelo Imagen 3 (não fast)",
      });
    } else {
      throw new Error("Resposta inválida do Imagen 3");
    }
    
  } catch (error) {
    console.error("❌ Fallback também falhou:", error.message);
    res.status(500).json({ 
      error: "Todos os modelos de imagem falharam",
      suggestion: "Use uma imagem de placeholder por enquanto",
      placeholder: `https://placehold.co/800x450/1a5fb4/ffffff?text=${encodeURIComponent(prompt.substring(0, 30))}`
    });
  }
}

// ✅ ROTA PARA ANÁLISE COM GEMINI (VERTEX AI)
app.post('/api/analyze', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt é obrigatório' });
    }

    const accessToken = await getAccessToken();
    const geminiUrl = `https://${API_ENDPOINT}/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODELS.GEMINI_15_FLASH}:generateContent`;
    
    console.log(`📝 Analisando com Gemini: "${prompt.substring(0, 50)}..."`);
    
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        }
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("❌ Erro Gemini:", data);
      return res.status(response.status).json(data);
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    
    res.json({
      success: true,
      analysis: text,
      model: MODELS.GEMINI_15_FLASH,
    });
    
  } catch (error) {
    console.error("🔥 Erro na análise:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ ROTA DE SAÚDE (TESTE)
app.get('/api/health', async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    
    res.json({
      status: 'healthy',
      project: PROJECT_ID,
      location: LOCATION,
      models: MODELS,
      credentials: {
        email: 'vertex-ai-ecominds-104@gen-lang-client-0452653252.iam.gserviceaccount.com',
        valid: true
      },
      timestamp: new Date().toISOString(),
      message: 'Vertex AI está funcionando!'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy',
      error: error.message 
    });
  }
});

// ✅ ROTA SIMPLES DE TESTE
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Ecominds Vertex AI Server está rodando!',
    endpoints: [
      'POST /api/generate-image',
      'POST /api/analyze', 
      'GET /api/health',
      'GET /api/test'
    ]
  });
});

// ✅ INICIAR SERVIDOR
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  🚀 VERTEX AI SERVER ONLINE
  ├── Porta: ${PORT}
  ├── Projeto: ${PROJECT_ID}
  ├── Região: ${LOCATION}
  ├── Email: vertex-ai-ecominds-104@gen-lang-client-0452653252.iam.gserviceaccount.com
  ├── Modelos disponíveis:
  │   ├── 🎨 Imagen 3: ${MODELS.IMAGEN_3}
  │   ├── ⚡ Imagen 3 Fast: ${MODELS.IMAGEN_3_FAST}
  │   └── 📝 Gemini 1.5 Flash: ${MODELS.GEMINI_15_FLASH}
  └── Rotas:
      ├── POST /api/generate-image
      ├── POST /api/analyze
      ├── GET /api/health
      └── GET /api/test
  `);
});