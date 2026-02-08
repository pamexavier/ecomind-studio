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
      Aja como Engenheira Sênior da EcomindsX. Missão: Diagnóstico técnico de precisão.
      
      DADOS TÉCNICOS:
      - Local: ${formData.location} | Área: ${formData.area}m² | Teto: ${formData.ceilingType}
      - Clima: ${weatherData?.temp}°C em Alvorada/POA.
      
      TAREFAS: Analise o Ar-condicionado e o forro de ${formData.ceilingType} na foto. Use a planta para orientação solar.

      ESTRUTURA OBRIGATÓRIA DO JSON (NÃO PULE NENHUMA CHAVE):
      {
        "summary": "...",
        "climateAnalysis": { "climate": "...", "solarIncidence": "...", "criticalPoints": [] },
        "lighting": { "naturalLight": [], "artificialLight": { "lampType": "", "colorTemperature": "", "distribution": "" } },
        "thermal": { "passiveStrategies": [], "recommendedMaterials": [], "simpleAdjustments": [], "estimatedTemperatureGain": "" },
        "materials": { "lighting": [], "ventilation": [], "finishes": [], "shading": [] },
        "disclaimer": "..."
      }
    `;

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