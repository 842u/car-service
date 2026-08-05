import { z } from 'zod';

import { Result } from '@/common/application/result';
import { type Validator, ValidatorError } from '@/common/application/validator';

z.config({
  jitless: true,
});

export class ZodValidator implements Validator {
  validate<TData>(
    value: unknown,
    schema: z.ZodSchema<TData>,
    errorMessage: string = 'Validation failed.',
  ) {
    const result = schema.safeParse(value);

    if (!result.success) {
      const { error } = result;

      const issues = error.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
      }));

      return Result.fail(new ValidatorError(errorMessage, issues));
    }

    return Result.ok(result.data);
  }
}
