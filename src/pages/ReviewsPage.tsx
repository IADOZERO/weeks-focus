import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Calendar, TrendingUp, BookOpen, AlertTriangle } from "lucide-react";
import { WeeklyReviewForm } from "@/components/WeeklyReviewForm";
import { useCurrentCycle, useCycles, useWeeklyReviews } from "@/hooks/useSupabaseData";
import { WeeklyReview } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ReviewsPage() {
  const { currentCycle, currentCycleId } = useCurrentCycle();
  const { reviews, addReview } = useWeeklyReviews(currentCycleId || undefined);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const { toast } = useToast();

  const getCurrentWeekNumber = (): number => {
    if (!currentCycle) return 1;
    
    const now = new Date();
    const weeksDiff = Math.floor((now.getTime() - currentCycle.startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
    return Math.max(1, Math.min(12, weeksDiff + 1));
  };

  const getWeekCompletionRate = (weekNumber: number): number => {
    if (!currentCycle) return 0;

    const weekActions = currentCycle.objectives.flatMap(obj => 
      obj.actions.filter(action => action.weekNumber === weekNumber)
    );
    
    if (weekActions.length === 0) return 0;
    
    const completedActions = weekActions.filter(action => action.completed).length;
    return (completedActions / weekActions.length) * 100;
  };

  const handleCreateReview = async (reviewData: Omit<WeeklyReview, 'id' | 'createdAt'>) => {
    if (!currentCycle) return;

    const existingReview = reviews.find(r => r.weekNumber === reviewData.weekNumber);
    if (existingReview) {
      toast({
        title: "Erro",
        description: "Já existe uma revisão para esta semana.",
        variant: "destructive",
      });
      return;
    }

    await addReview(reviewData);
  };

  const currentWeek = getCurrentWeekNumber();
  const averageCompletionRate = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.completionRate, 0) / reviews.length 
    : 0;

  if (!currentCycle) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Revisões</h1>
          <p className="text-muted-foreground">
            Acompanhe seu progresso com revisões semanais
          </p>
        </div>

        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Nenhum ciclo ativo</h3>
            <p className="text-muted-foreground">
              Você precisa ter um ciclo ativo para fazer revisões.
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
          <h1 className="text-3xl font-bold text-foreground">Revisões</h1>
          <p className="text-muted-foreground">
            Acompanhe seu progresso com revisões semanais
          </p>
        </div>
          <Button 
            onClick={() => {
              setSelectedWeek(currentWeek);
              setShowReviewForm(true);
            }}
            className="gap-2"
          >
          <Plus className="h-4 w-4" />
          Nova Revisão
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Semana Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentWeek}/12</div>
            <p className="text-xs text-muted-foreground">
              {format(currentCycle.startDate, "dd/MM", { locale: ptBR })} - {format(currentCycle.endDate, "dd/MM/yyyy", { locale: ptBR })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Taxa Média de Conclusão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageCompletionRate.toFixed(1)}%</div>
            <Progress value={averageCompletionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Revisões Feitas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviews.length}</div>
            <p className="text-xs text-muted-foreground">
              de {currentWeek} semanas possíveis
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progresso Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {Array.from({ length: Math.min(currentWeek, 12) }, (_, i) => i + 1).map((weekNumber) => {
                const review = reviews.find(r => r.weekNumber === weekNumber);
                const completionRate = review?.completionRate || getWeekCompletionRate(weekNumber);
                const hasReview = !!review;

                return (
                  <div key={weekNumber} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-medium">Semana {weekNumber}</div>
                      <Badge variant={hasReview ? "default" : "outline"}>
                        {hasReview ? "Revisado" : "Pendente"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-muted-foreground">{completionRate.toFixed(1)}%</div>
                      <div className="w-32">
                        <Progress value={completionRate} />
                      </div>
                      {!hasReview && weekNumber <= currentWeek && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedWeek(weekNumber);
                            setShowReviewForm(true);
                          }}
                        >
                          Revisar
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {reviews.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Histórico de Revisões
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {reviews
                  .sort((a, b) => b.weekNumber - a.weekNumber)
                  .map((review) => (
                    <div key={review.id} className="border border-border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Semana {review.weekNumber}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{review.completionRate.toFixed(1)}%</Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(review.createdAt, "dd/MM/yyyy", { locale: ptBR })}
                          </span>
                        </div>
                      </div>

                      {review.obstacles.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-destructive mb-1">Obstáculos</h5>
                          <div className="flex flex-wrap gap-1">
                            {review.obstacles.map((obstacle, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {obstacle}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {review.adjustments.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-warning mb-1">Ajustes</h5>
                          <div className="flex flex-wrap gap-1">
                            {review.adjustments.map((adjustment, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {adjustment}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {review.learnings.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-success mb-1">Aprendizados</h5>
                          <div className="flex flex-wrap gap-1">
                            {review.learnings.map((learning, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {learning}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <WeeklyReviewForm
        open={showReviewForm}
        onOpenChange={setShowReviewForm}
        onSubmit={handleCreateReview}
        weekNumber={selectedWeek}
        cycleId={currentCycle.id}
        completionRate={getWeekCompletionRate(selectedWeek)}
      />
    </div>
  );
}