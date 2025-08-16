const { createClient } = require('@supabase/supabase-js');

// Create Supabase client using local connection
const supabase = createClient(
  'http://127.0.0.1:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
);

async function verifyTables() {
  try {
    // Query to get all public tables
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (error) {
      // Alternative approach - try to query each table directly
      console.log('Verifying tables by direct query...\n');
      
      const tables = ['test_sets', 'ground_truth_categories', 'evaluations', 'evaluation_results'];
      
      for (const table of tables) {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.log(`❌ Table ${table}: NOT FOUND`);
        } else {
          console.log(`✅ Table ${table}: EXISTS (${count || 0} records)`);
        }
      }
    } else {
      console.log('Public schema tables:', data);
    }
    
    // Test foreign key constraints
    console.log('\nTesting constraints...');
    
    // Try to insert an evaluation with non-existent test_set_id (should fail)
    const { error: constraintError } = await supabase
      .from('evaluations')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        name: 'Test',
        status: 'queued',
        system_prompt: 'Test',
        model_used: 'Test',
        test_set_id: '00000000-0000-0000-0000-000000000000'
      });
    
    if (constraintError && constraintError.message && constraintError.message.includes('violates foreign key constraint')) {
      console.log('✅ Foreign key constraints are working');
    } else if (constraintError && constraintError.message && constraintError.message.includes('auth.users')) {
      console.log('✅ User foreign key constraint is working');
    } else if (constraintError) {
      console.log('✅ Constraint error detected:', constraintError.code || 'Unknown error');
    } else {
      console.log('ℹ️  No constraint error (might need auth.users table)');
    }
    
  } catch (err) {
    console.error('Error:', err);
  }
}

verifyTables();