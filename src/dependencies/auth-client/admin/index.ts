import { SupabaseAuthAdminClient } from '@/common/infrastructure/auth-client/supabase';
import { supabaseClientAdmin } from '@/dependencies/supabase-client/admin';

export const authClientAdmin = new SupabaseAuthAdminClient(supabaseClientAdmin);
