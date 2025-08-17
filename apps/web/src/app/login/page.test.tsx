import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginPage from './page'

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
    signIn: vi.fn(),
    getAdminEmail: vi.fn(() => 'admin@test.com'),
  },
}))

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render login form with pre-filled email', () => {
    render(<LoginPage />)

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    expect(emailInput).toBeInTheDocument()
    expect(emailInput.value).toBe('admin@test.com')
    expect(passwordInput).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
  })

  it('should display title and description', () => {
    render(<LoginPage />)

    expect(screen.getByText('Admin Login')).toBeInTheDocument()
    expect(screen.getByText(/sign in to access the prompt evaluation system/i)).toBeInTheDocument()
  })

  it('should handle successful login', async () => {
    const { authService } = await import('@/services/auth')
    const { useRouter } = await import('next/navigation')
    const router = useRouter()
    
    vi.mocked(authService.signIn).mockResolvedValueOnce({
      data: undefined,
      error: undefined,
    })

    render(<LoginPage />)

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    fireEvent.change(emailInput, { target: { value: 'admin@test.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(authService.signIn).toHaveBeenCalledWith('admin@test.com', 'password123')
      expect(router.push).toHaveBeenCalledWith('/')
      expect(router.refresh).toHaveBeenCalled()
    })
  })

  it('should display error message on failed login', async () => {
    const { authService } = await import('@/services/auth')
    
    vi.mocked(authService.signIn).mockResolvedValueOnce({
      data: undefined,
      error: {
        message: 'Invalid credentials',
        code: 'invalid_credentials',
      },
    })

    render(<LoginPage />)

    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })

  it('should disable form while loading', async () => {
    const { authService } = await import('@/services/auth')
    
    vi.mocked(authService.signIn).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ data: undefined }), 100))
    )

    render(<LoginPage />)

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    fireEvent.change(passwordInput, { target: { value: 'password' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(emailInput).toBeDisabled()
      expect(passwordInput).toBeDisabled()
      expect(submitButton).toBeDisabled()
      expect(screen.getByText(/signing in/i)).toBeInTheDocument()
    })
  })

  it('should prevent form submission with empty password', async () => {
    const { authService } = await import('@/services/auth')
    
    render(<LoginPage />)

    const form = screen.getByRole('button', { name: /sign in/i }).closest('form')
    
    if (form) {
      const isValid = form.checkValidity()
      expect(isValid).toBe(false)
    }
    
    expect(authService.signIn).not.toHaveBeenCalled()
  })
})