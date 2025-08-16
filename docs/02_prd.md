# AI Prompt Evaluation Platform Product Requirements Document (PRD)
### 1. Goals and Background Context

#### Goals

- To establish a new internal capability for validating AI prompts in bulk.
    
- To transition the Prompt Engineer's workflow from a manual, spreadsheet-based process to an automated, efficient platform.
    
- To systematically improve the quality, accuracy, and consistency of AI-powered solutions delivered to clients.
    
- To provide clear observability into prompt performance, including accuracy scores and associated costs.
    

#### Background Context

The current process for prompt engineering is a manual, slow, and unscalable bottleneck. Each prompt variation must be tested individually, with results tracked manually, making rapid iteration and quality control extremely difficult. This platform aims to solve this by providing a dedicated, data-driven solution for running prompt evaluations at scale, enabling our teams to build higher-quality AI products more efficiently.

### 2. Requirements

#### Functional

1. **FR1**: The system shall allow a user to create, view, and manage a list of evaluations.
    
2. **FR2**: Within an evaluation, the system shall allow a user to define a system prompt, which may contain text and/or images.
    
3. **FR3**: The system shall allow a user to select a target AI model for an evaluation, with initial support for OpenRouter.
    
4. **FR4**: The system shall allow a user to define a "ground truth" for an input by providing a list of acceptable text-based categories.
    
5. **FR5**: The evaluation engine must parse the LLM's output to determine if it matches one of the predefined categories, even if the category is nested within a JSON object.
    
6. **FR6**: The system shall allow a user to trigger a batch execution of an evaluation.
    
7. **FR7**: After a batch run, the system shall display a results summary page showing an aggregate accuracy score.
    
8. **FR8**: The results summary page shall allow the user to inspect each individual output from the batch run.

9. **FR9**: The system shall allow users to create, save, and manage reusable **Test Sets**. A Test Set contains the input data and the corresponding categorical ground truth definitions.

10. **FR10**: When creating a new evaluation, a user shall be able to select a pre-existing Test Set instead of defining a new one from scratch.

#### Non-Functional

1. **NFR1**: The monthly hosting and infrastructure costs on AWS must be architected to remain under $50 for the MVP's expected usage.
    
2. **NFR2**: The frontend shall be built using React with the Next.js framework (version 14 or newer).

3. **NFR3**: The backend logic shall be implemented using a hybrid serverless approach: **Supabase Edge Functions** (Deno/TypeScript) for synchronous API routes and **AWS Lambda** (Node.js/TypeScript) for long-running asynchronous jobs.
    
4. **NFR4**: The database shall be PostgreSQL.
    
5. **NFR5**: If a third-party API fails during a batch run, the system must fail gracefully, halt the process for that specific item, and log the error without crashing the entire batch.
    
6. **NFR6**: The application must be protected from public access. For the MVP, a simple, single password protection mechanism for the entire site is sufficient.


### 3. User Interface Design Goals

#### Overall UX Vision

The UX vision is to create a data-dense, utilitarian interface designed for maximum efficiency. The application should feel like a professional developer tool, prioritizing clarity, speed, and observability over decorative aesthetics. The primary goal is to enable a user to set up, run, and analyze evaluations with a minimum number of clicks and zero ambiguity.

#### Key Interaction Paradigms

The core workflow will be built around a few key interaction patterns:

- A dashboard or list view for managing all evaluations.
    
- A comprehensive, multi-step form for creating and configuring a new evaluation.
    
- Clear feedback mechanisms for initiating and monitoring the status of long-running batch processes.
    
- A detailed, data-rich report view for analyzing the results of a completed evaluation.
    

#### Core Screens and Views

From a product perspective, the MVP will require the following core screens:

- **Login Page**: A simple, site-wide password entry screen.
    
- **Dashboard**: A list view of all past and current evaluations, showing their status.
    
- **Test Set Management Page/Modal**: An interface to create, view, and manage reusable Test Sets.
    
- **Evaluation Setup Page**: A screen to create or edit an evaluation, which includes selecting a Test Set and defining the prompt/model to be tested.
    
- **Evaluation Results Page**: A detailed view of a completed evaluation's accuracy score and individual outputs.

#### Accessibility

- **Accessibility: WCAG AA**: The application should adhere to WCAG 2.1 Level AA standards to ensure it is usable by people with disabilities.
    

#### Branding

- No specific branding guidelines have been provided for the MVP. The initial UI should use a clean, professional, and minimal aesthetic, similar to other modern developer tools.
    

#### Target Device and Platforms

- **Target Device and Platforms: Web Responsive (Desktop-first)**: The primary target is a desktop web browser. The interface should be responsive but optimized for a desktop experience, as that is the expected environment for a Prompt Engineer.

### 4. Technical Assumptions

#### Repository Structure

- **Monorepo**: The project will be structured as a monorepo, containing separate packages for the frontend application (`web`), the backend API (`api`), and shared code (`shared`). This is the recommended best practice for full-stack TypeScript applications and provides the best context for AI development agents.
    

#### Service Architecture

- **Monolith**: The backend will be developed as a single, unified service (a monolith). This approach simplifies development, testing, and deployment for the MVP.
    

#### Testing Requirements

- **Unit + Integration**: The development process will require the creation of both unit tests for individual components/functions and integration tests to verify interactions between different parts of the system.
    

#### Additional Technical Assumptions and Requests

- The frontend will use the **Shadcn UI** component library for building the user interface.

### 5. Epic List

-  **Epic 1: Project Foundation & Secure Access**: Establish the full-stack monorepo with the core **Next.js application, the local Supabase environment, the placeholder AWS Lambda**, and implement site-wide password protection.
    
- **Epic 2: Test Set Management**: Implement the core functionality for users to create, view, edit, and delete reusable Test Sets (the combination of inputs and ground truth criteria).
    
- **Epic 3: Core Evaluation Workflow**: Build the complete, end-to-end user journey of creating a new evaluation, associating a Test Set, running the batch analysis against a prompt, and viewing the detailed results page.

### 6. Epic 1: Project Foundation & Secure Access

**Epic Goal**: The objective of this epic is to establish a secure, deployable, full-stack application skeleton. By the end of this epic, we will have a configured monorepo, a connected database, and a live, password-protected web application with a basic layout, ready for core feature development in subsequent epics.

---

####  Epic 1: Project Foundation & Secure Access (Revised)

**Epic Goal**: The objective of this epic is to establish a secure, deployable, full-stack application skeleton based on our hybrid architecture. By the end of this epic, we will have a configured monorepo, a Next.js application, a local Supabase environment with an applied database schema, a placeholder AWS Lambda package, and a live, password-protected web application.

---

#### **Story 1.1: Monorepo & Service Scaffolding (Revised)**

**As a** developer, **I want** a configured monorepo with the Next.js app, local Supabase setup, and a placeholder AWS Lambda package, **so that** I have the complete foundational structure for the project.

**Acceptance Criteria**

1. A monorepo is initialized using Turborepo.
    
2. A basic Next.js application is created in the `apps/web` directory.
    
3. A placeholder AWS Lambda package is created in the `apps/api-lambda` directory.
    
4. A `supabase` package is created and initialized using the Supabase CLI, creating the `packages/supabase/migrations` directory.
    
5. Shared `config` and `shared` (for TypeScript types) packages are created.
    
6. The root `pnpm dev` command successfully starts the Next.js application.
    

---

#### **Story 1.2: Database Schema Migration (Revised)**

**As a** developer, **I want** to create and apply the initial database schema using Supabase migrations, **so that** the database tables are ready for the application logic.

**Acceptance Criteria**

1. The local Supabase environment is running via Docker (`supabase start`).
    
2. A new SQL migration file is created in `packages/supabase/migrations`.
    
3. This file contains the complete SQL DDL for the `test_sets`, `ground_truth_categories`, `evaluations`, and `evaluation_results` tables as defined in the architecture document.
    
4. The `supabase db reset` command successfully applies the migration to the local database, creating all the tables.
    

---

#### Story 1.3: Simple Password Protection

**As a** project administrator, **I want** the entire Next.js application to be protected by a single, simple password, **so that** the internal tool is not publicly accessible.

**Acceptance Criteria**

1. Accessing any page of the application prompts for a password if the user is not authenticated.
    
2. A correct password, stored as a server-side environment variable, grants access and establishes a session (e.g., via a secure cookie).
    
3. An incorrect password denies access and shows an error message.
    
4. Once authenticated, the user can navigate between pages without being prompted for the password again.
    
5. A minimal, unstyled login form is implemented to capture the password.
    

---

#### Story 1.4: Basic Application Layout

**As a** logged-in user, **I want** to see a basic application layout with a header and a placeholder content area, **so that** the application has a consistent and professional structure for all subsequent screens.

**Acceptance Criteria**

1. After successfully logging in, the user is redirected to a main dashboard or home page.
    
2. The page displays a persistent header component.
    
3. The header displays the application's title (e.g., "Prompt Evaluation Platform").
    
4. The main content area below the header displays a simple "Welcome" message.
    
5. The Shadcn UI library is installed and initialized in the Next.js application, ready for use.

### 7. Epic 2: Test Set Management

**Epic Goal**: The objective of this epic is to build the complete lifecycle management for "Test Sets." This will provide the core reusable entity in the platform, allowing a user to define their evaluation criteria (inputs and ground truth categories) once and then reuse them across many different evaluation runs and prompt versions.

---

#### Story 2.1: Test Set List Page

**As a** Prompt Engineer, **I want** a dedicated page to view all my saved Test Sets, **so that** I can easily access and manage my evaluation criteria.

**Acceptance Criteria**

1. A navigation link (e.g., "Test Sets") is added to the main application header/layout.
    
2. The "Test Sets" page displays a table or list of all existing Test Sets.
    
3. Each item in the list displays, at a minimum, the Test Set's Name and Description.
    
4. The page includes a prominent "Create New Test Set" button.
    
5. If no Test Sets exist, a clear message and a call-to-action to create one are displayed.
    

---

#### Story 2.2: Create New Test Set

**As a** Prompt Engineer, **I want** to create and save a new Test Set with a name, description, and a list of categories, **so that** I can define a new, reusable set of evaluation criteria.

**Acceptance Criteria**

1. Clicking the "Create New Test Set" button navigates to a new page or opens a modal form.
    
2. The form includes text input fields for "Name" and "Description" for the Test Set.
    
3. The form includes a dynamic list editor where the user can define ground truth categories.
    
4. Each category entry in the list editor consists of a "Category Name" (e.g., "A++") and a "Description".
    
5. The user can dynamically add or remove category rows from the list.
    
6. Submitting the form saves the complete Test Set (name, description, and all categories) to the database.
    
7. After a successful save, the user is redirected to the Test Set list page, which now includes the newly created item.
    

---

#### Story 2.3: Edit an Existing Test Set

**As a** Prompt Engineer, **I want** to edit the details of an existing Test Set, **so that** I can update and maintain my evaluation criteria over time.

**Acceptance Criteria**

1. The Test Set list provides a clear way to select a Test Set for editing (e.g., an "Edit" button or by clicking the item).
    
2. The edit view is pre-populated with the existing data for the selected Test Set.
    
3. The user can modify the Name, Description, and the list of Categories (including adding, editing, or removing categories).
    
4. Saving the form updates the record in the database with the new information.
    
5. After a successful save, the user is returned to the updated Test Set list.
    

---

#### **Story 2.4: Delete a Test Set (Revised)**

**As a** Prompt Engineer, **I want** to delete a Test Set I no longer need, **so that** I can keep my library of evaluation criteria organized.

**Acceptance Criteria (Revised)**

1. A "Delete" button is available on the Test Set list or edit page.
    
2. Clicking the "Delete" button triggers a confirmation prompt (e.g., "Are you sure you want to delete this Test Set?").
    
3. **Upon confirmation, the system checks if the Test Set is used by any evaluations. If it is NOT in use, it is permanently removed from the database.**
    
4. **If the Test Set IS in use, the deletion is prevented, and a clear error message is shown to the user (e.g., "This Test Set cannot be deleted because it is used by 3 evaluations.").**
    
5. After a successful deletion, the user is returned to the Test Set list, where the deleted item is no longer visible.

### 8. Epic 3: Core Evaluation Workflow

**Epic Goal**: The objective of this epic is to deliver the complete end-to-end user experience of running a prompt evaluation. This connects the application foundation and the Test Set management system to produce the platform's core value: a detailed, actionable report that quantifies prompt performance.

---

#### Story 3.1: Evaluation Dashboard

**As a** Prompt Engineer, **I want** a main dashboard page to view all my evaluation runs and start new ones, **so that** I can manage and track my experiments.

**Acceptance Criteria**

1. The main dashboard page displays a list or table of all past and in-progress evaluation runs.
    
2. Each item in the list shows the Evaluation Name, the Test Set used, status (e.g., Completed, In Progress, Failed), and the final Accuracy Score.
    
3. The page includes a "New Evaluation" button that takes the user to the configuration page.
    
4. The list can be sorted by date or status.
    

---

#### Story 3.2: Configure and Run a New Evaluation

**As a** Prompt Engineer, **I want** to configure a new evaluation by selecting a Test Set, providing a prompt, and choosing a model, **so that** I can set up and launch my experiment.

**Acceptance Criteria**

1. Clicking the "New Evaluation" button opens a setup form.
    
2. The form allows the user to provide a unique "Evaluation Name".
    
3. The user must select a previously created "Test Set" from a dropdown list.
    
4. A text area is provided for the user to input the system prompt to be tested.
    
5. The user selects a target AI model from a pre-configured list (initially supporting OpenRouter).
    
6. Clicking a "Run Evaluation" button submits the configuration and initiates the backend process.
    
7. After submission, the user is redirected to the dashboard, where the new evaluation appears with an "In Progress" status.
    

---

#### Story 3.3: Backend Batch Processing Job

**As a** developer, **I want** a backend service that can process an evaluation request as an asynchronous background job, **so that** all test cases are executed against the selected LLM without blocking the UI.

**Acceptance Criteria**

1. An API endpoint exists to receive a new evaluation request.
    
2. Upon receiving a request, the system queues a background job and immediately returns a success response to the client.
    
3. The background job iterates through every item in the evaluation's specified Test Set.
    
4. For each item, it calls the selected LLM via its API with the correct prompt and inputs.
    
5. The raw output from the LLM for each item is saved to the database, linked to the evaluation run.
    
6. The evaluation's status is updated in the database (e.g., from 'Queued' to 'In Progress' to 'Completed' or 'Failed').
    

---

#### Story 3.4: Evaluation Scoring Service

**As a** developer, **I want** a service that automatically scores a completed evaluation run, **so that** the user receives a quantitative measure of their prompt's performance.

**Acceptance Criteria**

1. After the batch processing job for an evaluation is complete, a scoring process is automatically triggered.
    
2. The service retrieves all the saved LLM outputs for the run.
    
3. For each output, it parses the content and compares it against the ground truth category from the Test Set.
    
4. A "Pass" or "Fail" result is recorded for each individual item.
    
5. An overall accuracy percentage `(Total Passes / Total Items) * 100` is calculated.
    
6. The overall score and the individual Pass/Fail results are saved to the database for the evaluation run.
    

---

#### Story 3.5: Evaluation Results Page

**As a** Prompt Engineer, **I want** to view a detailed results page for a completed evaluation, **so that** I can analyze my prompt's performance and identify areas for improvement.

**Acceptance Criteria**

1. Clicking on a "Completed" evaluation from the dashboard navigates to its unique results page.
    
2. The page prominently displays the overall accuracy score.
    
3. The page displays the specific system prompt that was tested.
    
4. A detailed table lists every item from the Test Set, including its ground truth, the actual LLM output, and its Pass/Fail status.
    
5. The user can easily filter or sort the list to quickly identify which inputs failed the evaluation.