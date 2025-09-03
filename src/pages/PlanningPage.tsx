import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar, Target, CheckCircle, AlertTriangle, Edit2 } from "lucide-react";
import { ActionCard } from "@/components/ActionCard";
import { ActionForm } from "@/components/ActionForm";
import { CycleForm } from "@/components/CycleForm";
import { useCurrentCycle, useCycles, useActions } from "@/hooks/useSupabaseData";
import { Cycle, Action } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";

export default function PlanningPage() {
  const { cycles, addCycle, updateCycle, refetch: refetchCycles } = useCycles();
  const { currentCycle, currentCycleId } = useCurrentCycle();
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<string>("");
  const { actions: allActions, addAction, updateAction, deleteAction } = useActions(selectedObjectiveId || undefined);
  const [showActionForm, setShowActionForm] = useState(false);
  const [showCycleForm, setShowCycleForm] = useState(false);
  const [editingCycle, setEditingCycle] = useState<Cycle | undefined>();
  const [editingAction, setEditingAction] = useState<Action | undefined>();
  const { toast } = useToast();

  const currentWeekNumber = getCurrentWeekNumber(currentCycle);

  const handleCreateCycle = async (cycleData: Omit<Cycle, 'id' | 'objectives' | 'weeklyReviews'>) => {
    await addCycle(cycleData);
  };

  const handleUpdateCycle = async (cycleData: Omit<Cycle, 'id' | 'objectives' | 'weeklyReviews'>) => {
    if (!editingCycle) return;
    await updateCycle(editingCycle.id, cycleData);
    setEditingCycle(undefined);
  };

  const handleCreateAction = async (actionData: Omit<Action, 'id' | 'completed' | 'completedAt'>) => {
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

    await addAction(actionData);
    refetchCycles();
  };

  const handleEditAction = async (actionData: Omit<Action, 'id' | 'completed' | 'completedAt'>) => {
    if (!editingAction) return;

    await updateAction(editingAction.id, actionData);
    setEditingAction(undefined);
    refetchCycles();
  };

  const handleToggleAction = async (actionId: string) => {
    const action = allActions.find(a => a.id === actionId);
    if (!action) return;

    await updateAction(actionId, { completed: !action.completed });
    refetchCycles();
  };

  const handleDeleteAction = async (actionId: string) => {
    await deleteAction(actionId);
    refetchCycles();
  };

  function getCurrentWeekNumber(cycle: Cycle | null): number {
    if (!cycle) return 1;
    
    const now = new Date();
    const start = new Date(cycle.startDate);
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    return Math.min(Math.max(diffWeeks, 1), 12);
  }

  function getActionsForWeek(week: number): Action[] {
    if (!currentCycle) return [];
    
    return currentCycle.objectives.flatMap(obj => 
      obj.actions.filter(action => action.weekNumber === week)
    );
  }

  if (!currentCycle) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Planejamento</h1>
          <p className="text-muted-foreground">
            Organize suas ações e gerencie seus ciclos de 12 semanas
          </p>
        </div>

        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
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
            Organize suas ações e gerencie seus ciclos de 12 semanas
          </p>
        </div>
        <div className="flex gap-2">
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
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-foreground">
              Ciclo: {currentCycle.name}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditingCycle(currentCycle);
                setShowCycleForm(true);
              }}
              className="h-6 w-6 p-0"
            >
              <Edit2 className="h-3 w-3" />
            </Button>
          </div>
          <Badge variant="outline" className="text-foreground">
            Semana Atual: {currentWeekNumber}/12
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="current-week" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current-week">Semana Atual</TabsTrigger>
          <TabsTrigger value="all-weeks">Todas as Semanas</TabsTrigger>
          <TabsTrigger value="by-objective">Por Objetivo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current-week" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Semana {currentWeekNumber}</h2>
          </div>

          {getActionsForWeek(currentWeekNumber).length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma ação para esta semana</h3>
                <p className="text-muted-foreground mb-4">
                  Adicione ações para a semana {currentWeekNumber} para manter o foco.
                </p>
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
                    setShowActionForm(true);
                  }} 
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Primeira Ação
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {getActionsForWeek(currentWeekNumber).map((action) => (
                <ActionCard
                  key={action.id}
                  action={action}
                  onToggle={handleToggleAction}
                  onEdit={(action) => {
                    setEditingAction(action);
                    setSelectedObjectiveId(action.objectiveId || "");
                    setShowActionForm(true);
                  }}
                  onDelete={handleDeleteAction}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all-weeks" className="space-y-6">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((week) => {
            const weekActions = getActionsForWeek(week);
            const completedCount = weekActions.filter(a => a.completed).length;
            
            return (
              <Card key={week} className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-foreground">Semana {week}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-foreground">
                        {completedCount}/{weekActions.length} concluídas
                      </Badge>
                      {week === currentWeekNumber && (
                        <Badge className="bg-primary text-primary-foreground">
                          Atual
                        </Badge>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                {weekActions.length > 0 && (
                  <CardContent className="space-y-3">
                    {weekActions.map((action) => (
                      <ActionCard
                        key={action.id}
                        action={action}
                        onToggle={handleToggleAction}
                        onEdit={(action) => {
                          setEditingAction(action);
                          setSelectedObjectiveId(action.objectiveId || "");
                          setShowActionForm(true);
                        }}
                        onDelete={handleDeleteAction}
                        compact
                      />
                    ))}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="by-objective" className="space-y-6">
          {currentCycle.objectives.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Nenhum objetivo definido</h3>
                <p className="text-muted-foreground">
                  Defina objetivos primeiro para adicionar ações organizadas.
                </p>
              </CardContent>
            </Card>
          ) : (
            currentCycle.objectives.map((objective) => {
              const objectiveActions = objective.actions;
              const completedCount = objectiveActions.filter(a => a.completed).length;
              
              return (
                <Card key={objective.id} className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground">{objective.title}</span>
                        {objective.completed && (
                          <CheckCircle className="h-5 w-5 text-success" />
                        )}
                      </div>
                      <Badge variant="outline" className="text-foreground">
                        {completedCount}/{objectiveActions.length} ações concluídas
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  {objectiveActions.length > 0 && (
                    <CardContent className="space-y-3">
                      {objectiveActions.map((action) => (
                        <ActionCard
                          key={action.id}
                          action={action}
                          onToggle={handleToggleAction}
                          onEdit={(action) => {
                            setEditingAction(action);
                            setSelectedObjectiveId(objective.id);
                            setShowActionForm(true);
                          }}
                          onDelete={handleDeleteAction}
                          showWeek
                        />
                      ))}
                    </CardContent>
                  )}
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>

      <ActionForm
        open={showActionForm}
        onOpenChange={(open) => {
          setShowActionForm(open);
          if (!open) {
            setEditingAction(undefined);
            setSelectedObjectiveId("");
          }
        }}
        objectives={currentCycle.objectives}
        selectedObjectiveId={selectedObjectiveId}
        onObjectiveChange={setSelectedObjectiveId}
        onSubmit={editingAction ? handleEditAction : handleCreateAction}
        action={editingAction}
        currentWeek={currentWeekNumber}
      />

      <CycleForm
        open={showCycleForm}
        onOpenChange={(open) => {
          setShowCycleForm(open);
          if (!open) {
            setEditingCycle(undefined);
          }
        }}
        onSubmit={editingCycle ? handleUpdateCycle : handleCreateCycle}
        cycle={editingCycle}
      />
    </div>
  );
}