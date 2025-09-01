import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export default function PlanningPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Planejamento</h1>
        <p className="text-muted-foreground">
          Planeje suas ações semanais e gerencie seu ciclo atual
        </p>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-8 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Em desenvolvimento</h3>
          <p className="text-muted-foreground">
            Esta funcionalidade será implementada em breve.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}