import { Link } from 'react-router-dom';
import { 
  Sun, Thermometer, Lightbulb, Leaf, Package, AlertTriangle, 
  ArrowLeft, Download, Share2, CheckCircle, Flame, Wind, Palette 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAnalysis } from '@/contexts/AnalysisContext';

export default function ResultsDisplay() {
  const { result, images, resetAnalysis } = useAnalysis();

  if (!result) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhum resultado disponível.</p>
        <Link to="/analise">
          <Button className="mt-4">Iniciar Nova Análise</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <CheckCircle className="w-4 h-4" />
          Análise Concluída
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Diagnóstico Ambiental
        </h1>
        <p className="text-muted-foreground">
          Gerado em {new Date(result.createdAt).toLocaleDateString('pt-BR')}
        </p>
      </div>

      {/* Summary */}
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/50 border-primary/20">
        <CardContent className="p-6">
          <h2 className="font-display text-xl font-semibold text-foreground mb-3">
            Resumo do Diagnóstico
          </h2>
          <p className="text-foreground/80 leading-relaxed">
            {result.summary}
          </p>
        </CardContent>
      </Card>

      {/* Images Preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {images.map((img) => (
            <div key={img.id} className="rounded-xl overflow-hidden aspect-video">
              <img 
                src={img.preview} 
                alt="Ambiente analisado" 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Climate Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-eco-sun/20 flex items-center justify-center">
              <Sun className="w-5 h-5 text-eco-sun" />
            </div>
            Análise Climática e Solar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-foreground mb-1">Clima da Região</h4>
            <p className="text-muted-foreground">{result.climate.climate}</p>
          </div>
          <Separator />
          <div>
            <h4 className="font-medium text-foreground mb-1">Incidência Solar</h4>
            <p className="text-muted-foreground">{result.climate.solarIncidence}</p>
          </div>
          <Separator />
          <div>
            <h4 className="font-medium text-foreground mb-2">Pontos Críticos Identificados</h4>
            <ul className="space-y-2">
              {result.climate.criticalPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Lighting Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-eco-sun/20 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-eco-sun" />
            </div>
            Iluminação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium text-foreground mb-3">Sugestões para Luz Natural</h4>
            <ul className="space-y-2">
              {result.lighting.naturalLight.map((suggestion, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
          <Separator />
          <div>
            <h4 className="font-medium text-foreground mb-3">Iluminação Artificial Recomendada</h4>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-sm text-muted-foreground mb-1">Tipo de Lâmpada</p>
                <p className="font-medium text-foreground">{result.lighting.artificialLight.lampType}</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-sm text-muted-foreground mb-1">Temperatura de Cor</p>
                <p className="font-medium text-foreground">{result.lighting.artificialLight.colorTemperature}</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50 sm:col-span-1">
                <p className="text-sm text-muted-foreground mb-1">Distribuição</p>
                <p className="font-medium text-foreground text-sm">{result.lighting.artificialLight.distribution}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Thermal Comfort */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-eco-sky/20 flex items-center justify-center">
              <Thermometer className="w-5 h-5 text-eco-sky" />
            </div>
            Conforto Térmico
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <Wind className="w-4 h-4" />
              Estratégias Passivas
            </h4>
            <ul className="space-y-2">
              {result.thermal.passiveStrategies.map((strategy, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{strategy}</span>
                </li>
              ))}
            </ul>
          </div>
          <Separator />
          <div>
            <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Materiais Recomendados
            </h4>
            <ul className="space-y-2">
              {result.thermal.recommendedMaterials.map((material, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{material}</span>
                </li>
              ))}
            </ul>
          </div>
          <Separator />
          <div>
            <h4 className="font-medium text-foreground mb-3">Ajustes Simples</h4>
            <div className="flex flex-wrap gap-2">
              {result.thermal.simpleAdjustments.map((adjustment, i) => (
                <Badge key={i} variant="secondary" className="py-1.5 px-3">
                  {adjustment}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Materials List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-eco-earth/20 flex items-center justify-center">
              <Package className="w-5 h-5 text-eco-earth" />
            </div>
            Lista de Materiais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <MaterialCategory 
            title="Iluminação" 
            icon={Lightbulb}
            items={result.materials.lighting} 
          />
          <Separator />
          <MaterialCategory 
            title="Ventilação" 
            icon={Wind}
            items={result.materials.ventilation} 
          />
          <Separator />
          <MaterialCategory 
            title="Cores e Acabamentos" 
            icon={Palette}
            items={result.materials.finishes} 
          />
          <Separator />
          <MaterialCategory 
            title="Elementos de Sombreamento" 
            icon={Sun}
            items={result.materials.shading} 
          />
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground mb-1">Aviso Importante</h4>
            <p className="text-sm text-muted-foreground">{result.disclaimer}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Baixar Relatório
        </Button>
        <Button variant="outline" className="gap-2">
          <Share2 className="w-4 h-4" />
          Compartilhar
        </Button>
        <Link to="/">
          <Button 
            onClick={resetAnalysis}
            className="gap-2 w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Nova Análise
          </Button>
        </Link>
      </div>
    </div>
  );
}

function MaterialCategory({ 
  title, 
  icon: Icon,
  items 
}: { 
  title: string; 
  icon: typeof Lightbulb;
  items: Array<{
    name: string;
    description: string;
    purpose: string;
    estimatedQuantity?: string;
  }>;
}) {
  return (
    <div>
      <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
        <Icon className="w-4 h-4 text-primary" />
        {title}
      </h4>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="p-4 rounded-lg bg-secondary/30 border border-border/50">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h5 className="font-medium text-foreground">{item.name}</h5>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <p className="text-sm text-primary mt-1">{item.purpose}</p>
              </div>
              {item.estimatedQuantity && (
                <Badge variant="outline" className="flex-shrink-0">
                  {item.estimatedQuantity}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
