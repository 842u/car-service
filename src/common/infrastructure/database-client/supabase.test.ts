import { createBrowserClient } from '@supabase/ssr';

import {
  ROW_COUNT_MISMATCH,
  SupabaseDatabaseClient,
} from '@/common/infrastructure/database-client/supabase';
import {
  mockInternalMethodFailure,
  mockInternalMethodSuccess,
} from '@/test/mock/@supabase/database';

describe('SupabaseDatabaseClient', () => {
  let databaseClient: SupabaseDatabaseClient;

  beforeEach(() => {
    jest.clearAllMocks();
    const mockSupabaseClient = createBrowserClient('mock_url', 'mock_key');
    databaseClient = new SupabaseDatabaseClient(mockSupabaseClient);
  });

  describe('query', () => {
    it('should return data when from method chain succeeds', async () => {
      const mockData = [
        { id: '1', name: 'Test 1' },
        { id: '2', name: 'Test 2' },
      ];

      const result = await databaseClient.query(
        async () => await mockInternalMethodSuccess(mockData),
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockData);
      }
    });

    it('should return error when from method chain fails', async () => {
      const errorMessage = 'test error';

      const result = await databaseClient.query(
        async () => await mockInternalMethodFailure(errorMessage),
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe(errorMessage);
      }
    });

    it('should return error when unexpected error occurs', async () => {
      const errorMessage = 'test error';

      const result = await databaseClient.query(async () => {
        throw new Error(errorMessage);
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe(errorMessage);
      }
    });

    it('should handle null data with no error as success', async () => {
      const result = await databaseClient.query(
        async () => await mockInternalMethodSuccess(null),
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeNull();
      }
    });
  });

  describe('rpc', () => {
    it('should return data when rpc method succeeds', async () => {
      const mockRpcResultData = [
        { id: '1', value: 100 },
        { id: '2', value: 200 },
      ];

      const result = await databaseClient.rpc(
        async () => await mockInternalMethodSuccess(mockRpcResultData),
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockRpcResultData);
      }
    });

    it('should return error when rpc method fails', async () => {
      const errorMessage = 'test error';
      const result = await databaseClient.rpc(
        async () => await mockInternalMethodFailure(errorMessage),
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe(errorMessage);
      }
    });

    it('should return error when unexpected error occurs', async () => {
      const errorMessage = 'test error';

      const result = await databaseClient.rpc(async () => {
        throw new Error(errorMessage);
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe(errorMessage);
      }
    });

    it('should handle null data with no error as success', async () => {
      const result = await databaseClient.rpc(
        async () => await mockInternalMethodSuccess(null),
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeNull();
      }
    });
  });

  describe('mutate', () => {
    const affected = (rows: { id: string }[]) => ({
      select: () => Promise.resolve({ data: rows, error: null }),
    });

    it('should return the affected rows when the count matches', async () => {
      const affectedRows = [{ id: '1' }];

      const result = await databaseClient.mutate(
        () => affected(affectedRows),
        1,
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(affectedRows);
      }
    });

    it('should fail with ROW_COUNT_MISMATCH when no rows are affected', async () => {
      const result = await databaseClient.mutate(() => affected([]), 1);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ROW_COUNT_MISMATCH);
      }
    });

    it('should fail with ROW_COUNT_MISMATCH when the count differs', async () => {
      const result = await databaseClient.mutate(
        () => affected([{ id: '1' }, { id: '2' }]),
        1,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ROW_COUNT_MISMATCH);
      }
    });

    it('should return error when the mutation fails', async () => {
      const errorMessage = 'test error';

      const result = await databaseClient.mutate(
        () => ({
          select: () =>
            Promise.resolve({
              data: null,
              error: { message: errorMessage, code: 'error code' },
            }),
        }),
        1,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe(errorMessage);
        expect(result.error.code).not.toBe(ROW_COUNT_MISMATCH);
      }
    });

    it('should return error when an unexpected error occurs', async () => {
      const errorMessage = 'test error';

      const result = await databaseClient.mutate(() => {
        throw new Error(errorMessage);
      }, 1);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe(errorMessage);
      }
    });
  });
});
