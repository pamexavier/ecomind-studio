import { useAnalysis } from '@/contexts/AnalysisContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function ResultsDisplay() {
  const { result } = useAnalysis();
  if (!result) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* STATUS DA CERTIFICAÇÃO */}
      <div className={`p-4 rounded-xl border flex items-center gap-3 ${result.isCertified ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
        {result.isCertified ? (
          <CheckCircle className="text-green-600 w-6 h-6" />
        ) : (
          <Info className="text-amber-600 w-6 h-6" />
        )}
        <div>
          <p className="font-bold text-sm">{result.isCertified ? 'Laudo Certificado por Especialista' : 'Diagnóstico Preliminar (IA)'}</p>
          <p className="text-xs opacity-80">{result.isCertified ? 'Este relatório foi revisado por Pamella.' : 'Aguardando revisão técnica da especialista.'}</p>
        </div>
      </div>

      {/* PARECER TÉCNICO (O SEU ESPAÇO) */}
      <Card className="border-dashed border-2 border-primary/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-primary">Parecer da Especialista</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm italic text-muted-foreground">
            {result.expertObservation || "Após a geração deste laudo, nossa equipe técnica analisará as imagens para validar as sugestões da IA. Você receberá a versão certificada em seu e-mail."}
          </p>
        </CardContent>
      </Card>

      {/* RESUMO E ALERTAS */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-bold text-lg mb-2">Resumo da Auditoria</h3>
          <p className="text-sm text-foreground/80 leading-relaxed">{result.summary}</p>
          
          {result.thermal?.maintenanceAlerts && result.thermal.maintenanceAlerts.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs font-bold text-blue-700 mb-2 uppercase">Alertas de Manutenção e Durabilidade:</p>
              <ul className="text-xs space-y-1 text-blue-800">
                {result.thermal.maintenanceAlerts.map((a, i) => <li key={i}>• {a}</li>)}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Restante do conteúdo (Clima, Térmico, etc.) segue o padrão anterior... */}
    </div>
  );
}