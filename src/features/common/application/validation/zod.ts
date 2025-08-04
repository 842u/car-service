import type { $ZodIssue } from 'zod/v4/core';

import type { ValidationIssue } from '../errors/validation';

export function toValidationIssue(issue: $ZodIssue): ValidationIssue {
  return {
    path: issue.path,
    message: issue.message,
  };
}
