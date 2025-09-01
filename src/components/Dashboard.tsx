import { MetricCard } from "./MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Target, Calendar, TrendingUp, CheckCircle } from "lucide-react";
import { useCycles, useCurrentCycle } from "@/hooks/useLocalStorage";
import { Cycle } from "@/types";
import { useState, useEffect } from "react";
import { initializeSampleData } from "@/utils/sampleData";

export function Dashboard() {
  const [cycles] = useCycles();
  const [currentCycleId] = useCurrentCycle();
  const [currentCycle, setCurrentCycle] = useState<Cycle | null>(null);
  const [weeklyScore, setWeeklyScore] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    // Initialize sample data on first load
    initializeSampleData();
  }, []);

  useEffect(() => {
    if (currentCycleId && cycles.length > 0) {
      const cycle = cycles.find((c: Cycle) => c.id === currentCycleId);
      setCurrentCycle(cycle || null);
      
      if (cycle) {
        // Calculate current week progress
        const allActions = cycle.objectives.flatMap(obj => obj.actions);
        const currentWeek = getCurrentWeek(cycle.startDate);
        const weekActions = allActions.filter(action => action.weekNumber === currentWeek);
        const completedWeekActions = weekActions.filter(action => action.completed);
        const weekScore = weekActions.length > 0 ? (completedWeekActions.length / weekActions.length) * 100 : 0;
        setWeeklyScore(weekScore);

        // Calculate overall cycle progress
        const completedActions = allActions.filter(action => action.completed);
        const overallScore = allActions.length > 0 ? (completedActions.length / allActions.length) * 100 : 0;
        setOverallProgress(overallScore);
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

  const getWeeksRemaining = (endDate: Date): number => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    return Math.max(diffWeeks, 0);
  };

  if (!currentCycle) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        </div>
        
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Nenhum ciclo ativo</h3>
            <p className="text-muted-foreground mb-4">
              Comece criando sua visão de longo prazo e depois inicie seu primeiro ciclo de 12 semanas.
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" size="sm">
                Criar Visão
              </Button>
              <Button size="sm">
                Iniciar Ciclo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentWeek = getCurrentWeek(currentCycle.startDate);
  const weeksRemaining = getWeeksRemaining(currentCycle.endDate);
  const totalObjectives = currentCycle.objectives.length;
  const completedObjectives = currentCycle.objectives.filter(obj => obj.completed).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Ciclo: {currentCycle.name}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Semana {currentWeek} de 12</p>
          <p className="text-xs text-muted-foreground">{weeksRemaining} semanas restantes</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Score Semanal"
          value={`${weeklyScore.toFixed(0)}%`}
          subtitle="Ações concluídas esta semana"
          trend={{
            value: weeklyScore >= 85 ? 15 : -10,
            label: weeklyScore >= 85 ? "Meta atingida" : "Abaixo da meta",
            isPositive: weeklyScore >= 85
          }}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        
        <MetricCard
          title="Progresso Geral"
          value={`${overallProgress.toFixed(0)}%`}
          subtitle="Do ciclo completo"
          icon={<CheckCircle className="h-4 w-4" />}
        />
        
        <MetricCard
          title="Objetivos"
          value={`${completedObjectives}/${totalObjectives}`}
          subtitle="Objetivos concluídos"
          icon={<Target className="h-4 w-4" />}
        />
        
        <MetricCard
          title="Semana Atual"
          value={currentWeek}
          subtitle={`${weeksRemaining} semanas restantes`}
          icon={<Calendar className="h-4 w-4" />}
        />
      </div>

      {/* Weekly Progress */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Progresso Semanal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Semana {currentWeek}</span>
              <span className="text-sm font-medium text-foreground">{weeklyScore.toFixed(0)}%</span>
            </div>
            <Progress value={weeklyScore} className="h-2" />
            {weeklyScore < 85 && (
              <p className="text-xs text-warning">
                Meta: 85% de execução por semana. Ajuste suas ações para atingir a meta.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              Ver Ações da Semana
            </Button>
            <Button variant="outline" size="sm">
              Adicionar Ação
            </Button>
            <Button variant="outline" size="sm">
              Revisão Semanal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}