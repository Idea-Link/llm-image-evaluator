# 11. Development Workflow

## Local Development Setup

- **Prerequisites**: Before starting, the following tools must be installed on the developer's machine:
    
    - **Node.js** (v20.x or later)
        
    - **pnpm** (for managing the monorepo workspaces)
        
    - **Docker** (for running Supabase locally)
        
    - **Supabase CLI**
        
- **Initial Setup**: After cloning the repository for the first time, run these commands from the root directory:
    
    Bash
    
    ```
    # 1. Install all dependencies for all packages
    pnpm install
    
    # 2. Copy the example environment file
    cp .env.example .env
    
    # 3. Start the local Supabase services (Postgres, Auth, Storage)
    supabase start
    ```
    
- **Development Commands**:
    
    Bash
    
    ```
    # Start all applications (frontend, backend functions) concurrently
    pnpm dev
    
    # Run tests for all packages
    pnpm test
    ```
    

## Environment Configuration

- **Required Environment Variables**: The `.env` file in the root directory will contain the necessary secrets and configuration for local development. These keys will be provided by the Supabase CLI when it starts.
    
    Bash
    
    ```
    # .env.example
    
    # Supabase Local Development Keys (provided by `supabase start`)
    SUPABASE_URL="http://localhost:54321"
    SUPABASE_ANON_KEY="your-local-anon-key"
    SUPABASE_SERVICE_ROLE_KEY="your-local-service-role-key"
    
    # Application-specific variables
    ADMIN_EMAIL="admin@system.local"
    ADMIN_PASSWORD="your-secure-admin-password"
    ```