import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TestSetList } from './TestSetList'
import { useTestSetStore } from '@/stores/useTestSetStore'
import { deleteTestSet } from '@/services/testSetService'
import { useToast } from '@/hooks/use-toast'

vi.mock('@/stores/useTestSetStore')
vi.mock('@/services/testSetService')
vi.mock('@/hooks/use-toast')
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
}))

const mockUseTestSetStore = vi.mocked(useTestSetStore)
const mockDeleteTestSet = vi.mocked(deleteTestSet)
const mockUseToast = vi.mocked(useToast)

describe('TestSetList', () => {
  const mockToast = vi.fn()
  const mockRemoveTestSet = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseToast.mockReturnValue({ toast: mockToast } as any)
    mockUseTestSetStore.mockImplementation((selector: any) => {
      if (typeof selector === 'function') {
        const state = {
          testSets: [],
          removeTestSet: mockRemoveTestSet
        }
        return selector(state)
      }
      return []
    })
  })

  it('displays loading skeletons when loading is true', () => {
    render(<TestSetList loading={true} />)
    
    const skeletons = screen.getAllByTestId('skeleton')
    expect(skeletons).toHaveLength(6) // 3 cards with 2 skeletons each
  })

  it('displays empty state when no test sets exist', () => {
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
    
    mockUseTestSetStore.mockImplementation((selector: any) => {
      if (typeof selector === 'function') {
        const state = {
          testSets: mockTestSets,
          removeTestSet: mockRemoveTestSet
        }
        return selector(state)
      }
      return mockTestSets
    })
    
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
    
    mockUseTestSetStore.mockImplementation((selector: any) => {
      if (typeof selector === 'function') {
        const state = {
          testSets: mockTestSets,
          removeTestSet: mockRemoveTestSet
        }
        return selector(state)
      }
      return mockTestSets
    })
    
    render(<TestSetList loading={false} />)
    
    expect(screen.getByText('Test Set Without Description')).toBeInTheDocument()
    expect(screen.queryByText('Description')).not.toBeInTheDocument()
  })

  it('shows delete buttons for each test set', () => {
    const mockTestSets = [
      {
        id: '1',
        name: 'Test Set 1',
        createdBy: 'user1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Test Set 2',
        createdBy: 'user1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    
    mockUseTestSetStore.mockImplementation((selector: any) => {
      if (typeof selector === 'function') {
        const state = {
          testSets: mockTestSets,
          removeTestSet: mockRemoveTestSet
        }
        return selector(state)
      }
      return mockTestSets
    })
    
    render(<TestSetList loading={false} />)
    
    const deleteButtons = screen.getAllByRole('button').filter(btn => btn.querySelector('svg'))
    expect(deleteButtons).toHaveLength(2)
  })

  it('opens confirmation dialog when delete button is clicked', async () => {
    const mockTestSets = [
      {
        id: '1',
        name: 'Test Set to Delete',
        createdBy: 'user1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    
    mockUseTestSetStore.mockImplementation((selector: any) => {
      if (typeof selector === 'function') {
        const state = {
          testSets: mockTestSets,
          removeTestSet: mockRemoveTestSet
        }
        return selector(state)
      }
      return mockTestSets
    })
    
    render(<TestSetList loading={false} />)
    
    const deleteButton = screen.getAllByRole('button').find(btn => btn.querySelector('svg'))
    fireEvent.click(deleteButton!)
    
    await waitFor(() => {
      expect(screen.getByText('Delete Test Set')).toBeInTheDocument()
      expect(screen.getByText('Are you sure you want to delete "Test Set to Delete"? This action cannot be undone.')).toBeInTheDocument()
    })
  })

  it('successfully deletes unused test set', async () => {
    const mockTestSets = [
      {
        id: '1',
        name: 'Test Set to Delete',
        createdBy: 'user1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    
    mockUseTestSetStore.mockImplementation((selector: any) => {
      if (typeof selector === 'function') {
        const state = {
          testSets: mockTestSets,
          removeTestSet: mockRemoveTestSet
        }
        return selector(state)
      }
      return mockTestSets
    })
    
    mockDeleteTestSet.mockResolvedValue({ success: true })
    
    render(<TestSetList loading={false} />)
    
    const deleteButton = screen.getAllByRole('button').find(btn => btn.querySelector('svg'))
    fireEvent.click(deleteButton!)
    
    await waitFor(() => {
      expect(screen.getByText('Delete Test Set')).toBeInTheDocument()
    })
    
    const confirmButton = screen.getByText('Delete')
    fireEvent.click(confirmButton)
    
    await waitFor(() => {
      expect(mockDeleteTestSet).toHaveBeenCalledWith('1')
      expect(mockRemoveTestSet).toHaveBeenCalledWith('1')
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'Test set deleted successfully'
      })
    })
  })

  it('prevents deletion of test set in use', async () => {
    const mockTestSets = [
      {
        id: '1',
        name: 'Test Set in Use',
        createdBy: 'user1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    
    mockUseTestSetStore.mockImplementation((selector: any) => {
      if (typeof selector === 'function') {
        const state = {
          testSets: mockTestSets,
          removeTestSet: mockRemoveTestSet
        }
        return selector(state)
      }
      return mockTestSets
    })
    
    mockDeleteTestSet.mockResolvedValue({
      success: false,
      error: 'This Test Set cannot be deleted because it is used by 3 evaluations.',
      usageCount: 3
    })
    
    render(<TestSetList loading={false} />)
    
    const deleteButton = screen.getAllByRole('button').find(btn => btn.querySelector('svg'))
    fireEvent.click(deleteButton!)
    
    await waitFor(() => {
      expect(screen.getByText('Delete Test Set')).toBeInTheDocument()
    })
    
    const confirmButton = screen.getByText('Delete')
    fireEvent.click(confirmButton)
    
    await waitFor(() => {
      expect(mockDeleteTestSet).toHaveBeenCalledWith('1')
      expect(mockRemoveTestSet).not.toHaveBeenCalled()
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'This Test Set cannot be deleted because it is used by 3 evaluations.',
        variant: 'destructive'
      })
    })
  })

  it('handles deletion errors gracefully', async () => {
    const mockTestSets = [
      {
        id: '1',
        name: 'Test Set',
        createdBy: 'user1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    
    mockUseTestSetStore.mockImplementation((selector: any) => {
      if (typeof selector === 'function') {
        const state = {
          testSets: mockTestSets,
          removeTestSet: mockRemoveTestSet
        }
        return selector(state)
      }
      return mockTestSets
    })
    
    mockDeleteTestSet.mockRejectedValue(new Error('Network error'))
    
    render(<TestSetList loading={false} />)
    
    const deleteButton = screen.getAllByRole('button').find(btn => btn.querySelector('svg'))
    fireEvent.click(deleteButton!)
    
    await waitFor(() => {
      expect(screen.getByText('Delete Test Set')).toBeInTheDocument()
    })
    
    const confirmButton = screen.getByText('Delete')
    fireEvent.click(confirmButton)
    
    await waitFor(() => {
      expect(mockDeleteTestSet).toHaveBeenCalledWith('1')
      expect(mockRemoveTestSet).not.toHaveBeenCalled()
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Failed to delete test set',
        variant: 'destructive'
      })
    })
  })
})