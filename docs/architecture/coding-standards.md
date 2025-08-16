# 15. Coding Standards

## Critical Fullstack Rules

These rules are mandatory for all code written for this project.

1. **Shared Types**: All types shared between the frontend and backend (e.g., data models) **MUST** be defined in the `packages/shared` directory and imported from there. Do not duplicate types.
    
2. **API Service Layer**: Frontend components **MUST NOT** call the Supabase client directly. All API interactions **MUST** be encapsulated in a function within the `src/services` directory.
    
3. **Environment Variables**: Code **MUST NOT** access `process.env` directly outside of designated configuration files. Variables should be exposed through a typed configuration object.
    
4. **Structured Error Handling**: All API functions (Supabase and AWS Lambda) **MUST** include `try/catch` blocks and return a consistent error shape to the client.
    
5. **No Direct Database Access in API Logic**: Database queries **MUST** be handled within a dedicated data-access layer (e.g., repository pattern functions), not mixed directly with API route handler logic.
    

## Naming Conventions

| Element          | Frontend Convention  | Backend Convention | Example                 |
| ---------------- | -------------------- | ------------------ | ----------------------- |
| **Components**   | PascalCase           | N/A                | `EvaluationResults.tsx` |
| **Hooks**        | camelCase (`use...`) | N/A                | `useAuth.ts`            |
| **API Files**    | N/A                  | kebab-case         | `get-all-users.ts`      |
| **DB Tables**    | N/A                  | snake_case         | `evaluation_results`    |
| **Shared Types** | PascalCase           | PascalCase         | `interface TestSet {}`  |