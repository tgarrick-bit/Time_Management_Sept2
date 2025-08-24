import { createClient } from '@supabase/supabase-js'

// Debug logging

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let supabase: any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let supabaseAdmin: any = null

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  console.error('Missing Supabase environment variables')
}

export { supabase, supabaseAdmin }