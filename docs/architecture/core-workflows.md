# 7. Core Workflows

## Workflow 1: Creating a New Test Set (Synchronous)

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

## Workflow 2: Running a New Evaluation (Asynchronous)

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