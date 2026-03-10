import type { SupabaseDatabaseClient } from '@/common/infrastructure/database-client/supabase';

export function createMockSupabaseDatabaseClient() {
  return {
    query: jest.fn(),
    rpc: jest.fn(),
  } as unknown as jest.Mocked<SupabaseDatabaseClient>;
}
