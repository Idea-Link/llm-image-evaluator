# 9. Frontend Architecture

## Component Architecture

- **Component Organization**: We will use a feature-based folder structure.
    
    - **`src/components/ui/`**: This directory will hold core, reusable, generic components built with Shadcn, such as a customized `Button.tsx` or `Card.tsx`.
        
    - **`src/components/features/`**: This directory will contain components that are specific to a feature. For example, `src/components/features/evaluations/EvaluationList.tsx`.
        
    - This approach keeps our shared UI library clean while co-locating feature-specific logic.
        
- **Component Template**: All new components should follow this basic structure for consistency.
    
    TypeScript
    
    ```
    import * as React from 'react';
    
    interface MyComponentProps {
      // Props definition here
      title: string;
    }
    
    export function MyComponent({ title }: MyComponentProps) {
      return (
        <div>
          <h1>{title}</h1>
          {/* JSX content here */}
        </div>
      );
    }
    ```
    

## State Management Architecture

- **State Management Library**: For the MVP's complexity, a large library like Redux is unnecessary. I recommend using **Zustand**. It is a lightweight, simple, and powerful state management solution that is very easy for both humans and AI agents to work with.
    
- **State Structure**: We will create separate "stores" for different domains of our application. For example:
    
    - `src/stores/useEvaluationStore.ts`: To manage the state for the list of evaluations.
        
    - `src/stores/useTestSetStore.ts`: To manage the state for Test Sets.
        
- **State Patterns**: State will be accessed in components via custom hooks (e.g., `const evaluations = useEvaluationStore(state => state.evaluations);`). This keeps state logic encapsulated and easy to test.

## Routing Architecture

- **Framework**: We will use the standard **Next.js App Router**. Routes will be defined by folders within the `src/app/` directory. For example, the page for a specific evaluation result will be located at `src/app/evaluations/[id]/page.tsx`.
    
- **Protected Routes**: All routes, except for the login page, will be protected. This will be enforced using a single `src/middleware.ts` file that checks for a valid Supabase Auth session and redirects unauthenticated users to the login page. The middleware validates against the single admin user session.
    

## Frontend Services Layer (API Integration)

- **API Client**: We will use the official **`supabase-js`** client library for all communication with our backend. This library simplifies data fetching and authentication with our Supabase services.
    
- **Service Pattern**: We will create a dedicated service layer to encapsulate all API calls. This keeps our components clean and centralizes data-fetching logic. Here is an example pattern:
    
    TypeScript
    
    ```
    // src/services/testSetService.ts
    import { createClient } from '@/utils/supabase/client'; // Supabase client instance
    
    export async function getTestSets() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('test_sets')
        .select('*');
    
      if (error) {
        console.error('Error fetching test sets:', error);
        // Handle error appropriately in the UI
        return []; 
      }
      return data;
    }
    ```