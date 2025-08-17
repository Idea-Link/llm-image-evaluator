# 2. Requirements

## Functional

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

## Non-Functional

1. **NFR1**: The monthly hosting and infrastructure costs on AWS must be architected to remain under $50 for the MVP's expected usage.
    
2. **NFR2**: The frontend shall be built using React with the Next.js framework (version 14 or newer).

3. **NFR3**: The backend logic shall be implemented using a hybrid serverless approach: **Supabase Edge Functions** (Deno/TypeScript) for synchronous API routes and **AWS Lambda** (Node.js/TypeScript) for long-running asynchronous jobs.
    
4. **NFR4**: The database shall be PostgreSQL.
    
5. **NFR5**: If a third-party API fails during a batch run, the system must fail gracefully, halt the process for that specific item, and log the error without crashing the entire batch.
    
6. **NFR6**: The application must be protected from public access. For the MVP, the system will use a single pre-configured admin user account with email/password authentication managed through Supabase Auth.