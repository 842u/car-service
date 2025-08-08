import { z } from 'zod';

import { ValidationError } from '@/common/application/errors/validation';
import { Result } from '@/common/application/result';
import { toValidationIssue } from '@/common/utils/zod';

z.config({
  jitless: true,
});

export const PASSWORD_REQUIRED_MESSAGE = 'Password is required.';
export const PASSWORD_TYPE_MESSAGE = 'Password must be a string.';
export const MIN_PASSWORD_LENGTH = 6;
export const MIN_PASSWORD_LENGTH_MESSAGE = `Minimum password length is ${MIN_PASSWORD_LENGTH}.`;
export const MAX_PASSWORD_LENGTH = 72;
export const MAX_PASSWORD_LENGTH_MESSAGE = `Maximum password length is ${MAX_PASSWORD_LENGTH}.`;

export const passwordSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? PASSWORD_REQUIRED_MESSAGE
        : PASSWORD_TYPE_MESSAGE,
  })
  .trim()
  .min(MIN_PASSWORD_LENGTH, { error: MIN_PASSWORD_LENGTH_MESSAGE })
  .max(MAX_PASSWORD_LENGTH, { error: MAX_PASSWORD_LENGTH_MESSAGE });

export function validatePassword(value: string) {
  const result = passwordSchema.safeParse(value);

  if (!result.success) {
    const { error } = result;

    const issues = error.issues.map((issue) => toValidationIssue(issue));

    return Result.fail(
      new ValidationError('Password validation failed.', issues),
    );
  }

  const { data } = result;

  return Result.ok(data);
}
