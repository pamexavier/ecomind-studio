// Serviço de análise mockado - preparado para integração futura com IA real
import { AnalysisRequest, AnalysisResult, SimulationStatus } from '@/types/analysis';

// Simula delay de processamento
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock de análise baseado nos dados fornecidos
export async function analyzeEnvironment(
  request: AnalysisRequest, 
  originalImageUrl?: string
): Promise<AnalysisResult> {
  // Simula tempo de processamento da IA
  await delay(3000);
  
  const { formData } = request;
  const isHotClimate = formData.location.toLowerCase().includes('nordeste') || 
                       formData.location.toLowerCase().includes('rio') ||
                       formData.location.toLowerCase().includes('bahia');
  
  const result: AnalysisResult = {
    id: `analysis-${Date.now()}`,
    createdAt: new Date().toISOString(),
    summary: generateSummary(formData),
    climate: {
      climate: isHotClimate 
        ? 'Clima tropical/quente com alta incidência solar durante a maior parte do ano'
        : 'Clima temperado com variações sazonais moderadas',
      solarIncidence: formData.windowPosition === 'frente'
        ? 'Alta exposição solar no período da manhã, com picos entre 9h e 12h'
        : formData.windowPosition === 'fundos'
        ? 'Incidência solar concentrada no período da tarde, entre 14h e 17h'
        : 'Exposição solar lateral, com luz indireta durante boa parte do dia',
      criticalPoints: [
        'Aquecimento excessivo próximo às janelas entre 11h e 15h',
        'Iluminação natural insuficiente no fundo do ambiente',
        'Falta de ventilação cruzada adequada',
      ],
    },
    lighting: {
      naturalLight: [
        'Instalar película de controle solar nas janelas para reduzir calor sem bloquear luz',
        'Adicionar espelhos estrategicamente para ampliar a reflexão da luz natural',
        'Considerar claraboias ou tubos de luz solar para áreas mais escuras',
        'Usar cortinas de tecido leve em cores claras para difundir a luz',
      ],
      artificialLight: {
        lampType: 'LED de alta eficiência energética',
        colorTemperature: formData.roomType === 'escritorio' 
          ? '4000K a 5000K (luz neutra a fria para concentração)'
          : formData.roomType === 'quarto'
          ? '2700K a 3000K (luz quente para relaxamento)'
          : '3000K a 4000K (luz neutra versátil)',
        distribution: 'Combinação de iluminação geral no teto com pontos de luz direcionada para tarefas específicas',
      },
    },
    thermal: {
      passiveStrategies: [
        'Promover ventilação cruzada abrindo janelas em lados opostos',
        'Instalar brises ou pergolados para sombreamento externo',
        'Pintar paredes externas em cores claras para refletir o calor',
        'Criar áreas verdes próximas às janelas para resfriamento natural',
      ],
      recommendedMaterials: [
        'Tintas térmicas com microesferas cerâmicas para isolamento',
        'Mantas térmicas sob o telhado para reduzir transferência de calor',
        'Pisos em materiais naturais (cerâmica, porcelanato) que mantêm frescor',
        'Tecidos naturais (algodão, linho) em cortinas e estofados',
      ],
      simpleAdjustments: [
        'Fechar cortinas durante os horários de pico solar',
        'Usar ventiladores de teto para melhorar a sensação térmica',
        'Posicionar móveis grandes longe das fontes de calor',
        'Adicionar plantas que ajudam a resfriar o ambiente',
      ],
    },
    materials: generateMaterialsList(formData),
    conceptualImageUrl: undefined, // Será preenchido pela API de geração de imagem
    visualSimulation: {
      originalImageUrl: originalImageUrl || '',
      optimizedImageUrl: undefined,
      status: 'loading' as SimulationStatus,
    },
    disclaimer: 'Este diagnóstico apresenta estimativas conceituais baseadas em análise visual e informações fornecidas. Não substitui projeto técnico elaborado por profissional habilitado. Para execução das sugestões, consulte um arquiteto ou engenheiro.',
  };
  
  // Simula processamento da imagem otimizada (para demo, muda para 'error' após delay)
  // Em produção, isso seria substituído pela chamada real à API de geração de imagem
  setTimeout(() => {
    result.visualSimulation!.status = 'error';
  }, 2000);
  
  return result;
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

function generateMaterialsList(formData: AnalysisRequest['formData']) {
  const hasDimensions = formData.dimensions?.width && formData.dimensions?.length;
  const area = hasDimensions 
    ? (formData.dimensions!.width! * formData.dimensions!.length!).toFixed(1)
    : undefined;
  
  return {
    lighting: [
      {
        name: 'Lâmpadas LED tubulares',
        description: 'LED T8 18W, 4000K',
        purpose: 'Iluminação geral eficiente com boa reprodução de cores',
        estimatedQuantity: area ? `${Math.ceil(Number(area) / 5)} unidades` : 'A calcular conforme medidas',
      },
      {
        name: 'Spots direcionáveis',
        description: 'LED 7W embutir, ajustável',
        purpose: 'Iluminação de destaque e tarefas específicas',
        estimatedQuantity: hasDimensions ? '4 a 6 unidades' : 'A calcular conforme medidas',
      },
      {
        name: 'Fita LED',
        description: 'Fita 12V, 4000K, IP20',
        purpose: 'Iluminação indireta para conforto visual',
        estimatedQuantity: area ? `${Math.ceil(Number(area) * 0.8)}m` : 'A calcular conforme medidas',
      },
    ],
    ventilation: [
      {
        name: 'Ventilador de teto',
        description: 'Modelo silencioso com controle remoto',
        purpose: 'Circulação de ar e sensação de frescor',
        estimatedQuantity: area && Number(area) > 15 ? '2 unidades' : '1 unidade',
      },
      {
        name: 'Tela mosquiteiro',
        description: 'Tela retrátil para janelas',
        purpose: 'Permitir ventilação natural com proteção',
        estimatedQuantity: 'Conforme número de janelas',
      },
    ],
    finishes: [
      {
        name: 'Tinta térmica',
        description: 'Tinta acrílica com isolamento térmico',
        purpose: 'Reduzir absorção de calor pelas paredes',
        estimatedQuantity: area ? `${Math.ceil(Number(area) * 0.4)} litros` : 'A calcular conforme medidas',
      },
      {
        name: 'Papel de parede texturizado',
        description: 'Fibra natural em tons claros',
        purpose: 'Melhorar estética e absorção acústica',
        estimatedQuantity: 'Parede de destaque: ~10m²',
      },
    ],
    shading: [
      {
        name: 'Cortina blackout',
        description: 'Tecido térmico com trilho silencioso',
        purpose: 'Bloqueio total de luz e calor quando necessário',
        estimatedQuantity: 'Conforme largura das janelas',
      },
      {
        name: 'Persiana rolô',
        description: 'Screen 5% - visão externa com proteção',
        purpose: 'Controle de luz mantendo vista para exterior',
        estimatedQuantity: 'Conforme número de janelas',
      },
      {
        name: 'Película solar',
        description: 'Película refletiva 35% transparência',
        purpose: 'Reduzir entrada de calor solar em até 70%',
        estimatedQuantity: 'Conforme área de vidros',
      },
    ],
  };
}

// Mock para geração de imagem conceitual
export async function generateConceptualImage(analysisId: string): Promise<string> {
  await delay(2000);
  
  // Por enquanto retorna um placeholder
  // Em produção, integrará com API de geração de imagem
  return '/placeholder.svg';
}
