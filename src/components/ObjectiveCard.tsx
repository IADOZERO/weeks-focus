import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Edit, Trash2, Target, Calendar } from "lucide-react";
import { Objective } from "@/types";
import { format } from "date-fns";

interface ObjectiveCardProps {
  objective: Objective;
  onToggle: (id: string) => void;
  onEdit: (objective: Objective) => void;
  onDelete: (id: string) => void;
  onViewActions?: (id: string) => void;
}

export function ObjectiveCard({ objective, onToggle, onEdit, onDelete, onViewActions }: ObjectiveCardProps) {
  const completedActions = objective.actions.filter(action => action.completed).length;
  const totalActions = objective.actions.length;
  const progressPercentage = totalActions > 0 ? (completedActions / totalActions) * 100 : 0;

  return (
    <Card
      className="bg-card border-border hover:border-accent transition-colors"
      onClick={() => onViewActions?.(objective.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle(objective.id);
              }}
              className="mt-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              {objective.completed ? (
                <CheckCircle2 className="h-5 w-5 text-success" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </button>
            <div className="flex-1">
              <CardTitle className={`text-lg ${objective.completed ? 'line-through text-muted-foreground' : ''}`}>
                {objective.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {objective.description}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{objective.measurable}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Meta: {format(objective.deadline, 'dd/MM/yyyy')}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(objective);
              }}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(objective.id);
              }}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progresso das Ações</span>
              <span className="text-foreground">{completedActions}/{totalActions}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          {objective.completed && (
            <Badge variant="secondary" className="bg-success/20 text-success">
              Objetivo Concluído
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}