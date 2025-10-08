import { SupabaseDatabaseClient } from '@/common/infrastructure/database-client/supabase';
import { supabaseClientBrowser } from '@/dependencies/supabase-client/browser';

export const databaseClientBrowser = new SupabaseDatabaseClient(
  supabaseClientBrowser,
);
