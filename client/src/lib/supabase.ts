import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nurtwpcbzmagipgrrjrw.supabase.co";

const supabaseKey = "sb_publishable_WU4QdPZD7ibentvjMarmiQ_vFYSD6vW";

export const supabase = createClient(supabaseUrl, supabaseKey);