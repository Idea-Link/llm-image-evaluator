# 8. Epic 3: Core Evaluation Workflow

**Epic Goal**: The objective of this epic is to deliver the complete end-to-end user experience of running a prompt evaluation. This connects the application foundation and the Test Set management system to produce the platform's core value: a detailed, actionable report that quantifies prompt performance.

---

## Story 3.1: Evaluation Dashboard

**As a** Prompt Engineer, **I want** a main dashboard page to view all my evaluation runs and start new ones, **so that** I can manage and track my experiments.

**Acceptance Criteria**

1. The main dashboard page displays a list or table of all past and in-progress evaluation runs.
    
2. Each item in the list shows the Evaluation Name, the Test Set used, status (e.g., Completed, In Progress, Failed), and the final Accuracy Score.
    
3. The page includes a "New Evaluation" button that takes the user to the configuration page.
    
4. The list can be sorted by date or status.
    

---

## Story 3.2: Configure and Run a New Evaluation

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

## Story 3.3: Backend Batch Processing Job

**As a** developer, **I want** a backend service that can process an evaluation request as an asynchronous background job, **so that** all test cases are executed against the selected LLM without blocking the UI.

**Acceptance Criteria**

1. An API endpoint exists to receive a new evaluation request.
    
2. Upon receiving a request, the system queues a background job and immediately returns a success response to the client.
    
3. The background job iterates through every item in the evaluation's specified Test Set.
    
4. For each item, it calls the selected LLM via its API with the correct prompt and inputs.
    
5. The raw output from the LLM for each item is saved to the database, linked to the evaluation run.
    
6. The evaluation's status is updated in the database (e.g., from 'Queued' to 'In Progress' to 'Completed' or 'Failed').
    

---

## Story 3.4: Evaluation Scoring Service

**As a** developer, **I want** a service that automatically scores a completed evaluation run, **so that** the user receives a quantitative measure of their prompt's performance.

**Acceptance Criteria**

1. After the batch processing job for an evaluation is complete, a scoring process is automatically triggered.
    
2. The service retrieves all the saved LLM outputs for the run.
    
3. For each output, it parses the content and compares it against the ground truth category from the Test Set.
    
4. A "Pass" or "Fail" result is recorded for each individual item.
    
5. An overall accuracy percentage `(Total Passes / Total Items) * 100` is calculated.
    
6. The overall score and the individual Pass/Fail results are saved to the database for the evaluation run.
    

---

## Story 3.5: Evaluation Results Page

**As a** Prompt Engineer, **I want** to view a detailed results page for a completed evaluation, **so that** I can analyze my prompt's performance and identify areas for improvement.

**Acceptance Criteria**

1. Clicking on a "Completed" evaluation from the dashboard navigates to its unique results page.
    
2. The page prominently displays the overall accuracy score.
    
3. The page displays the specific system prompt that was tested.
    
4. A detailed table lists every item from the Test Set, including its ground truth, the actual LLM output, and its Pass/Fail status.
    
5. The user can easily filter or sort the list to quickly identify which inputs failed the evaluation.