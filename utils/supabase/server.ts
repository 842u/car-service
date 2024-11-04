import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { Database } from '@/types/supabase';

const supabaseAppProtocol = process.env.APP_PROTOCOL!;
const supabaseAppDomain = process.env.APP_DOMAIN!;
const supabaseAppApiPort = process.env.APP_API_PORT!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseAppUrl = `${supabaseAppProtocol}://${supabaseAppDomain}:${supabaseAppApiPort}`;

export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(supabaseAppUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}
