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

-- Admin User Setup
-- Create the single admin user for the MVP
-- Note: In production, the password should be set via environment variable
DO $$
DECLARE 
    admin_user_id UUID := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
BEGIN
    -- Create admin user if it doesn't exist
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
    VALUES (
        admin_user_id,
        COALESCE(current_setting('app.admin_email', true), 'admin@system.local'),
        crypt(current_setting('app.admin_password', true), gen_salt('bf')),
        NOW(),
        NOW(),
        NOW()
    ) ON CONFLICT (id) DO NOTHING;
END $$;

-- Note: Row Level Security (RLS) is commented out for MVP
-- Since we're using a single admin user, RLS is not required
-- These policies can be enabled when migrating to multi-user support
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