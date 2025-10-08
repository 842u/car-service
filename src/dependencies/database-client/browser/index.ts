import { SupabaseDatabaseClient } from '@/common/infrastructure/database-client/supabase';
import { browserSupabaseClient } from '@/dependencies/supabase-client/browser';

export const browserDatabaseClient = new SupabaseDatabaseClient(
  browserSupabaseClient,
);
