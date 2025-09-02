import React, { createContext, useContext, useState, useEffect } from 'react';

export interface GuideStep {
  id: string;
  title: string;
  estimatedTime: number;
  completed: boolean;
}

export interface GuideProgress {
  currentStep: number;
  completedSteps: string[];
  timeSpent: number;
  isFirstTime: boolean;
  isComplete: boolean;
}

interface GuideContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  progress: GuideProgress;
  setProgress: (progress: GuideProgress) => void;
  steps: GuideStep[];
  goToStep: (stepIndex: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  markStepComplete: (stepId: string) => void;
  resetGuide: () => void;
}

const GuideContext = createContext<GuideContextType | undefined>(undefined);

const GUIDE_STEPS: GuideStep[] = [
  { id: 'introduction', title: 'Introdução à Metodologia', estimatedTime: 2, completed: false },
  { id: 'vision', title: 'Definindo sua Visão', estimatedTime: 5, completed: false },
  { id: 'objectives', title: 'Escolhendo seus 3 Objetivos', estimatedTime: 10, completed: false },
  { id: 'actions', title: 'Criando seu Plano de Ação', estimatedTime: 15, completed: false },
  { id: 'execution', title: 'Executando e Medindo', estimatedTime: 5, completed: false },
  { id: 'review', title: 'Revisão e Próximo Ciclo', estimatedTime: 5, completed: false },
];

const STORAGE_KEY = 'guide-progress';

export function GuideProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [steps, setSteps] = useState<GuideStep[]>(GUIDE_STEPS);
  const [progress, setProgress] = useState<GuideProgress>({
    currentStep: 0,
    completedSteps: [],
    timeSpent: 0,
    isFirstTime: true,
    isComplete: false,
  });

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setProgress(parsed);
        
        // Update steps with completion status
        const updatedSteps = GUIDE_STEPS.map(step => ({
          ...step,
          completed: parsed.completedSteps.includes(step.id)
        }));
        setSteps(updatedSteps);
      } catch (error) {
        console.error('Error loading guide progress:', error);
      }
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setProgress(prev => ({
        ...prev,
        currentStep: stepIndex
      }));
    }
  };

  const nextStep = () => {
    if (progress.currentStep < steps.length - 1) {
      setProgress(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1
      }));
    }
  };

  const prevStep = () => {
    if (progress.currentStep > 0) {
      setProgress(prev => ({
        ...prev,
        currentStep: prev.currentStep - 1
      }));
    }
  };

  const markStepComplete = (stepId: string) => {
    setProgress(prev => {
      const newCompletedSteps = prev.completedSteps.includes(stepId) 
        ? prev.completedSteps 
        : [...prev.completedSteps, stepId];
      
      const isComplete = newCompletedSteps.length === steps.length;
      
      return {
        ...prev,
        completedSteps: newCompletedSteps,
        isComplete,
        isFirstTime: false
      };
    });

    // Update steps state
    setSteps(prev => prev.map(step => ({
      ...step,
      completed: step.id === stepId ? true : step.completed
    })));
  };

  const resetGuide = () => {
    const resetProgress: GuideProgress = {
      currentStep: 0,
      completedSteps: [],
      timeSpent: 0,
      isFirstTime: true,
      isComplete: false,
    };
    
    setProgress(resetProgress);
    setSteps(GUIDE_STEPS.map(step => ({ ...step, completed: false })));
    localStorage.removeItem(STORAGE_KEY);
  };

  const value: GuideContextType = {
    isOpen,
    setIsOpen,
    progress,
    setProgress,
    steps,
    goToStep,
    nextStep,
    prevStep,
    markStepComplete,
    resetGuide,
  };

  return (
    <GuideContext.Provider value={value}>
      {children}
    </GuideContext.Provider>
  );
}

export function useGuide() {
  const context = useContext(GuideContext);
  if (context === undefined) {
    throw new Error('useGuide must be used within a GuideProvider');
  }
  return context;
}