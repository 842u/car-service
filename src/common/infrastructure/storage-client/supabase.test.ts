import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

import { SupabaseStorageClient } from '@/common/infrastructure/storage-client/supabase';

describe('SupabaseStorageClient', () => {
  let mockInternalFromMethod: SupabaseClient['storage']['from'];
  let mockInternalUploadMethod: ReturnType<
    SupabaseClient['storage']['from']
  >['upload'];
  let storageClient: SupabaseStorageClient;

  beforeEach(() => {
    jest.clearAllMocks();
    const mockSupabaseClient = createBrowserClient('mock_url', 'mock_key');
    mockInternalFromMethod = mockSupabaseClient.storage.from;
    mockInternalUploadMethod = mockSupabaseClient.storage.from('').upload;
    storageClient = new SupabaseStorageClient(mockSupabaseClient);
  });

  it('should return data when upload method succeeds', async () => {
    const mockData = {
      id: '1',
      path: 'some/path',
      fullPath: 'some/full/path',
    };
    const bucketId = 'test bucket id';
    const path = 'upload/path';
    const file = new File([new ArrayBuffer(1)], 'test.png');
    const fileOptions = {
      cacheControl: '3600',
      contentType: 'image/png',
      upsert: true,
    };
    (mockInternalUploadMethod as jest.Mock).mockResolvedValue({
      data: mockData,
      error: null,
    });

    const result = await storageClient.upload(
      bucketId,
      path,
      file,
      fileOptions,
    );

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(mockData);
      expect(mockInternalFromMethod).toHaveBeenCalledWith(bucketId);
      expect(mockInternalUploadMethod).toHaveBeenCalledWith(
        path,
        file,
        fileOptions,
      );
    }
  });

  it('should return error when upload method fails', async () => {
    const mockError = { message: 'test error' };
    const bucketId = 'test bucket id';
    const path = 'upload/path';
    const file = new File([new ArrayBuffer(1)], 'test.png');
    (mockInternalUploadMethod as jest.Mock).mockResolvedValue({
      data: null,
      error: mockError,
    });

    const result = await storageClient.upload(bucketId, path, file);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toEqual(mockError);
    }
  });

  it('should return error when unexpected error occurs', async () => {
    const errorMessage = 'test error';
    const bucketId = 'test bucket id';
    const path = 'upload/path';
    const file = new File([new ArrayBuffer(1)], 'test.png');
    (mockInternalUploadMethod as jest.Mock).mockImplementation(() => {
      throw new Error(errorMessage);
    });

    const result = await storageClient.upload(bucketId, path, file);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.message).toBe(errorMessage);
    }
  });
});
