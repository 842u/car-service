import { createMockSupabaseAuthModule } from '@/lib/jest/mock/@supabase/auth';
import { createMockSupabaseDatabaseModule } from '@/lib/jest/mock/@supabase/database';

export function createMockSupabaseClient() {
  return {
    ...createMockSupabaseAuthModule(),
    ...createMockSupabaseDatabaseModule(),
  };
}
