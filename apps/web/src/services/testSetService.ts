import { TestSet } from '@evaluation-platform/shared';
import { createClient } from '@/utils/supabase/client';

export async function getTestSets(): Promise<TestSet[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('test_sets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching test sets:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching test sets:', error);
    return [];
  }
}