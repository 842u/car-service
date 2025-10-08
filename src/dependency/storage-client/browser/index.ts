import { SupabaseStorageClient } from '@/common/infrastructure/storage-client/supabase';
import { browserSupabaseClient } from '@/dependency/supabase-client/browser';

export const browserStorageClient = new SupabaseStorageClient(
  browserSupabaseClient,
);
