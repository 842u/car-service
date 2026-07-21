import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from 'supabase/types/supabase';

import { createTestUserByEmail, generateTestEmail } from './test-user';

// A raw actor holds its own Supabase session (anon key, signed in directly
// against Supabase, not through the app's /api/auth/sign-in route), so it can
// call PostgREST and RPCs the same way any script with a stolen or
// self-issued user JWT would: entirely bypassing the Next.js server.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const TEST_USER_PASSWORD = process.env.SUPABASE_TEST_USER_PASSWORD!;

export type RawActor = SupabaseClient<Database>;

export function createAnonClient(): RawActor {
  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export async function signInRawActor(email: string): Promise<RawActor> {
  const client = createAnonClient();

  const { error } = await client.auth.signInWithPassword({
    email,
    password: TEST_USER_PASSWORD,
  });

  if (error) {
    throw new Error(`Failed to sign in raw actor ${email}: ${error.message}.`);
  }

  return client;
}

export async function createRawActor(): Promise<{
  email: string;
  client: RawActor;
}> {
  const email = generateTestEmail();

  await createTestUserByEmail(email);

  const client = await signInRawActor(email);

  return { email, client };
}
