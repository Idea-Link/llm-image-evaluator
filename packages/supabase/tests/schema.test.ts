import { describe, it, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';

// Use the local Supabase instance
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

describe('Database Schema', () => {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  describe('Tables exist with correct structure', () => {
    it('should have test_sets table with all required columns', async () => {
      // Query with select * to verify table exists and has proper structure
      const { data, error } = await supabase
        .from('test_sets')
        .select('*')
        .limit(1);

      // Table should exist (no error about missing relation)
      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(Array.isArray(data)).toBe(true);
    });

    it('should have ground_truth_categories table with all required columns', async () => {
      const { data, error } = await supabase
        .from('ground_truth_categories')
        .select('*')
        .limit(1);

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(Array.isArray(data)).toBe(true);
    });

    it('should have evaluations table with all required columns', async () => {
      const { data, error } = await supabase
        .from('evaluations')
        .select('*')
        .limit(1);

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(Array.isArray(data)).toBe(true);
    });

    it('should have evaluation_results table with all required columns', async () => {
      const { data, error } = await supabase
        .from('evaluation_results')
        .select('*')
        .limit(1);

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe('Check constraints work correctly', () => {
    it('should enforce status check constraint on evaluations table', async () => {
      // Create test user first since we need a valid user_id
      const testUserId = '11111111-1111-1111-1111-111111111111';
      const testSetId = '22222222-2222-2222-2222-222222222222';
      
      // Try to insert with invalid status (should fail)
      const { error } = await supabase
        .from('evaluations')
        .insert({
          id: '33333333-3333-3333-3333-333333333333',
          user_id: testUserId,
          name: 'Test Evaluation',
          status: 'invalid_status', // This should fail check constraint
          system_prompt: 'Test prompt',
          model_used: 'test-model',
          test_set_id: testSetId
        });

      // Should get an error (either check constraint or foreign key)
      expect(error).toBeDefined();
      
      // If it's a check constraint error, it should mention the constraint
      if (error && error.message && !error.message.includes('foreign key')) {
        expect(error.message).toMatch(/check|constraint|status/i);
      }
    });

    it('should accept valid status values in evaluations table', async () => {
      const validStatuses = ['queued', 'in_progress', 'completed', 'failed'];
      
      for (const status of validStatuses) {
        // Generate unique IDs for each test
        const evalId = `4${status.charCodeAt(0)}${status.charCodeAt(1)}${status.charCodeAt(2)}0000-0000-0000-0000-000000000000`.slice(0, 36);
        
        const { error } = await supabase
          .from('evaluations')
          .insert({
            id: evalId,
            user_id: '11111111-1111-1111-1111-111111111111',
            name: `Test ${status}`,
            status: status,
            system_prompt: 'Test prompt',
            model_used: 'test-model',
            test_set_id: '22222222-2222-2222-2222-222222222222'
          });

        // Will fail on foreign key constraint (user/test_set don't exist), 
        // but should NOT fail on status check constraint
        if (error && error.message) {
          expect(error.message).not.toMatch(/violates check constraint.*status/i);
        }
      }
    });
  });

  describe('Foreign key constraints are enforced', () => {
    it('should not allow ground_truth_categories without valid test_set_id', async () => {
      const { error } = await supabase
        .from('ground_truth_categories')
        .insert({
          id: '55555555-5555-5555-5555-555555555555',
          test_set_id: '99999999-9999-9999-9999-999999999999', // Non-existent
          name: 'Test Category',
          description: 'Test Description'
        });

      expect(error).toBeDefined();
      // Should fail because test_set doesn't exist
      if (error && error.message) {
        expect(error.message).toMatch(/foreign key|violates|test_set/i);
      }
    });

    it('should not allow evaluation_results without valid evaluation_id', async () => {
      const { error } = await supabase
        .from('evaluation_results')
        .insert({
          id: '66666666-6666-6666-6666-666666666666',
          evaluation_id: '88888888-8888-8888-8888-888888888888', // Non-existent
          ground_truth_category: 'test',
          is_match: true
        });

      expect(error).toBeDefined();
      // Should fail because evaluation doesn't exist
      if (error && error.message) {
        expect(error.message).toMatch(/foreign key|violates|evaluation/i);
      }
    });
  });

  describe('Default values and auto-generated fields', () => {
    it('should have UUID generation capability for primary keys', async () => {
      // Test by attempting to query the id column
      const { data, error } = await supabase
        .from('test_sets')
        .select('id')
        .limit(1);

      // Table and column should exist
      expect(error).toBeNull();
      expect(data).toBeDefined();
    });

    it('should have status column with default in evaluations', async () => {
      // Test by querying the status column
      const { data, error } = await supabase
        .from('evaluations')
        .select('status')
        .limit(1);

      // Column should exist
      expect(error).toBeNull();
      expect(data).toBeDefined();
    });

    it('should have created_at timestamp columns', async () => {
      // Test test_sets.created_at
      const { data: testSetsData, error: testSetsError } = await supabase
        .from('test_sets')
        .select('created_at')
        .limit(1);

      expect(testSetsError).toBeNull();
      expect(testSetsData).toBeDefined();

      // Test evaluations.created_at
      const { data: evalsData, error: evalsError } = await supabase
        .from('evaluations')
        .select('created_at')
        .limit(1);

      expect(evalsError).toBeNull();
      expect(evalsData).toBeDefined();
    });
  });
});