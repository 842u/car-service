import { ValueObject } from '@/common/domain/value-objects/value-object';
import { Result } from '@/common/interface/result/result';
import { usernameValidator } from '@/user/domain/value-objects/username/username.schema';

export class Username extends ValueObject {
  private readonly _value: string;

  private constructor(value: string) {
    super();
    this._value = value;
  }

  static create(value: string) {
    const result = usernameValidator.validate(value);

    if (!result.success) {
      return Result.fail(result.error);
    }

    return Result.ok(new Username(value));
  }

  get value() {
    return this._value;
  }
}
