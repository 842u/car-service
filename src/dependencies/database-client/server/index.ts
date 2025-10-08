import { SupabaseDatabaseClient } from '@/common/infrastructure/database-client/supabase';
import { createServerSupabaseClient } from '@/dependencies/supabase-client/server';

export async function createServerDatabaseClient() {
  const supabaseClient = await createServerSupabaseClient();
  return new SupabaseDatabaseClient(supabaseClient);
}
