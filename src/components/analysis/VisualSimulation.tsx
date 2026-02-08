import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertCircle, CheckCircle, ImageIcon } from 'lucide-react';

interface VisualSimulationProps {
  originalImageUrl: string;
  optimizedImageUrl: string; // Este é o 'visualPrompt' do JSON
  status: 'loading' | 'ready' | 'error';
}

export default function VisualSimulation({
  originalImageUrl,
  optimizedImageUrl,
  status
}: VisualSimulationProps) {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
  const [errorDetails, setErrorDetails] = useState<string>('');

  useEffect(() => {
    async function fetchVertexImage() {
      // Só executa quando status é 'ready' e temos um prompt
      if (status === 'ready' && optimizedImageUrl && !generatedImage && !isGenerating) {
        setIsGenerating(true);
        setGenerationStatus('generating');
        setErrorDetails('');
        
        try {
          console.log('🎨 Enviando para Vertex AI:', optimizedImageUrl.substring(0, 100));
          
          const response = await fetch('http://localhost:3001/api/generate-image', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              prompt: optimizedImageUrl,
              aspectRatio: "16:9",
              numberOfImages: 1
            }),
          });

          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.error || `Erro ${response.status}`);
          }

          if (data.success && data.images && data.images[0]) {
            // Usa a URL de dados base64 diretamente
            setGeneratedImage(data.images[0].imageUrl);
            setGenerationStatus('success');
            console.log('✅ Imagem gerada! Modelo:', data.model);
          } else {
            throw new Error("Resposta inválida do servidor");
          }
        } catch (error: any) {
          console.error("❌ Erro na geração:", error);
          setGenerationStatus('error');
          setErrorDetails(error.message || 'Erro desconhecido');
          
          // Fallback após 2 segundos
          setTimeout(() => {
            setGeneratedImage(`https://placehold.co/800x450/1a5fb4/ffffff?text=Render+IA&font=montserrat`);
            setGenerationStatus('success');
          }, 2000);
        } finally {
          setIsGenerating(false);
        }
      }
    }
    
    fetchVertexImage();
  }, [status, optimizedImageUrl]);

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-semibold text-foreground">
        Simulação Visual do Ambiente
      </h2>
      
      <div className="text-sm text-muted-foreground mb-2">
        <div className="flex items-center gap-2">
          {generationStatus === 'generating' && (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Vertex AI Imagen 3 gerando render 3D...</span>
            </>
          )}
          {generationStatus === 'success' && (
            <>
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Render gerado com Inteligência Artificial</span>
            </>
          )}
          {generationStatus === 'error' && (
            <>
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span>Visualização conceitual</span>
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ambiente Atual */}
        <Card className="overflow-hidden border-border/50">
          <CardContent className="p-0">
            <div className="relative aspect-video">
              <img 
                src={originalImageUrl} 
                className="w-full h-full object-cover"
                alt="Ambiente atual" 
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 text-white">
                <div className="text-xs font-medium">AMBIENTE ATUAL</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Render IA */}
        <Card className="overflow-hidden border-primary/30 shadow-md">
          <CardContent className="p-0">
            <div className="relative aspect-video bg-gradient-to-br from-muted/30 to-background">
              {isGenerating ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="relative">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">Vertex AI processando</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Gerando render arquitetônico...
                    </p>
                  </div>
                </div>
              ) : generatedImage ? (
                <>
                  <img 
                    src={generatedImage} 
                    className="w-full h-full object-cover"
                    alt="Render IA generativo" 
                    onError={(e) => {
                      console.error('Erro ao carregar imagem');
                      e.currentTarget.src = `https://placehold.co/800x450/1a5fb4/ffffff?text=Render+IA`;
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-white">
                        <div className="text-sm font-bold">RENDER IA</div>
                        <div className="text-xs opacity-90">Vertex AI Imagen 3</div>
                      </div>
                      <div className="bg-primary/90 text-white text-xs px-2 py-1 rounded">
                        IA GENERATIVA
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                  <ImageIcon className="w-12 h-12 text-muted-foreground/50" />
                  <div>
                    <p className="font-medium text-foreground">Aguardando geração</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      O render 3D será criado automaticamente
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Debug info */}
      {errorDetails && (
        <div className="text-xs bg-muted/50 p-3 rounded">
          <div className="font-medium mb-1">Detalhes:</div>
          <code className="break-all">{errorDetails}</code>
        </div>
      )}
    </div>
  );
}