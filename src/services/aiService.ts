import { GoogleGenerativeAI } from "@google/generative-ai";
import { EnvironmentFormData, AnalysisResult } from "@/types/analysis";
import { resizeImage, fileToGenerativePart } from "@/utils/imageUtils";

// 1. Configurações Iniciais e Instância da IA
const MODEL_NAME = "gemini-2.0-flash";
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("VITE_GEMINI_API_KEY não configurada no arquivo .env");
}

const genAI = new GoogleGenerativeAI(API_KEY);

// 2. Instrução de Sistema (Personalidade e Regras)
const SYSTEM_INSTRUCTION = `Você é uma Engenheira Ambiental e Auditora Técnica especialista na NBR 15220:2023.
Sua missão é analisar imagens (plantas e fotos) e dados técnicos para emitir laudos de conformidade térmica.

REGRAS RÍGIDAS:
1. Responda exclusivamente em formato JSON, seguindo a interface AnalysisResult.
2. Identifique elementos térmicos visíveis: janelas (tamanho/orientação), materiais de parede e sombreamento.
3. Se o pé-direito informado for < 2.40m, classifique obrigatoriamente como 'ERRO CRÍTICO'.
4. Utilize terminologia técnica: Transmitância Térmica (U), Capacidade Térmica (C) e SRI.
5. Sugira estratégias passivas como ventilação cruzada, efeito chaminé ou inércia térmica conforme a região.`;

// 3. Função Principal de Análise
export async function generateAnalysis(
  formData: EnvironmentFormData,
  weatherData: any,
  ambienteFiles: File[],
  plantaFile?: File
): Promise<AnalysisResult> {
  
  try {
    // Lógica de cálculo determinística (Mastigando os dados para a IA)
    const area = Number(formData.area);
    const height = Number(formData.height);
    const deltaT = Math.max((weatherData?.temp || 30) - 24, 5);
    
    // Q = U * A * deltaT (Cálculo preciso feito no código)
    const cargaCalculada = Math.round(2.5 * (area * 1.2) * deltaT);
    const peDireitoStatus = height < 2.4 ? "ERRO CRÍTICO: Abaixo do mínimo legal (2.40m)" : "Conforme";

    // Inicializa o modelo com a Instrução de Sistema
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    // Processamento otimizado de imagens (Redimensionamento + Base64)
    const imageParts = await Promise.all([
      ...ambienteFiles.map(async (f) => {
        const resized = await resizeImage(f);
        return fileToGenerativePart(resized);
      }),
      ...(plantaFile ? [resizeImage(plantaFile).then(fileToGenerativePart)] : [])
    ]);

    // Prompt de Usuário (Apenas os fatos variáveis)
    const userPrompt = `
      DADOS DO AMBIENTE:
      - Localização: ${formData.location}
      - Medidas: ${area}m² de área com ${height}m de pé-direito (${peDireitoStatus}).
      - Carga Térmica Estimada: ${cargaCalculada}W.
      - Cobertura: ${formData.ceilingType}.
      - Clima Atual: ${weatherData?.temp}°C com ${weatherData?.humidade}% de umidade.

      TAREFA: 
      Com base nas fotos e planta anexadas, verifique a viabilidade de ventilação natural e sugira 3 materiais ou ajustes que reduziriam a carga térmica calculada.
    `;

    // Chamada para a API
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: userPrompt }, ...imageParts] }],
      generationConfig: {
        temperature: 0.2, // Baixa temperatura para maior rigor técnico
        responseMimeType: "application/json",
      }
    });

    const responseText = result.response.text();
    const parsed = JSON.parse(responseText);

    // Retorno formatado conforme a interface AnalysisResult
    return {
      id: `anls-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...parsed,
      thermal: {
        ...parsed.thermal,
        loadEstimate: `${cargaCalculada}W` // Inserindo o cálculo exato do código no relatório
      },
      disclaimer: "Análise técnica automatizada baseada na NBR 15220:2023."
    };

  } catch (error) {
    console.error("Erro no aiService:", error);
    throw error;
  }
}