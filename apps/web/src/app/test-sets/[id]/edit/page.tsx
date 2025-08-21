import { notFound } from 'next/navigation';
import { TestSetForm } from '@/components/features/test-sets/TestSetForm';
import { getTestSet } from '@/services/testSetService';

interface EditTestSetPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTestSetPage({ params }: EditTestSetPageProps) {
  const { id } = await params;
  
  const testSet = await getTestSet(id);
  
  if (!testSet) {
    notFound();
  }
  
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Edit Test Set</h1>
      <TestSetForm 
        testSet={testSet} 
        mode="edit"
      />
    </div>
  );
}

export function generateMetadata() {
  return {
    title: 'Edit Test Set',
  };
}