import { Link } from 'react-router-dom';
import { ArrowLeft, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnalysisProvider, useAnalysis } from '@/contexts/AnalysisContext';
import ImageUpload from '@/components/analysis/ImageUpload';
import EnvironmentForm from '@/components/analysis/EnvironmentForm';
import ProcessingScreen from '@/components/analysis/ProcessingScreen';
import ResultsDisplay from '@/components/analysis/ResultsDisplay';

const steps = [
  { id: 0, label: 'Upload' },
  { id: 1, label: 'Dados' },
  { id: 2, label: 'Análise' },
  { id: 3, label: 'Resultado' },
];

function AnalysisContent() {
  const { currentStep } = useAnalysis();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-nature flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-semibold text-foreground">
              EcoMindsX <span className="text-primary">Studio</span>
            </span>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="border-b border-border/50 bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div 
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                      ${currentStep >= step.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                      }
                    `}
                  >
                    {step.id + 1}
                  </div>
                  <span className={`hidden sm:block text-sm font-medium ${
                    currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 sm:w-16 h-0.5 mx-2 ${
                    currentStep > step.id ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {currentStep === 0 && <ImageUpload />}
        {currentStep === 1 && <EnvironmentForm />}
        {currentStep === 2 && <ProcessingScreen />}
        {currentStep === 3 && <ResultsDisplay />}
      </main>
    </div>
  );
}

export default function Analysis() {
  return (
    <AnalysisProvider>
      <AnalysisContent />
    </AnalysisProvider>
  );
}
