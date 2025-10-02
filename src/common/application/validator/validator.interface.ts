import { z } from 'zod';

import type { Result } from '@/common/application/result/result';

z.config({
  jitless: true,
});

export const issueSchema = z.object({
  path: z.array(z.union([z.string(), z.symbol(), z.number()])),
  message: z.string(),
});

export type ValidationIssue = {
  path: Array<string | number | symbol>;
  message: string;
};

export class ValidationError extends Error {
  readonly issues: ValidationIssue[];

  constructor(message: string, issues: ValidationIssue[] = []) {
    super(message);
    this.name = 'ValidationError';
    this.issues = issues;
  }
}

export interface IValidator {
  validate<T>(
    value: unknown,
    schema: { _output: T },
    errorMessage?: string,
  ): Result<T, ValidationError>;
}
