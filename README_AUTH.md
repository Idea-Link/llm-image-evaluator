# Authentication Setup Guide

## Overview
This application uses Supabase Auth for authentication with a single admin user setup.

## Admin User Setup

### Environment Variables
Configure the following variables in `apps/web/.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Admin User Configuration
ADMIN_EMAIL=admin@prompteval.internal
ADMIN_PASSWORD=<secure-password>
```

### Creating the Admin User

#### Method 1: Using the Seed Script (Recommended)
1. Ensure Supabase is running: `cd packages/supabase && pnpm db:start`
2. Run the admin seed script: `cd packages/supabase && pnpm seed:admin`

#### Method 2: Manual Creation via Supabase Dashboard
1. Access Supabase dashboard at http://localhost:54323
2. Navigate to Authentication > Users
3. Click "Add User" and create user with:
   - Email: Value from ADMIN_EMAIL environment variable
   - Password: Value from ADMIN_PASSWORD environment variable
   - Mark as verified

## Authentication Flow

### Protected Routes
- All routes are protected by middleware except `/login`
- Unauthenticated users are automatically redirected to `/login`
- Session persistence is handled automatically via Supabase Auth

### Login Process
1. Navigate to `/login` (or get redirected when accessing protected routes)
2. Email field is pre-filled with admin email from environment
3. Enter the admin password
4. On successful authentication, redirected to home page

### Logout
- Click the "Logout" button in the header
- Session is cleared and user is redirected to login page

## Development Notes

### Testing Authentication Locally
1. Start the development server: `cd apps/web && pnpm dev`
2. Access http://localhost:3000
3. You should be redirected to /login
4. Login with admin credentials
5. Verify you can access protected pages

### Troubleshooting

#### Admin User Creation Fails
- Ensure Supabase is running properly
- Check that all services are healthy: `npx supabase status`
- Verify environment variables are correctly set
- Try manual creation through dashboard as fallback

#### Login Issues
- Verify ADMIN_EMAIL and ADMIN_PASSWORD match the created user
- Check browser console for error messages
- Ensure cookies are enabled (required for session management)
- Clear browser cache and cookies if experiencing persistent issues

## Security Considerations

- Admin credentials should be stored securely
- Use strong passwords in production environments
- Consider implementing rate limiting for login attempts
- Enable audit logging in production Supabase instances
- Regularly rotate admin passwords

## Architecture

### Key Components
- **Middleware** (`src/middleware.ts`): Protects routes and handles redirects
- **Auth Service** (`src/services/auth.ts`): Encapsulates all auth operations
- **Login Page** (`src/app/login/page.tsx`): Handles user authentication
- **Auth Store** (`src/stores/useAuthStore.ts`): Manages authentication state
- **Logout Button** (`src/components/features/auth/LogoutButton.tsx`): Handles sign out

### Environment Configuration
All environment variables are accessed through a typed configuration object at `src/config/env.ts` to ensure type safety and prevent direct `process.env` access.