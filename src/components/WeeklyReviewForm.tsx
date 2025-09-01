import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { WeeklyReview } from "@/types";
import { X } from "lucide-react";

interface WeeklyReviewFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (review: Omit<WeeklyReview, 'id' | 'createdAt'>) => void;
  weekNumber: number;
  cycleId: string;
  completionRate: number;
  review?: WeeklyReview;
}

export function WeeklyReviewForm({ 
  open, 
  onOpenChange, 
  onSubmit, 
  weekNumber, 
  cycleId, 
  completionRate,
  review 
}: WeeklyReviewFormProps) {
  const [obstacles, setObstacles] = useState<string[]>(review?.obstacles || []);
  const [adjustments, setAdjustments] = useState<string[]>(review?.adjustments || []);
  const [learnings, setLearnings] = useState<string[]>(review?.learnings || []);
  const [newObstacle, setNewObstacle] = useState("");
  const [newAdjustment, setNewAdjustment] = useState("");
  const [newLearning, setNewLearning] = useState("");

  const addItem = (value: string, setter: (items: string[]) => void, items: string[], inputSetter: (value: string) => void) => {
    if (value.trim()) {
      setter([...items, value.trim()]);
      inputSetter("");
    }
  };

  const removeItem = (index: number, setter: (items: string[]) => void, items: string[]) => {
    setter(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      weekNumber,
      cycleId,
      completionRate,
      obstacles,
      adjustments,
      learnings,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Revisão da Semana {weekNumber}
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            Taxa de conclusão: <span className="font-medium">{completionRate.toFixed(1)}%</span>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Obstáculos */}
          <div className="space-y-3">
            <Label>Obstáculos Enfrentados</Label>
            <div className="flex gap-2">
              <Input
                value={newObstacle}
                onChange={(e) => setNewObstacle(e.target.value)}
                placeholder="Que obstáculos você enfrentou?"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addItem(newObstacle, setObstacles, obstacles, setNewObstacle);
                  }
                }}
              />
              <Button
                type="button"
                onClick={() => addItem(newObstacle, setObstacles, obstacles, setNewObstacle)}
                size="sm"
              >
                Adicionar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {obstacles.map((obstacle, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {obstacle}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeItem(index, setObstacles, obstacles)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Ajustes */}
          <div className="space-y-3">
            <Label>Ajustes Necessários</Label>
            <div className="flex gap-2">
              <Input
                value={newAdjustment}
                onChange={(e) => setNewAdjustment(e.target.value)}
                placeholder="Que ajustes você fará na próxima semana?"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addItem(newAdjustment, setAdjustments, adjustments, setNewAdjustment);
                  }
                }}
              />
              <Button
                type="button"
                onClick={() => addItem(newAdjustment, setAdjustments, adjustments, setNewAdjustment)}
                size="sm"
              >
                Adicionar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {adjustments.map((adjustment, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {adjustment}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeItem(index, setAdjustments, adjustments)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Aprendizados */}
          <div className="space-y-3">
            <Label>Principais Aprendizados</Label>
            <div className="flex gap-2">
              <Input
                value={newLearning}
                onChange={(e) => setNewLearning(e.target.value)}
                placeholder="O que você aprendeu esta semana?"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addItem(newLearning, setLearnings, learnings, setNewLearning);
                  }
                }}
              />
              <Button
                type="button"
                onClick={() => addItem(newLearning, setLearnings, learnings, setNewLearning)}
                size="sm"
              >
                Adicionar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {learnings.map((learning, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {learning}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeItem(index, setLearnings, learnings)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Revisão
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}