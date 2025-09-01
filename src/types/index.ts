export interface Vision {
  id: string;
  title: string;
  description: string;
  category: 'professional' | 'personal' | 'financial' | 'health' | 'relationships';
  timeframe: '2-years' | '3-years';
  createdAt: Date;
}

export interface Cycle {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: 'planning' | 'active' | 'completed' | 'paused';
  objectives: Objective[];
  weeklyReviews: WeeklyReview[];
}

export interface Objective {
  id: string;
  title: string;
  description: string;
  measurable: string;
  deadline: Date;
  visionId: string;
  actions: Action[];
  completed: boolean;
}

export interface Action {
  id: string;
  title: string;
  description?: string;
  weekNumber: number;
  priority: 'high' | 'medium' | 'low';
  estimatedTime?: number;
  completed: boolean;
  completedAt?: Date;
  notes?: string;
}

export interface WeeklyReview {
  id: string;
  weekNumber: number;
  cycleId: string;
  completionRate: number;
  obstacles: string[];
  adjustments: string[];
  learnings: string[];
  createdAt: Date;
}

export interface CycleReview {
  id: string;
  cycleId: string;
  objectivesAchieved: number;
  totalObjectives: number;
  whatWorked: string;
  whatDidntWork: string;
  nextSteps: string;
  overallScore: number;
  createdAt: Date;
}