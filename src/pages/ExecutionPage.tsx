import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useCycles, useCurrentCycle } from "@/hooks/useLocalStorage";
import { Cycle, Action } from "@/types";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ExecutionPage() {
  const [cycles, setCycles] = useCycles();
  const [currentCycleId] = useCurrentCycle();
  const [currentCycle, setCurrentCycle] = useState<Cycle | null>(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [weeklyScore, setWeeklyScore] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (currentCycleId && cycles.length > 0) {
      const cycle = cycles.find((c: Cycle) => c.id === currentCycleId);
      setCurrentCycle(cycle || null);
      
      if (cycle) {
        const week = getCurrentWeek(cycle.startDate);
        setCurrentWeek(week);
        calculateWeeklyScore(cycle, week);
      }
    }
  }, [currentCycleId, cycles]);

  const getCurrentWeek = (startDate: Date): number => {
    const now = new Date();
    const start = new Date(startDate);
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    return Math.min(diffWeeks, 12);
  };

  const calculateWeeklyScore = (cycle: Cycle, week: number) => {
    const allActions = cycle.objectives.flatMap(obj => obj.actions);
    const weekActions = allActions.filter(action => action.weekNumber === week);
    const completedActions = weekActions.filter(action => action.completed);
    const score = weekActions.length > 0 ? (completedActions.length / weekActions.length) * 100 : 0;
    setWeeklyScore(score);
  };

  const handleActionToggle = (actionId: string, completed: boolean) => {
    if (!currentCycle) return;

    const updatedCycle = {
      ...currentCycle,
      objectives: currentCycle.objectives.map(obj => ({
        ...obj,
        actions: obj.actions.map(action => 
          action.id === actionId 
            ? { ...action, completed, completedAt: completed ? new Date() : undefined }
            : action
        )
      }))
    };

    const updatedCycles = cycles.map((c: Cycle) => 
      c.id === currentCycle.id ? updatedCycle : c
    );

    setCycles(updatedCycles);
    setCurrentCycle(updatedCycle);
    calculateWeeklyScore(updatedCycle, currentWeek);

    toast({
      title: completed ? "Ação concluída!" : "Ação desmarcada",
      description: completed ? "Parabéns pelo progresso!" : "Ação marcada como pendente"
    });
  };

  const getPriorityColor = (priority: Action['priority']) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getPriorityLabel = (priority: Action['priority']) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return 'Não definida';
    }
  };

  if (!currentCycle) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Execução</h1>
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Nenhum ciclo ativo</h3>
            <p className="text-muted-foreground">
              Inicie um ciclo para começar a executar suas ações semanais.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const weekActions = currentCycle.objectives.flatMap(obj => 
    obj.actions.filter(action => action.weekNumber === currentWeek)
  );

  const completedActions = weekActions.filter(action => action.completed);
  const pendingActions = weekActions.filter(action => !action.completed);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Execução</h1>
          <p className="text-muted-foreground">
            Semana {currentWeek} - {currentCycle.name}
          </p>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-foreground">{weeklyScore.toFixed(0)}%</div>
          <div className="text-sm text-muted-foreground">Score da semana</div>
        </div>
      </div>

      {/* Weekly Progress */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Progresso da Semana {currentWeek}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={weeklyScore} className="h-3" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {completedActions.length} de {weekActions.length} ações concluídas
              </span>
              <span className={`font-medium ${weeklyScore >= 85 ? 'text-success' : 'text-warning'}`}>
                {weeklyScore >= 85 ? 'Meta atingida!' : 'Abaixo da meta (85%)'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Actions */}
      {pendingActions.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Ações Pendentes ({pendingActions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingActions.map((action) => (
              <div key={action.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
                <Checkbox
                  id={action.id}
                  checked={action.completed}
                  onCheckedChange={(checked) => handleActionToggle(action.id, checked as boolean)}
                  className="mt-1"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <label 
                      htmlFor={action.id}
                      className="font-medium text-foreground cursor-pointer"
                    >
                      {action.title}
                    </label>
                    <Badge className={getPriorityColor(action.priority)}>
                      {getPriorityLabel(action.priority)}
                    </Badge>
                    {action.estimatedTime && (
                      <Badge variant="outline" className="text-xs">
                        {action.estimatedTime}h
                      </Badge>
                    )}
                  </div>
                  {action.description && (
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Completed Actions */}
      {completedActions.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              Ações Concluídas ({completedActions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {completedActions.map((action) => (
              <div key={action.id} className="flex items-start gap-3 p-3 rounded-lg bg-success/10 border border-success/20">
                <Checkbox
                  id={`completed-${action.id}`}
                  checked={true}
                  onCheckedChange={(checked) => handleActionToggle(action.id, checked as boolean)}
                  className="mt-1"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <label 
                      htmlFor={`completed-${action.id}`}
                      className="font-medium text-foreground cursor-pointer line-through decoration-success"
                    >
                      {action.title}
                    </label>
                    <Badge className={getPriorityColor(action.priority)}>
                      {getPriorityLabel(action.priority)}
                    </Badge>
                    {action.completedAt && (
                      <Badge variant="outline" className="text-xs">
                        Concluída em {new Date(action.completedAt).toLocaleDateString()}
                      </Badge>
                    )}
                  </div>
                  {action.description && (
                    <p className="text-sm text-muted-foreground line-through">
                      {action.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {weekActions.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma ação para esta semana</h3>
            <p className="text-muted-foreground">
              Vá para o planejamento para adicionar ações à semana {currentWeek}.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}