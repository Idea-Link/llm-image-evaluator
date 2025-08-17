import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables from apps/web/.env.local
dotenv.config({ path: resolve(__dirname, '../../../apps/web/.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const adminEmail = process.env.ADMIN_EMAIL
const adminPassword = process.env.ADMIN_PASSWORD

if (!supabaseUrl || !supabaseServiceKey || !adminEmail || !adminPassword) {
  console.error('Missing required environment variables')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, ADMIN_PASSWORD')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function seedAdminUser() {
  try {
    // First try to list users to see if admin exists
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.error('Error listing users:', listError)
      // Continue anyway to try creating the user
    } else {
      const existingAdmin = users?.find(user => user.email === adminEmail)
      if (existingAdmin) {
        console.log('Admin user already exists:', adminEmail)
        console.log('User ID:', existingAdmin.id)
        return
      }
    }

    // Create admin user
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        role: 'admin'
      }
    })

    if (error) {
      // Check if error is because user already exists
      if (error.message?.includes('already exists') || error.message?.includes('duplicate')) {
        console.log('Admin user already exists:', adminEmail)
        return
      }
      console.error('Error creating admin user:', error)
      process.exit(1)
    }

    console.log('Admin user created successfully:', adminEmail)
    console.log('User ID:', data.user?.id)
  } catch (error) {
    console.error('Unexpected error:', error)
    process.exit(1)
  }
}

seedAdminUser()