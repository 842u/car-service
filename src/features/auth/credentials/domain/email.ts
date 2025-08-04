/**
 * Private constructor used with static factory method to avoid creating instances with malformed data.
 */

import { Result } from '@/common/application/result';

import { validateEmail } from '../application/validation/email.schema';

export class Email {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string) {
    const result = validateEmail(value);

    if (!result.isSuccess) {
      return Result.fail(result.error);
    }

    return Result.ok(new Email(value));
  }

  getEmail() {
    return this.value;
  }
}
