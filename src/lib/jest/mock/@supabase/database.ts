import type { PostgrestError } from '@supabase/supabase-js';

export function createMockSupabaseDatabaseModule() {
  return {
    from: jest.fn(),
    rpc: jest.fn(),
  };
}

export async function mockInternalMethodSuccess(mockData: unknown) {
  return Promise.resolve({
    data: mockData,
    error: null,
    count: null,
    status: 200,
    statusText: 'OK',
  });
}

export async function mockInternalMethodFailure(errorMessage: string) {
  return Promise.resolve({
    data: null,
    error: {
      message: errorMessage,
      code: 'error code',
      details: 'error details',
      hint: 'error hint',
      name: 'PostgrestError',
    } satisfies PostgrestError,
    count: null,
    status: 400,
    statusText: 'Bad Request',
  });
}
