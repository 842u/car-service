import { SupabaseStorageClient } from '@/common/infrastructure/storage-client/supabase';
import { createServerSupabaseClient } from '@/dependencies/supabase-client/server';

export async function createServerStorageClient() {
  const supabaseClient = await createServerSupabaseClient();
  return new SupabaseStorageClient(supabaseClient);
}
