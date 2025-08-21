import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect, test, vi, describe, beforeEach } from 'vitest';
import { TestSetForm } from './TestSetForm';
import { TestSet } from '@evaluation-platform/shared';

// Type override for test - matches database response
type TestSetWithSnakeCase = Omit<TestSet, 'createdBy' | 'createdAt' | 'updatedAt'> & {
  user_id?: string;
  created_at?: string;
};

const mockRouter = {
  push: vi.fn(),
  back: vi.fn(),
  refresh: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  forward: vi.fn(),
};

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));

const mockStore = {
  testSets: [],
  loading: false,
  error: null,
  fetchTestSets: vi.fn(),
  createTestSet: vi.fn(),
  updateTestSet: vi.fn().mockResolvedValue({ id: 'test-id' }),
  setTestSets: vi.fn(),
  setLoading: vi.fn(),
  setError: vi.fn(),
};

vi.mock('@/stores/useTestSetStore', () => ({
  useTestSetStore: () => mockStore,
}));

const mockToast = vi.fn();

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

describe('TestSetForm - Edit Mode', () => {
  const mockTestSet = {
    id: 'test-id-123',
    name: 'Existing Test Set',
    description: 'Existing Description',
    categories: [
      {
        id: 'cat-1',
        test_set_id: 'test-id-123',
        name: 'Category 1',
        description: 'Description 1',
      },
      {
        id: 'cat-2',
        test_set_id: 'test-id-123',
        name: 'Category 2',
        description: 'Description 2',
      },
    ],
  } as unknown as TestSet;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('pre-populates form with existing test set data', () => {
    render(<TestSetForm testSet={mockTestSet} mode="edit" />);

    const nameInput = screen.getByPlaceholderText('Enter test set name') as HTMLInputElement;
    const descriptionInput = screen.getByPlaceholderText('Enter test set description (optional)') as HTMLTextAreaElement;

    expect(nameInput.value).toBe('Existing Test Set');
    expect(descriptionInput.value).toBe('Existing Description');

    const categoryNameInputs = screen.getAllByPlaceholderText('Category name');
    const categoryDescInputs = screen.getAllByPlaceholderText('Category description');

    expect(categoryNameInputs).toHaveLength(2);
    expect(categoryDescInputs).toHaveLength(2);
    expect((categoryNameInputs[0] as HTMLInputElement).value).toBe('Category 1');
    expect((categoryDescInputs[0] as HTMLTextAreaElement).value).toBe('Description 1');
    expect((categoryNameInputs[1] as HTMLInputElement).value).toBe('Category 2');
    expect((categoryDescInputs[1] as HTMLTextAreaElement).value).toBe('Description 2');
  });

  test('shows "Update Test Set" button in edit mode', () => {
    render(<TestSetForm testSet={mockTestSet} mode="edit" />);

    const submitButton = screen.getByRole('button', { name: 'Update Test Set' });
    expect(submitButton).toBeDefined();
  });

  test('allows modifying test set name and description', () => {
    render(<TestSetForm testSet={mockTestSet} mode="edit" />);

    const nameInput = screen.getByPlaceholderText('Enter test set name') as HTMLInputElement;
    const descriptionInput = screen.getByPlaceholderText('Enter test set description (optional)') as HTMLTextAreaElement;

    fireEvent.change(nameInput, { target: { value: 'Updated Name' } });
    fireEvent.change(descriptionInput, { target: { value: 'Updated Description' } });

    expect(nameInput.value).toBe('Updated Name');
    expect(descriptionInput.value).toBe('Updated Description');
  });

  test('allows adding new categories', () => {
    render(<TestSetForm testSet={mockTestSet} mode="edit" />);

    const addButton = screen.getByRole('button', { name: 'Add Category' });
    fireEvent.click(addButton);

    const categoryNameInputs = screen.getAllByPlaceholderText('Category name');
    const categoryDescInputs = screen.getAllByPlaceholderText('Category description');

    expect(categoryNameInputs).toHaveLength(3);
    expect(categoryDescInputs).toHaveLength(3);
  });

  test('allows removing categories', () => {
    render(<TestSetForm testSet={mockTestSet} mode="edit" />);

    const removeButtons = screen.getAllByRole('button', { name: 'Remove' });
    expect(removeButtons).toHaveLength(2);

    fireEvent.click(removeButtons[0]);

    const categoryNameInputs = screen.getAllByPlaceholderText('Category name');
    expect(categoryNameInputs).toHaveLength(1);
    expect((categoryNameInputs[0] as HTMLInputElement).value).toBe('Category 2');
  });

  test('validates form on submission in edit mode', async () => {
    render(<TestSetForm testSet={mockTestSet} mode="edit" />);

    const nameInput = screen.getByPlaceholderText('Enter test set name') as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: '' } });

    const submitButton = screen.getByRole('button', { name: 'Update Test Set' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorMessage = screen.getByText('Name is required');
      expect(errorMessage).toBeDefined();
    });
  });

  test('calls updateTestSet when form is submitted', async () => {
    render(<TestSetForm testSet={mockTestSet} mode="edit" />);

    const nameInput = screen.getByPlaceholderText('Enter test set name') as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'Updated Name' } });

    const submitButton = screen.getByRole('button', { name: 'Update Test Set' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockStore.updateTestSet).toHaveBeenCalledWith(
        'test-id-123',
        expect.objectContaining({
          name: 'Updated Name',
          description: 'Existing Description',
        }),
        expect.arrayContaining([
          expect.objectContaining({ name: 'Category 1', description: 'Description 1' }),
          expect.objectContaining({ name: 'Category 2', description: 'Description 2' }),
        ])
      );
    });
  });

  test('shows "Updating..." text while submitting', async () => {
    mockStore.updateTestSet.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<TestSetForm testSet={mockTestSet} mode="edit" />);

    const submitButton = screen.getByRole('button', { name: 'Update Test Set' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const updatingButton = screen.getByRole('button', { name: 'Updating...' });
      expect(updatingButton).toBeDefined();
      expect(updatingButton).toBeDisabled();
    });
  });

  test('navigates to /test-sets after successful update', async () => {
    render(<TestSetForm testSet={mockTestSet} mode="edit" />);

    const submitButton = screen.getByRole('button', { name: 'Update Test Set' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/test-sets');
    });
  });

  test('shows success toast after successful update', async () => {
    render(<TestSetForm testSet={mockTestSet} mode="edit" />);

    const submitButton = screen.getByRole('button', { name: 'Update Test Set' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'Test set updated successfully',
      });
    });
  });

  test('shows error toast when update fails', async () => {
    mockStore.updateTestSet.mockRejectedValueOnce(new Error('Update failed'));

    render(<TestSetForm testSet={mockTestSet} mode="edit" />);

    const submitButton = screen.getByRole('button', { name: 'Update Test Set' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Failed to update test set',
        variant: 'destructive',
      });
    });
  });
});