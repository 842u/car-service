import { z } from 'zod';

import { ValidationError } from '@/common/application/errors/validation';
import { Result } from '@/common/application/result';
import { toValidationIssue } from '@/common/utils/zod';

z.config({
  jitless: true,
});

export const EMAIL_REGEXP =
  /^(?!.*\.\.)(?!\.)(?!.*@.*\.{2,})(?!.*@-)(?!.*-@)[a-zA-Z0-9._%+-]+@([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,}$/i;
const EMAIL_REGEXP_MESSAGE = 'Enter a valid e-mail address.';
const EMAIL_REQUIRED_MESSAGE = 'Email is required.';
const EMAIL_TYPE_MESSAGE = 'Email must be a string.';
const MIN_EMAIL_LENGTH = 6;
const MIN_EMAIL_LENGTH_MESSAGE = `Minimum email length is ${MIN_EMAIL_LENGTH}.`;
const MAX_EMAIL_LENGTH = 254;
const MAX_EMAIL_LENGTH_MESSAGE = `Maximum email length is ${MAX_EMAIL_LENGTH}.`;

export const emailSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined ? EMAIL_REQUIRED_MESSAGE : EMAIL_TYPE_MESSAGE,
  })
  .trim()
  .min(MIN_EMAIL_LENGTH, { error: MIN_EMAIL_LENGTH_MESSAGE })
  .max(MAX_EMAIL_LENGTH, { error: MAX_EMAIL_LENGTH_MESSAGE })
  .regex(EMAIL_REGEXP, { error: EMAIL_REGEXP_MESSAGE });

export function validateEmail(value: string) {
  const result = emailSchema.safeParse(value);

  if (!result.success) {
    const { error } = result;

    const issues = error.issues.map((issue) => toValidationIssue(issue));

    return Result.fail(new ValidationError('Email validation failed.', issues));
  }

  const { data } = result;

  return Result.ok(data);
}
