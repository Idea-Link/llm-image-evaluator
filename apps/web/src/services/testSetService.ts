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

export async function getTestSet(id: string): Promise<TestSet | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('test_sets')
      .select(`
        *,
        categories:ground_truth_categories(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching test set:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching test set:', error);
    return null;
  }
}

export async function updateTestSet(
  id: string,
  updates: Partial<Pick<TestSet, 'name' | 'description' | 'json_extraction_key'>>
): Promise<TestSet> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('test_sets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating test set:', error);
      throw new Error(error.message || 'Failed to update test set');
    }

    if (!data) {
      throw new Error('No test set data returned');
    }

    return data;
  } catch (error) {
    console.error('Unexpected error updating test set:', error);
    throw error instanceof Error ? error : new Error('Failed to update test set');
  }
}

export async function checkTestSetUsage(id: string): Promise<boolean> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from('evaluations')
      .select('id')
      .eq('test_set_id', id)
      .limit(1);
    
    if (error) {
      console.error('Error checking test set usage:', error);
      throw error;
    }
    
    return data && data.length > 0;
  } catch (error) {
    console.error('Error in checkTestSetUsage:', error);
    throw error;
  }
}

export async function deleteTestSet(id: string): Promise<{ success: boolean; error?: string; usageCount?: number }> {
  const supabase = createClient();
  
  try {
    const { data: evaluations, error: checkError } = await supabase
      .from('evaluations')
      .select('id')
      .eq('test_set_id', id);
    
    if (checkError) throw checkError;
    
    if (evaluations && evaluations.length > 0) {
      return {
        success: false,
        error: `This Test Set cannot be deleted because it is used by ${evaluations.length} evaluation${evaluations.length > 1 ? 's' : ''}.`,
        usageCount: evaluations.length
      };
    }
    
    const { error: deleteError } = await supabase
      .from('test_sets')
      .delete()
      .eq('id', id);
    
    if (deleteError) {
      if (deleteError.code === '23503') {
        return {
          success: false,
          error: 'This Test Set cannot be deleted because it is in use by evaluations.'
        };
      }
      throw deleteError;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting test set:', error);
    throw error;
  }
}

export async function updateTestSetWithCategories(
  id: string,
  updates: Partial<Pick<TestSet, 'name' | 'description' | 'json_extraction_key'>>,
  newCategories: Omit<GroundTruthCategory, 'id' | 'test_set_id'>[]
): Promise<TestSet> {
  try {
    const supabase = createClient();
    
    const { data: updatedTestSet, error: testSetError } = await supabase
      .from('test_sets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (testSetError) {
      console.error('Error updating test set:', testSetError);
      throw new Error(testSetError.message || 'Failed to update test set');
    }
    
    if (!updatedTestSet) {
      throw new Error('No test set data returned');
    }
    
    const { error: fetchError } = await supabase
      .from('ground_truth_categories')
      .select('*')
      .eq('test_set_id', id);
      
    if (fetchError) {
      console.error('Error fetching existing categories:', fetchError);
      throw new Error('Failed to fetch existing categories');
    }
    
    const { error: deleteError } = await supabase
      .from('ground_truth_categories')
      .delete()
      .eq('test_set_id', id);
      
    if (deleteError) {
      console.error('Error deleting existing categories:', deleteError);
      throw new Error('Failed to delete existing categories');
    }
    
    if (newCategories.length > 0) {
      const categoriesWithTestSetId = newCategories.map(cat => ({
        ...cat,
        test_set_id: id
      }));
      
      const { error: insertError } = await supabase
        .from('ground_truth_categories')
        .insert(categoriesWithTestSetId);
        
      if (insertError) {
        console.error('Error inserting new categories:', insertError);
        throw new Error('Failed to insert new categories');
      }
    }
    
    const { data: completeTestSet, error: finalFetchError } = await supabase
      .from('test_sets')
      .select(`
        *,
        categories:ground_truth_categories(*)
      `)
      .eq('id', id)
      .single();
      
    if (finalFetchError || !completeTestSet) {
      console.error('Error fetching complete test set:', finalFetchError);
      return updatedTestSet;
    }
    
    return completeTestSet;
  } catch (error) {
    console.error('Error updating test set with categories:', error);
    throw error instanceof Error ? error : new Error('Failed to update test set with categories');
  }
}