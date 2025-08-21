-- Enable Row Level Security on all tables
ALTER TABLE public.test_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ground_truth_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_results ENABLE ROW LEVEL SECURITY;

-- Policies for test_sets table
-- Users can view their own test sets
CREATE POLICY "Users can view own test_sets" ON public.test_sets
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own test sets
CREATE POLICY "Users can insert own test_sets" ON public.test_sets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own test sets
CREATE POLICY "Users can update own test_sets" ON public.test_sets
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own test sets
CREATE POLICY "Users can delete own test_sets" ON public.test_sets
    FOR DELETE USING (auth.uid() = user_id);

-- Policies for ground_truth_categories table
-- Users can view categories of their test sets
CREATE POLICY "Users can view categories of own test_sets" ON public.ground_truth_categories
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.test_sets
            WHERE test_sets.id = ground_truth_categories.test_set_id
            AND test_sets.user_id = auth.uid()
        )
    );

-- Users can insert categories for their test sets
CREATE POLICY "Users can insert categories for own test_sets" ON public.ground_truth_categories
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.test_sets
            WHERE test_sets.id = ground_truth_categories.test_set_id
            AND test_sets.user_id = auth.uid()
        )
    );

-- Users can update categories for their test sets
CREATE POLICY "Users can update categories for own test_sets" ON public.ground_truth_categories
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.test_sets
            WHERE test_sets.id = ground_truth_categories.test_set_id
            AND test_sets.user_id = auth.uid()
        )
    );

-- Users can delete categories for their test sets
CREATE POLICY "Users can delete categories for own test_sets" ON public.ground_truth_categories
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.test_sets
            WHERE test_sets.id = ground_truth_categories.test_set_id
            AND test_sets.user_id = auth.uid()
        )
    );

-- Policies for evaluations table
-- Users can view their own evaluations
CREATE POLICY "Users can view own evaluations" ON public.evaluations
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own evaluations
CREATE POLICY "Users can insert own evaluations" ON public.evaluations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own evaluations
CREATE POLICY "Users can update own evaluations" ON public.evaluations
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own evaluations
CREATE POLICY "Users can delete own evaluations" ON public.evaluations
    FOR DELETE USING (auth.uid() = user_id);

-- Policies for evaluation_results table
-- Users can view results of their evaluations
CREATE POLICY "Users can view results of own evaluations" ON public.evaluation_results
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.evaluations
            WHERE evaluations.id = evaluation_results.evaluation_id
            AND evaluations.user_id = auth.uid()
        )
    );

-- Users can insert results for their evaluations
CREATE POLICY "Users can insert results for own evaluations" ON public.evaluation_results
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.evaluations
            WHERE evaluations.id = evaluation_results.evaluation_id
            AND evaluations.user_id = auth.uid()
        )
    );

-- Users can update results for their evaluations
CREATE POLICY "Users can update results for own evaluations" ON public.evaluation_results
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.evaluations
            WHERE evaluations.id = evaluation_results.evaluation_id
            AND evaluations.user_id = auth.uid()
        )
    );

-- Users can delete results for their evaluations
CREATE POLICY "Users can delete results for own evaluations" ON public.evaluation_results
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.evaluations
            WHERE evaluations.id = evaluation_results.evaluation_id
            AND evaluations.user_id = auth.uid()
        )
    );