import { createBrowserClient } from '@supabase/ssr';

import { Database } from '@/types/supabase';

const supabaseAppProtocol = process.env.APP_PROTOCOL!;
const supabaseAppDomain = process.env.APP_DOMAIN!;
const supabaseAppApiPort = process.env.APP_API_PORT!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseAppUrl = `${supabaseAppProtocol}://${supabaseAppDomain}:${supabaseAppApiPort}`;

export function createClient(
  supabaseUrl: string = supabaseAppUrl,
  supabaseKey: string = supabaseAnonKey,
) {
  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
}
