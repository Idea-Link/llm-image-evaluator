# 6. Epic 1: Project Foundation & Secure Access

**Epic Goal**: The objective of this epic is to establish a secure, deployable, full-stack application skeleton. By the end of this epic, we will have a configured monorepo, a connected database, and a live web application protected by single admin user authentication with a basic layout, ready for core feature development in subsequent epics.

---

##  Epic 1: Project Foundation & Secure Access (Revised)

**Epic Goal**: The objective of this epic is to establish a secure, deployable, full-stack application skeleton based on our hybrid architecture. By the end of this epic, we will have a configured monorepo, a Next.js application, a local Supabase environment with an applied database schema including admin user setup, a placeholder AWS Lambda package, and a live web application with single admin user authentication.

---

## **Story 1.1: Monorepo & Service Scaffolding (Revised)**

**As a** developer, **I want** a configured monorepo with the Next.js app, local Supabase setup, and a placeholder AWS Lambda package, **so that** I have the complete foundational structure for the project.

**Acceptance Criteria**

1. A monorepo is initialized using Turborepo.
    
2. A basic Next.js application is created in the `apps/web` directory.
    
3. A placeholder AWS Lambda package is created in the `apps/api-lambda` directory.
    
4. A `supabase` package is created and initialized using the Supabase CLI, creating the `packages/supabase/migrations` directory.
    
5. Shared `config` and `shared` (for TypeScript types) packages are created.
    
6. The root `pnpm dev` command successfully starts the Next.js application.
    

---

## **Story 1.2: Database Schema Migration (Revised)**

**As a** developer, **I want** to create and apply the initial database schema using Supabase migrations, **so that** the database tables are ready for the application logic.

**Acceptance Criteria**

1. The local Supabase environment is running via Docker (`supabase start`).
    
2. A new SQL migration file is created in `packages/supabase/migrations`.
    
3. This file contains the complete SQL DDL for the `test_sets`, `ground_truth_categories`, `evaluations`, and `evaluation_results` tables as defined in the architecture document.
    
4. The `supabase db reset` command successfully applies the migration to the local database, creating all the tables.
    

---

## Story 1.3: Single Admin User Authentication

**As a** project administrator, **I want** the entire Next.js application to be protected by a single admin user account, **so that** the internal tool is not publicly accessible and leverages Supabase Auth's security features.

**Acceptance Criteria**

1. Accessing any page of the application redirects to a login page if the user is not authenticated.
    
2. The login page displays email and password fields (email can be pre-filled with admin email).
    
3. Correct admin credentials (stored as environment variables) authenticate via Supabase Auth and establish a secure session.
    
4. Incorrect credentials deny access and show an appropriate error message.
    
5. Once authenticated, the admin can navigate between pages without being prompted for credentials again.
    
6. A logout option is available to end the session.
    
7. The admin user is created during database initialization using the configured environment variables.
    

---

## Story 1.4: Basic Application Layout

**As a** logged-in user, **I want** to see a basic application layout with a header and a placeholder content area, **so that** the application has a consistent and professional structure for all subsequent screens.

**Acceptance Criteria**

1. After successfully logging in, the user is redirected to a main dashboard or home page.
    
2. The page displays a persistent header component.
    
3. The header displays the application's title (e.g., "Prompt Evaluation Platform").
    
4. The main content area below the header displays a simple "Welcome" message.
    
5. The Shadcn UI library is installed and initialized in the Next.js application, ready for use.