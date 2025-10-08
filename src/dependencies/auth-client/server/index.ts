import { SupabaseAuthClient } from '@/common/infrastructure/auth-client/supabase';
import { createServerSupabaseClient } from '@/dependencies/supabase-client/server';

export async function createServerAuthClient() {
  const supabaseClient = await createServerSupabaseClient();
  return new SupabaseAuthClient(supabaseClient);
}
