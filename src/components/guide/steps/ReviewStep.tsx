import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, RotateCcw, Trophy, ArrowRight } from 'lucide-react';

interface ReviewStepProps {
  onComplete: () => void;
}

export function ReviewStep({ onComplete }: ReviewStepProps) {
  const handleComplete = () => {
    onComplete();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground flex items-center justify-center gap-2">
          <RotateCcw className="h-6 w-6 text-primary" />
          Revisão e Próximo Ciclo
        </h2>
        <p className="text-muted-foreground">
          Como fazer a transição entre ciclos e manter a evolução contínua
        </p>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">Framework de Auto-avaliação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="p-4 bg-muted/20 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">📊 Métricas Quantitativas</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Quantos objetivos foram alcançados?</li>
                <li>• Qual foi o score semanal médio?</li>
                <li>• Quantas ações foram executadas vs planejadas?</li>
              </ul>
            </div>

            <div className="p-4 bg-muted/20 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">🤔 Reflexões Qualitativas</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• O que funcionou muito bem?</li>
                <li>• O que não funcionou como esperado?</li>
                <li>• Que lições aprendi sobre mim mesmo?</li>
                <li>• O que faria diferente no próximo ciclo?</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Celebrando Conquistas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Trophy className="h-5 w-5 text-warning mt-0.5" />
            <div className="space-y-2">
              <p className="font-medium text-foreground">Reconheça seu progresso</p>
              <p className="text-sm text-muted-foreground">
                Mesmo que não tenha alcançado 100% dos objetivos, você fez mais em 12 semanas 
                do que a maioria das pessoas faz em um ano. Celebre cada vitória!
              </p>
            </div>
          </div>

          <div className="p-4 bg-success/10 rounded-lg border border-success/20">
            <h4 className="font-medium text-success mb-2">Sugestões de Celebração</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Compartilhe suas conquistas com pessoas próximas</li>
              <li>• Tire um dia de descanso antes do próximo ciclo</li>
              <li>• Registre por escrito o que conquistou</li>
              <li>• Recompense-se de forma proporcional ao resultado</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Preparando o Próximo Ciclo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="p-4 bg-muted/20 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">🎯 Revisando a Visão</h4>
              <p className="text-sm text-muted-foreground">
                Sua visão de longo prazo ainda faz sentido? Precisa de ajustes baseados no que aprendeu?
              </p>
            </div>

            <div className="p-4 bg-muted/20 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">📋 Novos Objetivos</h4>
              <p className="text-sm text-muted-foreground">
                Com base no que funcionou, defina 2-3 novos objetivos para as próximas 12 semanas.
                Mantenha o que deu certo, ajuste o que não deu.
              </p>
            </div>

            <div className="p-4 bg-muted/20 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">⚡ Melhorias no Processo</h4>
              <p className="text-sm text-muted-foreground">
                Como pode melhorar sua execução? Precisa de ferramentas diferentes? 
                Rotinas ajustadas? Apoio externo?
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-success/50 bg-success/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-success" />
            <div>
              <p className="font-medium text-foreground">Parabéns! Você completou o guia!</p>
              <p className="text-sm text-muted-foreground">
                Agora você tem todo o conhecimento necessário para aplicar a metodologia 12 Week Year com sucesso.
                Comece criando sua primeira visão!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          <p>🚀 Você está pronto para começar seu primeiro ciclo!</p>
        </div>
        
        <Button onClick={handleComplete} className="gap-2">
          Finalizar Guia <CheckCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}