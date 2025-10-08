import { SupabaseAuthClient } from '@/common/infrastructure/auth-client/supabase';
import { supabaseClientBrowser } from '@/dependencies/supabase-client/browser';

export const authClientBrowser = new SupabaseAuthClient(supabaseClientBrowser);
