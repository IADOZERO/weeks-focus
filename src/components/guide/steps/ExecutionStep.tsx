import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, TrendingUp, Calendar, Clock } from 'lucide-react';

interface ExecutionStepProps {
  onComplete: () => void;
}

export function ExecutionStep({ onComplete }: ExecutionStepProps) {
  const [demoScore, setDemoScore] = useState(75);

  const handleComplete = () => {
    onComplete();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground flex items-center justify-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          Executando e Medindo
        </h2>
        <p className="text-muted-foreground">
          A rotina semanal que garante o sucesso da metodologia
        </p>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">Rotina Semanal Ideal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex gap-4 p-4 bg-muted/20 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium text-sm">
                S
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground">Segunda-feira (15 min)</h4>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                  <li>• Revisar ações da semana</li>
                  <li>• Priorizar as 3 mais importantes</li>
                  <li>• Ajustar agenda se necessário</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-muted/20 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-medium text-sm">
                ⚡
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground">Durante a Semana</h4>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                  <li>• Marcar ações como concluídas</li>
                  <li>• Anotar obstáculos encontrados</li>
                  <li>• Ajustar se necessário</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-muted/20 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-medium text-sm">
                D
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground">Domingo (15 min)</h4>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                  <li>• Calcular score da semana</li>
                  <li>• Se &lt; 85%: identificar o que travou</li>
                  <li>• Ajustar próxima semana</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Simulador de Score Semanal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted/20 rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Exemplo: Semana com 8 ações planejadas</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Ações concluídas: 6 de 8</span>
                <span className="font-medium">Score: {Math.round((6/8) * 100)}%</span>
              </div>
              <Progress value={(6/8) * 100} className="h-2" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-destructive/10 rounded-lg border border-destructive/20">
              <div className="font-medium text-destructive">Abaixo de 70%</div>
              <div className="text-muted-foreground">Revisar estratégia</div>
            </div>
            <div className="text-center p-3 bg-warning/10 rounded-lg border border-warning/20">
              <div className="font-medium text-warning">70% - 84%</div>
              <div className="text-muted-foreground">Bom, pode melhorar</div>
            </div>
            <div className="text-center p-3 bg-success/10 rounded-lg border border-success/20">
              <div className="font-medium text-success">85% ou mais</div>
              <div className="text-muted-foreground">Excelente!</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-warning/50 bg-warning/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-warning mt-0.5" />
            <div className="space-y-2">
              <p className="font-medium text-foreground">O que fazer quando está abaixo de 85%?</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Identifique os obstáculos principais</li>
                <li>• Reduza o número de ações na próxima semana</li>
                <li>• Ajuste horários ou métodos</li>
                <li>• Peça ajuda se necessário</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-success/50 bg-success/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-success" />
            <div>
              <p className="font-medium text-foreground">Rotina compreendida!</p>
              <p className="text-sm text-muted-foreground">
                Com esta rotina de 30 minutos por semana, você mantém o foco e mede o progresso
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          <p>⏰ Total: 30 minutos por semana de planejamento</p>
        </div>
        
        <Button onClick={handleComplete} className="gap-2">
          Continuar <CheckCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}