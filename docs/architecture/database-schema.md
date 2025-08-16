# 8. Database Schema

SQL

```
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table for reusable Test Sets
CREATE TABLE public.test_sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    json_extraction_key TEXT
);
-- Add index for performance
CREATE INDEX ON public.test_sets (user_id);

-- Table for categories within a Test Set
CREATE TABLE public.ground_truth_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_set_id UUID REFERENCES public.test_sets(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL
);
-- Add index for performance
CREATE INDEX ON public.ground_truth_categories (test_set_id);

-- Table for individual evaluation runs
CREATE TABLE public.evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'in_progress', 'completed', 'failed')),
    system_prompt TEXT NOT NULL,
    model_used TEXT NOT NULL,
    test_set_id UUID REFERENCES public.test_sets(id) ON DELETE RESTRICT NOT NULL, -- Prevent deleting a Test Set if it's in use
    accuracy_score NUMERIC(5, 2)
);
-- Add indexes for performance
CREATE INDEX ON public.evaluations (user_id);
CREATE INDEX ON public.evaluations (test_set_id);

-- Table for the results of each item in an evaluation
CREATE TABLE public.evaluation_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evaluation_id UUID REFERENCES public.evaluations(id) ON DELETE CASCADE NOT NULL,
    input_data TEXT, -- URL to the image in Supabase Storage
    ground_truth_category TEXT NOT NULL,
    llm_output TEXT,
    is_match BOOLEAN NOT NULL
);
-- Add index for performance
CREATE INDEX ON public.evaluation_results (evaluation_id);

-- Example Row Level Security (RLS) Policies for Multi-Tenancy
-- These policies ensure users can only access their own data.
/*
-- Enable RLS on all tables
ALTER TABLE public.test_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can only see their own test sets" ON public.test_sets
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can only insert their own test sets" ON public.test_sets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Repeat for evaluations, categories, and results tables...
*/
```