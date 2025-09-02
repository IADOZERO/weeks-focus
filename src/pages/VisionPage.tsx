import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVisions } from "@/hooks/useSupabaseData";
import { Vision } from "@/types";
import { Eye, Plus, Edit2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function VisionPage() {
  const { visions, loading, addVision, updateVision, deleteVision } = useVisions();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Vision, 'id' | 'createdAt'>>({
    title: '',
    description: '',
    category: 'personal',
    timeframe: '2-years'
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "Erro de Validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (editingId) {
      await updateVision(editingId, formData);
      setEditingId(null);
    } else {
      await addVision(formData);
    }

    // Reset form
    setFormData({
      title: '',
      description: '',
      category: 'personal',
      timeframe: '2-years'
    });
    setIsCreating(false);
  };

  const handleEdit = (vision: Vision) => {
    setFormData({
      title: vision.title,
      description: vision.description,
      category: vision.category,
      timeframe: vision.timeframe
    });
    setEditingId(vision.id);
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    await deleteVision(id);
  };

  const getCategoryLabel = (category: Vision['category']) => {
    const labels = {
      professional: "Profissional",
      personal: "Pessoal", 
      financial: "Financeira",
      health: "Saúde",
      relationships: "Relacionamentos"
    };
    return labels[category];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Visão de Longo Prazo</h1>
          <p className="text-muted-foreground">
            Defina sua visão de 2-3 anos para guiar seus ciclos de 12 semanas
          </p>
        </div>
        
        <Button onClick={() => setIsCreating(true)} className="bg-primary text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Nova Visão
        </Button>
      </div>

      {isCreating && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">
              {editingId ? "Editar Visão" : "Criar Nova Visão"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Título da Visão
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ex: Tornar-me um especialista reconhecido em..."
                  className="bg-input border-border text-foreground"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Descrição Detalhada
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descreva detalhadamente como será sua vida quando atingir esta visão..."
                  rows={4}
                  className="bg-input border-border text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Categoria
                  </label>
                  <Select value={formData.category} onValueChange={(value: Vision['category']) => setFormData({...formData, category: value})}>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Profissional</SelectItem>
                      <SelectItem value="personal">Pessoal</SelectItem>
                      <SelectItem value="financial">Financeira</SelectItem>
                      <SelectItem value="health">Saúde</SelectItem>
                      <SelectItem value="relationships">Relacionamentos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Prazo
                  </label>
                  <Select value={formData.timeframe} onValueChange={(value: Vision['timeframe']) => setFormData({...formData, timeframe: value})}>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2-years">2 anos</SelectItem>
                      <SelectItem value="3-years">3 anos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-primary text-primary-foreground">
                  {editingId ? "Atualizar" : "Criar"} Visão
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsCreating(false);
                    setEditingId(null);
                    setFormData({
                      title: "",
                      description: "",
                      category: "professional",
                      timeframe: "3-years"
                    });
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {visions.length === 0 && !isCreating ? (
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma visão criada</h3>
            <p className="text-muted-foreground mb-4">
              Comece definindo sua visão de longo prazo para guiar seus objetivos.
            </p>
            <Button onClick={() => setIsCreating(true)} className="bg-primary text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Visão
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {visions.map((vision: Vision) => (
            <Card key={vision.id} className="bg-card border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground text-lg">{vision.title}</CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(vision)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(vision.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                    {getCategoryLabel(vision.category)}
                  </span>
                  <span className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded">
                    {vision.timeframe === "2-years" ? "2 anos" : "3 anos"}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {vision.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}