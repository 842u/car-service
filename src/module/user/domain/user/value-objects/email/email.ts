/**
 * Private constructor used with static factory method to avoid creating instances with malformed data.
 */

import { Result } from '@/common/application/result/result';
import { ValueObject } from '@/common/domain/value-object/value-object';
import {
  emailSchema,
  emailValidator,
} from '@/user/domain/user/value-objects/email/email.schema';

export class Email extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string) {
    const result = emailValidator.validate(
      value,
      emailSchema,
      'Email validation failed.',
    );

    if (!result.success) {
      return Result.fail(result.error);
    }

    return Result.ok(new Email(value));
  }
}
