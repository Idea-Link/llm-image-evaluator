# 10. Unified Project Structure

Plaintext

```
/evaluation-platform/
|
|-- /apps/
|   |-- /web/                   # The Next.js frontend application
|   |   |-- /src/app/           # App Router pages and layouts
|   |   |-- /src/components/    # React components (UI and feature-specific)
|   |   |-- /src/services/      # API client functions
|   |   |-- /src/stores/        # Zustand state management stores
|   |   |-- next.config.mjs
|   |   `-- package.json
|   |
|   `-- /api-lambda/            # The AWS Lambda for batch processing (Node.js)
|       |-- /src/
|       |   `-- index.ts        # Lambda handler
|       `-- package.json
|
|-- /packages/
|   |-- /config/                # Shared ESLint, Prettier, TypeScript configs
|   |   |-- eslint-preset.js
|   |   `-- tsconfig.json
|   |
|   |-- /infra/                 # AWS CDK infrastructure-as-code for the Lambda
|   |   |-- /lib/
|   |   |   `-- lambda-stack.ts
|   |   `-- package.json
|   |
|   |-- /shared/                # Shared TypeScript types and utilities
|   |   |-- /src/
|   |   |   `-- index.ts        # Exporting our data model interfaces
|   |   `-- package.json
|   |
|   `-- /supabase/              # Supabase-specific code
|       |-- /functions/         # Supabase Edge Functions (Deno)
|       |   `-- /api/           # CRUD API endpoints
|       |       `-- index.ts
|       |
|       `-- /migrations/        # Database schema migrations
|           `-- 20250720_initial_schema.sql
|
|-- package.json                # Root package.json
`-- turbo.json                  # Turborepo configuration
```