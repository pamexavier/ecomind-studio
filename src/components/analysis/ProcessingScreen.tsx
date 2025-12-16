import { useEffect } from 'react';
import { Leaf, Sun, Thermometer, Lightbulb, CheckCircle } from 'lucide-react';
import { useAnalysis } from '@/contexts/AnalysisContext';
import { analyzeEnvironment } from '@/services/mockAnalysis';

const processingSteps = [
  { icon: Sun, label: 'Analisando condições climáticas...', delay: 0 },
  { icon: Lightbulb, label: 'Avaliando iluminação...', delay: 1000 },
  { icon: Thermometer, label: 'Calculando conforto térmico...', delay: 2000 },
  { icon: Leaf, label: 'Gerando recomendações sustentáveis...', delay: 3000 },
];

export default function ProcessingScreen() {
  const { images, formData, setResult, setCurrentStep, setIsProcessing } = useAnalysis();

  useEffect(() => {
    const runAnalysis = async () => {
      if (!formData) {
        setCurrentStep(1);
        return;
      }

      setIsProcessing(true);
      
      try {
        // Pega a URL da primeira imagem para a simulação visual
        const originalImageUrl = images.length > 0 ? images[0].preview : undefined;
        
        const result = await analyzeEnvironment({
          images,
          formData,
        }, originalImageUrl);
        
        setResult(result);
        setCurrentStep(3);
      } catch (error) {
        console.error('Analysis failed:', error);
        // Handle error - could show toast or error state
      } finally {
        setIsProcessing(false);
      }
    };

    runAnalysis();
  }, [formData, images, setResult, setCurrentStep, setIsProcessing]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-12">
      <div className="text-center mb-12">
        <div className="w-20 h-20 mx-auto rounded-full gradient-nature flex items-center justify-center mb-6 animate-pulse-slow">
          <Leaf className="w-10 h-10 text-primary-foreground" />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          Analisando seu ambiente
        </h2>
        <p className="text-muted-foreground">
          Nossa IA está processando as informações...
        </p>
      </div>

      <div className="w-full max-w-md space-y-4">
        {processingSteps.map((step, index) => (
          <ProcessingStep
            key={step.label}
            icon={step.icon}
            label={step.label}
            delay={step.delay}
          />
        ))}
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Isso geralmente leva alguns segundos...
      </p>
    </div>
  );
}

function ProcessingStep({ 
  icon: Icon, 
  label, 
  delay 
}: { 
  icon: typeof Sun; 
  label: string; 
  delay: number;
}) {
  return (
    <div 
      className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary animate-pulse" />
      </div>
      <span className="text-foreground font-medium">{label}</span>
      <div className="ml-auto">
        <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    </div>
  );
}
