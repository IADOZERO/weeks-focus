import React from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle } from 'lucide-react';

interface ProgressBarProps {
  steps: { id: string; title: string; completed: boolean }[];
  currentStep: number;
  showLabels?: boolean;
}

export function ProgressBar({ steps, currentStep, showLabels = true }: ProgressBarProps) {
  const completedSteps = steps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Progresso do Guia</span>
        <span>{completedSteps}/{steps.length} concluídos</span>
      </div>
      
      <Progress value={progressPercentage} className="h-2" />
      
      {showLabels && (
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex flex-col items-center gap-1 ${
                index === currentStep 
                  ? 'text-primary' 
                  : step.completed 
                    ? 'text-success' 
                    : 'text-muted-foreground'
              }`}
            >
              {step.completed ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <Circle className="h-4 w-4" />
              )}
              <span className="text-xs text-center max-w-16 leading-tight">
                {step.title.split(' ').slice(0, 2).join(' ')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}