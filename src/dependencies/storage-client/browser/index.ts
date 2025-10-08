import { SupabaseStorageClient } from '@/common/infrastructure/storage-client/supabase';
import { supabaseClientBrowser } from '@/dependencies/supabase-client/browser';

export const storageClientBrowser = new SupabaseStorageClient(
  supabaseClientBrowser,
);
