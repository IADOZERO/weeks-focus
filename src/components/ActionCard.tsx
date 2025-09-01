import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Edit, Trash2, Clock, AlertCircle } from "lucide-react";
import { Action } from "@/types";

interface ActionCardProps {
  action: Action;
  onToggle: (id: string) => void;
  onEdit: (action: Action) => void;
  onDelete: (id: string) => void;
}

const priorityConfig = {
  high: { label: "Alta", color: "bg-destructive/20 text-destructive", icon: AlertCircle },
  medium: { label: "Média", color: "bg-warning/20 text-warning", icon: Clock },
  low: { label: "Baixa", color: "bg-muted/20 text-muted-foreground", icon: Circle }
};

export function ActionCard({ action, onToggle, onEdit, onDelete }: ActionCardProps) {
  const priority = priorityConfig[action.priority];
  const PriorityIcon = priority.icon;

  return (
    <Card className="bg-card border-border hover:border-accent transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <button
              onClick={() => onToggle(action.id)}
              className="mt-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              {action.completed ? (
                <CheckCircle2 className="h-5 w-5 text-success" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </button>
            <div className="flex-1">
              <h4 className={`font-medium ${action.completed ? 'line-through text-muted-foreground' : ''}`}>
                {action.title}
              </h4>
              {action.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {action.description}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className={priority.color}>
                  <PriorityIcon className="h-3 w-3 mr-1" />
                  {priority.label}
                </Badge>
                <Badge variant="outline" className="text-muted-foreground">
                  Semana {action.weekNumber}
                </Badge>
                {action.estimatedTime && (
                  <Badge variant="outline" className="text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {action.estimatedTime}h
                  </Badge>
                )}
              </div>
              {action.notes && (
                <p className="text-xs text-muted-foreground mt-2 p-2 bg-muted/50 rounded">
                  {action.notes}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(action)}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(action.id)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}