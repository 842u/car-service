import { z } from 'zod';

import { Result } from '@/common/application/result/result';
import {
  ValidationError,
  type Validator,
} from '@/common/application/validation/validator.interface';

z.config({
  jitless: true,
});

export class ZodValidator<T> implements Validator<T> {
  constructor(
    private readonly schema: z.ZodSchema<T>,
    private readonly errorMessage: string = 'Validation failed.',
  ) {}

  validate(value: unknown) {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      const { error } = result;

      const issues = error.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
      }));

      return Result.fail(new ValidationError(this.errorMessage, issues));
    }

    return Result.ok(result.data);
  }
}
