# 14. Testing Strategy

## Testing Pyramid

Our strategy will focus on a strong base of fast, reliable unit tests, supported by a layer of integration tests to verify that components work together. End-to-end (E2E) tests are considered out of scope for the MVP but the architecture will support their future addition.

Plaintext

```
      /      \
     /  E2E   \   <-- Future Scope
    /----------\
   / Integration\  <-- MVP Focus
  /--------------\
 /      Unit     \ <-- MVP Focus
--------------------
```

## Test Organization

- **Frontend Tests (Next.js)**:
    
    - Tests will be co-located with the components they are testing. For example, a component at `src/components/ui/Button.tsx` will have its test at `src/components/ui/Button.test.tsx`.
        
    - We will use **Vitest** for the test runner and **React Testing Library** for rendering and interacting with components.
        
- **Backend Tests (Supabase & AWS Lambda)**:
    
    - Unit tests will be co-located with the functions they are testing, using **Vitest**. Dependencies like database clients will be mocked.
        
- **E2E Tests**:
    
    - While out of scope for the MVP, a dedicated `apps/web/tests-e2e` directory will be reserved for future **Playwright** tests.
        

## Test Examples

- **Frontend Component Test Example (`Button.test.tsx`)**:
    
    TypeScript
    
    ```
    import { render, screen } from '@testing-library/react';
    import { Button } from './Button';
    import { expect, test, vi } from 'vitest';
    
    test('Button renders and is clickable', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);
    
      const buttonElement = screen.getByText(/Click Me/i);
      expect(buttonElement).toBeInTheDocument();
    
      buttonElement.click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
    ```
    
- **Backend API Test Example (`get-test-sets.test.ts`)**:
    
    TypeScript
    
    ```
    import { expect, test, vi } from 'vitest';
    // Assume getTestSets is the function inside our Edge Function
    
    // Mock the Supabase client
    const mockSupabaseClient = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue({ data: [{ id: '123', name: 'Test Set' }], error: null }),
    };
    
    test('getTestSets function returns data correctly', async () => {
      // Inject the mock client
      const result = await getTestSets(mockSupabaseClient);
    
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('test_sets');
      expect(mockSupabaseClient.select).toHaveBeenCalledWith('*');
      expect(result).toEqual([{ id: '123', name: 'Test Set' }]);
    });
    ```