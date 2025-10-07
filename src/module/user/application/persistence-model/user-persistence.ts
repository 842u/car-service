import type { Database } from 'supabase/types/supabase';

export type UserPersistence = Database['public']['Tables']['users']['Row'];
