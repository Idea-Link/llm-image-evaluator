'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CategoryListEditor } from './CategoryListEditor';
import { TestSet, GroundTruthCategory } from '@evaluation-platform/shared';
import { useTestSetStore } from '@/stores/useTestSetStore';
import { useToast } from '@/hooks/use-toast';

interface TestSetFormProps {
  testSet?: TestSet;
  mode?: 'create' | 'edit';
  onSubmit?: (
    name: string,
    description: string,
    categories: Omit<GroundTruthCategory, 'id' | 'test_set_id'>[]
  ) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function TestSetForm({ 
  testSet, 
  mode = 'create',
  onSubmit,
  onCancel,
  isSubmitting: externalIsSubmitting = false 
}: TestSetFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { createTestSet, updateTestSet } = useTestSetStore();
  
  const [name, setName] = useState(testSet?.name || '');
  const [description, setDescription] = useState(testSet?.description || '');
  const [categories, setCategories] = useState<Omit<GroundTruthCategory, 'id' | 'test_set_id'>[]>(
    testSet?.categories?.map(cat => ({ 
      name: cat.name, 
      description: cat.description 
    })) || [{ name: '', description: '' }]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    categories?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    const validCategories = categories.filter(
      cat => cat.name.trim() || cat.description.trim()
    );

    if (validCategories.length === 0) {
      newErrors.categories = 'At least one category is required';
    }

    const hasInvalidCategory = validCategories.some(
      cat => !cat.name.trim() || !cat.description.trim()
    );

    if (hasInvalidCategory) {
      newErrors.categories = 'All categories must have both name and description';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const validCategories = categories.filter(
      cat => cat.name.trim() && cat.description.trim()
    );

    if (onSubmit) {
      await onSubmit(name, description, validCategories);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = {
        name,
        description,
        json_extraction_key: undefined
      };
      
      if (mode === 'edit' && testSet) {
        await updateTestSet(testSet.id, formData, validCategories);
        toast({
          title: 'Success',
          description: 'Test set updated successfully',
        });
      } else {
        await createTestSet(formData, validCategories);
        toast({
          title: 'Success',
          description: 'Test set created successfully',
        });
      }
      
      router.push('/test-sets');
    } catch {
      toast({
        title: 'Error',
        description: mode === 'edit' 
          ? 'Failed to update test set' 
          : 'Failed to create test set',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelClick = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push('/test-sets');
    }
  };

  const submitButtonText = () => {
    const submitting = isSubmitting || externalIsSubmitting;
    if (submitting) {
      return mode === 'edit' ? 'Updating...' : 'Creating...';
    }
    return mode === 'edit' ? 'Update Test Set' : 'Create Test Set';
  };

  const isDisabled = isSubmitting || externalIsSubmitting;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">
          Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter test set name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) {
              setErrors({ ...errors, name: undefined });
            }
          }}
          disabled={isDisabled}
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter test set description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isDisabled}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>
          Ground Truth Categories <span className="text-destructive">*</span>
        </Label>
        <CategoryListEditor
          categories={categories}
          onChange={(newCategories) => {
            setCategories(newCategories);
            if (errors.categories) {
              setErrors({ ...errors, categories: undefined });
            }
          }}
          disabled={isDisabled}
        />
        {errors.categories && (
          <p className="text-sm text-destructive">{errors.categories}</p>
        )}
      </div>

      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancelClick}
          disabled={isDisabled}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isDisabled}
        >
          {submitButtonText()}
        </Button>
      </div>
    </form>
  );
}