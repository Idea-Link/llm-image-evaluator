import { create } from 'zustand';
import { TestSet, GroundTruthCategory } from '@evaluation-platform/shared';
import { getTestSets, createTestSet as createTestSetService } from '@/services/testSetService';

interface TestSetStore {
  testSets: TestSet[];
  loading: boolean;
  error: string | null;
  fetchTestSets: () => Promise<void>;
  createTestSet: (
    testSet: Pick<TestSet, 'name' | 'description' | 'json_extraction_key'>,
    categories: Omit<GroundTruthCategory, 'id' | 'test_set_id'>[]
  ) => Promise<TestSet>;
  setTestSets: (testSets: TestSet[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTestSetStore = create<TestSetStore>((set, get) => ({
  testSets: [],
  loading: false,
  error: null,
  
  fetchTestSets: async () => {
    set({ loading: true, error: null });
    try {
      const testSets = await getTestSets();
      set({ testSets, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch test sets', 
        loading: false 
      });
    }
  },
  
  createTestSet: async (testSet, categories) => {
    set({ loading: true, error: null });
    try {
      const newTestSet = await createTestSetService(testSet, categories);
      
      const currentTestSets = get().testSets;
      set({ 
        testSets: [newTestSet, ...currentTestSets],
        loading: false,
        error: null
      });
      
      return newTestSet;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create test set';
      set({ 
        error: errorMessage,
        loading: false 
      });
      throw new Error(errorMessage);
    }
  },
  
  setTestSets: (testSets) => set({ testSets }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));