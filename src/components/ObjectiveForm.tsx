import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Objective, Vision } from "@/types";
import { cn } from "@/lib/utils";

interface ObjectiveFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (objective: Omit<Objective, 'id' | 'actions'>) => void;
  visions: Vision[];
  objective?: Objective;
}

export function ObjectiveForm({ open, onOpenChange, onSubmit, visions, objective }: ObjectiveFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [measurable, setMeasurable] = useState("");
  const [deadline, setDeadline] = useState<Date | undefined>();
  const [visionId, setVisionId] = useState("");

  // Sync form state with objective prop
  useEffect(() => {
    if (objective) {
      setTitle(objective.title);
      setDescription(objective.description);
      setMeasurable(objective.measurable);
      setDeadline(objective.deadline);
      setVisionId(objective.visionId);
    } else {
      // Reset form when creating new objective
      setTitle("");
      setDescription("");
      setMeasurable("");
      setDeadline(undefined);
      setVisionId("");
    }
  }, [objective]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !measurable || !deadline || !visionId) return;

    onSubmit({
      title,
      description,
      measurable,
      deadline,
      visionId,
      completed: objective?.completed || false,
    });

    // Reset form only after successful submit
    if (!objective) {
      setTitle("");
      setDescription("");
      setMeasurable("");
      setDeadline(undefined);
      setVisionId("");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {objective ? "Editar Objetivo" : "Novo Objetivo"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Objetivo</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Completar 3 projetos React avançados"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva detalhadamente o que você quer alcançar..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="measurable">Critério Mensurável</Label>
            <Input
              id="measurable"
              value={measurable}
              onChange={(e) => setMeasurable(e.target.value)}
              placeholder="Como você medirá o sucesso?"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Visão Relacionada</Label>
            <Select value={visionId} onValueChange={setVisionId} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma visão" />
              </SelectTrigger>
              <SelectContent>
                {visions.map((vision) => (
                  <SelectItem key={vision.id} value={vision.id}>
                    {vision.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Prazo Final</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !deadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, "dd/MM/yyyy", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={setDeadline}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {objective ? "Atualizar" : "Criar"} Objetivo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}