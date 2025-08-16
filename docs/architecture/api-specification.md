# 5. API Specification

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