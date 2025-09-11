import type { Result } from '@/common/application/result/result';

type ValidationIssue = {
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

export interface Validator<T> {
  validate(value: unknown): Result<T, ValidationError>;
}
