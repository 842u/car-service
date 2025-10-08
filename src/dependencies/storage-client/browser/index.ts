import { SupabaseStorageClient } from '@/common/infrastructure/storage-client/supabase-storage-client';
import { supabaseClientBrowser } from '@/dependencies/supabase-client/browser';

export const storageClientBrowser = new SupabaseStorageClient(
  supabaseClientBrowser,
);
