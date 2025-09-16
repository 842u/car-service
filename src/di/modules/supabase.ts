import { createBrowserClient, createServerClient } from '@supabase/ssr';

import type { DependencyContainer } from '@/di/container';
import { tokens } from '@/di/tokens';
import type { Database } from '@/types/supabase';

const defaultSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const defaultSupabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export interface SupabaseConfig {
  supabaseUrl?: string;
  supabaseKey?: string;
}

export function registerSupabaseModule(container: DependencyContainer) {
  container.registerFactory(
    tokens.SUPABASE_BROWSER_CLIENT,
    (_, config?: SupabaseConfig) => {
      const supabaseUrl = config?.supabaseUrl ?? defaultSupabaseUrl;
      const supabaseKey = config?.supabaseKey ?? defaultSupabaseKey;
      const client = createBrowserClient<Database>(supabaseUrl, supabaseKey);
      return client;
    },
  );

  container.registerFactory(
    tokens.SUPABASE_SERVER_CLIENT,
    async (_, config?: SupabaseConfig) => {
      const supabaseUrl = config?.supabaseUrl ?? defaultSupabaseUrl;
      const supabaseKey = config?.supabaseKey ?? defaultSupabaseKey;

      /**
       * *  Dynamic import to avoid loading next/headers in browser when using classic module import
       */
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      const client = createServerClient<Database>(supabaseUrl, supabaseKey, {
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
      return client;
    },
  );
}
