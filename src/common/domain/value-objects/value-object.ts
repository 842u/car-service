import type { Result } from '@/common/interface/result/result';

export abstract class ValueObject {
  static create(_: unknown): Result<unknown, unknown> {
    throw new Error('Create method of a Value Object not implemented.');
  }

  abstract get value(): unknown;
}
