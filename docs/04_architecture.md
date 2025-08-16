# AI Prompt Evaluation Platform Fullstack Architecture Document
### 1. Introduction

This document outlines the complete fullstack architecture for the AI Prompt Evaluation Platform, including backend systems, frontend implementation, and their integration. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack.

#### Starter Template or Existing Project

- N/A - Greenfield project.

### 2. High-Level Architecture

#### Technical Summary

The system will employ a hybrid, best-of-breed cloud architecture optimized for developer experience and cost-effectiveness. The frontend will be a Next.js application hosted on **Vercel** for optimal performance. It will communicate with backend services deployed as serverless functions. Core, stateless API logic (e.g., managing Test Sets) will be deployed to **Supabase Edge Functions**, keeping it close to the database. The intensive, long-running batch evaluation job will be handled by a dedicated **AWS Lambda** function to ensure reliable, long-running execution. Data will be persisted in a **Supabase-managed PostgreSQL** database.

#### Platform and Infrastructure Choice

- **Platform**: Hybrid (Vercel, Supabase, AWS)
    
- **Key Services**:
    
    - Vercel: Frontend Hosting, CDN, simple serverless functions.
        
    - Supabase: Managed PostgreSQL Database, Auth, simple Edge Functions for CRUD operations.
        
    - AWS: A specialized Lambda function for long-running, asynchronous batch processing.
        

#### Repository Structure

- **Structure**: Monorepo. This will contain the Next.js frontend, the Supabase Edge Functions, any shared code, and the AWS Lambda function code, simplifying development and context for AI agents.
    

#### High Level Architecture Diagram

Code snippet

```
graph TD
    User[Prompt Engineer] -->|Browser| Vercel[Next.js Frontend on Vercel CDN];
    
    subgraph "Backend & Data Layer"
        Vercel -->|Simple API Calls (e.g., GET /test-sets)| Supabase[Supabase Edge Functions];
        Vercel -->|Triggers Batch Job| Supabase_Trigger[API Endpoint on Supabase];
        Supabase -->|CRUD Operations| SupabaseDB[(Supabase PostgreSQL)];
        Supabase_Trigger -->|Invokes| AWS_Lambda[Batch Processing Job on AWS Lambda];
        AWS_Lambda -->|Writes Results| SupabaseDB;
    end

    AWS_Lambda -->|External API Calls| LLMs[External LLMs via OpenRouter];
```

#### Architectural Patterns

- **Jamstack**: The core architecture of a decoupled frontend (Vercel) communicating with APIs (Supabase/AWS) fits the Jamstack model, which prioritizes performance and security.
    
- **Serverless Functions**: We will leverage serverless for all backend logic, using the appropriate provider (Supabase vs. AWS) based on the task's specific requirements (especially execution time).
    
- **Hybrid Cloud**: We are intentionally selecting the best-in-class service for each job from different cloud providers to optimize for our specific needs.

### 3. Tech Stack

#### Technology Stack Table

|Category|Technology|Version|Purpose|Rationale|
|---|---|---|---|---|
|**Frontend Language**|TypeScript|`~5.5`|Main language for frontend code|Provides type safety and better tooling for large applications.|
|**Frontend Framework**|Next.js|`~15.x`|Primary framework for the user interface|Best-in-class React framework with optimal performance and DX.|
|**UI Component Lib**|Shadcn UI|`Latest`|Building blocks for the user interface|Unstyled, accessible components that are easy to customize.|
|**CSS Framework**|Tailwind CSS|`~3.4`|Styling the application|Utility-first CSS framework that works seamlessly with Shadcn.|
|**Backend Language**|TypeScript|`~5.5`|Main language for all backend logic|Consistent language across the stack simplifies development.|
|**Backend Runtimes**|Deno & Node.js|`Latest` & `~20.x`|Server-side JavaScript environments|Deno is used by Supabase Edge Functions; Node.js is used by AWS Lambda.|
|**API Style**|RESTful|`N/A`|API communication standard|Well-understood, stateless, and simple to implement for our needs.|
|**Database**|PostgreSQL|`16.x`|Primary data store|Powerful, reliable, and feature-rich open-source relational database.|
|**DB Provider**|Supabase|`Latest`|Managed PostgreSQL and backend services|Excellent DX, auth, and a generous free tier for our MVP.|
|**Authentication**|Supabase Auth|`Latest`|User authentication and access control|Tightly integrated with the database for robust security (like RLS).|
|**Frontend Testing**|Vitest & RTL|`Latest`|Unit and integration testing for UI|Modern, fast testing framework for Vite/Next.js environments.|
|**Backend Testing**|Vitest|`Latest`|Unit testing for backend functions|Provides a consistent testing experience with the frontend.|
|**E2E Testing**|Playwright|`Latest`|End-to-end testing of user flows|Powerful and reliable for testing the application in a real browser.|
|**CI/CD**|Vercel & GitHub Actions|`Latest`|Automated builds and deployments|Vercel for Frontend/Supabase Functions; GitHub Actions for AWS Lambda.|
|**IaC Tool**|AWS CDK|`~2.x`|Defining the AWS Lambda infrastructure|Allows us to define our AWS infrastructure using TypeScript.|
|**Monitoring**|Vercel Analytics, CloudWatch|`N/A`|Observing application health|Leverage the built-in tools of our chosen platforms for simplicity.|

### 4. Data Models (Final Version)

#### 1. TestSet

- **Purpose**: Represents a reusable collection of ground truth criteria for evaluating prompts.
    
- **Key Attributes**:
    
    - `id`: (UUID) - Unique identifier.
        
    - `name`: (Text) - The user-defined name for the Test Set.
        
    - `description`: (Text) - An optional description.
        
    - `json_extraction_key`: (Text, Nullable) - The key to find the result in a JSON output (e.g., "outcome"). If null, a direct string match is performed.
        
- **TypeScript Interface**:
    
    TypeScript
    
    ```
    export interface TestSet {
      id: string;
      name: string;
      description?: string;
      json_extraction_key?: string;
      categories?: GroundTruthCategory[];
    }
    ```
    

---

#### 2. GroundTruthCategory

- **Purpose**: Represents a single category definition within a Test Set.
    
- **Key Attributes**:
    
    - `id`: (UUID) - Unique identifier.
        
    - `test_set_id`: (Foreign Key) - Links to the parent `TestSet`.
        
    - `name`: (Text) - The name of the category (e.g., "A++").
        
    - `description`: (Text) - The definition of what this category means.
        
- **TypeScript Interface**:
    
    TypeScript
    
    ```
    export interface GroundTruthCategory {
      id: string;
      test_set_id: string;
      name: string;
      description: string;
    }
    ```
    

---

#### 3. Evaluation

- **Purpose**: Represents a specific execution run of a prompt against a Test Set.
    
- **Key Attributes**:
    
    - `id`: (UUID) - Unique identifier.
        
    - `name`: (Text) - A user-defined name for this specific run.
        
    - `status`: (Enum: `queued`, `in_progress`, `completed`, `failed`) - The current state of the job.
        
    - `system_prompt`: (Text/JSON) - The full prompt that was tested.
        
    - `model_used`: (Text) - The name of the AI model used.
        
    - `test_set_id`: (Foreign Key) - The Test Set used.
        
    - `accuracy_score`: (Number) - The final calculated score.
        
- **TypeScript Interface**:
    
    TypeScript
    
    ```
    export interface Evaluation {
      id: string;
      name: string;
      status: 'queued' | 'in_progress' | 'completed' | 'failed';
      system_prompt: string;
      model_used: string;
      test_set_id: string;
      accuracy_score?: number;
    }
    ```
    

---

#### 4. EvaluationResult

- **Purpose**: Stores the outcome of a single test case within an Evaluation run.
    
- **Key Attributes**:
    
    - `id`: (UUID) - Unique identifier.
        
    - `evaluation_id`: (Foreign Key) - Links to the parent `Evaluation`.
        
    - `input_data`: (Text) - The URL to the input image stored in Supabase Storage.
        
    - `ground_truth_category`: (Text) - The expected category name.
        
    - `llm_output`: (Text) - The full, raw output from the language model.
        
    - `is_match`: (Boolean) - Whether the output matched the ground truth.
        
- **TypeScript Interface**:
    
    TypeScript
    
    ```
    export interface EvaluationResult {
      id: string;
      evaluation_id: string;
      input_data: string; // URL to image in Supabase Storage
      ground_truth_category: string;
      llm_output: string;
      is_match: boolean;
    }
    ```

### 5. API Specification

YAML

```
openapi: 3.0.1
info:
  title: AI Prompt Evaluation Platform API
  version: 1.0.0
  description: API for managing and running prompt evaluations.
servers:
  - url: 'https://{project_ref}.supabase.co/functions/v1'
    description: Supabase Edge Functions

paths:
  /test-sets:
    get:
      summary: List all Test Sets
      responses:
        '200':
          description: A list of Test Sets.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/TestSet'
    post:
      summary: Create a new Test Set
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateTestSetPayload'
      responses:
        '201':
          description: Test Set created successfully.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TestSet'

  /test-sets/{id}:
    get:
      summary: Get a single Test Set by ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: A single Test Set.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TestSet'
    put:
      summary: Update a Test Set
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateTestSetPayload'
      responses:
        '200':
          description: Test Set updated successfully.
    delete:
      summary: Delete a Test Set
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '204':
          description: Test Set deleted successfully.

  /evaluations:
    get:
      summary: List all Evaluations
      responses:
        '200':
          description: A list of Evaluations.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Evaluation'
    post:
      summary: Create and trigger a new Evaluation
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateEvaluationPayload'
      responses:
        '202':
          description: Evaluation accepted and job queued.

  /evaluations/{id}:
    get:
      summary: Get a single Evaluation with its results
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: A single Evaluation with results.
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/Evaluation'
                  - type: object
                    properties:
                      results:
                        type: array
                        items:
                          $ref: '#/components/schemas/EvaluationResult'

components:
  schemas:
    TestSet:
      type: object
      properties:
        id: { type: string, format: uuid }
        name: { type: string }
        description: { type: string }
        json_extraction_key: { type: string }
        # categories would be a sub-resource or included in a detailed view
    CreateTestSetPayload:
      type: object
      properties:
        name: { type: string }
        description: { type: string }
        json_extraction_key: { type: string }
        categories:
          type: array
          items:
            type: object
            properties:
              name: { type: string }
              description: { type: string }
    Evaluation:
      type: object
      properties:
        id: { type: string, format: uuid }
        name: { type: string }
        status: { type: string, enum: [queued, in_progress, completed, failed] }
        accuracy_score: { type: number, format: float }
        # Other fields from data model
    CreateEvaluationPayload:
      type: object
      properties:
        name: { type: string }
        test_set_id: { type: string, format: uuid }
        system_prompt: { type: string }
        model_used: { type: string }
    EvaluationResult:
      type: object
      properties:
        id: { type: string, format: uuid }
        input_data: { type: string, description: "URL to image in Supabase Storage" }
        ground_truth_category: { type: string }
        llm_output: { type: string }
        is_match: { type: boolean }
```

### 6. Components

#### Component List

1. **Frontend Web Application**
    
    - **Responsibility**: Provides the entire user interface for the platform. Renders all screens (dashboard, setup, results), manages client-side state, handles user interactions, and communicates with the backend services.
        
    - **Technology**: Next.js, React, Shadcn UI, Tailwind CSS. Hosted on Vercel.
        
2. **Synchronous API**
    
    - **Responsibility**: Handles all real-time, fast-executing API requests. This primarily includes the CRUD (Create, Read, Update, Delete) operations for Test Sets and Evaluations. It also triggers the Asynchronous Job Processor.
        
    - **Technology**: Supabase Edge Functions (Deno runtime).
        
3. **Asynchronous Job Processor**
    
    - **Responsibility**: Executes the long-running batch evaluation jobs. This component is designed to run independently of the user's session, iterating through test cases, calling external LLMs, and processing results.
        
    - **Technology**: AWS Lambda (Node.js runtime) with a 15-minute execution timeout.
        
4. **Authentication Service**
    
    - **Responsibility**: Manages user identity, login via the single site-wide password, and session management. It will be the foundation for future role-based access and multi-tenancy.
        
    - **Technology**: Supabase Auth.
        
5. **Database**
    
    - **Responsibility**: Provides persistent storage for all structured application data, including Test Sets, Evaluations, and Results, in a relational format. It is the single source of truth for all application data.
        
    - **Technology**: Supabase PostgreSQL.
        
6. **File Storage**
    
    - **Responsibility**: Handles the secure upload, storage, and retrieval of all binary files, specifically the images used in system prompts and test inputs.
        
    - **Technology**: Supabase Storage.
        

#### Component Interaction Diagram

Here is a diagram showing how these components interact:

Code snippet

```
graph TD
    User --> FE[Frontend Web Application];

    subgraph "Backend Platform"
        FE --> |Synchronous CRUD API| API[Synchronous API];
        API --> |Triggers Job| JOB[Asynchronous Job Processor];
        API --> |Reads/Writes Data| DB[(Database)];
        
        FE --> |Manages Session| AUTH[Authentication Service];
        FE --> |Uploads/Downloads Files| STORAGE[File Storage];
        
        JOB --> |Writes Results| DB;
        JOB --> |Calls LLM| EXT[External LLMs];
    end
```

### 7. Core Workflows

#### Workflow 1: Creating a New Test Set (Synchronous)

This diagram shows the simple, real-time flow when a user creates a new Test Set. The entire operation is synchronous, meaning the user gets an immediate confirmation.

Code snippet

```
sequenceDiagram
    participant User
    participant FE as Frontend Web App
    participant API as Synchronous API (Supabase)
    participant DB as Database (Supabase)

    User->>+FE: Fills out and submits 'New Test Set' form
    FE->>+API: POST /test-sets (with form data)
    API->>+DB: INSERT INTO test_sets and categories tables
    DB-->>-API: Returns new Test Set record
    API-->>-FE: 201 Created (with new Test Set data)
    FE-->>-User: Redirects to list, shows success message
```

---

#### Workflow 2: Running a New Evaluation (Asynchronous)

This diagram illustrates the more complex, asynchronous workflow for running a batch evaluation. Note the critical handoff between the fast, synchronous API and the slow, asynchronous job processor.

Code snippet

```
sequenceDiagram
    participant User
    participant FE as Frontend Web App
    participant API as Synchronous API (Supabase)
    participant JOB as Async Job Processor (AWS Lambda)
    participant DB as Database (Supabase)
    participant LLM as External LLM

    User->>+FE: Submits 'Run Evaluation' form
    FE->>+API: POST /evaluations (with config)
    API->>+DB: INSERT INTO evaluations table (status: 'queued')
    API->>JOB: Invoke Asynchronously (with evaluation_id)
    DB-->>-API: Returns new Evaluation record
    API-->>-FE: 202 Accepted (response to user)
    FE-->>-User: Redirects to dashboard, shows 'In Progress'

    Note right of JOB: Job begins processing...
    JOB->>+DB: UPDATE evaluations SET status='in_progress'
    loop For each test case in Test Set
        JOB->>+LLM: Call API with prompt and input data
        LLM-->>-JOB: Return LLM output
        JOB->>+DB: INSERT INTO evaluation_results
    end
    JOB->>+DB: Calculate score and UPDATE evaluations SET status='completed', score=...
    DB-->>-JOB: Acknowledge final update
```

### 8. Database Schema

SQL

```
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table for reusable Test Sets
CREATE TABLE public.test_sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    json_extraction_key TEXT
);
-- Add index for performance
CREATE INDEX ON public.test_sets (user_id);

-- Table for categories within a Test Set
CREATE TABLE public.ground_truth_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_set_id UUID REFERENCES public.test_sets(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL
);
-- Add index for performance
CREATE INDEX ON public.ground_truth_categories (test_set_id);

-- Table for individual evaluation runs
CREATE TABLE public.evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'in_progress', 'completed', 'failed')),
    system_prompt TEXT NOT NULL,
    model_used TEXT NOT NULL,
    test_set_id UUID REFERENCES public.test_sets(id) ON DELETE RESTRICT NOT NULL, -- Prevent deleting a Test Set if it's in use
    accuracy_score NUMERIC(5, 2)
);
-- Add indexes for performance
CREATE INDEX ON public.evaluations (user_id);
CREATE INDEX ON public.evaluations (test_set_id);

-- Table for the results of each item in an evaluation
CREATE TABLE public.evaluation_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evaluation_id UUID REFERENCES public.evaluations(id) ON DELETE CASCADE NOT NULL,
    input_data TEXT, -- URL to the image in Supabase Storage
    ground_truth_category TEXT NOT NULL,
    llm_output TEXT,
    is_match BOOLEAN NOT NULL
);
-- Add index for performance
CREATE INDEX ON public.evaluation_results (evaluation_id);

-- Example Row Level Security (RLS) Policies for Multi-Tenancy
-- These policies ensure users can only access their own data.
/*
-- Enable RLS on all tables
ALTER TABLE public.test_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can only see their own test sets" ON public.test_sets
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can only insert their own test sets" ON public.test_sets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Repeat for evaluations, categories, and results tables...
*/
```

### 9. Frontend Architecture

#### Component Architecture

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
    

#### State Management Architecture

- **State Management Library**: For the MVP's complexity, a large library like Redux is unnecessary. I recommend using **Zustand**. It is a lightweight, simple, and powerful state management solution that is very easy for both humans and AI agents to work with.
    
- **State Structure**: We will create separate "stores" for different domains of our application. For example:
    
    - `src/stores/useEvaluationStore.ts`: To manage the state for the list of evaluations.
        
    - `src/stores/useTestSetStore.ts`: To manage the state for Test Sets.
        
- **State Patterns**: State will be accessed in components via custom hooks (e.g., `const evaluations = useEvaluationStore(state => state.evaluations);`). This keeps state logic encapsulated and easy to test.

#### Routing Architecture

- **Framework**: We will use the standard **Next.js App Router**. Routes will be defined by folders within the `src/app/` directory. For example, the page for a specific evaluation result will be located at `src/app/evaluations/[id]/page.tsx`.
    
- **Protected Routes**: All routes, except for the login page, will be protected. This will be enforced using a single `src/middleware.ts` file that checks for a valid session cookie and redirects unauthenticated users to the login page.
    

#### Frontend Services Layer (API Integration)

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

### 10. Unified Project Structure

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


### 11. Development Workflow

#### Local Development Setup

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
    

#### Environment Configuration

- **Required Environment Variables**: The `.env` file in the root directory will contain the necessary secrets and configuration for local development. These keys will be provided by the Supabase CLI when it starts.
    
    Bash
    
    ```
    # .env.example
    
    # Supabase Local Development Keys (provided by `supabase start`)
    SUPABASE_URL="http://localhost:54321"
    SUPABASE_ANON_KEY="your-local-anon-key"
    SUPABASE_SERVICE_ROLE_KEY="your-local-service-role-key"
    
    # Application-specific variables
    SITE_PASSWORD="your-secret-password-for-mvp"
    ```

### 12. Deployment Architecture

#### Deployment Strategy

Our deployment is split based on the component's hosting platform, orchestrated from our Git repository.

- **Frontend (Next.js)**:
    
    - **Platform**: **Vercel**
        
    - **Process**: Vercel's native Git integration will be used. Every push to the `main` branch will automatically trigger a build and deploy the `web` application to production. Every pull request will receive its own unique preview deployment URL.
        
- **Backend (Supabase Edge Functions)**:
    
    - **Platform**: **Supabase**
        
    - **Process**: The Supabase Functions in the `packages/supabase/functions` directory will be deployed via a **GitHub Actions** workflow that uses the Supabase CLI.
        
- **Backend (AWS Lambda Job)**:
    
    - **Platform**: **AWS**
        
    - **Process**: The Lambda function in the `apps/api-lambda` directory will be deployed via a separate **GitHub Actions** workflow that uses the AWS CDK to provision the necessary infrastructure.
        

#### CI/CD Pipeline

The deployment will be managed via GitHub Actions. Here is a conceptual outline of the workflow file:

YAML

```
# .github/workflows/deploy.yml
name: Deploy Production

on:
  push:
    branches:
      - main

jobs:
  # Vercel handles its own deployment via its Git integration
  
  deploy-supabase-functions:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: supabase/cli/setup@v1
      - name: Deploy Supabase Edge Functions
        run: supabase functions deploy --project-ref $SUPABASE_PROJECT_REF
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          # ... other vars
          
  deploy-aws-lambda:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          # ... other secrets
      - name: Deploy AWS CDK Stack
        run: |
          cd packages/infra
          pnpm install
          pnpm cdk deploy --require-approval never
```

#### Environments

|Environment|Frontend URL|Backend URL|Purpose|
|---|---|---|---|
|**Development**|`http://localhost:3000`|Supabase Local|Local development and testing.|
|**Staging**|`[pr-name].vercel.app`|Staging Supabase Project|Automatic preview for every Pull Request.|
|**Production**|`[your-domain].com`|Production Supabase Project|Live application for users.|
### 13. Security and Performance

#### Security Requirements

Our security strategy relies on the robust, enterprise-grade features provided by our platforms (Vercel, Supabase, AWS).

- **Frontend Security**:
    
    - **XSS Prevention**: React's native JSX escaping will be used to prevent cross-site scripting attacks.
        
    - **Secure Storage**: Session tokens will be managed automatically by the `supabase-js` client library, using secure, `httpOnly` cookies.
        
- **Backend Security**:
    
    - **Input Validation**: All API inputs will be validated on the server-side within the Supabase Edge Function or AWS Lambda before being processed.
        
    - **Rate Limiting**: We will rely on Supabase's built-in DDoS protection. Function-specific rate limiting can be added if abuse is detected.
        
    - **CORS Policy**: The CORS policy for our Supabase functions will be configured to only allow requests from our production Vercel domain.
        
- **Authentication Security**:
    
    - **Session Management**: Handled entirely by Supabase Auth, which provides a secure, battle-tested system.
        
    - **Password Policy**: The single site-wide password for the MVP will be stored as a secure secret/environment variable, never in the code.
        

#### Performance Optimization

Our performance strategy focuses on leveraging the highly optimized nature of our chosen stack.

- **Frontend Performance**:
    
    - **Bundle Size**: We will monitor bundle sizes using Vercel Analytics to ensure they remain small.
        
    - **Loading Strategy**: We will utilize the Next.js App Router's automatic code-splitting on a per-page basis.
        
    - **Caching Strategy**: We will rely on **Vercel's Edge CDN** to automatically cache static assets and pages globally, ensuring fast load times for users anywhere.
        
- **Backend Performance**:
    
    - **Response Time Target**: Synchronous API calls from Supabase Edge Functions should respond in **< 200ms**.
        
    - **Database Optimization**: We will use the **indexes** defined in our database schema to ensure all queries are highly performant.
        
    - **Caching Strategy**: For the MVP, we will rely on database performance and Vercel's frontend caching. A dedicated server-side cache (like Redis) is considered out of scope.

### 14. Testing Strategy

#### Testing Pyramid

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

#### Test Organization

- **Frontend Tests (Next.js)**:
    
    - Tests will be co-located with the components they are testing. For example, a component at `src/components/ui/Button.tsx` will have its test at `src/components/ui/Button.test.tsx`.
        
    - We will use **Vitest** for the test runner and **React Testing Library** for rendering and interacting with components.
        
- **Backend Tests (Supabase & AWS Lambda)**:
    
    - Unit tests will be co-located with the functions they are testing, using **Vitest**. Dependencies like database clients will be mocked.
        
- **E2E Tests**:
    
    - While out of scope for the MVP, a dedicated `apps/web/tests-e2e` directory will be reserved for future **Playwright** tests.
        

#### Test Examples

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

### 15. Coding Standards

#### Critical Fullstack Rules

These rules are mandatory for all code written for this project.

1. **Shared Types**: All types shared between the frontend and backend (e.g., data models) **MUST** be defined in the `packages/shared` directory and imported from there. Do not duplicate types.
    
2. **API Service Layer**: Frontend components **MUST NOT** call the Supabase client directly. All API interactions **MUST** be encapsulated in a function within the `src/services` directory.
    
3. **Environment Variables**: Code **MUST NOT** access `process.env` directly outside of designated configuration files. Variables should be exposed through a typed configuration object.
    
4. **Structured Error Handling**: All API functions (Supabase and AWS Lambda) **MUST** include `try/catch` blocks and return a consistent error shape to the client.
    
5. **No Direct Database Access in API Logic**: Database queries **MUST** be handled within a dedicated data-access layer (e.g., repository pattern functions), not mixed directly with API route handler logic.
    

#### Naming Conventions

| Element          | Frontend Convention  | Backend Convention | Example                 |
| ---------------- | -------------------- | ------------------ | ----------------------- |
| **Components**   | PascalCase           | N/A                | `EvaluationResults.tsx` |
| **Hooks**        | camelCase (`use...`) | N/A                | `useAuth.ts`            |
| **API Files**    | N/A                  | kebab-case         | `get-all-users.ts`      |
| **DB Tables**    | N/A                  | snake_case         | `evaluation_results`    |
| **Shared Types** | PascalCase           | PascalCase         | `interface TestSet {}`  |

### 16. Error Handling Strategy

#### Error Response Format

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

#### Error Flow

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

#### Backend Error Handling

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

#### Frontend Error Handling

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

### 17. Monitoring and Observability

#### Monitoring Stack

Our monitoring strategy is based on leveraging the native capabilities of our chosen platforms.

- **Frontend Monitoring**: We will use **Vercel Analytics**. It is enabled by default and provides real-time data on Core Web Vitals, traffic sources, and overall site performance with zero configuration.
    
- **Backend Monitoring**:
    
    - **Supabase**: We will use the built-in logs viewer in the Supabase dashboard to monitor our Edge Function invocations, execution times, and errors.
        
    - **AWS**: We will use **Amazon CloudWatch** for our Lambda function. It automatically captures logs, invocation counts, error rates, and execution duration. We will set up a basic CloudWatch Alarm for a high error rate.
        
- **Error Tracking**: For proactive client-side error tracking, I recommend integrating **Sentry** on its free tier. It will capture and report any JavaScript errors that occur in a user's browser, giving us visibility into issues we might otherwise miss.
    
- **Performance Monitoring**: Vercel Analytics and AWS CloudWatch will provide our primary performance metrics for the frontend and backend, respectively.
    

#### Key Metrics

For the MVP, we will focus on monitoring a few key health indicators:

- **Frontend Metrics**:
    
    - Core Web Vitals (LCP, FID, CLS)
        
    - Client-side JavaScript Error Rate
        
    - API Response Times (as measured from the client)
        
- **Backend Metrics**:
    
    - Function Invocation Count (Supabase & AWS)
        
    - Function Error Rate (Supabase & AWS)
        
    - Function Duration, especially for the AWS Lambda to ensure it stays well below the 15-minute timeout.

