import { SupabaseAuthAdminClient } from '@/common/infrastructure/auth-client/supabase-auth-client';
import { supabaseClientAdmin } from '@/dependencies/supabase-client/admin';

export const authClientAdmin = new SupabaseAuthAdminClient(supabaseClientAdmin);
