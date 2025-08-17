import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { writeFileSync } from 'fs'

// Load environment variables from apps/web/.env.local
dotenv.config({ path: resolve(__dirname, '../../../apps/web/.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function exportCurrentData() {
  try {
    // Get current user
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()
    if (usersError) throw usersError
    
    console.log('Current users:')
    users?.forEach(user => {
      console.log(`- ${user.email} (ID: ${user.id})`)
    })
    
    // Get test sets
    const { data: testSets, error: testSetsError } = await supabase
      .from('test_sets')
      .select('*')
      .order('created_at', { ascending: true })
    
    if (testSetsError) throw testSetsError
    console.log('\nTest Sets:', testSets?.length || 0)
    testSets?.forEach(ts => {
      console.log(`- ${ts.name} (ID: ${ts.id})`)
    })
    
    // Get ground truth categories
    const { data: categories, error: categoriesError } = await supabase
      .from('ground_truth_categories')
      .select('*')
    
    if (categoriesError) throw categoriesError
    console.log('\nGround Truth Categories:', categories?.length || 0)
    
    // Get evaluations
    const { data: evaluations, error: evaluationsError } = await supabase
      .from('evaluations')
      .select('*')
      .order('created_at', { ascending: true })
    
    if (evaluationsError) throw evaluationsError
    console.log('Evaluations:', evaluations?.length || 0)
    evaluations?.forEach(ev => {
      console.log(`- ${ev.name} (Status: ${ev.status})`)
    })
    
    // Get evaluation results
    const { data: results, error: resultsError } = await supabase
      .from('evaluation_results')
      .select('*')
    
    if (resultsError) throw resultsError
    console.log('Evaluation Results:', results?.length || 0)
    
    // Export data structure
    const exportData = {
      users: users?.map(u => ({ id: u.id, email: u.email })),
      testSets,
      categories,
      evaluations,
      results
    }
    
    // Save to JSON file for reference
    writeFileSync(
      resolve(__dirname, 'current-data-export.json'),
      JSON.stringify(exportData, null, 2)
    )
    
    console.log('\nData exported to current-data-export.json')
    
    return exportData
  } catch (error) {
    console.error('Error exporting data:', error)
    process.exit(1)
  }
}

exportCurrentData()