import { SupabaseDatabaseClient } from '@/common/infrastructure/database-client/supabase';
import { createServerSupabaseClient } from '@/dependency/supabase-client/server';

export async function createServerDatabaseClient() {
  const supabaseClient = await createServerSupabaseClient();
  return new SupabaseDatabaseClient(supabaseClient);
}
