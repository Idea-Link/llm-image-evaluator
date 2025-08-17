import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthenticatedLayout } from './AuthenticatedLayout'

vi.mock('./Header', () => ({
  Header: () => <header data-testid="header">Prompt Evaluation Platform</header>
}))

describe('AuthenticatedLayout', () => {
  it('renders the Header component', () => {
    render(
      <AuthenticatedLayout>
        <div>Test Content</div>
      </AuthenticatedLayout>
    )
    expect(screen.getByTestId('header')).toBeInTheDocument()
  })

  it('renders children content', () => {
    render(
      <AuthenticatedLayout>
        <div>Test Content</div>
      </AuthenticatedLayout>
    )
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('renders main element with correct classes', () => {
    const { container } = render(
      <AuthenticatedLayout>
        <div>Test Content</div>
      </AuthenticatedLayout>
    )
    const mainElement = container.querySelector('main')
    expect(mainElement).toBeInTheDocument()
    expect(mainElement).toHaveClass('container', 'mx-auto', 'px-4', 'py-8')
  })

  it('renders header and main elements together', () => {
    const { container } = render(
      <AuthenticatedLayout>
        <div>Test Content</div>
      </AuthenticatedLayout>
    )
    expect(screen.getByTestId('header')).toBeInTheDocument()
    const mainElement = container.querySelector('main')
    expect(mainElement).toBeInTheDocument()
  })
})