import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Calendar, ArrowRight } from 'lucide-react';

interface ActionsStepProps {
  onComplete: () => void;
}

export function ActionsStep({ onComplete }: ActionsStepProps) {
  const [currentExample, setCurrentExample] = useState(0);

  const examples = [
    {
      objective: "Conseguir 5 novos clientes para consultoria",
      weeks: [
        { range: "1-2", title: "Preparação", actions: ["Atualizar portfólio com 3 casos", "Criar proposta comercial padrão", "Listar 50 empresas-alvo"] },
        { range: "3-6", title: "Prospecção", actions: ["Conectar com 10 decisores/semana", "Enviar 15 propostas/semana", "Fazer 2 apresentações/semana"] },
        { range: "7-12", title: "Fechamento", actions: ["Follow-up de propostas", "Negociar contratos", "Entregar primeiros trabalhos"] }
      ]
    }
  ];

  const handleComplete = () => {
    onComplete();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground flex items-center justify-center gap-2">
          <Calendar className="h-6 w-6 text-primary" />
          Criando seu Plano de Ação
        </h2>
        <p className="text-muted-foreground">
          Como quebrar seus objetivos em ações semanais executáveis
        </p>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">Processo Guiado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">1</div>
              <span>Pegue 1 objetivo</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">2</div>
              <span>Pergunte: "Que ações levarão a este resultado?"</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">3</div>
              <span>Liste todas (brainstorm)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">4</div>
              <span>Organize por semana (do mais importante)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">5</div>
              <span>Limite a 5 ações por semana máximo</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Exemplo Prático Completo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <h4 className="font-medium text-foreground mb-2">
              🎯 Objetivo: "{examples[0].objective}"
            </h4>
          </div>

          {examples[0].weeks.map((week, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Badge className="text-xs">Semana {week.range}</Badge>
                <h5 className="font-medium">{week.title}</h5>
              </div>
              <ul className="space-y-1 text-sm">
                {week.actions.map((action, actionIndex) => (
                  <li key={actionIndex} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-warning/50 bg-warning/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-warning mt-0.5" />
            <div className="space-y-2">
              <p className="font-medium text-foreground">Regra das 3-5 ações por semana</p>
              <p className="text-sm text-muted-foreground">
                Mais que 5 ações por semana é receita para sobrecarga e abandono.
                Seja realista sobre sua capacidade de execução.
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
              <p className="font-medium text-foreground">Conceito compreendido!</p>
              <p className="text-sm text-muted-foreground">
                Agora você pode aplicar este processo aos seus objetivos reais nas páginas de planejamento
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          <p>💡 Lembre-se: Ações específicas levam a resultados específicos</p>
        </div>
        
        <Button onClick={handleComplete} className="gap-2">
          Continuar <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20 ${className}`}>
      {children}
    </span>
  );
}