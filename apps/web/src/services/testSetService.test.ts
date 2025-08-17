import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getTestSets } from './testSetService'
import { createClient } from '@/utils/supabase/client'

vi.mock('@/utils/supabase/client')

const mockSupabaseClient = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  order: vi.fn().mockResolvedValue({ data: [], error: null })
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
})