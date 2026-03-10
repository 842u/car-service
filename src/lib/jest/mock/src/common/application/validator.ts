import type { Validator } from '@/common/application/validator';

export function createMockValidator() {
  return {
    validate: jest.fn(),
  } as jest.Mocked<Validator>;
}
