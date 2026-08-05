import { z } from 'zod';

import type { Result } from '@/common/application/result';

z.config({
  jitless: true,
});

export const validatorIssueSchema = z.object({
  path: z.array(z.union([z.string(), z.symbol(), z.number()])),
  message: z.string(),
});

export type ValidatorIssue = {
  path: Array<string | number | symbol>;
  message: string;
};

export class ValidatorError extends Error {
  readonly issues: ValidatorIssue[];

  constructor(message: string, issues: ValidatorIssue[] = []) {
    super(message);
    this.name = 'ValidationError';
    this.issues = issues;
  }
}

export interface Validator {
  validate<TData>(
    value: unknown,
    schema: { _output: TData },
    errorMessage?: string,
  ): Result<TData, ValidatorError>;
}
