import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, addWeeks } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Cycle } from "@/types";
import { cn } from "@/lib/utils";

interface CycleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (cycle: Omit<Cycle, 'id' | 'objectives' | 'weeklyReviews'>) => void;
  cycle?: Cycle;
}

export function CycleForm({ open, onOpenChange, onSubmit, cycle }: CycleFormProps) {
  const [name, setName] = useState(cycle?.name || "");
  const [startDate, setStartDate] = useState<Date | undefined>(cycle?.startDate);
  const [status, setStatus] = useState<Cycle['status']>(cycle?.status || "planning");

  const endDate = startDate ? addWeeks(startDate, 12) : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !startDate) return;

    onSubmit({
      name,
      startDate,
      endDate: addWeeks(startDate, 12),
      status,
    });

    // Reset form
    setName("");
    setStartDate(undefined);
    setStatus("planning");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {cycle ? "Editar Ciclo" : "Novo Ciclo de 12 Semanas"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Ciclo</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Q1 2025 - Foco em React"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Data de Início</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {endDate && (
            <div className="space-y-2">
              <Label>Data de Término (calculada automaticamente)</Label>
              <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground">
                {format(endDate, "dd/MM/yyyy", { locale: ptBR })}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {cycle ? "Atualizar" : "Criar"} Ciclo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}