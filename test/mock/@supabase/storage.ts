export function createMockSupabaseStorageModule() {
  const mockBucketMethods = {
    upload: jest.fn(),
  };

  return {
    storage: {
      from: jest.fn(() => mockBucketMethods),
    },
  };
}
