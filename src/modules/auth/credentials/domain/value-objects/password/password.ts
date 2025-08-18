import { ValueObject } from '@/common/domain/value-objects/value-object';
import { Result } from '@/common/interface/result/result';

import { validatePassword } from './password.schema';

export class Password extends ValueObject {
  private readonly _value: string;

  private constructor(value: string) {
    super();
    this._value = value;
  }

  static create(value: string) {
    const result = validatePassword(value);

    if (!result.success) {
      return Result.fail(result.error);
    }

    return Result.ok(new Password(value));
  }

  get value() {
    return this._value;
  }
}
