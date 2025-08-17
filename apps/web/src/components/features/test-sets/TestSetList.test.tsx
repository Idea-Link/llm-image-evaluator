import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TestSetList } from './TestSetList'
import { useTestSetStore } from '@/stores/useTestSetStore'

vi.mock('@/stores/useTestSetStore')
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
}))

const mockUseTestSetStore = vi.mocked(useTestSetStore)

describe('TestSetList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('displays loading skeletons when loading is true', () => {
    mockUseTestSetStore.mockReturnValue([])
    
    render(<TestSetList loading={true} />)
    
    const skeletons = screen.getAllByTestId('skeleton')
    expect(skeletons).toHaveLength(6) // 3 cards with 2 skeletons each
  })

  it('displays empty state when no test sets exist', () => {
    mockUseTestSetStore.mockReturnValue([])
    
    render(<TestSetList loading={false} />)
    
    expect(screen.getByText('No Test Sets Found')).toBeInTheDocument()
    expect(screen.getByText('Get started by creating your first test set to evaluate your prompts.')).toBeInTheDocument()
    expect(screen.getByText('Create Your First Test Set')).toBeInTheDocument()
    
    const createLink = screen.getByText('Create Your First Test Set').closest('a')
    expect(createLink).toHaveAttribute('href', '/test-sets/new')
  })

  it('displays test sets correctly when data exists', () => {
    const mockTestSets = [
      {
        id: '1',
        name: 'Test Set 1',
        description: 'Description for test set 1',
        createdBy: 'user1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Test Set 2',
        description: 'Description for test set 2',
        createdBy: 'user1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    
    mockUseTestSetStore.mockReturnValue(mockTestSets)
    
    render(<TestSetList loading={false} />)
    
    expect(screen.getByText('Test Set 1')).toBeInTheDocument()
    expect(screen.getByText('Description for test set 1')).toBeInTheDocument()
    expect(screen.getByText('Test Set 2')).toBeInTheDocument()
    expect(screen.getByText('Description for test set 2')).toBeInTheDocument()
  })

  it('displays test set without description correctly', () => {
    const mockTestSets = [
      {
        id: '1',
        name: 'Test Set Without Description',
        createdBy: 'user1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    
    mockUseTestSetStore.mockReturnValue(mockTestSets)
    
    render(<TestSetList loading={false} />)
    
    expect(screen.getByText('Test Set Without Description')).toBeInTheDocument()
    expect(screen.queryByText('Description')).not.toBeInTheDocument()
  })
})