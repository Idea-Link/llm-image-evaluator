-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table 1: test_sets
CREATE TABLE public.test_sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    json_extraction_key TEXT
);

CREATE INDEX ON public.test_sets (user_id);

-- Table 2: ground_truth_categories
CREATE TABLE public.ground_truth_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_set_id UUID REFERENCES public.test_sets(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL
);

CREATE INDEX ON public.ground_truth_categories (test_set_id);

-- Table 3: evaluations
CREATE TABLE public.evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'in_progress', 'completed', 'failed')),
    system_prompt TEXT NOT NULL,
    model_used TEXT NOT NULL,
    test_set_id UUID REFERENCES public.test_sets(id) ON DELETE RESTRICT NOT NULL,
    accuracy_score NUMERIC(5, 2)
);

CREATE INDEX ON public.evaluations (user_id);
CREATE INDEX ON public.evaluations (test_set_id);

-- Table 4: evaluation_results
CREATE TABLE public.evaluation_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evaluation_id UUID REFERENCES public.evaluations(id) ON DELETE CASCADE NOT NULL,
    input_data TEXT, -- URL to image in Supabase Storage
    ground_truth_category TEXT NOT NULL,
    llm_output TEXT,
    is_match BOOLEAN NOT NULL
);

CREATE INDEX ON public.evaluation_results (evaluation_id);