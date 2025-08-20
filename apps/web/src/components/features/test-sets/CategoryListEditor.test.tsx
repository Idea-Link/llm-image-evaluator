import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, vi, describe, beforeEach } from 'vitest';
import { CategoryListEditor } from './CategoryListEditor';
import { GroundTruthCategory } from '@evaluation-platform/shared';

describe('CategoryListEditor', () => {
  const mockOnChange = vi.fn();
  const initialCategories: Omit<GroundTruthCategory, 'id' | 'test_set_id'>[] = [
    { name: 'A++', description: 'Excellent' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders initial categories', () => {
    render(
      <CategoryListEditor
        categories={initialCategories}
        onChange={mockOnChange}
      />
    );

    const nameInput = screen.getByDisplayValue('A++');
    const descriptionInput = screen.getByDisplayValue('Excellent');
    
    expect(nameInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
  });

  test('adds a new category when Add Category button is clicked', () => {
    render(
      <CategoryListEditor
        categories={initialCategories}
        onChange={mockOnChange}
      />
    );

    const addButton = screen.getByRole('button', { name: /add category/i });
    fireEvent.click(addButton);

    expect(mockOnChange).toHaveBeenCalledWith([
      { name: 'A++', description: 'Excellent' },
      { name: '', description: '' }
    ]);
  });

  test('removes a category when remove button is clicked', () => {
    const multipleCategories = [
      { name: 'A++', description: 'Excellent' },
      { name: 'B', description: 'Good' }
    ];

    render(
      <CategoryListEditor
        categories={multipleCategories}
        onChange={mockOnChange}
      />
    );

    const removeButtons = screen.getAllByRole('button', { name: '' });
    const firstRemoveButton = removeButtons.find(btn => 
      btn.querySelector('svg')
    );
    
    if (firstRemoveButton) {
      fireEvent.click(firstRemoveButton);
    }

    expect(mockOnChange).toHaveBeenCalledWith([
      { name: 'B', description: 'Good' }
    ]);
  });

  test('does not show remove button when only one category exists', () => {
    render(
      <CategoryListEditor
        categories={initialCategories}
        onChange={mockOnChange}
      />
    );

    const buttons = screen.getAllByRole('button');
    const removeButtons = buttons.filter(btn => 
      btn.querySelector('svg.lucide-trash-2')
    );
    
    expect(removeButtons).toHaveLength(0);
  });

  test('updates category name when input changes', () => {
    render(
      <CategoryListEditor
        categories={initialCategories}
        onChange={mockOnChange}
      />
    );

    const nameInput = screen.getByDisplayValue('A++');
    fireEvent.change(nameInput, { target: { value: 'A+' } });

    expect(mockOnChange).toHaveBeenCalledWith([
      { name: 'A+', description: 'Excellent' }
    ]);
  });

  test('updates category description when textarea changes', () => {
    render(
      <CategoryListEditor
        categories={initialCategories}
        onChange={mockOnChange}
      />
    );

    const descriptionInput = screen.getByDisplayValue('Excellent');
    fireEvent.change(descriptionInput, { target: { value: 'Very Good' } });

    expect(mockOnChange).toHaveBeenCalledWith([
      { name: 'A++', description: 'Very Good' }
    ]);
  });

  test('disables all inputs when disabled prop is true', () => {
    render(
      <CategoryListEditor
        categories={initialCategories}
        onChange={mockOnChange}
        disabled={true}
      />
    );

    const nameInput = screen.getByDisplayValue('A++');
    const descriptionInput = screen.getByDisplayValue('Excellent');
    const addButton = screen.getByRole('button', { name: /add category/i });

    expect(nameInput).toBeDisabled();
    expect(descriptionInput).toBeDisabled();
    expect(addButton).toBeDisabled();
  });

  test('maintains at least one category when trying to remove the last one', () => {
    const singleCategory = [{ name: '', description: '' }];
    
    render(
      <CategoryListEditor
        categories={singleCategory}
        onChange={mockOnChange}
      />
    );

    const buttons = screen.getAllByRole('button');
    const removeButtons = buttons.filter(btn => 
      btn.querySelector('svg.lucide-trash-2')
    );
    
    expect(removeButtons).toHaveLength(0);
  });
});