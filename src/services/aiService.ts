import { GoogleGenerativeAI } from "@google/generative-ai";
import { EnvironmentFormData, AnalysisResult } from "@/types/analysis";
import { resizeImage, fileToGenerativePart } from "@/utils/imageUtils";

const MODEL_NAME = "gemini-2.0-flash";
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) throw new Error("VITE_GEMINI_API_KEY não configurada.");
const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_INSTRUCTION = `Você é uma Auditora Técnica de Engenharia Ambiental e Consultora de Startups.
Sua missão é realizar diagnósticos de ALTA PERFORMANCE baseados na NBR 15220 e eficiência energética.

⚠️ DIRETRIZES DE AUDITORIA CRÍTICA:
1. PÉ-DIREITO: Se o valor informado for < 2.40m, o campo "summary" DEVE iniciar com "🚨 VIOLAÇÃO NORMATIVA: Pé-direito insuficiente". Explique o risco de estratificação de calor.
2. FINALIDADE (ACADEMIA): Se for Academia, considere o alto ganho de calor metabólico. Proíba soluções genéricas como "plantas". Exija vidros de alta performance ou ventilação forçada.
3. ENTORNO E MANUTENÇÃO: Analise o entorno (arborizado, litoral, urbano). Se houver árvores e vidro, ALERTE sobre acúmulo de detritos, fezes de aves e custos de limpeza.
4. RETROFIT vs CONSTRUÇÃO: Para Retrofit, foque em brises, películas e isolamentos internos. Para Construção, sugira mudanças na orientação das aberturas.

Responda APENAS em JSON puro, sem markdown.`;

export async function generateAnalysis(
  formData: EnvironmentFormData,
  weatherData: any,
  ambienteFiles: File[],
  plantaFile?: File
): Promise<AnalysisResult> {
  
  const area = Number(formData.area);
  const height = Number(formData.height);
  const deltaT = Math.max((weatherData?.temp || 30) - 24, 5);
  const cargaCalculada = Math.round(2.5 * (area * 1.2) * deltaT);

  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  // Processamento de Imagens (Ambiente + Planta)
  const imageParts = await Promise.all([
    ...ambienteFiles.map(async (f) => fileToGenerativePart(await resizeImage(f))),
    ...(plantaFile ? [fileToGenerativePart(await resizeImage(plantaFile))] : [])
  ]);

  const prompt = `
    DADOS DA AUDITORIA:
    - Local: ${formData.location} (Considere o microclima e entorno: ${formData.description})
    - Uso: ${formData.roomType.toUpperCase()} | Intervenção: ${formData.interventionType}
    - Medidas: ${area}m² x ${height}m. Carga Estimada: ${cargaCalculada}W.

    TAREFA TÉCNICA:
    1. Analise as fotos e a planta baixa: há ventilação cruzada efetiva?
    2. O pé-direito de ${height}m é adequado para uma ${formData.roomType}? 
    3. Quais os riscos de manutenção e patologias para este design no local ${formData.location}?
    
    ESTRUTURA JSON:
    {
      "summary": "",
      "climate": { "climate": "", "bioclimaticZone": "", "solarIncidence": "", "criticalPoints": [] },
      "lighting": { "naturalLight": [], "artificialLight": { "lampType": "", "colorTemperature": "", "distribution": "" } },
      "thermal": { "loadEstimate": "${cargaCalculada}W", "passiveStrategies": [], "recommendedMaterials": [], "simpleAdjustments": [], "maintenanceAlerts": [] },
      "materials": { "lighting": [], "ventilation": [], "finishes": [], "shading": [] },
      "disclaimer": "Análise técnica preliminar baseada na NBR 15220."
    }
  `;

  try {
    const result = await model.generateContent([prompt, ...imageParts]);
    let text = result.response.text().trim();
    if (text.startsWith("```")) text = text.replace(/^```json/i, "").replace(/```$/g, "").trim();

    const parsed = JSON.parse(text);

    return {
      id: `anls-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isCertified: false,
      ...parsed,
      thermal: {
        ...parsed.thermal,
        loadEstimate: `${cargaCalculada}W`
      }
    };
  } catch (error) {
    console.error("Erro na Auditoria:", error);
    throw error;
  }
}