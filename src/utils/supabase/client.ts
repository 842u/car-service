import { createBrowserClient } from '@supabase/ssr';

import type { Database } from '@/types/supabase';

const supabaseAppUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createClient(
  supabaseUrl: string = supabaseAppUrl,
  supabaseKey: string = supabaseAnonKey,
) {
  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
}
