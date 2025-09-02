import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Target, Calendar, TrendingUp, ArrowRight } from 'lucide-react';

interface IntroductionProps {
  onComplete: () => void;
}

export function Introduction({ onComplete }: IntroductionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Por que 12 semanas funciona melhor?",
      content: "A metodologia 12 Week Year substitui o ano tradicional de 12 meses por ciclos de 12 semanas. Isso cria maior senso de urgência e foco.",
      icon: Calendar,
      example: "Ao invés de 'melhorar vendas este ano', você dirá 'aumentar vendas em 20% nas próximas 12 semanas'",
    },
    {
      title: "Os 3 Pilares da Metodologia",
      content: "Visão clara de longo prazo, objetivos específicos para 12 semanas e execução disciplinada com medição constante.",
      icon: Target,
      example: "Visão (2-3 anos) → Objetivos (12 semanas) → Ações (semanais)",
    },
    {
      title: "Expectativa Realista: 85% é o Objetivo",
      content: "Não busque perfeição. Executar 85% das suas ações planejadas já é um resultado excepcional e sustentável.",
      icon: TrendingUp,
      example: "Se você planejar 10 ações na semana e executar 8-9, está no caminho certo!",
    },
  ];

  const currentSlideData = slides[currentSlide];
  const Icon = currentSlideData.icon;

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          Bem-vindo à Metodologia 12 Week Year
        </h2>
        <p className="text-muted-foreground">
          Em apenas 2 minutos, você entenderá por que esta metodologia é tão eficaz
        </p>
      </div>

      <Card className="border-primary/20">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Icon className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-xl">{currentSlideData.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground leading-relaxed">
            {currentSlideData.content}
          </p>
          
          <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
            <p className="text-sm font-medium text-foreground">
              Exemplo prático:
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {currentSlideData.example}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Slide Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prevSlide}
          disabled={currentSlide === 0}
        >
          Anterior
        </Button>

        <div className="flex gap-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-8 rounded-full transition-colors ${
                index === currentSlide ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <Button onClick={nextSlide} className="gap-2">
          {currentSlide === slides.length - 1 ? (
            <>
              Entendi! <CheckCircle className="h-4 w-4" />
            </>
          ) : (
            <>
              Próximo <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {currentSlide === slides.length - 1 && (
        <Card className="border-success/50 bg-success/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-success" />
              <div>
                <p className="font-medium text-foreground">Pronto para começar!</p>
                <p className="text-sm text-muted-foreground">
                  Agora vamos definir sua visão de longo prazo
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}