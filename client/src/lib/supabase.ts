import { createClient } from "@supabase/supabase-js";

// Check if env vars are present, otherwise use placeholders to prevent crash during build/dev if not set yet.
// In a real app, these are strictly required.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
