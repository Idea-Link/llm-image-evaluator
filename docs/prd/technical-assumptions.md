# 4. Technical Assumptions

## Repository Structure

- **Monorepo**: The project will be structured as a monorepo, containing separate packages for the frontend application (`web`), the backend API (`api`), and shared code (`shared`). This is the recommended best practice for full-stack TypeScript applications and provides the best context for AI development agents.
    

## Service Architecture

- **Monolith**: The backend will be developed as a single, unified service (a monolith). This approach simplifies development, testing, and deployment for the MVP.
    

## Testing Requirements

- **Unit + Integration**: The development process will require the creation of both unit tests for individual components/functions and integration tests to verify interactions between different parts of the system.
    

## Additional Technical Assumptions and Requests

- The frontend will use the **Shadcn UI** component library for building the user interface.