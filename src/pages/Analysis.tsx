import React, { useState } from 'react';
import { ClipboardList, Microchip, FileCheck, Check } from 'lucide-react'; // Ícones para as etapas
import EnvironmentForm from '@/components/analysis/EnvironmentForm';
import ProcessingScreen from '@/components/analysis/ProcessingScreen';
import ResultsDisplay from '@/components/analysis/ResultsDisplay';
import { useAnalysis } from '@/contexts/AnalysisContext';
import { generateAnalysis } from '@/services/aiService';
import { toast } from 'sonner';

export default function Analysis() {
  const { setResult } = useAnalysis();
  const [step, setStep] = useState<'form' | 'processing' | 'result'>('form');
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (formData: any, images: File[], planta?: File) => {
    if (images.length === 0) {
      toast.error("Por favor, adicione ao menos uma foto do ambiente.");
      return;
    }

    setIsLoading(true);
    setStep('processing');

    try {
      const weatherData = { temp: 32, humidade: 45 }; 
      const analysis = await generateAnalysis(formData, weatherData, images, planta);
      
      setResult(analysis);
      setStep('result');
    } catch (error) {
      console.error("Erro na análise:", error);
      toast.error("Falha ao gerar diagnóstico.");
      setStep('form');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background py-12 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* STEPPER MODERNIZADO COM ÍCONES */}
        <div className="flex justify-center mb-16">
          <div className="flex items-center w-full max-w-2xl">
            <StepItem 
              label="Dados do Projeto" 
              icon={ClipboardList} 
              active={step === 'form'} 
              completed={step !== 'form'} 
            />
            <StepDivider active={step !== 'form'} />
            <StepItem 
              label="Auditoria IA" 
              icon={Microchip} 
              active={step === 'processing'} 
              completed={step === 'result'} 
            />
            <StepDivider active={step === 'result'} />
            <StepItem 
              label="Diagnóstico" 
              icon={FileCheck} 
              active={step === 'result'} 
              completed={false} 
            />
          </div>
        </div>

        {/* TELAS */}
        <div className="transition-all duration-700 ease-in-out">
          {step === 'form' && (
            <EnvironmentForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          )}

          {step === 'processing' && (
            <div className="animate-in fade-in zoom-in duration-500">
              <ProcessingScreen />
            </div>
          )}

          {step === 'result' && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <ResultsDisplay />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

// COMPONENTE DA "BOLINHA" COM ÍCONE
function StepItem({ label, icon: Icon, active, completed }: { label: string, icon: any, active: boolean, completed: boolean }) {
  return (
    <div className="flex flex-col items-center relative z-10">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 shadow-sm ${
        active 
          ? 'border-primary bg-primary text-white scale-110 shadow-primary/20 ring-4 ring-primary/5' 
          : completed 
            ? 'border-primary/40 bg-primary/10 text-primary' 
            : 'border-muted bg-background text-muted-foreground/40'
      }`}>
        {completed ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
      </div>
      <span className={`text-[11px] mt-3 font-bold uppercase tracking-widest text-center max-w-[80px] leading-tight transition-colors duration-500 ${
        active ? 'text-primary' : 'text-slate-400'
      }`}>
        {label}
      </span>
    </div>
  );
}

function StepDivider({ active }: { active: boolean }) {
  return (
    <div className="flex-1 h-[2px] mx-[-10px] mb-8 bg-slate-100 relative overflow-hidden">
      <div className={`absolute inset-0 bg-primary transition-all duration-1000 ease-in-out ${active ? 'translate-x-0' : '-translate-x-full'}`} />
    </div>
  );
}