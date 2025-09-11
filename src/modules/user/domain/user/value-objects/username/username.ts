import { Result } from '@/common/application/result/result';
import { ValueObject } from '@/common/domain/value-objects/value-object';
import { usernameValidator } from '@/user/domain/user/value-objects/username/username.schema';

export class Username extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string) {
    const result = usernameValidator.validate(value);

    if (!result.success) {
      return Result.fail(result.error);
    }

    return Result.ok(new Username(value));
  }
}
