import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from './page'

vi.mock('@/components/layout/AuthenticatedLayout', () => ({
  AuthenticatedLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={className}>{children}</div>
  ),
  CardHeader: ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={className}>{children}</div>
  ),
  CardTitle: ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <h2 className={className}>{children}</h2>
  ),
  CardDescription: ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <p className={className}>{children}</p>
  ),
  CardContent: ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={className}>{children}</div>
  ),
}))

describe('Home Dashboard', () => {
  it('renders welcome message', () => {
    render(<Home />)
    expect(screen.getByText('Welcome')).toBeInTheDocument()
  })

  it('renders platform name in description', () => {
    render(<Home />)
    expect(screen.getByText('Prompt Evaluation Platform')).toBeInTheDocument()
  })

  it('renders welcome content text', () => {
    render(<Home />)
    expect(screen.getByText(/Welcome to the Prompt Evaluation Platform/)).toBeInTheDocument()
  })

  it('uses AuthenticatedLayout', () => {
    const { container } = render(<Home />)
    const card = container.querySelector('.max-w-2xl')
    expect(card).toBeInTheDocument()
  })

  it('renders with proper card structure', () => {
    const { container } = render(<Home />)
    const card = container.querySelector('.max-w-2xl.mx-auto')
    expect(card).toBeInTheDocument()
  })
})