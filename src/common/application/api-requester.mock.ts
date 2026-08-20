import { jest } from '@jest/globals';

import type { ApiRequester } from '@/common/application/api-requester';

export function createMockApiRequester(): jest.Mocked<ApiRequester> {
  return {
    // `send` is generic. A mock fixes its type parameter at creation, so no
    // mock call signature can match the generic one. The cast is scoped to this
    // member, leaving the surrounding object checked against `ApiRequester`.
    send: jest.fn() as unknown as jest.Mocked<ApiRequester>['send'],
  };
}
