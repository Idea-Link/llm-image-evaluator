'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTestSetStore } from '@/stores/useTestSetStore';
import { TestSetList } from '@/components/features/test-sets/TestSetList';

export default function TestSetsPage() {
  const { fetchTestSets, loading, error } = useTestSetStore();

  useEffect(() => {
    fetchTestSets();
  }, [fetchTestSets]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-foreground">Test Sets</h2>
        <Link href="/test-sets/new">
          <Button variant="default" size="lg">
            Create New Test Set
          </Button>
        </Link>
      </div>
      
      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <TestSetList loading={loading} />
    </div>
  );
}