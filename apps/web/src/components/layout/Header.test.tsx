import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { Header } from './Header'

vi.mock('@/components/features/auth/LogoutButton', () => ({
  LogoutButton: () => <button>Logout</button>
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
}))

describe('Header', () => {
  afterEach(() => {
    cleanup()
  })

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

  it('renders the Test Sets navigation link', () => {
    render(<Header />)
    const testSetsLink = screen.getByText('Test Sets')
    expect(testSetsLink).toBeInTheDocument()
    expect(testSetsLink.closest('a')).toHaveAttribute('href', '/test-sets')
  })

  it('has correct header structure', () => {
    const { container } = render(<Header />)
    const header = container.querySelector('header')
    expect(header).toBeInTheDocument()
    expect(header).toHaveClass('border-b', 'bg-background')
  })
})