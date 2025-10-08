import { SupabaseAdminAuthClient } from '@/common/infrastructure/auth-client/supabase';
import { adminSupabaseClient } from '@/dependencies/supabase-client/admin';

export const adminAuthClient = new SupabaseAdminAuthClient(adminSupabaseClient);
