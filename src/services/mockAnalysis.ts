import { getWeatherData } from './weatherService';
import { generateAnalysis } from './aiService';
import { AnalysisRequest, AnalysisResult } from '@/types/analysis';

export async function analyzeEnvironment(request: AnalysisRequest): Promise<AnalysisResult> {
  const { formData, images, plantaImage } = request;

  // 1. Pega o clima real (Convertendo para número se vier como string)
  let weather = null;
  const lat = formData.latitude ? Number(formData.latitude) : null;
  const lon = formData.longitude ? Number(formData.longitude) : null;

  if (lat && lon && !isNaN(lat) && !isNaN(lon)) {
    try {
      weather = await getWeatherData(lat, lon);
      console.log("✅ Clima capturado com sucesso:", weather);
    } catch (e) {
      console.warn('Clima indisponível, seguindo sem dados reais.');
    }
  } else {
    console.warn('Coordenadas inválidas ou ausentes.');
  }

  // 2. Prepara os arquivos de imagem para a IA
  const ambienteFiles = images.map(img => img.file);
  const plantaFile = plantaImage?.file;

  // 3. Envia para o Gemini (aiService)
  // Agora passamos os arquivos separadamente para a IA analisar
  const aiResult = await generateAnalysis(
    formData, 
    weather, 
    ambienteFiles, 
    plantaFile
  );

  // 4. Retorna o resultado processado pela IA
  return aiResult;
}