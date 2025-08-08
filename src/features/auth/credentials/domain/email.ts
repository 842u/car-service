/**
 * Private constructor used with static factory method to avoid creating instances with malformed data.
 */

import { Result } from '@/common/application/result';

import { validateEmail } from '../interface/validation/email.schema';

export class Email {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string) {
    const result = validateEmail(value);

    if (!result.success) {
      return Result.fail(result.error);
    }

    return Result.ok(new Email(value));
  }

  get value() {
    return this._value;
  }
}
