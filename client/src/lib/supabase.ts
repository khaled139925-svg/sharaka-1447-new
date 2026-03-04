import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sxgvnkswsakckibttzpa.supabase.co'
const supabaseAnonKey = 'sb_publishable_i12oQEqwz5x_Y6GNGZ3RvQ_Qmo0g-ae'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)