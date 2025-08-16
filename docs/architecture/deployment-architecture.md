# 12. Deployment Architecture

## Deployment Strategy

Our deployment is split based on the component's hosting platform, orchestrated from our Git repository.

- **Frontend (Next.js)**:
    
    - **Platform**: **Vercel**
        
    - **Process**: Vercel's native Git integration will be used. Every push to the `main` branch will automatically trigger a build and deploy the `web` application to production. Every pull request will receive its own unique preview deployment URL.
        
- **Backend (Supabase Edge Functions)**:
    
    - **Platform**: **Supabase**
        
    - **Process**: The Supabase Functions in the `packages/supabase/functions` directory will be deployed via a **GitHub Actions** workflow that uses the Supabase CLI.
        
- **Backend (AWS Lambda Job)**:
    
    - **Platform**: **AWS**
        
    - **Process**: The Lambda function in the `apps/api-lambda` directory will be deployed via a separate **GitHub Actions** workflow that uses the AWS CDK to provision the necessary infrastructure.
        

## CI/CD Pipeline

The deployment will be managed via GitHub Actions. Here is a conceptual outline of the workflow file:

YAML

```
# .github/workflows/deploy.yml
name: Deploy Production

on:
  push:
    branches:
      - main

jobs:
  # Vercel handles its own deployment via its Git integration
  
  deploy-supabase-functions:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: supabase/cli/setup@v1
      - name: Deploy Supabase Edge Functions
        run: supabase functions deploy --project-ref $SUPABASE_PROJECT_REF
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          # ... other vars
          
  deploy-aws-lambda:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          # ... other secrets
      - name: Deploy AWS CDK Stack
        run: |
          cd packages/infra
          pnpm install
          pnpm cdk deploy --require-approval never
```

## Environments

|Environment|Frontend URL|Backend URL|Purpose|
|---|---|---|---|
|**Development**|`http://localhost:3000`|Supabase Local|Local development and testing.|
|**Staging**|`[pr-name].vercel.app`|Staging Supabase Project|Automatic preview for every Pull Request.|
|**Production**|`[your-domain].com`|Production Supabase Project|Live application for users.|