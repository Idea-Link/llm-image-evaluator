import { TestSet, GroundTruthCategory } from '@evaluation-platform/shared';
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

export async function createTestSet(
  testSet: Pick<TestSet, 'name' | 'description' | 'json_extraction_key'>,
  categories: Omit<GroundTruthCategory, 'id' | 'test_set_id'>[]
): Promise<TestSet> {
  try {
    const supabase = createClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('User not authenticated');
    }
    
    // Include user_id in the test set data
    const testSetWithUser = {
      ...testSet,
      user_id: user.id
    };
    
    const { data: testSetData, error: testSetError } = await supabase
      .from('test_sets')
      .insert(testSetWithUser)
      .select()
      .single();

    if (testSetError) {
      console.error('Error creating test set:', testSetError);
      throw new Error(testSetError.message || 'Failed to create test set');
    }

    if (!testSetData) {
      throw new Error('No test set data returned');
    }

    if (categories && categories.length > 0) {
      const categoriesWithTestSetId = categories.map(cat => ({
        ...cat,
        test_set_id: testSetData.id
      }));

      const { error: categoriesError } = await supabase
        .from('ground_truth_categories')
        .insert(categoriesWithTestSetId);

      if (categoriesError) {
        console.error('Error creating categories:', categoriesError);
        
        await supabase
          .from('test_sets')
          .delete()
          .eq('id', testSetData.id);
        
        throw new Error('Failed to create categories. Test set creation rolled back.');
      }
    }

    const { data: completeTestSet, error: fetchError } = await supabase
      .from('test_sets')
      .select(`
        *,
        categories:ground_truth_categories(*)
      `)
      .eq('id', testSetData.id)
      .single();

    if (fetchError || !completeTestSet) {
      console.error('Error fetching complete test set:', fetchError);
      return testSetData;
    }

    return completeTestSet;
  } catch (error) {
    console.error('Unexpected error creating test set:', error);
    throw error instanceof Error ? error : new Error('Failed to create test set');
  }
}

export async function createGroundTruthCategories(
  testSetId: string,
  categories: Omit<GroundTruthCategory, 'id' | 'test_set_id'>[]
): Promise<GroundTruthCategory[]> {
  try {
    const supabase = createClient();
    
    const categoriesWithTestSetId = categories.map(cat => ({
      ...cat,
      test_set_id: testSetId
    }));

    const { data, error } = await supabase
      .from('ground_truth_categories')
      .insert(categoriesWithTestSetId)
      .select();

    if (error) {
      console.error('Error creating ground truth categories:', error);
      throw new Error('Failed to create categories');
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error creating categories:', error);
    throw error instanceof Error ? error : new Error('Failed to create categories');
  }
}