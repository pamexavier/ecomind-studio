import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from '@/components/ui/card';
import { Sun, Thermometer, Lightbulb, Leaf, ArrowRight, CheckCircle } from 'lucide-react';

const features = [
  {
    icon: Sun,
    title: 'Análise Solar',
    description: 'Identificamos a incidência solar e pontos críticos do seu ambiente',
  },
  {
    icon: Lightbulb,
    title: 'Iluminação Inteligente',
    description: 'Sugestões para iluminação natural e artificial otimizadas',
  },
  {
    icon: Thermometer,
    title: 'Conforto Térmico',
    description: 'Estratégias passivas para um ambiente mais confortável',
  },
  {
    icon: Leaf,
    title: 'Sustentabilidade',
    description: 'Soluções eco-friendly que reduzem seu impacto ambiental',
  },
];

const benefits = [
  'Diagnóstico completo em minutos',
  'Lista de materiais com estimativas',
  'Indicadores de desempenho ambiental e econômico',
  'Foco em soluções práticas e acessíveis',
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-nature flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-xl font-bold text-foreground">
                Nexus-X
              </span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                by EcoMindsX
              </span>
            </div>
          </div>
          <Link to="/analise">
            <Button>Analisar meu espaço</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 gradient-warm opacity-50" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-eco-sun/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6 animate-fade-in">
              <Leaf className="w-4 h-4" />
              Diagnóstico Ambiental Inteligente
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Transforme seu ambiente com
              <span className="text-primary"> inteligência sustentável</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Envie fotos do seu espaço e receba uma análise completa de iluminação, 
              conforto térmico e sugestões práticas para um ambiente mais saudável e eficiente.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Link to="/analise">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  Começar Análise Gratuita
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Como Funciona
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="font-display text-2xl text-primary">Nexus-X: Como Funciona</DialogTitle>
                    <DialogDescription>
                      Transformamos dados visuais em conforto ambiental em 3 passos simples.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 font-bold">1</div>
                      <p className="text-sm">
                        <span className="font-bold text-foreground">Envie seu Espaço e Localização:</span> 
                        Insira o endereço do local e faça o upload de fotos ou do projeto. O endereço é fundamental para calcularmos a trajetória solar exata na sua região.
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 font-bold">2</div>
                      <p className="text-sm">
                        <span className="font-bold text-foreground">Inteligência Nexus-X:</span> 
                        Nossa IA cruza os dados visuais com as coordenadas solares e normas NBR para identificar pontos de calor e iluminação.
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 font-bold">3</div>
                      <p className="text-sm">
                        <span className="font-bold text-foreground">Relatório de Otimização:</span> 
                        Receba recomendações técnicas para melhorar o conforto e reduzir custos de energia sem precisar de reformas complexas.
                      </p>
                    </div>
                  </div>
                  <Link to="/analise" className="w-full">
                    <Button className="w-full">Entendi, vamos começar!</Button>
                  </Link>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              O que analisamos
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nossa IA avalia múltiplos aspectos do seu ambiente para entregar recomendações personalizadas
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="border-border/50 bg-background eco-shadow hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Diagnóstico profissional ao alcance de todos
              </h2>
              <p className="text-muted-foreground mb-8">
                Não é necessário conhecimento técnico. Nossa plataforma traduz análises ambientais complexas
                em recomendações práticas, baseadas em normas técnicas, prontas para implementação.
              </p>
              
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative group">
              {/* Fundo decorativo com brilho */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-eco-sun/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative aspect-square rounded-2xl bg-card border border-border/50 shadow-2xl overflow-hidden flex flex-col">
                {/* Header simulando a IA */}
                <div className="bg-muted/50 p-3 border-b border-border/50 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-400/50" />
                    <div className="w-2 h-2 rounded-full bg-amber-400/50" />
                    <div className="w-2 h-2 rounded-full bg-green-400/50" />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-tighter">Nexus-X Analysis v1.0</span>
                </div>
                {/* Conteúdo Central: Ícone Técnico */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 relative">
                    <Sun className="w-10 h-10 text-primary animate-pulse" />
                    {/* Linhas de "escaneamento" simuladas */}
                    <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-ping opacity-20" />
                  </div>
                  <h4 className="font-display font-bold text-foreground mb-2">Simulação Bioclimática</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed px-4">
                    Análise do clima local e dos materiais para identificar ganhos térmicos, conforto e economia de energia.
                  </p>
                </div>
                {/* Badge de Localização */}
                <div className="p-3 bg-primary/5 border-t border-border/50 text-center">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                    📍 Porto Alegre, RS - 2026
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção sobre a Fundadora */}
      <section className="py-24 bg-secondary/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16">
            {/* Container da Foto */}
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border-2 border-primary/10 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="/pamella.jpg" 
                  alt="Pamella - Fundadora da EcoMindsX" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Detalhe decorativo */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl -z-10" />
            </div>

            {/* Conteúdo do Texto */}
            <div className="flex-1 space-y-6">
              <div className="inline-block px-3 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                A Visão por trás do Nexus-X
              </div>

              <h2 className="font-display text-4xl font-bold text-foreground mb-2">
                Olá, eu sou a <span className="text-primary">Pamella.</span>
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Sou fundadora da <strong>EcoMindsX</strong> e estudante de Engenharia Ambiental na UniRitter.
                </p>
                <p>
                  Criei este estúdio porque acredito que a engenharia ambiental pode ir muito além das abordagens tradicionais.
                </p>
                <p>
                  Através da engenharia ambiental e da bioclimatologia, desenvolvemos soluções que analisam espaços, interpretam plantas e imagens, e propõem melhorias reais em eficiência térmica, hídrica e luminosa, sempre alinhadas às normas técnicas.
                </p>
                <p>
                  O <strong>Nexus-X</strong> nasce para transformar dados em decisões: <strong>mais conforto, mais saúde e menos custo operacional.</strong>
                </p>
                <p>
                  Não se trata apenas de sustentabilidade estética, trata-se de <strong>desempenho ambiental mensurável.</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-nature">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Pronto para transformar seu espaço?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Comece agora mesmo e receba seu diagnóstico ambiental completo em poucos minutos.
          </p>
          <Link to="/analise">
            <Button size="lg" variant="secondary" className="gap-2">
              Iniciar Análise
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 EcoMindsX. Inteligência Bioclimática e Consultoria Ambiental.</p>
          <p className="mt-1 text-[11px] opacity-70">
            Este diagnóstico possui caráter consultivo e conceitual, baseado em inteligência de dados, 
            e não substitui projetos técnicos ou laudos assinados por profissionais habilitados.
          </p>
        </div>
      </footer>
    </div>
  );
}
