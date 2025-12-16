import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAnalysis } from '@/contexts/AnalysisContext';
import { UploadedImage } from '@/types/analysis';

export default function ImageUpload() {
  const { images, addImage, removeImage, setCurrentStep } = useAnalysis();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      if (images.length >= 3) return;
      
      const newImage: UploadedImage = {
        id: `img-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        preview: URL.createObjectURL(file),
      };
      addImage(newImage);
    });
  }, [images.length, addImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxFiles: 3 - images.length,
    disabled: images.length >= 3,
  });

  const canProceed = images.length >= 1;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          Envie fotos do ambiente
        </h2>
        <p className="text-muted-foreground">
          Adicione de 1 a 3 fotos do espaço que deseja analisar (JPG ou PNG)
        </p>
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
          ${isDragActive 
            ? 'border-primary bg-primary/5' 
            : images.length >= 3 
              ? 'border-muted bg-muted/30 cursor-not-allowed' 
              : 'border-border hover:border-primary/50 hover:bg-muted/50'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            images.length >= 3 ? 'bg-muted' : 'bg-primary/10'
          }`}>
            <Upload className={`w-8 h-8 ${images.length >= 3 ? 'text-muted-foreground' : 'text-primary'}`} />
          </div>
          {images.length >= 3 ? (
            <p className="text-muted-foreground">Limite de 3 imagens atingido</p>
          ) : isDragActive ? (
            <p className="text-primary font-medium">Solte as imagens aqui...</p>
          ) : (
            <>
              <p className="text-foreground font-medium">
                Arraste imagens ou clique para selecionar
              </p>
              <p className="text-sm text-muted-foreground">
                JPG ou PNG • Máximo 3 fotos
              </p>
            </>
          )}
        </div>
      </div>

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {images.map((image) => (
            <div 
              key={image.id} 
              className="relative group rounded-xl overflow-hidden bg-muted aspect-video"
            >
              <img
                src={image.preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors" />
              <button
                onClick={() => removeImage(image.id)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-background/80 text-xs text-foreground">
                <ImageIcon className="w-3 h-3 inline mr-1" />
                {(image.file.size / 1024 / 1024).toFixed(1)} MB
              </div>
            </div>
          ))}
          
          {/* Empty slots */}
          {Array.from({ length: 3 - images.length }).map((_, i) => (
            <div 
              key={`empty-${i}`}
              className="rounded-xl border-2 border-dashed border-border aspect-video flex items-center justify-center"
            >
              <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
            </div>
          ))}
        </div>
      )}

      {/* Tip */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50">
        <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-foreground mb-1">Dicas para melhores resultados:</p>
          <ul className="text-muted-foreground space-y-1">
            <li>• Fotografe durante o dia com luz natural</li>
            <li>• Inclua janelas e portas na imagem</li>
            <li>• Capture diferentes ângulos do ambiente</li>
          </ul>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end">
        <Button 
          onClick={() => setCurrentStep(1)} 
          disabled={!canProceed}
          className="gap-2"
        >
          Próximo: Dados do Ambiente
        </Button>
      </div>
    </div>
  );
}
