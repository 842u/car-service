/**
 * Private constructor used with static factory method to avoid creating instances with malformed data.
 */

import { ValueObject } from '@/common/domain/value-objects/value-object';
import { Result } from '@/common/interface/result/result';
import { emailValidator } from '@/user/domain/value-objects/email/email.schema';

export class Email extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string) {
    const result = emailValidator.validate(value);

    if (!result.success) {
      return Result.fail(result.error);
    }

    return Result.ok(new Email(value));
  }
}
