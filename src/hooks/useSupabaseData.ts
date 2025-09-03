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
          notes: action.notes,
          objectiveId: obj.id
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

  const updateCycle = async (cycleId: string, cycleData: Partial<Omit<Cycle, 'id' | 'objectives' | 'weeklyReviews'>>) => {
    if (!user) return;
    
    try {
      const updateData: any = {};
      if (cycleData.name) updateData.name = cycleData.name;
      if (cycleData.startDate) updateData.start_date = cycleData.startDate.toISOString().split('T')[0];
      if (cycleData.endDate) updateData.end_date = cycleData.endDate.toISOString().split('T')[0];
      if (cycleData.status) updateData.status = cycleData.status;

      const { error } = await supabase
        .from('cycles')
        .update(updateData)
        .eq('id', cycleId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Update local state
      setCycles(prev => prev.map(cycle => 
        cycle.id === cycleId 
          ? { ...cycle, ...cycleData }
          : cycle
      ));
      
      toast.success('Ciclo atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating cycle:', error);
      toast.error('Erro ao atualizar ciclo');
    }
  };

  return { cycles, loading, addCycle, updateCycle, refetch: fetchCycles };
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

// Objectives hooks
export const useObjectives = (cycleId?: string) => {
  const { user } = useAuth();
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchObjectives = async () => {
    if (!user || !cycleId) {
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('objectives')
        .select(`
          *,
          actions (*)
        `)
        .eq('user_id', user.id)
        .eq('cycle_id', cycleId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const mappedObjectives: Objective[] = data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        measurable: item.measurable,
        deadline: new Date(item.deadline),
        visionId: item.vision_id,
        completed: item.completed,
        completedAt: item.completed_at ? new Date(item.completed_at) : undefined,
          actions: item.actions?.map((action: any) => ({
            id: action.id,
            title: action.title,
            description: action.description,
            weekNumber: action.week_number,
            priority: action.priority,
            estimatedTime: action.estimated_time,
            completed: action.completed,
            completedAt: action.completed_at ? new Date(action.completed_at) : undefined,
            notes: action.notes,
            objectiveId: item.id
          })) || []
      }));
      
      setObjectives(mappedObjectives);
    } catch (error) {
      console.error('Error fetching objectives:', error);
      toast.error('Erro ao carregar objetivos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObjectives();
  }, [user, cycleId]);

  const addObjective = async (objective: Omit<Objective, 'id' | 'actions' | 'completedAt'>) => {
    if (!user || !cycleId) return;
    
    try {
      const { data, error } = await supabase
        .from('objectives')
        .insert([{
          user_id: user.id,
          cycle_id: cycleId,
          title: objective.title,
          description: objective.description,
          measurable: objective.measurable,
          deadline: objective.deadline.toISOString().split('T')[0],
          vision_id: objective.visionId,
          completed: objective.completed || false
        }])
        .select()
        .single();

      if (error) throw error;
      
      const newObjective: Objective = {
        id: data.id,
        title: data.title,
        description: data.description,
        measurable: data.measurable,
        deadline: new Date(data.deadline),
        visionId: data.vision_id,
        completed: data.completed,
        actions: []
      };
      
      setObjectives(prev => [newObjective, ...prev]);
      toast.success('Objetivo criado com sucesso!');
      return newObjective;
    } catch (error) {
      console.error('Error adding objective:', error);
      toast.error('Erro ao criar objetivo');
    }
  };

  const updateObjective = async (id: string, updates: Partial<Objective>) => {
    if (!user) return;
    
    try {
      const updateData: any = {};
      if (updates.title) updateData.title = updates.title;
      if (updates.description) updateData.description = updates.description;
      if (updates.measurable) updateData.measurable = updates.measurable;
      if (updates.deadline) updateData.deadline = updates.deadline.toISOString().split('T')[0];
      if (updates.visionId) updateData.vision_id = updates.visionId;
      if (typeof updates.completed === 'boolean') {
        updateData.completed = updates.completed;
        updateData.completed_at = updates.completed ? new Date().toISOString() : null;
      }

      const { error } = await supabase
        .from('objectives')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Update local state immediately for better UX
      setObjectives(prev => prev.map(obj => 
        obj.id === id ? { ...obj, ...updates } : obj
      ));
      
      // Refetch to ensure data consistency
      await fetchObjectives();
      
      toast.success('Objetivo atualizado!');
    } catch (error) {
      console.error('Error updating objective:', error);
      toast.error('Erro ao atualizar objetivo');
      // Refetch on error to restore correct state
      await fetchObjectives();
    }
  };

  const deleteObjective = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('objectives')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setObjectives(prev => prev.filter(obj => obj.id !== id));
      toast.success('Objetivo removido!');
    } catch (error) {
      console.error('Error deleting objective:', error);
      toast.error('Erro ao remover objetivo');
    }
  };

  return { objectives, loading, addObjective, updateObjective, deleteObjective, refetch: fetchObjectives };
};

// Actions hooks
export const useActions = (objectiveId?: string) => {
  const { user } = useAuth();
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActions = async () => {
    if (!user || !objectiveId) {
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('actions')
        .select('*')
        .eq('user_id', user.id)
        .eq('objective_id', objectiveId)
        .order('week_number', { ascending: true });

      if (error) throw error;
      
      const mappedActions: Action[] = data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        weekNumber: item.week_number,
        priority: item.priority,
        estimatedTime: item.estimated_time,
        completed: item.completed,
        completedAt: item.completed_at ? new Date(item.completed_at) : undefined,
        notes: item.notes,
        objectiveId: item.objective_id
      }));
      
      setActions(mappedActions);
    } catch (error) {
      console.error('Error fetching actions:', error);
      toast.error('Erro ao carregar ações');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActions();
  }, [user, objectiveId]);

  const addAction = async (action: Omit<Action, 'id' | 'completed' | 'completedAt'>) => {
    if (!user || !objectiveId) return;
    
    try {
      const { data, error } = await supabase
        .from('actions')
        .insert([{
          user_id: user.id,
          objective_id: action.objectiveId,
          title: action.title,
          description: action.description,
          week_number: action.weekNumber,
          priority: action.priority,
          estimated_time: action.estimatedTime,
          completed: false,
          notes: action.notes
        }])
        .select()
        .single();

      if (error) throw error;
      
      const newAction: Action = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        weekNumber: data.week_number,
        priority: data.priority,
        estimatedTime: data.estimated_time,
        completed: data.completed,
        notes: data.notes,
        objectiveId: action.objectiveId
      };
      
      setActions(prev => [...prev, newAction]);
      toast.success('Ação criada com sucesso!');
      return newAction;
    } catch (error) {
      console.error('Error adding action:', error);
      toast.error('Erro ao criar ação');
    }
  };

  const updateAction = async (id: string, updates: Partial<Action>) => {
    if (!user) return;
    
    try {
      const updateData: any = {};
      if (updates.title) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.weekNumber) updateData.week_number = updates.weekNumber;
      if (updates.priority) updateData.priority = updates.priority;
      if (updates.estimatedTime !== undefined) updateData.estimated_time = updates.estimatedTime;
      if (updates.notes !== undefined) updateData.notes = updates.notes;
      if (typeof updates.completed === 'boolean') {
        updateData.completed = updates.completed;
        updateData.completed_at = updates.completed ? new Date().toISOString() : null;
      }

      const { error } = await supabase
        .from('actions')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setActions(prev => prev.map(action => 
        action.id === id ? { ...action, ...updates } : action
      ));
      
      if (typeof updates.completed === 'boolean') {
        toast.success(updates.completed ? 'Ação marcada como concluída!' : 'Ação desmarcada!');
      } else {
        toast.success('Ação atualizada!');
      }
    } catch (error) {
      console.error('Error updating action:', error);
      toast.error('Erro ao atualizar ação');
    }
  };

  const deleteAction = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('actions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setActions(prev => prev.filter(action => action.id !== id));
      toast.success('Ação removida!');
    } catch (error) {
      console.error('Error deleting action:', error);
      toast.error('Erro ao remover ação');
    }
  };

  return { actions, loading, addAction, updateAction, deleteAction, refetch: fetchActions };
};

// Weekly Reviews hooks
export const useWeeklyReviews = (cycleId?: string) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<WeeklyReview[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    if (!user || !cycleId) {
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('weekly_reviews')
        .select('*')
        .eq('user_id', user.id)
        .eq('cycle_id', cycleId)
        .order('week_number', { ascending: false });

      if (error) throw error;
      
      const mappedReviews: WeeklyReview[] = data.map(item => ({
        id: item.id,
        weekNumber: item.week_number,
        cycleId: item.cycle_id,
        completionRate: item.completion_rate,
        obstacles: item.obstacles,
        adjustments: item.adjustments,
        learnings: item.learnings,
        createdAt: new Date(item.created_at)
      }));
      
      setReviews(mappedReviews);
    } catch (error) {
      console.error('Error fetching weekly reviews:', error);
      toast.error('Erro ao carregar revisões semanais');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [user, cycleId]);

  const addReview = async (review: Omit<WeeklyReview, 'id' | 'createdAt'>) => {
    if (!user || !cycleId) return;
    
    try {
      const { data, error } = await supabase
        .from('weekly_reviews')
        .insert([{
          user_id: user.id,
          cycle_id: cycleId,
          week_number: review.weekNumber,
          completion_rate: review.completionRate,
          obstacles: review.obstacles,
          adjustments: review.adjustments,
          learnings: review.learnings
        }])
        .select()
        .single();

      if (error) throw error;
      
      const newReview: WeeklyReview = {
        id: data.id,
        weekNumber: data.week_number,
        cycleId: data.cycle_id,
        completionRate: data.completion_rate,
        obstacles: data.obstacles,
        adjustments: data.adjustments,
        learnings: data.learnings,
        createdAt: new Date(data.created_at)
      };
      
      setReviews(prev => [newReview, ...prev]);
      toast.success('Revisão semanal criada com sucesso!');
      return newReview;
    } catch (error) {
      console.error('Error adding weekly review:', error);
      toast.error('Erro ao criar revisão semanal');
    }
  };

  return { reviews, loading, addReview, refetch: fetchReviews };
};