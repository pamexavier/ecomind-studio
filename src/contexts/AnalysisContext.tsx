import { createContext, useContext, useState, ReactNode } from 'react';
import { UploadedImage, EnvironmentFormData, AnalysisResult } from '@/types/analysis';

interface AnalysisContextType {
  // State
  images: UploadedImage[];
  formData: EnvironmentFormData | null;
  result: AnalysisResult | null;
  currentStep: number;
  isProcessing: boolean;
  
  // Actions
  setImages: (images: UploadedImage[]) => void;
  addImage: (image: UploadedImage) => void;
  removeImage: (id: string) => void;
  setFormData: (data: EnvironmentFormData) => void;
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
};

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [formData, setFormData] = useState<EnvironmentFormData | null>(null);
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
      if (img) {
        URL.revokeObjectURL(img.preview);
      }
      return prev.filter(i => i.id !== id);
    });
  };

  const resetAnalysis = () => {
    images.forEach(img => URL.revokeObjectURL(img.preview));
    setImages([]);
    setFormData(null);
    setResult(null);
    setCurrentStep(0);
    setIsProcessing(false);
  };

  return (
    <AnalysisContext.Provider
      value={{
        images,
        formData,
        result,
        currentStep,
        isProcessing,
        setImages,
        addImage,
        removeImage,
        setFormData,
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
