import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Vision, Cycle, Objective, Action, WeeklyReview, CycleReview } from '@/types';
import { toast } from 'sonner';

// Vision hooks
export const useVisions = () => {
  const { user } = useAuth();
  const [visions, setVisions] = useState<Vision[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVisions = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('visions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const mappedVisions: Vision[] = data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category,
        timeframe: item.timeframe,
        createdAt: new Date(item.created_at)
      }));
      
      setVisions(mappedVisions);
    } catch (error) {
      console.error('Error fetching visions:', error);
      toast.error('Erro ao carregar visões');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisions();
  }, [user]);

  const addVision = async (vision: Omit<Vision, 'id' | 'createdAt'>) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('visions')
        .insert([{
          user_id: user.id,
          title: vision.title,
          description: vision.description,
          category: vision.category,
          timeframe: vision.timeframe
        }])
        .select()
        .single();

      if (error) throw error;
      
      const newVision: Vision = {
        id: data.id,
        title: data.title,
        description: data.description,
        category: data.category,
        timeframe: data.timeframe,
        createdAt: new Date(data.created_at)
      };
      
      setVisions(prev => [newVision, ...prev]);
      toast.success('Visão criada com sucesso!');
      return newVision;
    } catch (error) {
      console.error('Error adding vision:', error);
      toast.error('Erro ao criar visão');
    }
  };

  const updateVision = async (id: string, updates: Partial<Vision>) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('visions')
        .update({
          title: updates.title,
          description: updates.description,
          category: updates.category,
          timeframe: updates.timeframe
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setVisions(prev => prev.map(v => 
        v.id === id ? { ...v, ...updates } : v
      ));
      toast.success('Visão atualizada!');
    } catch (error) {
      console.error('Error updating vision:', error);
      toast.error('Erro ao atualizar visão');
    }
  };

  const deleteVision = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('visions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setVisions(prev => prev.filter(v => v.id !== id));
      toast.success('Visão removida!');
    } catch (error) {
      console.error('Error deleting vision:', error);
      toast.error('Erro ao remover visão');
    }
  };

  return { visions, loading, addVision, updateVision, deleteVision, refetch: fetchVisions };
};

// Cycles hooks
export const useCycles = () => {
  const { user } = useAuth();
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCycles = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('cycles')
        .select(`
          *,
          objectives (*,
            actions (*)
          ),
          weekly_reviews (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const mappedCycles: Cycle[] = data.map(item => ({
        id: item.id,
        name: item.name,
        startDate: new Date(item.start_date),
        endDate: new Date(item.end_date),
        status: item.status,
        objectives: item.objectives?.map((obj: any) => ({
          id: obj.id,
          title: obj.title,
          description: obj.description,
          measurable: obj.measurable,
          deadline: new Date(obj.deadline),
          visionId: obj.vision_id,
          completed: obj.completed,
          actions: obj.actions?.map((action: any) => ({
            id: action.id,
            title: action.title,
            description: action.description,
            weekNumber: action.week_number,
            priority: action.priority,
            estimatedTime: action.estimated_time,
            completed: action.completed,
            completedAt: action.completed_at ? new Date(action.completed_at) : undefined,
            notes: action.notes
          })) || []
        })) || [],
        weeklyReviews: item.weekly_reviews?.map((review: any) => ({
          id: review.id,
          weekNumber: review.week_number,
          cycleId: review.cycle_id,
          completionRate: review.completion_rate,
          obstacles: review.obstacles,
          adjustments: review.adjustments,
          learnings: review.learnings,
          createdAt: new Date(review.created_at)
        })) || []
      }));
      
      setCycles(mappedCycles);
    } catch (error) {
      console.error('Error fetching cycles:', error);
      toast.error('Erro ao carregar ciclos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCycles();
  }, [user]);

  const addCycle = async (cycle: Omit<Cycle, 'id' | 'objectives' | 'weeklyReviews'>) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('cycles')
        .insert([{
          user_id: user.id,
          name: cycle.name,
          start_date: cycle.startDate.toISOString().split('T')[0],
          end_date: cycle.endDate.toISOString().split('T')[0],
          status: cycle.status
        }])
        .select()
        .single();

      if (error) throw error;
      
      const newCycle: Cycle = {
        id: data.id,
        name: data.name,
        startDate: new Date(data.start_date),
        endDate: new Date(data.end_date),
        status: data.status,
        objectives: [],
        weeklyReviews: []
      };
      
      setCycles(prev => [newCycle, ...prev]);
      toast.success('Ciclo criado com sucesso!');
      return newCycle;
    } catch (error) {
      console.error('Error adding cycle:', error);
      toast.error('Erro ao criar ciclo');
    }
  };

  return { cycles, loading, addCycle, refetch: fetchCycles };
};

// Current cycle hook
export const useCurrentCycle = () => {
  const { cycles, loading } = useCycles();
  const [currentCycleId, setCurrentCycleId] = useState<string | null>(null);

  // Get active cycle or most recent one
  useEffect(() => {
    if (cycles.length > 0) {
      const activeCycle = cycles.find(c => c.status === 'active');
      const currentId = activeCycle?.id || cycles[0]?.id || null;
      setCurrentCycleId(currentId);
    }
  }, [cycles]);

  const currentCycle = cycles.find(c => c.id === currentCycleId) || null;

  return { currentCycle, currentCycleId, setCurrentCycleId, loading };
};

// Additional hooks for objectives, actions, reviews can be added here
export const useObjectives = () => {
  const { user } = useAuth();
  const [objectives, setObjectives] = useState<Objective[]>([]);
  
  // Implementation for objectives CRUD operations
  // Similar pattern as above
  
  return { objectives, setObjectives };
};