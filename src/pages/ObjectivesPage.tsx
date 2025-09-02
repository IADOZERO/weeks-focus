import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Target, AlertTriangle } from "lucide-react";
import { ObjectiveCard } from "@/components/ObjectiveCard";
import { ObjectiveForm } from "@/components/ObjectiveForm";
import { useCurrentCycle, useVisions, useObjectives } from "@/hooks/useSupabaseData";
import { Objective } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";

export default function ObjectivesPage() {
  const { visions } = useVisions();
  const { currentCycle, currentCycleId } = useCurrentCycle();
  const { objectives, addObjective, updateObjective, deleteObjective } = useObjectives(currentCycleId || undefined);
  const [showObjectiveForm, setShowObjectiveForm] = useState(false);
  const [editingObjective, setEditingObjective] = useState<Objective | undefined>();
  const { toast } = useToast();

  const handleCreateObjective = async (objectiveData: Omit<Objective, 'id' | 'actions'>) => {
    if (!currentCycle) {
      toast({
        title: "Erro",
        description: "Nenhum ciclo ativo encontrado. Crie um ciclo primeiro.",
        variant: "destructive",
      });
      return;
    }

    if (objectives.length >= 3) {
      toast({
        title: "Limite Atingido",
        description: "Você pode ter no máximo 3 objetivos por ciclo.",
        variant: "destructive",
      });
      return;
    }

    await addObjective(objectiveData);
  };

  const handleEditObjective = async (objectiveData: Omit<Objective, 'id' | 'actions'>) => {
    if (!editingObjective) return;

    await updateObjective(editingObjective.id, objectiveData);
    setEditingObjective(undefined);
  };

  const handleToggleObjective = async (objectiveId: string) => {
    const objective = objectives.find(obj => obj.id === objectiveId);
    if (!objective) return;

    await updateObjective(objectiveId, { completed: !objective.completed });
  };

  const handleDeleteObjective = async (objectiveId: string) => {
    await deleteObjective(objectiveId);
  };

  if (!currentCycle) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Objetivos</h1>
          <p className="text-muted-foreground">
            Defina e gerencie seus objetivos de 12 semanas
          </p>
        </div>

        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Nenhum ciclo ativo</h3>
            <p className="text-muted-foreground">
              Você precisa criar um ciclo antes de definir objetivos.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Objetivos</h1>
          <p className="text-muted-foreground">
            Defina e gerencie seus objetivos de 12 semanas
          </p>
        </div>
        <Button 
          onClick={() => setShowObjectiveForm(true)}
          disabled={objectives.length >= 3}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Objetivo
        </Button>
      </div>

      <div className="grid gap-4">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-foreground">
            Ciclo: {currentCycle.name}
          </Badge>
          <Badge variant="outline" className="text-foreground">
            Objetivos: {objectives.length}/3
          </Badge>
        </div>

        {objectives.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Nenhum objetivo definido</h3>
              <p className="text-muted-foreground mb-4">
                Comece criando seu primeiro objetivo para este ciclo.
              </p>
              <Button onClick={() => setShowObjectiveForm(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Criar Primeiro Objetivo
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {objectives.map((objective) => (
              <ObjectiveCard
                key={objective.id}
                objective={objective}
                onToggle={handleToggleObjective}
                onEdit={(obj) => {
                  setEditingObjective(obj);
                  setShowObjectiveForm(true);
                }}
                onDelete={handleDeleteObjective}
              />
            ))}
          </div>
        )}
      </div>

      <ObjectiveForm
        open={showObjectiveForm}
        onOpenChange={(open) => {
          setShowObjectiveForm(open);
          if (!open) setEditingObjective(undefined);
        }}
        onSubmit={editingObjective ? handleEditObjective : handleCreateObjective}
        visions={visions}
        objective={editingObjective}
      />
    </div>
  );
}