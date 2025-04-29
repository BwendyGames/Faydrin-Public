import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "your-supabase-url" // Replace with your Supabase URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
