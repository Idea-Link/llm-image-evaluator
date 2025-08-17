/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authService } from './auth'

// Mock the Supabase client
vi.mock('@/utils/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
    },
  })),
}))

// Mock the env config
vi.mock('@/config/env', () => ({
  env: {
    auth: {
      adminEmail: 'admin@test.com',
    },
  },
}))

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('signIn', () => {
    it('should successfully sign in with valid credentials', async () => {
      const { createClient } = await import('@/utils/supabase/client')
      const mockClient = createClient()
      vi.mocked(mockClient.auth.signInWithPassword).mockResolvedValueOnce({
        data: { user: {}, session: {} },
        error: null,
      } as any)

      const result = await authService.signIn('admin@test.com', 'password')

      expect(result.error).toBeUndefined()
      expect(mockClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'admin@test.com',
        password: 'password',
      })
    })

    it('should return error with invalid credentials', async () => {
      const { createClient } = await import('@/utils/supabase/client')
      const mockClient = createClient()
      vi.mocked(mockClient.auth.signInWithPassword).mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: 'Invalid login credentials',
          code: 'invalid_credentials',
        },
      } as any)

      const result = await authService.signIn('admin@test.com', 'wrong')

      expect(result.error).toBeDefined()
      expect(result.error?.message).toBe('Invalid login credentials')
    })

    it('should handle unexpected errors', async () => {
      const { createClient } = await import('@/utils/supabase/client')
      const mockClient = createClient()
      vi.mocked(mockClient.auth.signInWithPassword).mockRejectedValueOnce(
        new Error('Network error')
      )

      const result = await authService.signIn('admin@test.com', 'password')

      expect(result.error).toBeDefined()
      expect(result.error?.message).toBe('An unexpected error occurred during sign in')
    })
  })

  describe('signOut', () => {
    it('should successfully sign out', async () => {
      const { createClient } = await import('@/utils/supabase/client')
      const mockClient = createClient()
      vi.mocked(mockClient.auth.signOut).mockResolvedValueOnce({
        error: null,
      } as any)

      const result = await authService.signOut()

      expect(result.error).toBeUndefined()
      expect(mockClient.auth.signOut).toHaveBeenCalled()
    })

    it('should return error if sign out fails', async () => {
      const { createClient } = await import('@/utils/supabase/client')
      const mockClient = createClient()
      vi.mocked(mockClient.auth.signOut).mockResolvedValueOnce({
        error: {
          message: 'Failed to sign out',
          code: 'sign_out_error',
        },
      } as any)

      const result = await authService.signOut()

      expect(result.error).toBeDefined()
      expect(result.error?.message).toBe('Failed to sign out')
    })
  })

  describe('getSession', () => {
    it('should return current session', async () => {
      const mockSession = { user: {}, access_token: 'token' }
      const { createClient } = await import('@/utils/supabase/client')
      const mockClient = createClient()
      vi.mocked(mockClient.auth.getSession).mockResolvedValueOnce({
        data: { session: mockSession },
        error: null,
      } as any)

      const result = await authService.getSession()

      expect(result.error).toBeUndefined()
      expect(result.data).toEqual(mockSession)
    })

    it('should return null if no session', async () => {
      const { createClient } = await import('@/utils/supabase/client')
      const mockClient = createClient()
      vi.mocked(mockClient.auth.getSession).mockResolvedValueOnce({
        data: { session: null },
        error: null,
      } as any)

      const result = await authService.getSession()

      expect(result.error).toBeUndefined()
      expect(result.data).toBeNull()
    })
  })

  describe('getAdminEmail', () => {
    it('should return admin email from config', () => {
      const email = authService.getAdminEmail()
      expect(email).toBe('admin@test.com')
    })
  })
})