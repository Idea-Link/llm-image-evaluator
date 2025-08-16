# 3. Tech Stack

## Technology Stack Table

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