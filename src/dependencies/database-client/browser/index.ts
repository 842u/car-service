import { SupabaseDatabaseClient } from '@/common/infrastructure/database-client/supabase-database-client';
import { supabaseClientBrowser } from '@/dependencies/supabase-client/browser';

export const databaseClientBrowser = new SupabaseDatabaseClient(
  supabaseClientBrowser,
);
