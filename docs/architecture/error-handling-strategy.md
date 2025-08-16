# 16. Error Handling Strategy

## Error Response Format

All backend APIs (Supabase and AWS Lambda) that result in an error **MUST** return a JSON object with the following structure and the appropriate HTTP status code (e.g., 400, 401, 500).

TypeScript

```
// src/packages/shared/src/index.ts
export interface ApiError {
  error: {
    code: string; // e.g., 'validation_error', 'internal_server_error'
    message: string; // A user-friendly message
    timestamp: string;
    requestId?: string; // For tracing
  };
}
```

## Error Flow

This diagram shows how a typical error is handled between the client and the server.

Code snippet

```
sequenceDiagram
    participant User
    participant FE as Frontend Web App
    participant API as Backend API

    User->>FE: Performs an action (e.g., saves a form)
    FE->>+API: Sends API request
    API-->>-API: Error occurs during processing (e.g., validation fails)
    API-->>-FE: Returns HTTP 4xx/5xx with standard ApiError JSON payload
    FE->>FE: Catches error in service layer
    FE-->>User: Displays a user-friendly message (e.g., a toast notification)
```

## Backend Error Handling

Backend functions must use `try/catch` blocks to catch errors and return the standardized error response.

TypeScript

```
// Example in a Supabase Edge Function
try {
  // ... business logic ...
} catch (error) {
  // Log the full error internally for debugging
  console.error(error); 
  
  // Return the standardized error object to the client
  return new Response(
    JSON.stringify({
      error: {
        code: 'internal_server_error',
        message: 'An unexpected error occurred. Please try again.',
        timestamp: new Date().toISOString(),
      }
    }),
    { status: 500, headers: { 'Content-Type': 'application/json' } }
  )
}
```

## Frontend Error Handling

The frontend service layer will be responsible for catching API errors and propagating them in a way the UI can handle, for example, by showing a toast notification.

TypeScript

```
// src/services/testSetService.ts
import { toast } from 'sonner'; // Shadcn's toast component

export async function createTestSet(payload: any) {
  const { data, error } = await supabase.from('test_sets').insert(payload).select();

  if (error) {
    console.error('API Error:', error);
    // Display a user-friendly message
    toast.error('Failed to create Test Set. Please try again.');
    // Propagate the error for the component to handle if needed
    throw new Error('Failed to create Test Set');
  }
  return data;
}
```