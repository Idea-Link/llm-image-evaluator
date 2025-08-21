import { describe, test, expect, beforeAll, vi } from 'vitest';
import { createTestSet } from './testSetService';
import { createClient } from '@/utils/supabase/client';

// Mock the Supabase client
vi.mock('@/utils/supabase/client', () => ({
  createClient: vi.fn()
}));

describe('testSetService Integration', () => {
  const mockSupabase = {
    auth: {
      getUser: vi.fn()
    },
    from: vi.fn()
  };

  beforeAll(() => {
    (createClient as any).mockReturnValue(mockSupabase);
  });

  test('createTestSet includes user_id in the request', async () => {
    const mockUser = { id: 'test-user-123', email: 'test@example.com' };
    const mockTestSet = {
      id: 'test-set-123',
      name: 'Test Set',
      description: 'Test Description',
      user_id: mockUser.id,
      created_at: new Date(),
      updated_at: new Date()
    };

    // Mock successful auth
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null
    });

    // Mock successful insert
    const mockInsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: mockTestSet,
          error: null
        })
      })
    });

    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: { ...mockTestSet, categories: [] },
          error: null
        })
      })
    });

    mockSupabase.from.mockImplementation((table: string) => {
      if (table === 'test_sets') {
        return {
          insert: mockInsert,
          select: mockSelect
        };
      }
      if (table === 'ground_truth_categories') {
        return {
          insert: vi.fn().mockResolvedValue({ error: null })
        };
      }
      return {};
    });

    const testSetData = {
      name: 'Test Set',
      description: 'Test Description'
    };

    const categories = [
      { name: 'Category 1', description: 'Description 1' }
    ];

    const result = await createTestSet(testSetData, categories);

    // Verify user was fetched
    expect(mockSupabase.auth.getUser).toHaveBeenCalled();

    // Verify insert was called with user_id
    expect(mockInsert).toHaveBeenCalledWith({
      ...testSetData,
      user_id: mockUser.id
    });

    // Verify result
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('name', 'Test Set');
  });

  test('createTestSet throws error when user is not authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null
    });

    const testSetData = {
      name: 'Test Set',
      description: 'Test Description'
    };

    await expect(createTestSet(testSetData, [])).rejects.toThrow('User not authenticated');
  });
});