import { useAnalysis } from '@/contexts/AnalysisContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sun, Thermometer, Wind, CheckCircle, AlertTriangle } from 'lucide-react';

export default function ResultsDisplay() {
  const { result } = useAnalysis();

  if (!result) return <div className="p-8 text-center">Nenhum dado encontrado.</div>;

  // Blindagem de Dados (Fallbacks)
  const climate = result.climate || { climate: "N/A", criticalPoints: [] };
  const thermal = result.thermal || { passiveStrategies: [], recommendedMaterials: [] };
  const materials = result.materials || { lighting: [], ventilation: [], finishes: [], shading: [] };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <Badge variant="outline" className="text-primary border-primary">Análise Concluída</Badge>
        <h1 className="text-3xl font-bold">Diagnóstico Nexus-X</h1>
        <p className="text-muted-foreground">Gerado em {new Date(result.createdAt).toLocaleDateString()}</p>
      </div>

      <Card className="border-l-4 border-l-primary bg-primary/5">
        <CardContent className="p-6">
          <h3 className="font-bold mb-2">Resumo Executivo</h3>
          <p className="text-sm leading-relaxed text-foreground/80">{result.summary}</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Clima */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Sun className="w-5 h-5 text-orange-500"/> Clima e Sol</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p><strong>Clima:</strong> {climate.climate}</p>
            <p><strong>Incidência:</strong> {climate.solarIncidence}</p>
            <Separator />
            <p className="font-bold">Pontos Críticos:</p>
            <ul className="space-y-1">
              {(climate.criticalPoints || []).map((p, i) => (
                <li key={i} className="flex items-center gap-2"><AlertTriangle className="w-3 h-3 text-amber-500"/> {p}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Térmico */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Thermometer className="w-5 h-5 text-blue-500"/> Térmico ({thermal.loadEstimate})</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="font-bold">Estratégias Sugeridas:</p>
            <div className="flex flex-wrap gap-2">
              {(thermal.passiveStrategies || []).map((s, i) => <Badge key={i} variant="secondary">{s}</Badge>)}
            </div>
            <Separator />
            <p className="font-bold">Materiais de Alta Eficiência:</p>
            <ul className="space-y-1">
              {(thermal.recommendedMaterials || []).map((m, i) => (
                <li key={i} className="flex items-center gap-2 text-primary"><CheckCircle className="w-3 h-3"/> {m}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <p className="text-[10px] text-center text-muted-foreground">{result.disclaimer}</p>
    </div>
  );
}