import { Result } from '@/common/application/result/result';
import { ValueObject } from '@/common/domain/value-objects/value-object';
import { passwordValidator } from '@/user/domain/user/value-objects/password/password.schema';

export class Password extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string) {
    const result = passwordValidator.validate(value);

    if (!result.success) {
      return Result.fail(result.error);
    }

    return Result.ok(new Password(value));
  }
}
