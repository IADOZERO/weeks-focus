import React from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ValidationFeedbackProps {
  type: 'success' | 'error' | 'info';
  message: string;
  className?: string;
}

export function ValidationFeedback({ type, message, className = "" }: ValidationFeedbackProps) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  };

  const variants = {
    success: 'border-success/50 bg-success/10 text-success-foreground',
    error: 'border-destructive/50 bg-destructive/10 text-destructive-foreground',
    info: 'border-primary/50 bg-primary/10 text-primary-foreground',
  };

  const Icon = icons[type];

  return (
    <Alert className={`${variants[type]} ${className}`}>
      <Icon className="h-4 w-4" />
      <AlertDescription className="text-sm">
        {message}
      </AlertDescription>
    </Alert>
  );
}