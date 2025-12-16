import { useState } from 'react';
import { ImageIcon, Loader2, AlertCircle, ArrowLeftRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type SimulationStatus = 'loading' | 'ready' | 'error';

interface VisualSimulationProps {
  originalImageUrl: string;
  optimizedImageUrl?: string;
  status: SimulationStatus;
}

export default function VisualSimulation({ 
  originalImageUrl, 
  optimizedImageUrl, 
  status 
}: VisualSimulationProps) {
  const [showComparison, setShowComparison] = useState(false);

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-semibold text-foreground">
        Simulação Visual do Ambiente
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1 - Ambiente Original */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-video">
              <img 
                src={originalImageUrl} 
                alt="Ambiente original" 
                className={cn(
                  "w-full h-full object-cover transition-opacity duration-300",
                  showComparison ? "opacity-100" : "opacity-100"
                )}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-3">
                <span className="text-sm font-medium text-foreground">
                  Imagem original
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2 - Ambiente Otimizado */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-video bg-secondary/30">
              {status === 'loading' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">
                      Simulação visual em processamento…
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Analisando iluminação e conforto ambiental…
                    </p>
                  </div>
                </div>
              )}

              {status === 'ready' && optimizedImageUrl && (
                <>
                  <img 
                    src={optimizedImageUrl} 
                    alt="Ambiente otimizado por IA" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-3">
                    <span className="text-sm font-medium text-foreground">
                      Ambiente otimizado (IA)
                    </span>
                  </div>
                </>
              )}

              {status === 'error' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Simulação visual indisponível no momento
                  </p>
                </div>
              )}

              {status !== 'ready' && status !== 'error' && status !== 'loading' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Simulação visual em processamento…
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botão de comparação - só aparece quando a simulação está pronta */}
      {status === 'ready' && optimizedImageUrl && (
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowComparison(!showComparison)}
            className="gap-2"
          >
            <ArrowLeftRight className="w-4 h-4" />
            Comparar antes e depois
          </Button>
        </div>
      )}

      {/* Disclaimer obrigatório */}
      {status === 'ready' && optimizedImageUrl && (
        <p className="text-xs text-muted-foreground text-center italic">
          Imagem gerada por IA para fins de visualização.
          <br />
          Não representa projeto executivo ou alteração estrutural.
        </p>
      )}
    </div>
  );
}
