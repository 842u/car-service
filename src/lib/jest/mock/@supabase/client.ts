import { createMockSupabaseAuthModule } from '@/lib/jest/mock/@supabase/auth';
import { createMockSupabaseDatabaseModule } from '@/lib/jest/mock/@supabase/database';
import { createMockSupabaseStorageModule } from '@/lib/jest/mock/@supabase/storage';

export function createMockSupabaseClient() {
  return {
    ...createMockSupabaseAuthModule(),
    ...createMockSupabaseDatabaseModule(),
    ...createMockSupabaseStorageModule(),
  };
}
