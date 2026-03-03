import { createContext, useContext, useState, ReactNode } from 'react';
import { UploadedImage, EnvironmentFormData, AnalysisResult } from '@/types/analysis';

interface AnalysisContextType {
  images: UploadedImage[];
  plantaImage: UploadedImage | null;
  formData: EnvironmentFormData;
  result: AnalysisResult | null;
  currentStep: number;
  isProcessing: boolean;
  
  setImages: (images: UploadedImage[]) => void;
  setPlantaImage: (image: UploadedImage | null) => void;
  addImage: (image: UploadedImage) => void;
  removeImage: (id: string) => void;
  updateFormData: (data: Partial<EnvironmentFormData>) => void;
  setResult: (result: AnalysisResult) => void;
  setCurrentStep: (step: number) => void;
  setIsProcessing: (processing: boolean) => void;
  resetAnalysis: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

const initialFormData: EnvironmentFormData = {
  roomType: 'sala',
  location: '',
  objectives: [],
  description: '',
  area: '',
  height: '',
  ceilingType: 'laje',
  sunPosition: 'tarde',
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
        updateFormData,
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
