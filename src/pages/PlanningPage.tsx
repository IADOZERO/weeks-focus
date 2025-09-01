import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar, Target, Clock, AlertTriangle } from "lucide-react";
import { ActionCard } from "@/components/ActionCard";
import { ActionForm } from "@/components/ActionForm";
import { CycleForm } from "@/components/CycleForm";
import { useCycles, useCurrentCycle } from "@/hooks/useLocalStorage";
import { Action, Cycle } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { format, isWithinInterval, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function PlanningPage() {
  const [cycles, setCycles] = useCycles();
  const [currentCycleId, setCurrentCycleId] = useCurrentCycle();
  const [showActionForm, setShowActionForm] = useState(false);
  const [showCycleForm, setShowCycleForm] = useState(false);
  const [editingAction, setEditingAction] = useState<Action | undefined>();
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<string>("");
  const [selectedWeek, setSelectedWeek] = useState(1);
  const { toast } = useToast();

  const currentCycle = cycles.find(cycle => cycle.id === currentCycleId);
  const currentWeekNumber = getCurrentWeekNumber(currentCycle);

  function getCurrentWeekNumber(cycle: Cycle | undefined): number {
    if (!cycle) return 1;
    
    const now = new Date();
    const weeksDiff = Math.floor((now.getTime() - cycle.startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
    return Math.max(1, Math.min(12, weeksDiff + 1));
  }

  const handleCreateCycle = (cycleData: Omit<Cycle, 'id' | 'objectives' | 'weeklyReviews'>) => {
    const newCycle: Cycle = {
      ...cycleData,
      id: uuidv4(),
      objectives: [],
      weeklyReviews: [],
    };

    setCycles([...cycles, newCycle]);
    setCurrentCycleId(newCycle.id);
    toast({
      title: "Sucesso",
      description: "Novo ciclo criado com sucesso!",
    });
  };

  const handleCreateAction = (actionData: Omit<Action, 'id' | 'completed' | 'completedAt'>) => {
    if (!currentCycle || !selectedObjectiveId) {
      toast({
        title: "Erro",
        description: "Selecione um objetivo para adicionar a ação.",
        variant: "destructive",
      });
      return;
    }

    const objective = currentCycle.objectives.find(obj => obj.id === selectedObjectiveId);
    if (!objective) return;

    const weekActions = objective.actions.filter(action => action.weekNumber === actionData.weekNumber);
    if (weekActions.length >= 5) {
      toast({
        title: "Limite Atingido",
        description: "Você pode ter no máximo 5 ações por semana.",
        variant: "destructive",
      });
      return;
    }

    const newAction: Action = {
      ...actionData,
      id: uuidv4(),
      completed: false,
    };

    const updatedCycles = cycles.map(cycle =>
      cycle.id === currentCycleId
        ? {
            ...cycle,
            objectives: cycle.objectives.map(obj =>
              obj.id === selectedObjectiveId
                ? { ...obj, actions: [...obj.actions, newAction] }
                : obj
            )
          }
        : cycle
    );

    setCycles(updatedCycles);
    toast({
      title: "Sucesso",
      description: "Ação criada com sucesso!",
    });
  };

  const handleEditAction = (actionData: Omit<Action, 'id' | 'completed' | 'completedAt'>) => {
    if (!editingAction || !currentCycle) return;

    const updatedCycles = cycles.map(cycle =>
      cycle.id === currentCycleId
        ? {
            ...cycle,
            objectives: cycle.objectives.map(obj => ({
              ...obj,
              actions: obj.actions.map(action =>
                action.id === editingAction.id
                  ? { ...action, ...actionData }
                  : action
              )
            }))
          }
        : cycle
    );

    setCycles(updatedCycles);
    setEditingAction(undefined);
    toast({
      title: "Sucesso",
      description: "Ação atualizada com sucesso!",
    });
  };

  const handleToggleAction = (actionId: string) => {
    if (!currentCycle) return;

    const updatedCycles = cycles.map(cycle =>
      cycle.id === currentCycleId
        ? {
            ...cycle,
            objectives: cycle.objectives.map(obj => ({
              ...obj,
              actions: obj.actions.map(action =>
                action.id === actionId
                  ? { 
                      ...action, 
                      completed: !action.completed,
                      completedAt: !action.completed ? new Date() : undefined
                    }
                  : action
              )
            }))
          }
        : cycle
    );

    setCycles(updatedCycles);
  };

  const handleDeleteAction = (actionId: string) => {
    if (!currentCycle) return;

    const updatedCycles = cycles.map(cycle =>
      cycle.id === currentCycleId
        ? {
            ...cycle,
            objectives: cycle.objectives.map(obj => ({
              ...obj,
              actions: obj.actions.filter(action => action.id !== actionId)
            }))
          }
        : cycle
    );

    setCycles(updatedCycles);
    toast({
      title: "Sucesso",
      description: "Ação removida com sucesso!",
    });
  };

  const getActionsForWeek = (weekNumber: number) => {
    if (!currentCycle) return [];
    return currentCycle.objectives.flatMap(obj => 
      obj.actions.filter(action => action.weekNumber === weekNumber)
    );
  };

  if (!currentCycle) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Planejamento</h1>
            <p className="text-muted-foreground">
              Planeje suas ações semanais e gerencie seu ciclo atual
            </p>
          </div>
          <Button onClick={() => setShowCycleForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Ciclo
          </Button>
        </div>

        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Nenhum ciclo ativo</h3>
            <p className="text-muted-foreground mb-4">
              Crie seu primeiro ciclo de 12 semanas para começar o planejamento.
            </p>
            <Button onClick={() => setShowCycleForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Criar Primeiro Ciclo
            </Button>
          </CardContent>
        </Card>

        <CycleForm
          open={showCycleForm}
          onOpenChange={setShowCycleForm}
          onSubmit={handleCreateCycle}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Planejamento</h1>
          <p className="text-muted-foreground">
            Planeje suas ações semanais e gerencie seu ciclo atual
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowCycleForm(true)} className="gap-2">
            <Calendar className="h-4 w-4" />
            Gerenciar Ciclo
          </Button>
          <Button 
            onClick={() => {
              if (currentCycle.objectives.length === 0) {
                toast({
                  title: "Atenção",
                  description: "Crie objetivos primeiro antes de adicionar ações.",
                  variant: "destructive",
                });
                return;
              }
              setSelectedObjectiveId(currentCycle.objectives[0].id);
              setSelectedWeek(currentWeekNumber);
              setShowActionForm(true);
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Nova Ação
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-foreground">
            {currentCycle.name}
          </Badge>
          <Badge variant="outline" className="text-foreground">
            Semana Atual: {currentWeekNumber}/12
          </Badge>
          <Badge variant="outline" className="text-foreground">
            {format(currentCycle.startDate, "dd/MM", { locale: ptBR })} - {format(currentCycle.endDate, "dd/MM/yyyy", { locale: ptBR })}
          </Badge>
        </div>

        <Tabs defaultValue="current-week" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="current-week">Semana Atual</TabsTrigger>
            <TabsTrigger value="all-weeks">Todas as Semanas</TabsTrigger>
            <TabsTrigger value="objectives">Por Objetivo</TabsTrigger>
          </TabsList>

          <TabsContent value="current-week" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Semana {currentWeekNumber} - Ações
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getActionsForWeek(currentWeekNumber).length === 0 ? (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhuma ação planejada para esta semana.</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {getActionsForWeek(currentWeekNumber).map((action) => (
                      <ActionCard
                        key={action.id}
                        action={action}
                        onToggle={handleToggleAction}
                        onEdit={(action) => {
                          setEditingAction(action);
                          setShowActionForm(true);
                        }}
                        onDelete={handleDeleteAction}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all-weeks" className="space-y-4">
            <div className="grid gap-4">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((weekNumber) => {
                const weekActions = getActionsForWeek(weekNumber);
                return (
                  <Card key={weekNumber}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Calendar className="h-5 w-5" />
                          Semana {weekNumber}
                        </span>
                        <Badge variant="outline">
                          {weekActions.length} ações
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {weekActions.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">
                          Nenhuma ação planejada
                        </p>
                      ) : (
                        <div className="grid gap-3">
                          {weekActions.map((action) => (
                            <ActionCard
                              key={action.id}
                              action={action}
                              onToggle={handleToggleAction}
                              onEdit={(action) => {
                                setEditingAction(action);
                                setShowActionForm(true);
                              }}
                              onDelete={handleDeleteAction}
                            />
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="objectives" className="space-y-4">
            {currentCycle.objectives.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Nenhum objetivo definido</h3>
                  <p className="text-muted-foreground">
                    Vá para a página de Objetivos para criar seus objetivos primeiro.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {currentCycle.objectives.map((objective) => (
                  <Card key={objective.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          {objective.title}
                        </span>
                        <Badge variant="outline">
                          {objective.actions.length} ações
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {objective.actions.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">
                          Nenhuma ação criada para este objetivo
                        </p>
                      ) : (
                        <div className="grid gap-3">
                          {objective.actions.map((action) => (
                            <ActionCard
                              key={action.id}
                              action={action}
                              onToggle={handleToggleAction}
                              onEdit={(action) => {
                                setEditingAction(action);
                                setShowActionForm(true);
                              }}
                              onDelete={handleDeleteAction}
                            />
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <ActionForm
        open={showActionForm}
        onOpenChange={(open) => {
          setShowActionForm(open);
          if (!open) setEditingAction(undefined);
        }}
        onSubmit={editingAction ? handleEditAction : handleCreateAction}
        action={editingAction}
        currentWeek={selectedWeek}
      />

      <CycleForm
        open={showCycleForm}
        onOpenChange={setShowCycleForm}
        onSubmit={handleCreateCycle}
        cycle={currentCycle}
      />
    </div>
  );
}