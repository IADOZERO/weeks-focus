import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Target, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { ValidationFeedback } from '../shared/ValidationFeedback';
import { useObjectives, useVisions, useCycles } from '@/hooks/useSupabaseData';
import { useToast } from '@/hooks/use-toast';
import { addDays } from 'date-fns';

interface ObjectivesStepProps {
  onComplete: () => void;
}

interface Objective {
  title: string;
  description: string;
  measurable: string;
}

export function ObjectivesStep({ onComplete }: ObjectivesStepProps) {
  const [objectives, setObjectives] = useState<Objective[]>([
    { title: '', description: '', measurable: '' },
    { title: '', description: '', measurable: '' },
    { title: '', description: '', measurable: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { visions } = useVisions();
  const { currentCycle, cycles, addCycle } = useCycles();
  const { objectives: existingObjectives, addObjective } = useObjectives(currentCycle?.id);
  const { toast } = useToast();

  // Load existing objectives if available
  useEffect(() => {
    if (existingObjectives.length > 0) {
      const formattedObjectives = existingObjectives.slice(0, 3).map(obj => ({
        title: obj.title,
        description: obj.description,
        measurable: obj.measurable
      }));
      
      // Pad with empty objectives if needed
      while (formattedObjectives.length < 3) {
        formattedObjectives.push({ title: '', description: '', measurable: '' });
      }
      
      setObjectives(formattedObjectives);
    }
  }, [existingObjectives]);

  const validateObjective = (objective: Objective) => {
    if (!objective.title.trim()) return { type: 'error' as const, message: 'Título é obrigatório' };
    if (!objective.measurable.trim()) return { type: 'error' as const, message: 'Como você vai medir este objetivo?' };
    
    const hasNumbers = /\d+/.test(objective.measurable);
    const hasDeadline = objective.measurable.toLowerCase().includes('semana') || objective.measurable.toLowerCase().includes('até');
    
    if (!hasNumbers && !hasDeadline) {
      return { type: 'info' as const, message: 'Tente ser mais específico com números ou prazos' };
    }
    
    return { type: 'success' as const, message: 'Objetivo bem definido!' };
  };

  const updateObjective = (index: number, field: keyof Objective, value: string) => {
    setObjectives(prev => prev.map((obj, i) => 
      i === index ? { ...obj, [field]: value } : obj
    ));
  };

  const filledObjectives = objectives.filter(obj => obj.title.trim() && obj.measurable.trim());
  const canProceed = filledObjectives.length >= 2; // Pelo menos 2 objetivos

  const handleComplete = async () => {
    if (!canProceed || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      // Create or get current cycle
      let cycleId = currentCycle?.id;
      
      if (!cycleId) {
        const today = new Date();
        const endDate = addDays(today, 84); // 12 weeks = 84 days
        
        const newCycle = await addCycle({
          name: `Ciclo - ${today.toLocaleDateString()}`,
          startDate: today,
          endDate: endDate,
          status: 'planning' as const
        });
        cycleId = newCycle.id;
      }
      
      // Get latest vision for linking objectives
      const latestVision = visions[0];
      if (!latestVision) {
        throw new Error('É necessário criar uma visão primeiro');
      }
      
      // Save all filled objectives
      for (const objective of filledObjectives) {
        await addObjective({
          title: objective.title,
          description: objective.description,
          measurable: objective.measurable,
          deadline: addDays(new Date(), 84), // 12 weeks deadline
          visionId: latestVision.id,
          completed: false
        });
      }
      
      toast({
        title: "Objetivos salvos com sucesso!",
        description: `${filledObjectives.length} objetivos foram criados no seu ciclo.`,
      });
      
      onComplete();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar objetivos",
        description: error instanceof Error ? error.message : "Tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground flex items-center justify-center gap-2">
          <Target className="h-6 w-6 text-primary" />
          Escolhendo seus 3 Objetivos
        </h2>
        <p className="text-muted-foreground">
          Defina 2-3 objetivos específicos e mensuráveis para as próximas 12 semanas
        </p>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">Framework SMART para 12 semanas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="font-medium text-foreground">Específico</div>
              <div className="text-muted-foreground">O que exatamente?</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="font-medium text-foreground">Mensurável</div>
              <div className="text-muted-foreground">Como medir?</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="font-medium text-foreground">12 Semanas</div>
              <div className="text-muted-foreground">Alcançável em 84 dias</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {objectives.map((objective, index) => {
          const validation = objective.title.trim() || objective.measurable.trim() 
            ? validateObjective(objective) 
            : null;

          return (
            <Card key={index} className={`${index < 2 ? 'border-primary/30' : 'border-dashed'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Objetivo {index + 1}
                    {index < 2 && <Badge variant="secondary" className="ml-2">Obrigatório</Badge>}
                  </CardTitle>
                  <Badge variant="outline">
                    {filledObjectives.includes(objective) ? 'Preenchido' : 'Vazio'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Título do objetivo
                  </label>
                  <Input
                    placeholder="Ex: Conseguir 5 novos clientes para minha consultoria"
                    value={objective.title}
                    onChange={(e) => updateObjective(index, 'title', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Como você vai medir este objetivo?
                  </label>
                  <Input
                    placeholder="Ex: 5 contratos assinados até a semana 12"
                    value={objective.measurable}
                    onChange={(e) => updateObjective(index, 'measurable', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Descrição adicional (opcional)
                  </label>
                  <Textarea
                    placeholder="Detalhes sobre como este objetivo se conecta com sua visão..."
                    value={objective.description}
                    onChange={(e) => updateObjective(index, 'description', e.target.value)}
                    rows={2}
                  />
                </div>

                {validation && (
                  <ValidationFeedback
                    type={validation.type}
                    message={validation.message}
                  />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-warning/50 bg-warning/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-warning mt-0.5" />
            <div className="space-y-2">
              <p className="font-medium text-foreground">Por que apenas 2-3 objetivos?</p>
              <p className="text-sm text-muted-foreground">
                Foco é fundamental. Com muitos objetivos, você não consegue dar a atenção necessária para executar bem.
                É melhor conquistar 2-3 objetivos do que falhar em 5-6.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          <p>📊 Objetivos preenchidos: {filledObjectives.length}/3</p>
          <p className="text-xs mt-1">Mínimo necessário: 2 objetivos</p>
        </div>
        
        <Button 
          onClick={handleComplete}
          disabled={!canProceed || isSubmitting}
          className="gap-2"
        >
          {isSubmitting ? 'Salvando...' : 'Continuar'} <CheckCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}