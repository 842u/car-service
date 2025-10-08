import { SupabaseStorageClient } from '@/common/infrastructure/storage-client/supabase-storage-client';
import { supabaseClientAdmin } from '@/dependencies/supabase-client/admin';

export const storageClientAdmin = new SupabaseStorageClient(
  supabaseClientAdmin,
);
