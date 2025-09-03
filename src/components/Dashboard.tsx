import { MetricCard } from "./MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Target, Calendar, TrendingUp, CheckCircle } from "lucide-react";
import { useCurrentCycle } from "@/hooks/useSupabaseData";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGuide } from "@/components/guide/GuideProvider";
import { getCurrentWeek } from "@/utils/getCurrentWeek";

export function Dashboard() {
  const { currentCycle, loading } = useCurrentCycle();
  const [weeklyScore, setWeeklyScore] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const navigate = useNavigate();
  const { progress } = useGuide();

  useEffect(() => {
    if (currentCycle) {
      // Calculate current week progress
      const allActions = currentCycle.objectives.flatMap(obj => obj.actions);
      const currentWeek = getCurrentWeek(currentCycle.startDate);
      const weekActions = allActions.filter(action => action.weekNumber === currentWeek);
      const completedWeekActions = weekActions.filter(action => action.completed);
      const weekScore = weekActions.length > 0 ? (completedWeekActions.length / weekActions.length) * 100 : 0;
      setWeeklyScore(weekScore);

      // Calculate overall cycle progress
      const completedActions = allActions.filter(action => action.completed);
      const overallScore = allActions.length > 0 ? (completedActions.length / allActions.length) * 100 : 0;
      setOverallProgress(overallScore);
    }
  }, [currentCycle]);

  const getWeeksRemaining = (endDate: Date): number => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    return Math.max(diffWeeks, 0);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        </div>
        
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            <div className="animate-pulse">
              <div className="h-12 w-12 bg-muted rounded-full mx-auto mb-4"></div>
              <div className="h-4 bg-muted rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentCycle) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        </div>
        
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            {!progress.isComplete && (
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 mb-6">
                <h4 className="font-medium text-primary mb-2">🎯 Novo na metodologia?</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Aprenda em 30 minutos como aplicar o 12 Week Year com nosso guia interativo
                </p>
                <Button 
                  onClick={() => navigate('/guide')}
                  size="sm"
                  className="gap-2"
                >
                  <Target className="h-4 w-4" />
                  Começar Guia Interativo
                </Button>
              </div>
            )}
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Nenhum ciclo ativo</h3>
            <p className="text-muted-foreground mb-4">
              Comece criando sua visão de longo prazo e depois inicie seu primeiro ciclo de 12 semanas.
            </p>
            <div className="flex gap-2 justify-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/vision')}
              >
                Criar Visão
              </Button>
              <Button 
                size="sm"
                onClick={() => navigate('/planning')}
              >
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
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/execution')}
            >
              Ver Ações da Semana
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/planning')}
            >
              Adicionar Ação
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/reviews')}
            >
              Revisão Semanal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}