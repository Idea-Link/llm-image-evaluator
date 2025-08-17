import { create } from 'zustand';
import { TestSet } from '@evaluation-platform/shared';
import { getTestSets } from '@/services/testSetService';

interface TestSetStore {
  testSets: TestSet[];
  loading: boolean;
  error: string | null;
  fetchTestSets: () => Promise<void>;
  setTestSets: (testSets: TestSet[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTestSetStore = create<TestSetStore>((set) => ({
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
  
  setTestSets: (testSets) => set({ testSets }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));