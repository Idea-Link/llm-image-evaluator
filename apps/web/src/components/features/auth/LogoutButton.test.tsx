import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LogoutButton } from './LogoutButton'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}))

// Mock auth service
vi.mock('@/services/auth', () => ({
  authService: {
    signOut: vi.fn(),
  },
}))

describe('LogoutButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render logout button', () => {
    render(<LogoutButton />)
    
    const button = screen.getByRole('button', { name: /logout/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('outline') // variant="outline"
  })

  it('should handle successful logout', async () => {
    const { authService } = await import('@/services/auth')
    const { useRouter } = await import('next/navigation')
    const router = useRouter()
    
    vi.mocked(authService.signOut).mockResolvedValueOnce({
      data: undefined,
      error: undefined,
    })

    render(<LogoutButton />)
    
    const button = screen.getByRole('button', { name: /logout/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(authService.signOut).toHaveBeenCalled()
      expect(router.push).toHaveBeenCalledWith('/login')
      expect(router.refresh).toHaveBeenCalled()
    })
  })

  it('should not redirect on logout error', async () => {
    const { authService } = await import('@/services/auth')
    const { useRouter } = await import('next/navigation')
    const router = useRouter()
    
    vi.mocked(authService.signOut).mockResolvedValueOnce({
      data: undefined,
      error: {
        message: 'Failed to logout',
        code: 'logout_error',
      },
    })

    render(<LogoutButton />)
    
    const button = screen.getByRole('button', { name: /logout/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(authService.signOut).toHaveBeenCalled()
      expect(router.push).not.toHaveBeenCalled()
      expect(router.refresh).not.toHaveBeenCalled()
    })
  })

  it('should have correct button styling', () => {
    render(<LogoutButton />)
    
    const button = screen.getByRole('button', { name: /logout/i })
    expect(button).toHaveClass('outline') // variant
    expect(button).toHaveClass('sm') // size
  })
})