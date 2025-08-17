-- Seed data for development and testing
-- This file contains sample data for all tables in the database

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create the admin user in auth.users if it doesn't exist
-- This is the single admin user for the MVP
-- Note: In production, credentials should be set via environment variables
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'a9125d55-df18-4e26-9376-7e8ddc7da42b',
    'admin@idealink.tech',
    crypt(COALESCE(current_setting('app.admin_password', true), 'admin123'), gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Use the admin user ID for all seed data
-- This is the single admin user that owns all data in the MVP
DO $$
DECLARE 
    admin_user_id UUID := 'a9125d55-df18-4e26-9376-7e8ddc7da42b';
    test_set_1_id UUID := '36c0bfe9-dc2e-43ab-aea5-59a9e373d7a5';
    test_set_2_id UUID := '7c10b321-5d07-485d-9dc0-f3a22bc62e1b';
    evaluation_1_id UUID := '3f3ee499-fc87-4a14-8013-1b38d06d2a71';
    evaluation_2_id UUID := '6d8bc932-9881-4549-b583-a4cb8a321d83';
    evaluation_3_id UUID := '22a43692-87a5-43ec-9adb-1100219027aa';
BEGIN
    -- Insert first test set
    INSERT INTO public.test_sets (id, user_id, name, description, json_extraction_key)
    VALUES 
        (test_set_1_id, admin_user_id, 'Product Images Test Set', 'Test set for e-commerce product categorization', 'category')
    ON CONFLICT (id) DO NOTHING;
    
    -- Insert second test set
    INSERT INTO public.test_sets (id, user_id, name, description, json_extraction_key)
    VALUES 
        (test_set_2_id, admin_user_id, 'Medical Images Test Set', 'Test set for medical image classification', 'diagnosis')
    ON CONFLICT (id) DO NOTHING;

    -- Insert ground truth categories for first test set
    INSERT INTO public.ground_truth_categories (id, test_set_id, name, description)
    VALUES 
        ('2f8f9bb8-5e6a-42af-8d13-8941e9604870', test_set_1_id, 'Electronics', 'Electronic devices and accessories'),
        ('d123cf41-7cda-49b5-9525-2ed258f35805', test_set_1_id, 'Clothing', 'Apparel and fashion items'),
        ('7b780503-5e14-4900-a27d-0d7e0ebf5112', test_set_1_id, 'Home & Garden', 'Home improvement and garden supplies'),
        ('e73f9596-2a09-4462-a053-fbafc2e74028', test_set_1_id, 'Sports & Outdoors', 'Sporting goods and outdoor equipment')
    ON CONFLICT (id) DO NOTHING;

    -- Insert ground truth categories for second test set
    INSERT INTO public.ground_truth_categories (id, test_set_id, name, description)
    VALUES 
        ('a931f2b1-e9a2-4af2-8b58-14930f145f56', test_set_2_id, 'Normal', 'No abnormalities detected'),
        ('eeacc795-6111-47fe-88dd-360aeaca6381', test_set_2_id, 'Pneumonia', 'Signs of pneumonia present'),
        ('5044d3f2-2399-48ee-be5d-28f01ed3f2b0', test_set_2_id, 'Fracture', 'Bone fracture detected'),
        ('c4a8ab70-cf56-49e0-9bba-3255ce0599d9', test_set_2_id, 'Tumor', 'Potential tumor identified')
    ON CONFLICT (id) DO NOTHING;

    -- Insert first evaluation (completed)
    INSERT INTO public.evaluations (id, user_id, name, status, system_prompt, model_used, test_set_id, accuracy_score)
    VALUES 
        (
            evaluation_1_id, 
            admin_user_id, 
            'Product Categorization v1', 
            'completed',
            'You are an expert at categorizing product images. Analyze the image and return the most appropriate category.',
            'gpt-4-vision',
            test_set_1_id,
            92.50
        )
    ON CONFLICT (id) DO NOTHING;
    
    -- Insert second evaluation (in_progress)
    INSERT INTO public.evaluations (id, user_id, name, status, system_prompt, model_used, test_set_id, accuracy_score)
    VALUES 
        (
            evaluation_2_id,
            admin_user_id,
            'Product Categorization v2',
            'in_progress',
            'You are an AI assistant specialized in e-commerce product classification. Examine the image carefully and determine its category.',
            'claude-3-opus',
            test_set_1_id,
            NULL
        )
    ON CONFLICT (id) DO NOTHING;
    
    -- Insert third evaluation (queued)
    INSERT INTO public.evaluations (id, user_id, name, status, system_prompt, model_used, test_set_id, accuracy_score)
    VALUES 
        (
            evaluation_3_id,
            admin_user_id,
            'Medical Image Analysis',
            'queued',
            'You are a medical imaging specialist. Analyze the X-ray image and identify any abnormalities.',
            'gpt-4-vision',
            test_set_2_id,
            NULL
        )
    ON CONFLICT (id) DO NOTHING;

    -- Insert evaluation results for completed evaluation
    INSERT INTO public.evaluation_results (id, evaluation_id, input_data, ground_truth_category, llm_output, is_match)
    VALUES 
        ('f879bc03-18e0-42d1-976f-d5536e9ddb4d', evaluation_1_id, 'https://example.com/images/laptop.jpg', 'Electronics', 'Electronics', true),
        ('7ffbd98a-ff67-4b44-878f-0a0dbd859bb7', evaluation_1_id, 'https://example.com/images/tshirt.jpg', 'Clothing', 'Clothing', true),
        ('b7bbd04d-c049-4a86-8e10-80e5f0615347', evaluation_1_id, 'https://example.com/images/garden-hose.jpg', 'Home & Garden', 'Home & Garden', true),
        ('db1887ee-2865-47ed-bace-3726a48cf859', evaluation_1_id, 'https://example.com/images/tennis-racket.jpg', 'Sports & Outdoors', 'Sports & Outdoors', true),
        ('45197255-782b-4296-8db6-173d93841616', evaluation_1_id, 'https://example.com/images/smartphone.jpg', 'Electronics', 'Electronics', true),
        ('0452b78e-a152-472f-b362-d64ca4cb68b1', evaluation_1_id, 'https://example.com/images/dress.jpg', 'Clothing', 'Clothing', true),
        ('6f891713-e85c-4396-8c91-adc2e35c4adc', evaluation_1_id, 'https://example.com/images/lawn-mower.jpg', 'Home & Garden', 'Sports & Outdoors', false),
        ('5c2e15a0-f478-4632-8306-48ee3c1ffbc0', evaluation_1_id, 'https://example.com/images/basketball.jpg', 'Sports & Outdoors', 'Sports & Outdoors', true)
    ON CONFLICT (id) DO NOTHING;

    -- Insert partial results for in-progress evaluation
    INSERT INTO public.evaluation_results (id, evaluation_id, input_data, ground_truth_category, llm_output, is_match)
    VALUES 
        ('49fd0ea7-a0af-41ac-9274-fb70b694e4cc', evaluation_2_id, 'https://example.com/images/headphones.jpg', 'Electronics', 'Electronics', true),
        ('caac1608-1780-47b6-a2c9-a3a37a26b013', evaluation_2_id, 'https://example.com/images/jacket.jpg', 'Clothing', 'Clothing', true),
        ('dc2d5a14-2af6-4e90-849e-dc096f9754fe', evaluation_2_id, 'https://example.com/images/plant-pot.jpg', 'Home & Garden', 'Home & Garden', true)
    ON CONFLICT (id) DO NOTHING;

    RAISE NOTICE 'Seed data inserted successfully';
    RAISE NOTICE 'Admin User ID: %', admin_user_id;
    RAISE NOTICE 'Admin Email: admin@idealink.tech';
    RAISE NOTICE 'Test Set 1 ID: %', test_set_1_id;
    RAISE NOTICE 'Test Set 2 ID: %', test_set_2_id;
    RAISE NOTICE 'Evaluation 1 ID: %', evaluation_1_id;
    RAISE NOTICE 'Evaluation 2 ID: %', evaluation_2_id;
    RAISE NOTICE 'Evaluation 3 ID: %', evaluation_3_id;
END $$;

-- Summary of seeded data
SELECT 'Test Sets' as table_name, COUNT(*) as count FROM public.test_sets
UNION ALL
SELECT 'Ground Truth Categories', COUNT(*) FROM public.ground_truth_categories
UNION ALL
SELECT 'Evaluations', COUNT(*) FROM public.evaluations
UNION ALL
SELECT 'Evaluation Results', COUNT(*) FROM public.evaluation_results;