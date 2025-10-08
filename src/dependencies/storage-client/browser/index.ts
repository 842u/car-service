import { SupabaseStorageClient } from '@/common/infrastructure/storage-client/supabase';
import { browserSupabaseClient } from '@/dependencies/supabase-client/browser';

export const browserStorageClient = new SupabaseStorageClient(
  browserSupabaseClient,
);
