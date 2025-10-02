import { z } from 'zod';

import { Result } from '@/common/application/result/result';
import {
  type IValidator,
  ValidationError,
} from '@/common/application/validator/validator.interface';

z.config({
  jitless: true,
});

export class ZodValidator implements IValidator {
  validate<T>(
    value: unknown,
    schema: z.ZodSchema<T>,
    errorMessage: string = 'Validation failed.',
  ) {
    const result = schema.safeParse(value);

    if (!result.success) {
      const { error } = result;

      const issues = error.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
      }));

      return Result.fail(new ValidationError(errorMessage, issues));
    }

    return Result.ok(result.data);
  }
}
