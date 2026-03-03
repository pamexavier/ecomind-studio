export type RoomType = 
  | 'sala' 
  | 'quarto' 
  | 'escritorio' 
  | 'cozinha' 
  | 'banheiro' 
  | 'varanda' 
  | 'outro';

export type ObjectiveType = 
  | 'iluminacao_natural' 
  | 'menos_calor' 
  | 'conforto_termico' 
  | 'estetica' 
  | 'sustentabilidade';

export type BudgetLevel = 'baixo' | 'medio' | 'alto';

// Atualizado para refletir o formulário real
export interface EnvironmentFormData {
  roomType: RoomType;
  location: string;
  latitude?: number;
  longitude?: number;
  objectives: ObjectiveType[];
  description: string;
  area: string;          // Novo
  height: string;        // Novo
  ceilingType: string;   // Novo
  sunPosition: string;   // Novo
  budget?: BudgetLevel;
}

export interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

export interface AnalysisRequest {
  images: UploadedImage[];
  plantaImage: UploadedImage | null; // Adicionado para suportar a planta separada
  formData: EnvironmentFormData;
}

// Estrutura de resposta que a IA DEVE seguir
export interface AnalysisResult {
  id: string;
  createdAt: string;
  summary: string;
  climate: {
    climate: string;
    solarIncidence: string;
    criticalPoints: string[];
    bioclimaticZone: string; // Novo campo NBR 15220
  };
  lighting: {
    naturalLight: string[];
    artificialLight: {
      lampType: string;
      colorTemperature: string;
      distribution: string;
    };
  };
  thermal: {
    passiveStrategies: string[];
    recommendedMaterials: string[];
    simpleAdjustments: string[];
    loadEstimate: string; // Novo
  };
  materials: {
    lighting: MaterialItem[];
    ventilation: MaterialItem[];
    finishes: MaterialItem[];
    shading: MaterialItem[];
  };
  visualPrompt?: string; // Para a simulação visual
  disclaimer: string;
}

export interface MaterialItem {
  name: string;
  description: string;
  purpose: string;
  estimatedQuantity?: string;
}
