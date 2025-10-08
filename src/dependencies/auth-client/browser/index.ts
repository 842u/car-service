import { SupabaseAuthClient } from '@/common/infrastructure/auth-client/supabase';
import { browserSupabaseClient } from '@/dependencies/supabase-client/browser';

export const browserAuthClient = new SupabaseAuthClient(browserSupabaseClient);
