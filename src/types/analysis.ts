export type RoomType = 'residencia' | 'academia' | 'comercio' | 'escritorio' | 'outro';
export type InterventionType = 'construcao' | 'retrofit';

export interface MaterialItem {
  name: string;
  description: string;
  purpose: string;
  estimatedQuantity?: string;
}

export interface EnvironmentFormData {
  roomType: RoomType;
  interventionType: InterventionType;
  location: string;
  description: string; // Aqui o usuário descreve o entorno (arborizado, centro urbano, etc)
  area: string;
  height: string;
  ceilingType: string;
  sunPosition: string;
  objectives: string[];
}

export interface AnalysisResult {
  id: string;
  createdAt: string;
  summary: string;
  expertObservation?: string; // Seu campo de revisão manual
  isCertified: boolean;       // Selo de revisão da Pamella
  formData?: EnvironmentFormData;
  climate: {
    climate: string;
    solarIncidence: string;
    criticalPoints: string[];
    bioclimaticZone: string;
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
    loadEstimate: string;
    maintenanceAlerts?: string[]; // Novos alertas (limpeza, fezes de aves, etc)
  };
  materials: {
    lighting: MaterialItem[];
    ventilation: MaterialItem[];
    finishes: MaterialItem[];
    shading: MaterialItem[];
  };
  disclaimer: string;
  visualPrompt?: string;
}