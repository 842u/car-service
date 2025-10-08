import { SupabaseDatabaseClient } from '@/common/infrastructure/database-client/supabase';
import { supabaseClientAdmin } from '@/dependencies/supabase-client/admin';

export const databaseClientAdmin = new SupabaseDatabaseClient(
  supabaseClientAdmin,
);
