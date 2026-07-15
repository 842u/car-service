import { jest } from '@jest/globals';

import type { Validator } from '@/common/application/validator';

export function createMockValidator(): jest.Mocked<Validator> {
  return {
    // `validate` is generic. A mock fixes its type parameter at creation, so no
    // mock call signature can match the generic one. The cast is scoped to this
    // member, leaving the surrounding object checked against `Validator`.
    validate: jest.fn() as unknown as jest.Mocked<Validator>['validate'],
  };
}
