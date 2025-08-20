import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect, test, vi, describe, beforeEach } from 'vitest';
import NewTestSetPage from './page';
import { useRouter } from 'next/navigation';
import { useTestSetStore } from '@/stores/useTestSetStore';
import { useToast } from '@/hooks/use-toast';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// Mock the store
vi.mock('@/stores/useTestSetStore', () => ({
  useTestSetStore: vi.fn(),
}));

// Mock the toast
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(),
}));

describe('NewTestSetPage Integration', () => {
  const mockPush = vi.fn();
  const mockCreateTestSet = vi.fn();
  const mockToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    (useRouter as any).mockReturnValue({
      push: mockPush,
    });
    
    (useTestSetStore as any).mockReturnValue({
      createTestSet: mockCreateTestSet,
    });
    
    (useToast as any).mockReturnValue({
      toast: mockToast,
    });
  });

  test('renders the form with all required elements', () => {
    render(<NewTestSetPage />);
    
    // Check page title
    expect(screen.getByText('Create New Test Set')).toBeInTheDocument();
    
    // Check form fields exist
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByText(/ground truth categories/i)).toBeInTheDocument();
    
    // Check buttons
    expect(screen.getByRole('button', { name: /create test set/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  test('successfully creates a test set with valid data', async () => {
    mockCreateTestSet.mockResolvedValueOnce({ id: '123', name: 'Test Set' });
    
    render(<NewTestSetPage />);
    
    // Fill in the form
    const nameInput = screen.getByLabelText(/name/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    
    fireEvent.change(nameInput, { target: { value: 'My Test Set' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    
    // Fill in category - use getAllBy since form initializes with one category
    const categoryNameInputs = screen.getAllByPlaceholderText(/category name/i);
    const categoryDescInputs = screen.getAllByPlaceholderText(/category description/i);
    
    fireEvent.change(categoryNameInputs[0], { target: { value: 'A++' } });
    fireEvent.change(categoryDescInputs[0], { target: { value: 'Excellent' } });
    
    // Submit the form - use getAllBy and select the correct button
    const submitButtons = screen.getAllByRole('button', { name: /create test set/i });
    fireEvent.click(submitButtons[0]);
    
    // Wait for async operations
    await waitFor(() => {
      expect(mockCreateTestSet).toHaveBeenCalledWith(
        {
          name: 'My Test Set',
          description: 'Test Description',
        },
        [{ name: 'A++', description: 'Excellent' }]
      );
      
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'Test set created successfully',
      });
      
      expect(mockPush).toHaveBeenCalledWith('/test-sets');
    });
  });

  test('handles errors during test set creation', async () => {
    const errorMessage = 'Failed to create test set';
    mockCreateTestSet.mockRejectedValueOnce(new Error(errorMessage));
    
    render(<NewTestSetPage />);
    
    // Fill minimum required data
    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: 'Test Set' } });
    
    // Use getAllBy since form initializes with one category
    const categoryNameInputs = screen.getAllByPlaceholderText(/category name/i);
    const categoryDescInputs = screen.getAllByPlaceholderText(/category description/i);
    fireEvent.change(categoryNameInputs[0], { target: { value: 'A' } });
    fireEvent.change(categoryDescInputs[0], { target: { value: 'Good' } });
    
    // Submit - use getAllBy and select the correct button
    const submitButtons = screen.getAllByRole('button', { name: /create test set/i });
    fireEvent.click(submitButtons[0]);
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      
      // Should not navigate on error
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  test('navigates back when cancel is clicked', () => {
    render(<NewTestSetPage />);
    
    // Use getAllBy in case there are multiple cancel buttons
    const cancelButtons = screen.getAllByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButtons[0]);
    
    expect(mockPush).toHaveBeenCalledWith('/test-sets');
  });
});