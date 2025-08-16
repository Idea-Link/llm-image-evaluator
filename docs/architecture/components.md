# 6. Components

## Component List

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
        

## Component Interaction Diagram

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