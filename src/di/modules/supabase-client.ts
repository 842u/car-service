import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

import type { DependencyContainer } from '@/di/container';
import { tokens } from '@/di/tokens';
import type { Database } from '@/types/supabase';

const defaultSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const defaultSupabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export interface SupabaseConfig {
  supabaseUrl?: string;
  supabaseKey?: string;
}

export function registerSupabaseClientModule(container: DependencyContainer) {
  container.registerFactory(
    tokens.SUPABASE_CLIENT_ADMIN,
    (_, config?: SupabaseConfig) => {
      /**
       * By default, the auth-helpers/ssr do not permit the use of the service_role secret.
       * This restriction is in place to prevent the accidental exposure of your service_role secret to the public.
       * Since the auth-helpers/ssr function on both the server and client side, it becomes challenging to separate the key specifically for client-side usage.
       * You can create a separate Supabase client using the createClient method from @supabase/supabase-js and provide it with the service_role secret.
       * By implementing this approach, you can safely utilize the service_role secret without compromising security or exposing sensitive information to the public.
       * * https://supabase.com/docs/guides/troubleshooting/performing-administration-tasks-on-the-server-side-with-the-servicerole-secret-BYM4Fa
       * * https://supabase.com/docs/guides/troubleshooting/why-is-my-service-role-key-client-getting-rls-errors-or-not-returning-data-7_1K9z
       */
      const supabaseUrl = config?.supabaseUrl ?? defaultSupabaseUrl;
      const supabaseKey = config?.supabaseKey ?? defaultSupabaseKey;
      const client = createClient<Database>(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      });
      return client;
    },
  );

  container.registerFactory(tokens.SUPABASE_CLIENT_BROWSER, () => {
    const client = createBrowserClient<Database>(
      defaultSupabaseUrl,
      defaultSupabaseKey,
    );
    return client;
  });

  container.registerFactory(tokens.SUPABASE_CLIENT_SERVER, async () => {
    /**
     * Dynamic import to avoid loading next/headers in browser when using classic module import.
     */
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const client = createServerClient<Database>(
      defaultSupabaseUrl,
      defaultSupabaseKey,
      {
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
              /**
               * The `setAll` method was called from a Server Component.
               * This can be ignored if you have middleware refreshing user sessions.
               */
            }
          },
        },
      },
    );
    return client;
  });
}
