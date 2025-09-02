import React from 'react';
import { useGuide } from '@/components/guide/GuideProvider';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Clock, CheckCircle, ArrowLeft, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Introduction } from '@/components/guide/steps/Introduction';
import { VisionStep } from '@/components/guide/steps/VisionStep';
import { ObjectivesStep } from '@/components/guide/steps/ObjectivesStep';
import { ActionsStep } from '@/components/guide/steps/ActionsStep';
import { ExecutionStep } from '@/components/guide/steps/ExecutionStep';
import { ReviewStep } from '@/components/guide/steps/ReviewStep';

export default function GuideInteractivePage() {
  const navigate = useNavigate();
  const { 
    progress, 
    steps, 
    goToStep, 
    nextStep, 
    prevStep, 
    markStepComplete 
  } = useGuide();

  const currentStep = steps[progress.currentStep];
  const progressPercentage = ((progress.currentStep + 1) / steps.length) * 100;
  const totalTime = steps.reduce((acc, step) => acc + step.estimatedTime, 0);
  const completedTime = steps
    .filter(step => step.completed)
    .reduce((acc, step) => acc + step.estimatedTime, 0);

  const renderStepContent = () => {
    switch (currentStep?.id) {
      case 'introduction':
        return <Introduction onComplete={() => markStepComplete('introduction')} />;
      case 'vision':
        return <VisionStep onComplete={() => markStepComplete('vision')} />;
      case 'objectives':
        return <ObjectivesStep onComplete={() => markStepComplete('objectives')} />;
      case 'actions':
        return <ActionsStep onComplete={() => markStepComplete('actions')} />;
      case 'execution':
        return <ExecutionStep onComplete={() => markStepComplete('execution')} />;
      case 'review':
        return <ReviewStep onComplete={() => markStepComplete('review')} />;
      default:
        return <div>Passo não encontrado</div>;
    }
  };

  const canGoNext = progress.currentStep < steps.length - 1;
  const canGoPrev = progress.currentStep > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Dashboard
              </Button>
              <div className="hidden sm:block w-px h-6 bg-border"></div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h1 className="text-lg font-semibold text-foreground">
                  Guia Interativo - 12 Week Year
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="gap-1">
                <Clock className="h-3 w-3" />
                {completedTime}/{totalTime} min
              </Badge>
              <Badge variant="outline">
                Passo {progress.currentStep + 1} de {steps.length}
              </Badge>
            </div>
          </div>
          
          <div className="pb-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>{currentStep?.title}</span>
              <span>{Math.round(progressPercentage)}% concluído</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-32">
              <CardHeader>
                <CardTitle className="text-base">Passos do Guia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {steps.map((step, index) => (
                  <Button
                    key={step.id}
                    variant={progress.currentStep === index ? "default" : "ghost"}
                    size="sm"
                    onClick={() => goToStep(index)}
                    className="w-full justify-start relative"
                    disabled={index > progress.currentStep && !step.completed}
                  >
                    {step.completed && (
                      <CheckCircle className="h-3 w-3 mr-2 text-success" />
                    )}
                    <span className="text-xs font-medium mr-2">{index + 1}.</span>
                    <span className="text-left flex-1">{step.title}</span>
                  </Button>
                ))}
                
                <div className="pt-4 border-t border-border mt-4">
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>Progresso:</span>
                      <span>{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tempo:</span>
                      <span>~{currentStep?.estimatedTime} min</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {/* Step Content */}
              <div className="min-h-[600px]">
                {renderStepContent()}
              </div>

              {/* Navigation Footer */}
              <Card>
                <CardContent className="flex items-center justify-between p-6">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={!canGoPrev}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>~{currentStep?.estimatedTime} min</span>
                  </div>

                  <Button
                    onClick={nextStep}
                    disabled={!canGoNext}
                    className="gap-2"
                  >
                    Próximo
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}