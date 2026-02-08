// ...mantém a versão HEAD...
import { getWeatherData } from './weatherService';
import { generateAnalysis } from './aiService';
import { AnalysisRequest, AnalysisResult } from '@/types/analysis';

export async function analyzeEnvironment(request: AnalysisRequest): Promise<AnalysisResult> {
  const { formData } = request;


  // 1. Pega o clima real (só se latitude/longitude forem válidos)
  // 1. Pega o clima real (Convertendo para número se vier como string)
let weather = null;

const lat = Number(formData.latitude);
const lon = Number(formData.longitude);

if (!isNaN(lat) && !isNaN(lon) && lat !== 0 && lon !== 0) {
  try {
    weather = await getWeatherData(lat, lon);
    console.log("✅ Clima capturado com sucesso:", weather);
  } catch (e) {
    console.warn('Clima indisponível, seguindo sem dados reais.');
  }
} else {
  console.warn('Coordenadas inválidas ou ausentes. Verifique o mapa no formulário.');
}
  // 2. Envia tudo para o Gemini
  const aiResult = await generateAnalysis(formData, weather);

  // 3. Monta o resultado final que a tela vai exibir
  return {
    id: `analysis-${Date.now()}`,
    createdAt: new Date().toISOString(),
    summary: aiResult.summary,
    climate: aiResult.climateAnalysis,
    lighting: aiResult.lighting,
    thermal: aiResult.thermal,
    materials: generateMaterialsList(formData, aiResult), // Agora enviamos o resultado da IA aqui!
    visualSimulation: {
      originalImageUrl: formData.imageUrl || '',
      optimizedImageUrl: aiResult.visualPrompt || 'A sustainable modern room',
      status: 'ready'
    },
    disclaimer: 'Esta análise foi gerada por inteligência artificial com base em dados climáticos reais.'
  };
// ...mantém a versão HEAD...
}

function generateSummary(formData: AnalysisRequest['formData']): string {
  const objectiveTexts: Record<string, string> = {
    iluminacao_natural: 'melhorar a iluminação natural',
    menos_calor: 'reduzir o calor excessivo',
    conforto_termico: 'otimizar o conforto térmico',
    estetica: 'aprimorar a estética do ambiente',
    sustentabilidade: 'aumentar a sustentabilidade',
  };
  
  const objectives = formData.objectives
    .map(obj => objectiveTexts[obj])
    .join(', ')
    .replace(/, ([^,]*)$/, ' e $1');
  
  return `Análise completa do ${formData.roomType} localizado em ${formData.location}. ` +
    `Os principais objetivos identificados são: ${objectives}. ` +
    `Com base nas imagens e informações fornecidas, desenvolvemos um conjunto de recomendações práticas ` +
    `que equilibram eficiência energética, conforto ambiental e viabilidade econômica.`;
}

function generateMaterialsList(formData: any, aiResult: any) {
  const area = formData.dimensions?.width && formData.dimensions?.length
    ? formData.dimensions.width * formData.dimensions.length
    : undefined;

  // Mapeia sugestões da IA para cada categoria
  const mapCategory = (category: string) =>
    aiResult.suggestions?.[category]?.map((item: any) => ({
      name: item.productName,
      description: item.technicalSpec,
      purpose: item.reasoning,
      estimatedQuantity: area && item.coverage
        ? `${Math.ceil(area / item.coverage)} un`
        : 'Sob medida'
    })) || [];

  return {
    lighting: mapCategory('lighting'),
    ventilation: mapCategory('ventilation'),
    finishes: mapCategory('finishes'),
    shading: mapCategory('shading'),
  };
}

// Mock para geração de imagem conceitual
export async function generateConceptualImage(analysisId: string): Promise<string> {
  await delay(2000);
  
  // Por enquanto retorna um placeholder
  // Em produção, integrará com API de geração de imagem
  return '/placeholder.svg';
}
