// Tipos para o sistema EcoMindsX Studio

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

export type WindowPosition = 'frente' | 'lateral' | 'fundos' | 'nenhuma';

export interface EnvironmentDimensions {
  width?: number;
  length?: number;
  height?: number;
}

export interface EnvironmentFormData {
  // Required fields
  roomType: RoomType;
  location: string;
  latitude?: number;
  longitude?: number;
  objectives: ObjectiveType[];
  description: string;
  
  // Optional fields
  dimensions?: EnvironmentDimensions;
  windowPosition?: WindowPosition;
  budget?: BudgetLevel;
}

export interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

export interface AnalysisRequest {
  images: UploadedImage[];
  formData: EnvironmentFormData;
}

// Resultado da análise
export interface ClimateAnalysis {
  climate: string;
  solarIncidence: string;
  criticalPoints: string[];
}

export interface LightingAnalysis {
  naturalLight: string[];
  artificialLight: {
    lampType: string;
    colorTemperature: string;
    distribution: string;
  };
}

export interface ThermalAnalysis {
  passiveStrategies: string[];
  recommendedMaterials: string[];
  simpleAdjustments: string[];
}

export interface MaterialItem {
  name: string;
  description: string;
  purpose: string;
  estimatedQuantity?: string;
}

export interface MaterialsList {
  lighting: MaterialItem[];
  ventilation: MaterialItem[];
  finishes: MaterialItem[];
  shading: MaterialItem[];
}

export type SimulationStatus = 'loading' | 'ready' | 'error';

export interface VisualSimulation {
  originalImageUrl: string;
  optimizedImageUrl?: string;
  status: SimulationStatus;
}

export interface AnalysisResult {
  id: string;
  createdAt: string;
  summary: string;
  climate: ClimateAnalysis;
  lighting: LightingAnalysis;
  thermal: ThermalAnalysis;
  materials: MaterialsList;
  conceptualImageUrl?: string;
  visualSimulation?: VisualSimulation;
  disclaimer: string;
}
