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
  'Linguagem acessível para leigos',
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
            <Button>Iniciar Análise</Button>
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
                Não é necessário conhecimento técnico. Nossa plataforma traduz análises complexas 
                em recomendações claras e práticas que você pode implementar.
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
            
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-secondary to-eco-sun/20 p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto rounded-full gradient-nature flex items-center justify-center mb-4 animate-float">
                    <Sun className="w-12 h-12 text-primary-foreground" />
                  </div>
                  <p className="font-display text-xl font-semibold text-foreground">
                    Seu ambiente, mais inteligente
                  </p>
                </div>
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
      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 EcoMindsX Studio. Consultoria conceitual inteligente.</p>
          <p className="mt-1">Este serviço não substitui projetos técnicos elaborados por profissionais habilitados.</p>
        </div>
      </footer>
    </div>
  );
}
