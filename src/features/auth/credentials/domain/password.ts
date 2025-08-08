import { Result } from '@/common/application/result';

import { validatePassword } from '../interface/validation/password.schema';

export class Password {
  private readonly _value: string;

  private constructor(value: string) {
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
