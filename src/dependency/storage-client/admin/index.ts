import { SupabaseStorageClient } from '@/common/infrastructure/storage-client/supabase';
import { adminSupabaseClient } from '@/dependency/supabase-client/admin';

export const adminStorageClient = new SupabaseStorageClient(
  adminSupabaseClient,
);
