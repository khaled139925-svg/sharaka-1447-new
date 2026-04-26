import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lvoecyolzmfowqsbnbdf.supabase.co';
const supabaseAnonKey = 'sb_publishable_PcBO73tlwPZ3rUJs-fDfDQ_Kn07rnbp';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);