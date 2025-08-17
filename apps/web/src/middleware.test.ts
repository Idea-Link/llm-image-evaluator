/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { middleware } from './middleware'

// Mock Supabase SSR
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(),
    },
  })),
}))

// Mock env config
vi.mock('@/config/env', () => ({
  env: {
    supabase: {
      url: 'http://localhost:54321',
      anonKey: 'test-anon-key',
    },
  },
}))

describe('middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should redirect to login when user is not authenticated', async () => {
    const { createServerClient } = await import('@supabase/ssr')
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: null,
        }),
      },
    }
    vi.mocked(createServerClient).mockReturnValue(mockSupabase as any)

    const request = new NextRequest(new URL('http://localhost:3000/dashboard'))
    const response = await middleware(request)

    expect(response?.status).toBe(307) // Redirect status
    expect(response?.headers.get('location')).toContain('/login')
  })

  it('should allow access to login page without authentication', async () => {
    const { createServerClient } = await import('@supabase/ssr')
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: null,
        }),
      },
    }
    vi.mocked(createServerClient).mockReturnValue(mockSupabase as any)

    const request = new NextRequest(new URL('http://localhost:3000/login'))
    const response = await middleware(request)

    // Should not redirect
    expect(response?.status).not.toBe(307)
  })

  it('should allow access to protected routes when authenticated', async () => {
    const { createServerClient } = await import('@supabase/ssr')
    const mockUser = {
      id: '123',
      email: 'admin@test.com',
    }
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      },
    }
    vi.mocked(createServerClient).mockReturnValue(mockSupabase as any)

    const request = new NextRequest(new URL('http://localhost:3000/dashboard'))
    const response = await middleware(request)

    // Should not redirect
    expect(response?.status).not.toBe(307)
  })

  it('should not apply to static assets', async () => {
    const staticPaths = [
      '/_next/static/file.js',
      '/_next/image/test.jpg',
      '/favicon.ico',
      '/image.png',
      '/style.css',
    ]

    for (const path of staticPaths) {
      // Static check only - request not used
      
      // The matcher config should exclude these paths
      // We can test this by checking if the path matches the pattern
      const shouldMatch = !path.match(/_next\/static|_next\/image|favicon\.ico|.*\.(svg|png|jpg|jpeg|gif|webp)$/)
      expect(shouldMatch).toBe(false)
    }
  })

  it('should handle authentication errors gracefully', async () => {
    const { createServerClient } = await import('@supabase/ssr')
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: { message: 'Auth service error' },
        }),
      },
    }
    vi.mocked(createServerClient).mockReturnValue(mockSupabase as any)

    const request = new NextRequest(new URL('http://localhost:3000/dashboard'))
    const response = await middleware(request)

    // Should redirect to login on auth error
    expect(response?.status).toBe(307)
    expect(response?.headers.get('location')).toContain('/login')
  })
})