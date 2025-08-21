'use client';

import { useState } from 'react';
import { useTestSetStore } from '@/stores/useTestSetStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog';
import { useToast } from '@/hooks/use-toast';
import { deleteTestSet } from '@/services/testSetService';
import { TestSet } from '@evaluation-platform/shared';

interface TestSetListProps {
  loading: boolean;
}

export function TestSetList({ loading }: TestSetListProps) {
  const testSets = useTestSetStore(state => state.testSets);
  const removeTestSet = useTestSetStore(state => state.removeTestSet);
  const fetchTestSets = useTestSetStore(state => state.fetchTestSets);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTestSet, setSelectedTestSet] = useState<TestSet | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDeleteClick = (testSet: TestSet) => {
    setSelectedTestSet(testSet);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTestSet) return;

    setIsDeleting(true);
    try {
      const result = await deleteTestSet(selectedTestSet.id);

      if (result.success) {
        // Update local state optimistically
        removeTestSet(selectedTestSet.id);
        
        // Refetch to ensure consistency across tabs/windows
        // This is non-blocking to maintain responsive UI
        fetchTestSets().catch(err => {
          console.error('Failed to refetch test sets after deletion:', err);
        });
        
        toast({
          title: 'Success',
          description: 'Test set deleted successfully',
        });
        setDeleteDialogOpen(false);
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting test set:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete test set',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-48" data-testid="skeleton" />
              <Skeleton className="h-4 w-96" data-testid="skeleton" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (testSets.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No Test Sets Found
          </h3>
          <p className="text-muted-foreground mb-6">
            Get started by creating your first test set to evaluate your prompts.
          </p>
          <Link href="/test-sets/new">
            <Button variant="default">
              Create Your First Test Set
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {testSets.map((testSet) => (
          <Card key={testSet.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-xl">{testSet.name}</CardTitle>
                  {testSet.description && (
                    <CardDescription className="text-base mt-2">
                      {testSet.description}
                    </CardDescription>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link href={`/test-sets/${testSet.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClick(testSet)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Test Set"
        description={`Are you sure you want to delete "${selectedTestSet?.name}"? This action cannot be undone.`}
      />
    </>
  );
}