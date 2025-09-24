import type { Database } from '@/types/supabase';

export type UserPersistence = Database['public']['Tables']['users']['Row'];
