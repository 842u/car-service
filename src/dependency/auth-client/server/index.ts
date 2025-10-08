import { SupabaseAuthClient } from '@/common/infrastructure/auth-client/supabase';
import { createServerSupabaseClient } from '@/dependency/supabase-client/server';

export async function createServerAuthClient() {
  const supabaseClient = await createServerSupabaseClient();
  return new SupabaseAuthClient(supabaseClient);
}
