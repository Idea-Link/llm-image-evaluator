import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from './Header'

vi.mock('@/components/features/auth/LogoutButton', () => ({
  LogoutButton: () => <button>Logout</button>
}))

describe('Header', () => {
  it('renders the application title', () => {
    render(<Header />)
    const title = screen.getByText('Prompt Evaluation Platform')
    expect(title).toBeInTheDocument()
    expect(title.tagName).toBe('H1')
  })

  it('renders with correct styling classes', () => {
    render(<Header />)
    const title = screen.getByText('Prompt Evaluation Platform')
    expect(title).toHaveClass('text-2xl', 'font-bold', 'text-foreground')
  })

  it('renders the logout button', () => {
    render(<Header />)
    expect(screen.getByText('Logout')).toBeInTheDocument()
  })

  it('has correct header structure', () => {
    const { container } = render(<Header />)
    const header = container.querySelector('header')
    expect(header).toBeInTheDocument()
    expect(header).toHaveClass('border-b', 'bg-background')
  })
})