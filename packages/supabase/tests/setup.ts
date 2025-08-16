import { beforeAll, afterAll } from 'vitest';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

beforeAll(async () => {
  console.log('Setting up test environment...');
  
  // Ensure Supabase is running
  try {
    const { stdout } = await execAsync('cd /Users/rokasjurkenas/Documents/Projects/Pictures\\ LLM/packages/supabase && npx supabase status');
    if (stdout.includes('supabase local development setup is running')) {
      console.log('Supabase is already running');
    }
  } catch (error) {
    console.log('Starting Supabase...');
    // If not running, start it
    await execAsync('cd /Users/rokasjurkenas/Documents/Projects/Pictures\\ LLM/packages/supabase && npx supabase start');
  }
}, 60000); // 60 second timeout for setup

afterAll(async () => {
  // Optionally stop Supabase after tests
  // await execAsync('cd /Users/rokasjurkenas/Documents/Projects/Pictures\\ LLM/packages/supabase && npx supabase stop');
});