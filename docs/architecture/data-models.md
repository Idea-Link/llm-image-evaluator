# 4. Data Models (Final Version)

## 1. TestSet

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

## 2. GroundTruthCategory

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

## 3. Evaluation

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

## 4. EvaluationResult

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