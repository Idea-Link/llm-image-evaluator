-- Seed data for development and testing
-- This file contains sample data for all tables in the database

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create a test user in auth.users if it doesn't exist
-- This is required for the foreign key constraints
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'test@example.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Sample user ID (would normally come from auth.users)
-- For local development, you may need to create a test user in auth.users first
-- Using a fixed UUID for consistency in testing
DO $$
DECLARE 
    test_user_id UUID := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    test_set_1_id UUID;
    test_set_2_id UUID;
    evaluation_1_id UUID;
    evaluation_2_id UUID;
BEGIN
    -- Insert first test set
    INSERT INTO public.test_sets (id, user_id, name, description, json_extraction_key)
    VALUES 
        (uuid_generate_v4(), test_user_id, 'Product Images Test Set', 'Test set for e-commerce product categorization', 'category')
    RETURNING id INTO test_set_1_id;
    
    -- Insert second test set
    INSERT INTO public.test_sets (id, user_id, name, description, json_extraction_key)
    VALUES 
        (uuid_generate_v4(), test_user_id, 'Medical Images Test Set', 'Test set for medical image classification', 'diagnosis')
    RETURNING id INTO test_set_2_id;

    -- Insert ground truth categories for first test set
    INSERT INTO public.ground_truth_categories (test_set_id, name, description)
    VALUES 
        (test_set_1_id, 'Electronics', 'Electronic devices and accessories'),
        (test_set_1_id, 'Clothing', 'Apparel and fashion items'),
        (test_set_1_id, 'Home & Garden', 'Home improvement and garden supplies'),
        (test_set_1_id, 'Sports & Outdoors', 'Sporting goods and outdoor equipment');

    -- Insert ground truth categories for second test set
    INSERT INTO public.ground_truth_categories (test_set_id, name, description)
    VALUES 
        (test_set_2_id, 'Normal', 'No abnormalities detected'),
        (test_set_2_id, 'Pneumonia', 'Signs of pneumonia present'),
        (test_set_2_id, 'Fracture', 'Bone fracture detected'),
        (test_set_2_id, 'Tumor', 'Potential tumor identified');

    -- Insert first evaluation
    INSERT INTO public.evaluations (id, user_id, name, status, system_prompt, model_used, test_set_id, accuracy_score)
    VALUES 
        (
            uuid_generate_v4(), 
            test_user_id, 
            'Product Categorization v1', 
            'completed',
            'You are an expert at categorizing product images. Analyze the image and return the most appropriate category.',
            'gpt-4-vision',
            test_set_1_id,
            92.50
        )
    RETURNING id INTO evaluation_1_id;
    
    -- Insert second evaluation
    INSERT INTO public.evaluations (id, user_id, name, status, system_prompt, model_used, test_set_id, accuracy_score)
    VALUES 
        (
            uuid_generate_v4(),
            test_user_id,
            'Product Categorization v2',
            'in_progress',
            'You are an AI assistant specialized in e-commerce product classification. Examine the image carefully and determine its category.',
            'claude-3-opus',
            test_set_1_id,
            NULL
        )
    RETURNING id INTO evaluation_2_id;
    
    -- Insert third evaluation
    INSERT INTO public.evaluations (id, user_id, name, status, system_prompt, model_used, test_set_id, accuracy_score)
    VALUES 
        (
            uuid_generate_v4(),
            test_user_id,
            'Medical Image Analysis',
            'queued',
            'You are a medical imaging specialist. Analyze the X-ray image and identify any abnormalities.',
            'gpt-4-vision',
            test_set_2_id,
            NULL
        );

    -- Insert evaluation results for completed evaluation
    INSERT INTO public.evaluation_results (evaluation_id, input_data, ground_truth_category, llm_output, is_match)
    VALUES 
        (evaluation_1_id, 'https://example.com/images/laptop.jpg', 'Electronics', 'Electronics', true),
        (evaluation_1_id, 'https://example.com/images/tshirt.jpg', 'Clothing', 'Clothing', true),
        (evaluation_1_id, 'https://example.com/images/garden-hose.jpg', 'Home & Garden', 'Home & Garden', true),
        (evaluation_1_id, 'https://example.com/images/tennis-racket.jpg', 'Sports & Outdoors', 'Sports & Outdoors', true),
        (evaluation_1_id, 'https://example.com/images/smartphone.jpg', 'Electronics', 'Electronics', true),
        (evaluation_1_id, 'https://example.com/images/dress.jpg', 'Clothing', 'Clothing', true),
        (evaluation_1_id, 'https://example.com/images/lawn-mower.jpg', 'Home & Garden', 'Sports & Outdoors', false),
        (evaluation_1_id, 'https://example.com/images/basketball.jpg', 'Sports & Outdoors', 'Sports & Outdoors', true);

    -- Insert partial results for in-progress evaluation
    INSERT INTO public.evaluation_results (evaluation_id, input_data, ground_truth_category, llm_output, is_match)
    VALUES 
        (evaluation_2_id, 'https://example.com/images/headphones.jpg', 'Electronics', 'Electronics', true),
        (evaluation_2_id, 'https://example.com/images/jacket.jpg', 'Clothing', 'Clothing', true),
        (evaluation_2_id, 'https://example.com/images/plant-pot.jpg', 'Home & Garden', 'Home & Garden', true);

    RAISE NOTICE 'Seed data inserted successfully';
    RAISE NOTICE 'Test User ID: %', test_user_id;
    RAISE NOTICE 'Test Set 1 ID: %', test_set_1_id;
    RAISE NOTICE 'Test Set 2 ID: %', test_set_2_id;
    RAISE NOTICE 'Evaluation 1 ID: %', evaluation_1_id;
    RAISE NOTICE 'Evaluation 2 ID: %', evaluation_2_id;
END $$;

-- Summary of seeded data
SELECT 'Test Sets' as table_name, COUNT(*) as count FROM public.test_sets
UNION ALL
SELECT 'Ground Truth Categories', COUNT(*) FROM public.ground_truth_categories
UNION ALL
SELECT 'Evaluations', COUNT(*) FROM public.evaluations
UNION ALL
SELECT 'Evaluation Results', COUNT(*) FROM public.evaluation_results;