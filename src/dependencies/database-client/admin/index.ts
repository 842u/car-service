import { SupabaseDatabaseClient } from '@/common/infrastructure/database-client/supabase';
import { adminSupabaseClient } from '@/dependencies/supabase-client/admin';

export const adminDatabaseClient = new SupabaseDatabaseClient(
  adminSupabaseClient,
);
