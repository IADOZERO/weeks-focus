-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE public.vision_category AS ENUM ('professional', 'personal', 'financial', 'health', 'relationships');
CREATE TYPE public.vision_timeframe AS ENUM ('2-years', '3-years');
CREATE TYPE public.cycle_status AS ENUM ('planning', 'active', 'completed', 'paused');
CREATE TYPE public.action_priority AS ENUM ('high', 'medium', 'low');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create visions table
CREATE TABLE public.visions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category public.vision_category NOT NULL,
  timeframe public.vision_timeframe NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cycles table
CREATE TABLE public.cycles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status public.cycle_status NOT NULL DEFAULT 'planning',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_date_range CHECK (end_date > start_date)
);

-- Create objectives table
CREATE TABLE public.objectives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vision_id UUID NOT NULL REFERENCES public.visions(id) ON DELETE CASCADE,
  cycle_id UUID REFERENCES public.cycles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  measurable TEXT NOT NULL,
  deadline DATE NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create actions table
CREATE TABLE public.actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  objective_id UUID NOT NULL REFERENCES public.objectives(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  week_number INTEGER NOT NULL CHECK (week_number >= 1 AND week_number <= 12),
  priority public.action_priority NOT NULL DEFAULT 'medium',
  estimated_time INTEGER, -- in hours
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create weekly_reviews table
CREATE TABLE public.weekly_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cycle_id UUID NOT NULL REFERENCES public.cycles(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL CHECK (week_number >= 1 AND week_number <= 12),
  completion_rate INTEGER NOT NULL CHECK (completion_rate >= 0 AND completion_rate <= 100),
  obstacles TEXT[] NOT NULL DEFAULT '{}',
  adjustments TEXT[] NOT NULL DEFAULT '{}',
  learnings TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, cycle_id, week_number)
);

-- Create cycle_reviews table
CREATE TABLE public.cycle_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cycle_id UUID NOT NULL REFERENCES public.cycles(id) ON DELETE CASCADE,
  objectives_achieved INTEGER NOT NULL DEFAULT 0,
  total_objectives INTEGER NOT NULL DEFAULT 0,
  what_worked TEXT NOT NULL,
  what_didnt_work TEXT NOT NULL,
  next_steps TEXT NOT NULL,
  overall_score INTEGER NOT NULL CHECK (overall_score >= 1 AND overall_score <= 10),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, cycle_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cycle_reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Create RLS Policies for visions
CREATE POLICY "Users can view their own visions"
ON public.visions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own visions"
ON public.visions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own visions"
ON public.visions FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own visions"
ON public.visions FOR DELETE
USING (auth.uid() = user_id);

-- Create RLS Policies for cycles
CREATE POLICY "Users can view their own cycles"
ON public.cycles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cycles"
ON public.cycles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cycles"
ON public.cycles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cycles"
ON public.cycles FOR DELETE
USING (auth.uid() = user_id);

-- Create RLS Policies for objectives
CREATE POLICY "Users can view their own objectives"
ON public.objectives FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own objectives"
ON public.objectives FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own objectives"
ON public.objectives FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own objectives"
ON public.objectives FOR DELETE
USING (auth.uid() = user_id);

-- Create RLS Policies for actions
CREATE POLICY "Users can view their own actions"
ON public.actions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own actions"
ON public.actions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own actions"
ON public.actions FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own actions"
ON public.actions FOR DELETE
USING (auth.uid() = user_id);

-- Create RLS Policies for weekly_reviews
CREATE POLICY "Users can view their own weekly reviews"
ON public.weekly_reviews FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own weekly reviews"
ON public.weekly_reviews FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weekly reviews"
ON public.weekly_reviews FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weekly reviews"
ON public.weekly_reviews FOR DELETE
USING (auth.uid() = user_id);

-- Create RLS Policies for cycle_reviews
CREATE POLICY "Users can view their own cycle reviews"
ON public.cycle_reviews FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cycle reviews"
ON public.cycle_reviews FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cycle reviews"
ON public.cycle_reviews FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cycle reviews"
ON public.cycle_reviews FOR DELETE
USING (auth.uid() = user_id);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_visions_updated_at
  BEFORE UPDATE ON public.visions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cycles_updated_at
  BEFORE UPDATE ON public.cycles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_objectives_updated_at
  BEFORE UPDATE ON public.objectives
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_actions_updated_at
  BEFORE UPDATE ON public.actions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_weekly_reviews_updated_at
  BEFORE UPDATE ON public.weekly_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cycle_reviews_updated_at
  BEFORE UPDATE ON public.cycle_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_visions_user_id ON public.visions(user_id);
CREATE INDEX idx_cycles_user_id ON public.cycles(user_id);
CREATE INDEX idx_cycles_status ON public.cycles(status);
CREATE INDEX idx_objectives_user_id ON public.objectives(user_id);
CREATE INDEX idx_objectives_vision_id ON public.objectives(vision_id);
CREATE INDEX idx_objectives_cycle_id ON public.objectives(cycle_id);
CREATE INDEX idx_actions_user_id ON public.actions(user_id);
CREATE INDEX idx_actions_objective_id ON public.actions(objective_id);
CREATE INDEX idx_actions_week_number ON public.actions(week_number);
CREATE INDEX idx_weekly_reviews_user_id ON public.weekly_reviews(user_id);
CREATE INDEX idx_weekly_reviews_cycle_id ON public.weekly_reviews(cycle_id);
CREATE INDEX idx_cycle_reviews_user_id ON public.cycle_reviews(user_id);
CREATE INDEX idx_cycle_reviews_cycle_id ON public.cycle_reviews(cycle_id);