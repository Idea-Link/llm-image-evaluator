'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CategoryListEditor } from './CategoryListEditor';
import { GroundTruthCategory } from '@evaluation-platform/shared';

interface TestSetFormProps {
  onSubmit: (
    name: string,
    description: string,
    categories: Omit<GroundTruthCategory, 'id' | 'test_set_id'>[]
  ) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function TestSetForm({ onSubmit, onCancel, isSubmitting = false }: TestSetFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState<Omit<GroundTruthCategory, 'id' | 'test_set_id'>[]>([
    { name: '', description: '' }
  ]);
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

    await onSubmit(name, description, validCategories);
  };

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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
        />
        {errors.categories && (
          <p className="text-sm text-destructive">{errors.categories}</p>
        )}
      </div>

      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Test Set'}
        </Button>
      </div>
    </form>
  );
}