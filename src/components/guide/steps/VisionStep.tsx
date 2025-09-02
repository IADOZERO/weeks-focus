import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Eye, CheckCircle, X, Lightbulb } from 'lucide-react';
import { ValidationFeedback } from '../shared/ValidationFeedback';

interface VisionStepProps {
  onComplete: () => void;
}

const VISION_EXAMPLES = {
  professional: {
    bad: "Ser mais bem-sucedido no trabalho",
    good: "Ser reconhecido como especialista em marketing digital, liderando uma equipe de 10 pessoas e faturando R$ 500k anuais"
  },
  personal: {
    bad: "Ser mais feliz e equilibrado",
    good: "Ter relacionamentos profundos com família e amigos, praticar meditação diariamente e dedicar 2 horas semanais aos meus hobbies"
  },
  health: {
    bad: "Ser mais saudável",
    good: "Ter 15% de gordura corporal, correr 10km sem parar e sentir energia durante todo o dia"
  },
  financial: {
    bad: "Ganhar mais dinheiro",
    good: "Ter renda mensal de R$ 15.000 através do meu negócio digital, trabalhando 6 horas por dia"
  }
};

const CATEGORIES = [
  { value: 'professional', label: 'Profissional' },
  { value: 'personal', label: 'Pessoal' },
  { value: 'health', label: 'Saúde' },
  { value: 'financial', label: 'Financeiro' },
  { value: 'relationships', label: 'Relacionamentos' }
];

export function VisionStep({ onComplete }: VisionStepProps) {
  const [vision, setVision] = useState('');
  const [category, setCategory] = useState('');
  const [showExamples, setShowExamples] = useState(false);

  const validateVision = () => {
    if (!vision.trim()) return null;
    
    const wordCount = vision.trim().split(' ').length;
    const hasSpecifics = /\d+/.test(vision) || vision.includes('R$') || vision.includes('%');
    const isDetailed = wordCount >= 15;
    
    if (wordCount < 10) {
      return { type: 'error' as const, message: 'Sua visão precisa ser mais detalhada. Adicione mais informações sobre como será sua vida.' };
    }
    
    if (!hasSpecifics) {
      return { type: 'info' as const, message: 'Tente ser mais específico. Adicione números, valores ou detalhes mensuráveis.' };
    }
    
    if (isDetailed && hasSpecifics) {
      return { type: 'success' as const, message: 'Excelente! Sua visão está clara e inspiradora.' };
    }
    
    return { type: 'info' as const, message: 'Boa! Você pode adicionar mais detalhes para torná-la ainda mais poderosa.' };
  };

  const validation = validateVision();
  const canProceed = validation?.type === 'success' || (vision.trim().length > 0 && vision.trim().split(' ').length >= 15);

  const handleComplete = () => {
    if (canProceed) {
      // Save vision to localStorage or context
      localStorage.setItem('guide-vision', JSON.stringify({ vision, category }));
      onComplete();
    }
  };

  const useExample = (exampleCategory: keyof typeof VISION_EXAMPLES) => {
    setVision(VISION_EXAMPLES[exampleCategory].good);
    setCategory(exampleCategory);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground flex items-center justify-center gap-2">
          <Eye className="h-6 w-6 text-primary" />
          Definindo sua Visão de Longo Prazo
        </h2>
        <p className="text-muted-foreground">
          Onde você quer estar em 2-3 anos? Seja específico e inspirador.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Escreva sua visão</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Categoria (opcional)
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Sua visão de 2-3 anos
            </label>
            <Textarea
              placeholder="Em 3 anos, eu quero..."
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>{vision.trim().split(' ').filter(w => w).length} palavras</span>
              <span>Mínimo recomendado: 15 palavras</span>
            </div>
          </div>

          {validation && (
            <ValidationFeedback
              type={validation.type}
              message={validation.message}
            />
          )}
        </CardContent>
      </Card>

      {/* Examples Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-warning" />
              Exemplos para Inspirar
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowExamples(!showExamples)}
            >
              {showExamples ? 'Ocultar' : 'Ver exemplos'}
            </Button>
          </div>
        </CardHeader>
        {showExamples && (
          <CardContent className="space-y-4">
            {Object.entries(VISION_EXAMPLES).map(([key, examples]) => (
              <div key={key} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium capitalize">{key === 'professional' ? 'Profissional' : key === 'personal' ? 'Pessoal' : key === 'health' ? 'Saúde' : 'Financeiro'}</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => useExample(key as keyof typeof VISION_EXAMPLES)}
                  >
                    Usar este exemplo
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <X className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                    <div>
                      <Badge variant="destructive" className="text-xs mb-1">Ruim</Badge>
                      <p className="text-sm text-muted-foreground">"{examples.bad}"</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    <div>
                      <Badge variant="outline" className="text-xs mb-1 border-success text-success">Bom</Badge>
                      <p className="text-sm">"{examples.good}"</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        )}
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          <p>💡 Dica: Uma boa visão é específica, mensurável e te inspira a agir</p>
        </div>
        
        <Button 
          onClick={handleComplete}
          disabled={!canProceed}
          className="gap-2"
        >
          Continuar <CheckCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}