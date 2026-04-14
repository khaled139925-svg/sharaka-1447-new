import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://lvoecyolzmfowqsbnbdf.supabase.co"
const supabaseKey = "sb_publishable_PcBO73tlwPZ3rUJs-fDfDQ_Kn07rnbp"

export const supabase = createClient(supabaseUrl, supabaseKey)