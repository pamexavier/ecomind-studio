import { GoogleGenerativeAI } from "@google/generative-ai";
import { EnvironmentFormData, AnalysisResult } from "@/types/analysis";
import { resizeImage, fileToGenerativePart } from "@/utils/imageUtils";

const MODEL_NAME = "gemini-2.0-flash";
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || "");

const SYSTEM_INSTRUCTION = `Você é uma Auditora Técnica de Engenharia Ambiental.
Sua função não é dar dicas de decoração, mas sim identificar FALHAS estruturais e propor soluções de ALTA PERFORMANCE baseadas na NBR 15220.

PROIBIÇÕES RÍGIDAS:
- Proibido sugerir "tintas claras", "plantas" ou "abrir janelas" de forma genérica.
- Proibido ignorar erros normativos.

EXIGÊNCIAS:
- Se o pé-direito for inferior a 2.40m, o campo 'summary' DEVE começar com: "🚨 VIOLAÇÃO NORMATIVA DETECTADA".
- Identifique na foto/planta se há obstáculos à ventilação (móveis, paredes próximas).
- Sugira materiais com valores de Transmitância Térmica (U) específicos.
- Responda apenas em JSON puro.`;

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
  
  // Detecção de erro no código para reforçar no prompt
  const isIllegalHeight = height < 2.40;

  const prompt = `
    AUDITORIA TÉCNICA: ${formData.location}
    Pé-direito informado: ${height}m. (Mínimo NBR: 2.40m).
    Carga calculada: ${cargaCalculada}W.
    
    INSTRUÇÃO DE ANÁLISE:
    1. O pé-direito de ${height}m é aceitável? Se não, explique o impacto no acúmulo de calor (efeito estufa interno).
    2. Analise a imagem: a posição das aberturas permite ventilação cruzada real ou apenas estagnada?
    3. Recomende 3 materiais de construção (especificando o material, ex: lã de rocha, vidro duplo low-e) que reduziriam os ${cargaCalculada}W.

    ESTRUTURA JSON (MANTENHA OS NOMES DAS CHAVES):
    {
      "summary": "",
      "climate": { "climate": "", "bioclimaticZone": "", "solarIncidence": "", "criticalPoints": [] },
      "lighting": { "naturalLight": [], "artificialLight": { "lampType": "", "colorTemperature": "", "distribution": "" } },
      "thermal": { "loadEstimate": "${cargaCalculada}W", "passiveStrategies": [], "recommendedMaterials": [], "simpleAdjustments": [] },
      "materials": { "lighting": [], "ventilation": [], "finishes": [], "shading": [] },
      "disclaimer": "NBR 15220 aplicada."
    }
  `;

  const model = genAI.getGenerativeModel({ 
    model: MODEL_NAME,
    systemInstruction: SYSTEM_INSTRUCTION 
  });

  const imageParts = await Promise.all([
    ...ambienteFiles.map(async (f) => fileToGenerativePart(await resizeImage(f))),
    ...(plantaFile ? [fileToGenerativePart(await resizeImage(await resizeImage(plantaFile)))] : [])
  ]);

  const result = await model.generateContent([prompt, ...imageParts]);
  let text = result.response.text().trim();
  
  // Limpeza de Markdown (Crasas)
  if (text.startsWith("```")) {
    text = text.replace(/^```json/i, "").replace(/```$/g, "").trim();
  }

  const parsed = JSON.parse(text);

  return {
    id: `anls-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...parsed,
    thermal: { ...parsed.thermal, loadEstimate: `${cargaCalculada}W` }
  };
}