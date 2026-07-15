import { jest } from '@jest/globals';

import type { SupabaseDatabaseClient } from '@/common/infrastructure/database-client/supabase';

/**
 * Unlike the other doubles in this codebase, this one cannot be checked against
 * its subject. `SupabaseDatabaseClient` is a class holding a private `_client`,
 * which is nominal and unreachable from an object literal, and its `query` and
 * `rpc` are generic, so a mock (which fixes the type parameter at creation) can
 * never match their call signatures. Both force the assertion below, which means
 * a method added to the client will not fail here. Keep this mock in step by
 * hand.
 */
export function createMockSupabaseDatabaseClient() {
  return {
    query: jest.fn(),
    rpc: jest.fn(),
  } as unknown as jest.Mocked<SupabaseDatabaseClient>;
}
