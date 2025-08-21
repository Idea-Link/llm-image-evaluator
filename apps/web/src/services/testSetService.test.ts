import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getTestSets, getTestSet, updateTestSet, updateTestSetWithCategories, checkTestSetUsage, deleteTestSet } from './testSetService'
import { createClient } from '@/utils/supabase/client'

vi.mock('@/utils/supabase/client')

const mockSupabaseClient = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  order: vi.fn().mockResolvedValue({ data: [], error: null }),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn().mockResolvedValue({ data: null, error: null }),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis()
}

const mockCreateClient = vi.mocked(createClient)

describe('testSetService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockCreateClient.mockReturnValue(mockSupabaseClient as any)
  })

  describe('getTestSets', () => {
    it('returns test sets when successful', async () => {
      const mockTestSets = [
        {
          id: '1',
          name: 'Test Set 1',
          description: 'Description 1',
          created_at: '2025-01-01T00:00:00Z',
          user_id: 'user1'
        }
      ]

      mockSupabaseClient.order.mockResolvedValue({
        data: mockTestSets,
        error: null
      })

      const result = await getTestSets()

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('test_sets')
      expect(mockSupabaseClient.select).toHaveBeenCalledWith('*')
      expect(mockSupabaseClient.order).toHaveBeenCalledWith('created_at', { ascending: false })
      expect(result).toEqual(mockTestSets)
    })

    it('returns empty array when Supabase returns error', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      mockSupabaseClient.order.mockResolvedValue({
        data: null,
        error: { message: 'Database error' }
      })

      const result = await getTestSets()

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching test sets:', { message: 'Database error' })
      expect(result).toEqual([])
      
      consoleErrorSpy.mockRestore()
    })

    it('returns empty array when unexpected error occurs', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      mockSupabaseClient.from.mockImplementation(() => {
        throw new Error('Unexpected error')
      })

      const result = await getTestSets()

      expect(consoleErrorSpy).toHaveBeenCalledWith('Unexpected error fetching test sets:', expect.any(Error))
      expect(result).toEqual([])
      
      consoleErrorSpy.mockRestore()
    })

    it('returns empty array when data is null', async () => {
      mockSupabaseClient.order.mockResolvedValue({
        data: null,
        error: null
      })

      const result = await getTestSets()

      expect(result).toEqual([])
    })
  })

  describe('getTestSet', () => {
    it('returns test set with categories when successful', async () => {
      const mockTestSet = {
        id: '1',
        name: 'Test Set 1',
        description: 'Description 1',
        categories: [
          { id: 'cat1', test_set_id: '1', name: 'Category 1', description: 'Cat Desc 1' }
        ]
      }

      mockSupabaseClient.single.mockResolvedValue({
        data: mockTestSet,
        error: null
      })

      const result = await getTestSet('1')

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('test_sets')
      expect(mockSupabaseClient.select).toHaveBeenCalledWith(expect.stringContaining('categories:ground_truth_categories(*)'))
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', '1')
      expect(mockSupabaseClient.single).toHaveBeenCalled()
      expect(result).toEqual(mockTestSet)
    })

    it('returns null when test set not found', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      mockSupabaseClient.single.mockResolvedValue({
        data: null,
        error: { message: 'Not found' }
      })

      const result = await getTestSet('nonexistent')

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching test set:', { message: 'Not found' })
      expect(result).toBeNull()
      
      consoleErrorSpy.mockRestore()
    })

    it('returns null when unexpected error occurs', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      mockSupabaseClient.from.mockImplementation(() => {
        throw new Error('Unexpected error')
      })

      const result = await getTestSet('1')

      expect(consoleErrorSpy).toHaveBeenCalledWith('Unexpected error fetching test set:', expect.any(Error))
      expect(result).toBeNull()
      
      consoleErrorSpy.mockRestore()
    })
  })

  describe('updateTestSet', () => {
    it('updates test set successfully', async () => {
      const updates = { name: 'Updated Name', description: 'Updated Description' }
      const mockUpdatedTestSet = {
        id: '1',
        name: 'Updated Name',
        description: 'Updated Description'
      }

      mockSupabaseClient.single.mockResolvedValue({
        data: mockUpdatedTestSet,
        error: null
      })

      const result = await updateTestSet('1', updates)

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('test_sets')
      expect(mockSupabaseClient.update).toHaveBeenCalledWith(updates)
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', '1')
      expect(mockSupabaseClient.select).toHaveBeenCalled()
      expect(mockSupabaseClient.single).toHaveBeenCalled()
      expect(result).toEqual(mockUpdatedTestSet)
    })

    it('throws error when update fails', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      mockSupabaseClient.single.mockResolvedValue({
        data: null,
        error: { message: 'Update failed' }
      })

      await expect(updateTestSet('1', { name: 'New' })).rejects.toThrow('Update failed')
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error updating test set:', { message: 'Update failed' })
      
      consoleErrorSpy.mockRestore()
    })

    it('throws error when no data returned', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      mockSupabaseClient.single.mockResolvedValue({
        data: null,
        error: null
      })

      await expect(updateTestSet('1', { name: 'New' })).rejects.toThrow('No test set data returned')
      
      consoleErrorSpy.mockRestore()
    })
  })

  describe('updateTestSetWithCategories', () => {
    it('updates test set and replaces categories successfully', async () => {
      const updates = { name: 'Updated Name' }
      const newCategories = [
        { name: 'New Category 1', description: 'New Desc 1' },
        { name: 'New Category 2', description: 'New Desc 2' }
      ]
      const mockUpdatedTestSet = {
        id: '1',
        name: 'Updated Name',
        categories: []
      }

      mockSupabaseClient.single.mockResolvedValueOnce({
        data: mockUpdatedTestSet,
        error: null
      })
      
      mockSupabaseClient.select.mockReturnValueOnce({
        ...mockSupabaseClient,
        eq: vi.fn().mockResolvedValue({
          data: [{ id: 'old1', test_set_id: '1', name: 'Old', description: 'Old' }],
          error: null
        })
      })
      
      mockSupabaseClient.eq.mockReturnValueOnce({
        ...mockSupabaseClient,
        delete: vi.fn().mockResolvedValue({ data: null, error: null })
      })
      
      mockSupabaseClient.insert.mockResolvedValue({
        data: null,
        error: null
      })
      
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: { ...mockUpdatedTestSet, categories: newCategories },
        error: null
      })

      const result = await updateTestSetWithCategories('1', updates, newCategories)

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('test_sets')
      expect(mockSupabaseClient.update).toHaveBeenCalledWith(updates)
      expect(result).toBeDefined()
    })

    it('throws error when test set update fails', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      mockSupabaseClient.single.mockResolvedValue({
        data: null,
        error: { message: 'Update failed' }
      })

      await expect(
        updateTestSetWithCategories('1', { name: 'New' }, [])
      ).rejects.toThrow('Update failed')
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error updating test set:', { message: 'Update failed' })
      
      consoleErrorSpy.mockRestore()
    })
  })

  describe('checkTestSetUsage', () => {
    it('returns true when test set is in use', async () => {
      mockSupabaseClient.limit = vi.fn().mockResolvedValue({
        data: [{ id: 'eval-1' }],
        error: null
      })

      const result = await checkTestSetUsage('test-set-1')

      expect(result).toBe(true)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('evaluations')
      expect(mockSupabaseClient.select).toHaveBeenCalledWith('id')
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('test_set_id', 'test-set-1')
      expect(mockSupabaseClient.limit).toHaveBeenCalledWith(1)
    })

    it('returns false when test set is not in use', async () => {
      mockSupabaseClient.limit = vi.fn().mockResolvedValue({
        data: [],
        error: null
      })

      const result = await checkTestSetUsage('test-set-1')

      expect(result).toBe(false)
    })

    it('throws error when database query fails', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const dbError = new Error('Database error')
      
      mockSupabaseClient.limit = vi.fn().mockResolvedValue({
        data: null,
        error: dbError
      })

      await expect(checkTestSetUsage('test-set-1')).rejects.toThrow(dbError)
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error checking test set usage:', dbError)
      
      consoleErrorSpy.mockRestore()
    })
  })

  describe('deleteTestSet', () => {
    beforeEach(() => {
      mockSupabaseClient.limit = vi.fn().mockReturnThis()
    })

    it('successfully deletes unused test set', async () => {
      let callIndex = 0
      mockSupabaseClient.from.mockImplementation(() => {
        callIndex++
        if (callIndex === 1) {
          return {
            ...mockSupabaseClient,
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: [],
                error: null
              })
            })
          }
        }
        return mockSupabaseClient
      })

      mockSupabaseClient.eq.mockResolvedValue({
        data: null,
        error: null
      })

      const result = await deleteTestSet('test-set-1')

      expect(result).toEqual({ success: true })
      expect(mockSupabaseClient.delete).toHaveBeenCalled()
    })

    it('prevents deletion of test set in use', async () => {
      mockSupabaseClient.from.mockReturnValueOnce({
        ...mockSupabaseClient,
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: [{ id: 'eval-1' }, { id: 'eval-2' }, { id: 'eval-3' }],
            error: null
          })
        })
      })

      const result = await deleteTestSet('test-set-1')

      expect(result).toEqual({
        success: false,
        error: 'This Test Set cannot be deleted because it is used by 3 evaluations.',
        usageCount: 3
      })
      expect(mockSupabaseClient.delete).not.toHaveBeenCalled()
    })

    it('returns correct message for single evaluation in use', async () => {
      mockSupabaseClient.from.mockReturnValueOnce({
        ...mockSupabaseClient,
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: [{ id: 'eval-1' }],
            error: null
          })
        })
      })

      const result = await deleteTestSet('test-set-1')

      expect(result).toEqual({
        success: false,
        error: 'This Test Set cannot be deleted because it is used by 1 evaluation.',
        usageCount: 1
      })
    })

    it('handles foreign key constraint error', async () => {
      let callIndex = 0
      mockSupabaseClient.from.mockImplementation(() => {
        callIndex++
        if (callIndex === 1) {
          return {
            ...mockSupabaseClient,
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: [],
                error: null
              })
            })
          }
        }
        return mockSupabaseClient
      })

      mockSupabaseClient.eq.mockResolvedValue({
        data: null,
        error: { code: '23503', message: 'Foreign key violation' }
      })

      const result = await deleteTestSet('test-set-1')

      expect(result).toEqual({
        success: false,
        error: 'This Test Set cannot be deleted because it is in use by evaluations.'
      })
    })

    it('throws error for other database errors', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const dbError = new Error('Database connection failed')
      
      let callIndex = 0
      mockSupabaseClient.from.mockImplementation(() => {
        callIndex++
        if (callIndex === 1) {
          return {
            ...mockSupabaseClient,
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: [],
                error: null
              })
            })
          }
        }
        return mockSupabaseClient
      })

      mockSupabaseClient.eq.mockResolvedValue({
        data: null,
        error: dbError
      })

      await expect(deleteTestSet('test-set-1')).rejects.toThrow(dbError)
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error deleting test set:', dbError)
      
      consoleErrorSpy.mockRestore()
    })
  })
})