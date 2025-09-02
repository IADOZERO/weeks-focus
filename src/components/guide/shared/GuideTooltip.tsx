import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface GuideTooltipProps {
  content: string;
  children?: React.ReactNode;
  className?: string;
}

export function GuideTooltip({ content, children, className = "" }: GuideTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children || (
            <HelpCircle className={`h-4 w-4 text-muted-foreground hover:text-foreground cursor-help ${className}`} />
          )}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}