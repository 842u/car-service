import { createMockSupabaseAuthModule } from '@/lib/jest/mock/@supabase/auth';

export function createMockSupabaseClient() {
  return {
    ...createMockSupabaseAuthModule(),
  };
}
