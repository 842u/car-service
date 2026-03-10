import { SupabaseAuthClient } from '@/common/infrastructure/auth-client/supabase';
import { browserSupabaseClient } from '@/dependency/supabase-client/browser';

export const browserAuthClient = new SupabaseAuthClient(browserSupabaseClient);
