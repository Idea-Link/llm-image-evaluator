# 2. High-Level Architecture

## Technical Summary

The system will employ a hybrid, best-of-breed cloud architecture optimized for developer experience and cost-effectiveness. The frontend will be a Next.js application hosted on **Vercel** for optimal performance. It will communicate with backend services deployed as serverless functions. Core, stateless API logic (e.g., managing Test Sets) will be deployed to **Supabase Edge Functions**, keeping it close to the database. The intensive, long-running batch evaluation job will be handled by a dedicated **AWS Lambda** function to ensure reliable, long-running execution. Data will be persisted in a **Supabase-managed PostgreSQL** database.

## Platform and Infrastructure Choice

- **Platform**: Hybrid (Vercel, Supabase, AWS)
    
- **Key Services**:
    
    - Vercel: Frontend Hosting, CDN, simple serverless functions.
        
    - Supabase: Managed PostgreSQL Database, Auth, simple Edge Functions for CRUD operations.
        
    - AWS: A specialized Lambda function for long-running, asynchronous batch processing.
        

## Repository Structure

- **Structure**: Monorepo. This will contain the Next.js frontend, the Supabase Edge Functions, any shared code, and the AWS Lambda function code, simplifying development and context for AI agents.
    

## High Level Architecture Diagram

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

## Architectural Patterns

- **Jamstack**: The core architecture of a decoupled frontend (Vercel) communicating with APIs (Supabase/AWS) fits the Jamstack model, which prioritizes performance and security.
    
- **Serverless Functions**: We will leverage serverless for all backend logic, using the appropriate provider (Supabase vs. AWS) based on the task's specific requirements (especially execution time).
    
- **Hybrid Cloud**: We are intentionally selecting the best-in-class service for each job from different cloud providers to optimize for our specific needs.