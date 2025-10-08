import { SupabaseStorageClient } from '@/common/infrastructure/storage-client/supabase-storage-client';
import { createSupabaseClientServer } from '@/dependencies/supabase-client/server';

export async function createStorageClientServer() {
  const supabaseClientServer = await createSupabaseClientServer();
  return new SupabaseStorageClient(supabaseClientServer);
}
