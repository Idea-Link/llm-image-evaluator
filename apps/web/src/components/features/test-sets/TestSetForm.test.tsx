import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect, test, vi, describe, beforeEach } from 'vitest';
import { TestSetForm } from './TestSetForm';

describe('TestSetForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders form with all required fields', () => {
    render(
      <TestSetForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByText(/ground truth categories/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create test set/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  test('validates required name field', async () => {
    render(
      <TestSetForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const submitButton = screen.getByRole('button', { name: /create test set/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('validates at least one category is required', async () => {
    render(
      <TestSetForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: 'Test Set' } });

    const categoryNameInput = screen.getByPlaceholderText(/category name/i);
    const categoryDescInput = screen.getByPlaceholderText(/category description/i);
    
    fireEvent.change(categoryNameInput, { target: { value: '' } });
    fireEvent.change(categoryDescInput, { target: { value: '' } });

    const submitButton = screen.getByRole('button', { name: /create test set/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/at least one category is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('validates categories must have both name and description', async () => {
    render(
      <TestSetForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: 'Test Set' } });

    const categoryNameInput = screen.getByPlaceholderText(/category name/i);
    fireEvent.change(categoryNameInput, { target: { value: 'A++' } });

    const submitButton = screen.getByRole('button', { name: /create test set/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/all categories must have both name and description/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('submits form with valid data', async () => {
    render(
      <TestSetForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const nameInput = screen.getByLabelText(/name/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const categoryNameInput = screen.getByPlaceholderText(/category name/i);
    const categoryDescInput = screen.getByPlaceholderText(/category description/i);

    fireEvent.change(nameInput, { target: { value: 'Test Set Name' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Set Description' } });
    fireEvent.change(categoryNameInput, { target: { value: 'A++' } });
    fireEvent.change(categoryDescInput, { target: { value: 'Excellent category' } });

    const submitButton = screen.getByRole('button', { name: /create test set/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        'Test Set Name',
        'Test Set Description',
        [{ name: 'A++', description: 'Excellent category' }]
      );
    });
  });

  test('calls onCancel when cancel button is clicked', () => {
    render(
      <TestSetForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  test('disables form fields when isSubmitting is true', () => {
    render(
      <TestSetForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isSubmitting={true}
      />
    );

    expect(screen.getByLabelText(/name/i)).toBeDisabled();
    expect(screen.getByLabelText(/description/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /creating/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
  });
});