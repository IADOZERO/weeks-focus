import { Card, CardContent } from "@/components/ui/card";
import { Target } from "lucide-react";

export default function ObjectivesPage() {
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
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Em desenvolvimento</h3>
          <p className="text-muted-foreground">
            Esta funcionalidade será implementada em breve.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}