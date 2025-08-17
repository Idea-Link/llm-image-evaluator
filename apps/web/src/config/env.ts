export const env = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },
  auth: {
    adminEmail: process.env.ADMIN_EMAIL || 'admin@prompteval.internal',
    adminPassword: process.env.ADMIN_PASSWORD || '',
  },
} as const