import { Result } from '@/common/application/result/result';
import { ValueObject } from '@/common/domain/value-object/value-object';
import {
  passwordSchema,
  passwordValidator,
} from '@/user/domain/user/value-object/password/password.schema';

export class Password extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string) {
    const result = passwordValidator.validate(
      value,
      passwordSchema,
      'Password validation failed.',
    );

    if (!result.success) {
      return Result.fail(result.error);
    }

    return Result.ok(new Password(value));
  }
}
