import { createClient } from '@supabase/supabase-js';
import type { Database } from 'supabase/types/supabase';

/**
 * By default, the auth-helpers/ssr do not permit the use of the service_role secret.
 * This restriction is in place to prevent the accidental exposure of your service_role secret to the public.
 * Since the auth-helpers/ssr function on both the server and client side, it becomes challenging to separate the key specifically for client-side usage.
 * You can create a separate Supabase client using the createClient method from @supabase/supabase-js and provide it with the service_role secret.
 * By implementing this approach, you can safely utilize the service_role secret without compromising security or exposing sensitive information to the public.
 * * https://supabase.com/docs/guides/troubleshooting/performing-administration-tasks-on-the-server-side-with-the-servicerole-secret-BYM4Fa
 * * https://supabase.com/docs/guides/troubleshooting/why-is-my-service-role-key-client-getting-rls-errors-or-not-returning-data-7_1K9z
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const adminSupabaseClient = createClient<Database>(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  },
);
