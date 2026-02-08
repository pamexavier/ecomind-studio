import { Link } from 'react-router-dom';
import { 
  Sun, Thermometer, Lightbulb, Leaf, Package, AlertTriangle, 
  ArrowLeft, Download, Share2, CheckCircle, Flame, Wind, Palette 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { EcomindsReport } from './EcomindsReport';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAnalysis } from '@/contexts/AnalysisContext';
import VisualSimulation from './VisualSimulation';
import jsPDF from 'jspdf';

export default function ResultsDisplay() {
  const { result, images, resetAnalysis } = useAnalysis();

  // Função de Download movida para DENTRO do componente para acessar os dados facilmente
  const handleDownloadPDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    
    // --- CORES PREMIUM ---
    const verdeEcominds = [45, 90, 70]; // Um verde musgo elegante, não "cheguei"
    const cinzaTexto = [60, 60, 60];
    const cinzaClaro = [240, 240, 240];

    // --- CABEÇALHO MINIMALISTA ---
    doc.setFillColor(verdeEcominds[0], verdeEcominds[1], verdeEcominds[2]);
    doc.rect(0, 0, 210, 35, 'F'); // Barra superior mais fina
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("times", "bold"); // Times traz um ar mais sério/tradicional de engenharia
    doc.setFontSize(22);
    doc.text("ECOMINDSX", 20, 22);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("CONSULTORIA EM ALTO DESEMPENHO AMBIENTAL", 20, 28);

    // --- CORPO DO RELATÓRIO ---
    doc.setTextColor(cinzaTexto[0], cinzaTexto[1], cinzaTexto[2]);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("DIAGNÓSTICO TÉCNICO EXECUTIVO", 20, 55);
    
    // Linha sutil de separação
    doc.setDrawColor(220, 220, 220);
    doc.line(20, 58, 190, 58);

    // Texto de resumo com mais espaçamento (Leading)
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const summary = doc.splitTextToSize(result.summary, 170);
    doc.text(summary, 20, 68, { align: "justify", lineHeightFactor: 1.5 });

    // --- SEÇÃO DE MATERIAIS (LAYOUT DE TABELA LIMPA) ---
    let yPos = 110;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("PLANO DE INVESTIMENTO E RETORNO", 20, yPos);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    
    // Cabeçalho da Tabela
    yPos += 8;
    doc.setFillColor(cinzaClaro[0], cinzaClaro[1], cinzaClaro[2]);
    doc.rect(20, yPos, 170, 8, 'F');
    doc.text("ESPECIFICAÇÃO TÉCNICA | ESTIMATIVA DE PAYBACK", 25, yPos + 5);

    // Itens da Tabela
    if (result.thermal?.recommendedMaterials) {
      result.thermal.recommendedMaterials.forEach((item: string) => {
        yPos += 12;
        doc.setDrawColor(240, 240, 240);
        doc.line(20, yPos + 2, 190, yPos + 2); // Linha divisória fina
        const splitItem = doc.splitTextToSize(item, 160);
        doc.text(splitItem, 25, yPos);
      });
    }

    // --- RODAPÉ ---
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 180);
    doc.text("Este documento contém análise proprietária baseada em inteligência climática.", 20, 285);
    doc.text("Pág 01/01", 185, 285);

    doc.save(`Relatorio_EcomindsX_Premium.pdf`);
  };

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

      {/* Visual Simulation Section */}
      {images.length > 0 && (
        <VisualSimulation
          originalImageUrl={images[0].preview}
          optimizedImageUrl={result.visualSimulation?.optimizedImageUrl}
          status={result.visualSimulation?.status || 'loading'}
        />
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
          {result.climate ? (
            <>
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
                  {result.climate.criticalPoints.map((point: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="text-muted-foreground">Nenhuma análise climática disponível.</div>
          )}
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
              {result.lighting.naturalLight.map((suggestion: string, i: number) => (
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
              {result.thermal.passiveStrategies.map((strategy: string, i: number) => (
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
              {result.thermal.recommendedMaterials.map((material: string, i: number) => (
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
              {result.thermal.simpleAdjustments.map((adjustment: string, i: number) => (
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
        {/* Pré-visualização do Relatório - Movido para o lugar certo */}
<Card className="overflow-hidden border-2 border-primary/20 shadow-lg">
  <CardHeader className="bg-primary/5 py-3">
    <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
      <Leaf className="w-4 h-4" />
      Relatório Executivo Gerado
    </CardTitle>
  </CardHeader>
  <CardContent className="p-0">
    <PDFViewer width="100%" height="600px" showToolbar={true} className="border-none">
      <EcomindsReport 
        result={result} 
        formData={result.formData || { location: result?.location }} 
      />
    </PDFViewer>
  </CardContent>
</Card>
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
        <PDFDownloadLink 
          document={<EcomindsReport result={result} formData={result.formData || { location: result?.location }} />} 
          fileName={`EcomindsX_Relatorio_${result.id}.pdf`}
        >
          {({ loading }) => (
            <Button variant="outline" className="gap-2" disabled={loading}>
              <Download className="w-4 h-4" />
              {loading ? 'Gerando...' : 'Baixar Relatório Executivo'}
            </Button>
          )}
        </PDFDownloadLink>
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
  icon: any;
  items: any[];
}) {
  if (!items || items.length === 0) return null;
  
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