'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { GroundTruthCategory } from '@evaluation-platform/shared';

interface CategoryListEditorProps {
  categories: Omit<GroundTruthCategory, 'id' | 'test_set_id'>[];
  onChange: (categories: Omit<GroundTruthCategory, 'id' | 'test_set_id'>[]) => void;
  disabled?: boolean;
}

export function CategoryListEditor({ categories, onChange, disabled = false }: CategoryListEditorProps) {
  const handleAddCategory = () => {
    onChange([...categories, { name: '', description: '' }]);
  };

  const handleRemoveCategory = (index: number) => {
    const newCategories = categories.filter((_, i) => i !== index);
    onChange(newCategories.length > 0 ? newCategories : [{ name: '', description: '' }]);
  };

  const handleCategoryChange = (
    index: number,
    field: keyof Omit<GroundTruthCategory, 'id' | 'test_set_id'>,
    value: string
  ) => {
    const newCategories = [...categories];
    newCategories[index] = {
      ...newCategories[index],
      [field]: value
    };
    onChange(newCategories);
  };

  return (
    <div className="space-y-4">
      {categories.map((category, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-3">
          <div className="flex items-start gap-2">
            <div className="flex-1 space-y-3">
              <div>
                <Input
                  type="text"
                  placeholder="Category name (e.g., A++)"
                  value={category.name}
                  onChange={(e) => handleCategoryChange(index, 'name', e.target.value)}
                  disabled={disabled}
                  className="w-full"
                />
              </div>
              <div>
                <Textarea
                  placeholder="Category description"
                  value={category.description}
                  onChange={(e) => handleCategoryChange(index, 'description', e.target.value)}
                  disabled={disabled}
                  rows={2}
                  className="w-full"
                />
              </div>
            </div>
            {categories.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveCategory(index)}
                disabled={disabled}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={handleAddCategory}
        disabled={disabled}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Category
      </Button>
    </div>
  );
}