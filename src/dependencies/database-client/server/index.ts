import { SupabaseDatabaseClient } from '@/common/infrastructure/database-client/supabase';
import { createSupabaseClientServer } from '@/dependencies/supabase-client/server';

export async function createDatabaseClientServer() {
  const supabaseClientServer = await createSupabaseClientServer();
  return new SupabaseDatabaseClient(supabaseClientServer);
}
