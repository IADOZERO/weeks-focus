import React from 'react';
import { useGuide } from './GuideProvider';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, X, Clock, CheckCircle } from 'lucide-react';
import { Introduction } from './steps/Introduction';
import { VisionStep } from './steps/VisionStep';
import { ObjectivesStep } from './steps/ObjectivesStep';
import { ActionsStep } from './steps/ActionsStep';
import { ExecutionStep } from './steps/ExecutionStep';
import { ReviewStep } from './steps/ReviewStep';

export function GuideModal() {
  const { 
    isOpen, 
    setIsOpen, 
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

  const handleClose = () => {
    setIsOpen(false);
  };

  const canGoNext = progress.currentStep < steps.length - 1;
  const canGoPrev = progress.currentStep > 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="flex-shrink-0 p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold text-foreground">
                Guia Interativo - Metodologia 12 Week Year
              </DialogTitle>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="secondary" className="gap-1">
                  <Clock className="h-3 w-3" />
                  {completedTime}/{totalTime} min
                </Badge>
                <Badge variant="outline">
                  Passo {progress.currentStep + 1} de {steps.length}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{currentStep?.title}</span>
              <span>{Math.round(progressPercentage)}% concluído</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </DialogHeader>

        {/* Steps Navigation */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-border">
          <div className="flex gap-2 flex-wrap">
            {steps.map((step, index) => (
              <Button
                key={step.id}
                variant={progress.currentStep === index ? "default" : "outline"}
                size="sm"
                onClick={() => goToStep(index)}
                className="relative"
                disabled={index > progress.currentStep && !step.completed}
              >
                {step.completed && (
                  <CheckCircle className="h-3 w-3 mr-1 text-success" />
                )}
                <span className="hidden sm:inline">{step.title}</span>
                <span className="sm:hidden">{index + 1}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-auto p-6">
          {renderStepContent()}
        </div>

        {/* Navigation Footer */}
        <div className="flex-shrink-0 flex items-center justify-between p-6 border-t border-border bg-muted/20">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}