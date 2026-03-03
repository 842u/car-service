import type { HttpClient } from '@/common/application/http-client';

export function createMockHttpClient() {
  return {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
    getController: jest.fn(),
  } as jest.Mocked<HttpClient>;
}
