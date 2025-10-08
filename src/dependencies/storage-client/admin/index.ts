import { SupabaseStorageClient } from '@/common/infrastructure/storage-client/supabase';
import { adminSupabaseClient } from '@/dependencies/supabase-client/admin';

export const adminStorageClient = new SupabaseStorageClient(
  adminSupabaseClient,
);
