import { SupabaseAuthClient } from '@/common/infrastructure/auth-client/supabase-auth-client';
import { createSupabaseClientServer } from '@/dependencies/supabase-client/server';

export async function createAuthClientServer() {
  const supabaseClientServer = await createSupabaseClientServer();
  return new SupabaseAuthClient(supabaseClientServer);
}
