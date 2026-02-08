import { createContext, useContext, useState, ReactNode } from 'react';
import { UploadedImage, EnvironmentFormData, AnalysisResult } from '@/types/analysis';

interface AnalysisContextType {
  images: UploadedImage[];
  plantaImage: UploadedImage | null; // Novo: Campo específico para a planta
  formData: EnvironmentFormData; // Removi o null para facilitar o acesso
  result: AnalysisResult | null;
  currentStep: number;
  isProcessing: boolean;
  
  setImages: (images: UploadedImage[]) => void;
  setPlantaImage: (image: UploadedImage | null) => void; // Ação para a planta
  addImage: (image: UploadedImage) => void;
  removeImage: (id: string) => void;
  updateFormData: (data: Partial<EnvironmentFormData>) => void; // Update parcial é melhor
  setResult: (result: AnalysisResult) => void;
  setCurrentStep: (step: number) => void;
  setIsProcessing: (processing: boolean) => void;
  resetAnalysis: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

// Atualizei o estado inicial com os novos campos técnicos
const initialFormData: EnvironmentFormData = {
  roomType: 'sala',
  location: '',
  objectives: [],
  description: '',
  area: '',        // Novo
  height: '',      // Novo
  ceilingType: 'laje', // Novo (default seguro)
  sunPosition: 'tarde', // Novo
};

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [plantaImage, setPlantaImage] = useState<UploadedImage | null>(null);
  const [formData, setFormData] = useState<EnvironmentFormData>(initialFormData);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const addImage = (image: UploadedImage) => {
    if (images.length < 3) {
      setImages(prev => [...prev, image]);
    }
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const img = prev.find(i => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter(i => i.id !== id);
    });
  };

  // Função mais inteligente para atualizar o formulário sem perder dados antigos
  const updateFormData = (data: Partial<EnvironmentFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const resetAnalysis = () => {
    images.forEach(img => URL.revokeObjectURL(img.preview));
    if (plantaImage) URL.revokeObjectURL(plantaImage.preview);
    setImages([]);
    setPlantaImage(null);
    setFormData(initialFormData);
    setResult(null);
    setCurrentStep(0);
    setIsProcessing(false);
  };

  return (
    <AnalysisContext.Provider
      value={{
        images,
        plantaImage,
        formData,
        result,
        currentStep,
        isProcessing,
        setImages,
        setPlantaImage,
        addImage,
        removeImage,
        updateFormData, // Usando a nova função de update
        setFormData: updateFormData as any, // Mantendo compatibilidade
        setResult,
        setCurrentStep,
        setIsProcessing,
        resetAnalysis,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
}