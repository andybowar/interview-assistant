import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VUE_APP_SUPABASE_URL as string;
const supabaseAnonKey = process.env.VUE_APP_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or Anon Key is missing');
}

export function useSupabase() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  return { supabase };
}