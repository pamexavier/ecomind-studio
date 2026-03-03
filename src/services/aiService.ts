import { GoogleGenerativeAI } from "@google/generative-ai";
import { EnvironmentFormData, AnalysisResult } from "@/types/analysis";

const MODEL_NAME = "gemini-2.0-flash";
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("VITE_GEMINI_API_KEY não configurada.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

/* =========================================================
   BASE DE CONHECIMENTO — NBR 15220:2023
========================================================= */

const BASE_CONHECIMENTO_ZONAS: Record<string, string> = {
  "1": "Zona 1: Ênfase em isolamento térmico e ganho solar no inverno.",
  "2": "Zona 2: Isolamento no inverno e ventilação no verão.",
  "3": "Zona 3: Necessita massa térmica e ventilação cruzada.",
  "4": "Zona 4: Resfriamento evaporativo e ventilação intensa.",
  "5": "Zona 5: Alta inércia térmica e ventilação seletiva.",
  "6": "Zona 6: Ventilação constante, sombreamento rigoroso e baixa inércia térmica."
};

function buscarDiretrizPorCidade(localizacao: string): string {
  const loc = localizacao.toLowerCase();

  if (loc.includes("araguaina") || loc.includes("tocantins"))
    return BASE_CONHECIMENTO_ZONAS["6"];

  if (loc.includes("porto alegre") || loc.includes("rio grande do sul"))
    return BASE_CONHECIMENTO_ZONAS["1"];

  if (loc.includes("acre"))
    return BASE_CONHECIMENTO_ZONAS["6"];

  return "Zona não identificada automaticamente. Exigir verificação conforme NBR 15220:2023.";
}

/* =========================================================
   UTIL — CONVERTER ARQUIVO PARA BASE64
========================================================= */

async function fileToGenerativePart(file: File) {
  const base64Data = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () =>
      resolve((reader.result as string).split(",")[1]);
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: base64Data,
      mimeType: file.type
    }
  };
}

/* =========================================================
   FUNÇÃO PRINCIPAL
========================================================= */

export async function generateAnalysis(
  formData: EnvironmentFormData,
  weatherData: any,
  ambienteFiles: File[],
  plantaFile?: File
): Promise<AnalysisResult> {

  const diretrizEspecifica = buscarDiretrizPorCidade(formData.location);

  const volume = Number(formData.area) * Number(formData.height);
  const deltaT = Math.max((weatherData?.temp || 30) - 24, 5); // ΔT mínimo 5°C
  const area = Number(formData.area);

  /* =========================================================
     PROMPT RÍGIDO
  ========================================================= */

  const prompt = `
SISTEMA DE AUDITORIA TÉRMICA — MODO RIGOROSO

Você é Engenheira Ambiental e Auditora Técnica especialista em NBR 15220:2023.

⚠️ REGRAS ABSOLUTAS:
- Responder exclusivamente em Português (Brasil).
- Não escrever nada fora do JSON.
- Não usar inglês no corpo da análise.
- Não gerar texto explicativo fora da estrutura.
- Utilizar termos: Transmitância Térmica (U), Capacidade Térmica (C), SRI.
- Apresentar cálculo simplificado da carga térmica.

━━━━━━━━━━━━━━━━━━━━━━━
DIRETRIZ NBR 15220 (OBRIGATÓRIA):
${diretrizEspecifica}
━━━━━━━━━━━━━━━━━━━━━━━

DADOS:
Local: ${formData.location}
Área: ${area} m²
Pé-direito: ${formData.height} m
Volume: ${volume} m³
Cobertura: ${formData.ceilingType}
Exposição Solar: ${formData.sunPosition}
Temperatura externa: ${weatherData?.temp} °C
Umidade: ${weatherData?.humidade} %
ΔT considerado: ${deltaT} °C

━━━━━━━━━━━━━━━━━━━━━━━
CÁLCULO OBRIGATÓRIO:

Estimativa simplificada:
Q = U x A x ΔT

Considere:
U médio = 2,5 W/m²K (se não houver dado)
Área equivalente de troca = 1,2 x área
ΔT = ${deltaT}

Calcular carga térmica estimada em Watts.

Se pé-direito < 2.40m → classificar como ERRO CRÍTICO.

━━━━━━━━━━━━━━━━━━━━━━━
RESPONDER APENAS EM JSON:

{
  "summary": "",
  "climate": {
    "classification": "",
    "bioclimaticZone": "",
    "solarIncidence": "",
    "criticalPoints": []
  },
  "thermal": {
    "loadEstimateWatts": "",
    "calculationMemory": "",
    "passiveStrategies": [],
    "recommendedMaterials": []
  },
  "materials": {
    "lighting": [],
    "ventilation": [],
    "finishes": [],
    "shading": []
  },
  "nonCompliance": [],
  "visualPrompt": "Detailed architectural render prompt in English"
}

VALIDAR JSON antes de finalizar.
`;

  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: {
        temperature: 0.1,
        topP: 0.1,
        topK: 1,
        responseMimeType: "application/json"
      }
    });

    const imageParts: any[] = [];

    if (ambienteFiles?.length > 0) {
      const converted = await Promise.all(
        ambienteFiles.map(fileToGenerativePart)
      );
      imageParts.push(...converted);
    }

    if (plantaFile) {
      imageParts.push(await fileToGenerativePart(plantaFile));
    }

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text().trim();

    if (!text.startsWith("{")) {
      throw new Error("Resposta não retornou JSON válido.");
    }

    const parsed = JSON.parse(text);

    return {
      id: `analysis-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...parsed,
      disclaimer: "Análise técnica baseada na NBR 15220:2023."
    };

  } catch (error: any) {
    console.error("Erro no aiService:", error);

    return {
      id: `analysis-error-${Date.now()}`,
      createdAt: new Date().toISOString(),
      summary: "Falha na geração da análise técnica.",
      climate: {} as any,
      thermal: {} as any,
      materials: {} as any,
      nonCompliance: [],
      visualPrompt: "",
      disclaimer: "Erro técnico ao processar análise."
    };
  }
}