import { jest } from '@jest/globals';

import type { HttpClient } from '@/common/application/http-client';

export function createMockHttpClient(): jest.Mocked<HttpClient> {
  return {
    request: jest.fn<HttpClient['request']>(),
    get: jest.fn<HttpClient['get']>(),
    post: jest.fn<HttpClient['post']>(),
    put: jest.fn<HttpClient['put']>(),
    delete: jest.fn<HttpClient['delete']>(),
    patch: jest.fn<HttpClient['patch']>(),
  };
}
