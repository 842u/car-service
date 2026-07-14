import { createMockSupabaseAuthModule } from '@/test/mock/@supabase/auth';
import { createMockSupabaseDatabaseModule } from '@/test/mock/@supabase/database';
import { createMockSupabaseStorageModule } from '@/test/mock/@supabase/storage';

export function createMockSupabaseClient() {
  return {
    ...createMockSupabaseAuthModule(),
    ...createMockSupabaseDatabaseModule(),
    ...createMockSupabaseStorageModule(),
  };
}
