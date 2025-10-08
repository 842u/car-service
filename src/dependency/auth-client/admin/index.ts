import { SupabaseAdminAuthClient } from '@/common/infrastructure/auth-client/supabase';
import { adminSupabaseClient } from '@/dependency/supabase-client/admin';

export const adminAuthClient = new SupabaseAdminAuthClient(adminSupabaseClient);
