'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TestSetForm } from '@/components/features/test-sets/TestSetForm';
import { useTestSetStore } from '@/stores/useTestSetStore';
import { GroundTruthCategory } from '@evaluation-platform/shared';
import { useToast } from '@/hooks/use-toast';

export default function NewTestSetPage() {
  const router = useRouter();
  const { createTestSet } = useTestSetStore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    name: string,
    description: string,
    categories: Omit<GroundTruthCategory, 'id' | 'test_set_id'>[]
  ) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const testSetData = {
        name,
        description: description || undefined,
      };

      await createTestSet(testSetData, categories);
      
      toast({
        title: 'Success',
        description: 'Test set created successfully',
      });
      
      router.push('/test-sets');
    } catch (error) {
      console.error('Error creating test set:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create test set',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/test-sets');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-foreground mb-8">Create New Test Set</h2>
        
        <TestSetForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}