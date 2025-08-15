import { z } from 'zod';

import { ValidationError } from '@/common/application/errors/validation';
import { Result } from '@/common/interface/result/result';
import { toValidationIssue } from '@/common/utils/zod';

z.config({
  jitless: true,
});

const ID_REQUIRED_MESSAGE = 'ID is required.';
const ID_TYPE_MESSAGE = 'ID must be a UUID.';

const idSchema = z.uuid({
  error: (issue) =>
    issue.input === undefined ? ID_REQUIRED_MESSAGE : ID_TYPE_MESSAGE,
});

export function validateId(value: unknown) {
  const result = idSchema.safeParse(value);

  if (!result.success) {
    const { error } = result;

    const issues = error.issues.map((issue) => toValidationIssue(issue));

    return Result.fail(new ValidationError('Email validation failed.', issues));
  }

  const { data } = result;

  return Result.ok(data);
}
