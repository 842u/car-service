import { SupabaseDatabaseClient } from '@/common/infrastructure/database-client/supabase';
import { browserSupabaseClient } from '@/dependency/supabase-client/browser';

export const browserDatabaseClient = new SupabaseDatabaseClient(
  browserSupabaseClient,
);
