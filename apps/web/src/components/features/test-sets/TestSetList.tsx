import { useTestSetStore } from '@/stores/useTestSetStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface TestSetListProps {
  loading: boolean;
}

export function TestSetList({ loading }: TestSetListProps) {
  const testSets = useTestSetStore(state => state.testSets);

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
    <div className="space-y-4">
      {testSets.map((testSet) => (
        <Card key={testSet.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl">{testSet.name}</CardTitle>
            {testSet.description && (
              <CardDescription className="text-base">
                {testSet.description}
              </CardDescription>
            )}
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}