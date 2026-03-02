import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL_NAME = "gemini-flash-latest"; // Usando o modelo mais estável recomendado
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// Função para listar os modelos disponíveis na sua chave Google
export async function listAvailableModels() {
  try {
    // Busca a lista de modelos disponíveis para a sua chave
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await response.json();
    console.log("🔍 MODELOS DISPONÍVEIS NA SUA CHAVE:");
    data.models.forEach((m: any) => {
      console.log(`Nome: ${m.name} | Suporta: ${m.supportedGenerationMethods}`);
    });
  } catch (error) {
    console.error("Erro ao listar modelos:", error);
  }
}

// Chama a função assim que o módulo for carregado
listAvailableModels();

// Função auxiliar para converter arquivo em parte compreensível pela IA
async function fileToGenerativePart(file: File) {
  const base64Data = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return { inlineData: { data: base64Data, mimeType: file.type } };
}

export async function generateAnalysis(formData: any, weatherData: any, ambienteFile?: File, plantaFile?: File) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: MODEL_NAME,
      generationConfig: { responseMimeType: "application/json" } // Força o Google a responder JSON puro
    });

    const imageParts = [];
    if (ambienteFile) imageParts.push(await fileToGenerativePart(ambienteFile));
    if (plantaFile) imageParts.push(await fileToGenerativePart(plantaFile));

    const prompt = `
Você é uma Engenheira Ambiental especialista em conforto térmico e eficiência energética conforme NBR 15220.

REGRAS OBRIGATÓRIAS:
- Utilize explicitamente os dados climáticos fornecidos.
- Classifique a ZONA BIOCLIMÁTICA conforme NBR 15220.
- Justifique cada recomendação com base no clima e orientação solar.
- É PROIBIDO gerar sugestões genéricas.
- Se faltar dado, declare explicitamente qual dado está ausente.

DADOS DO PROJETO:
Localização: ${formData.location}
Latitude/Longitude: ${formData.lat}, ${formData.lng}
Dimensões: ${formData.width}m x ${formData.length}m x ${formData.height}m
Área estimada: ${formData.width * formData.length} m²
Descrição do ambiente: ${formData.description}
Objetivos: ${formData.objectives?.join(', ')}

DADOS CLIMÁTICOS REAIS:
Temperatura média anual: ${weatherData.avgTemp}°C
Temperatura máxima média: ${weatherData.maxTemp}°C
Temperatura mínima média: ${weatherData.minTemp}°C
Umidade média: ${weatherData.humidity}%
Direção predominante dos ventos: ${weatherData.windDirection}
Radiação solar média: ${weatherData.solarRadiation}

INSTRUÇÕES:
1. Determine a zona bioclimática.
2. Explique o comportamento térmico esperado.
3. Identifique riscos reais de sobreaquecimento ou subaquecimento.
4. Calcule estimativa simplificada de carga térmica considerando área envidraçada estimada de 20% da fachada.
5. Gere estimativa de redução térmica para cada estratégia proposta.
6. Estime quantitativo de materiais com base na área.

ESTRUTURA JSON OBRIGATÓRIA:
{ ... }
`;
      

    console.log("Dados que estão indo para a IA:", formData);
    const result = await model.generateContent([prompt, ...imageParts]);
    const text = result.response.text();
    
    // Limpeza de segurança para garantir que o JSON seja lido corretamente
    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}') + 1;
    return JSON.parse(text.substring(startIndex, endIndex));

  } catch (error: any) {
    console.error("Erro na Engenharia da IA:", error);
    throw error;
  }
}