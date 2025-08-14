import { z } from 'zod';

import { ValidationError } from '@/common/application/errors/validation';
import { Result } from '@/common/interface/result/result';
import { toValidationIssue } from '@/common/utils/zod';

import { emailSchema } from '../../domain/value-objects/email/email.schema';
import {
  PASSWORD_REQUIRED_MESSAGE,
  PASSWORD_TYPE_MESSAGE,
} from '../../domain/value-objects/password/password.schema';

z.config({
  jitless: true,
});

export const signInFormSchema = z.object({
  email: emailSchema,
  password: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? PASSWORD_REQUIRED_MESSAGE
          : PASSWORD_TYPE_MESSAGE,
    })
    .trim()
    .min(1, PASSWORD_REQUIRED_MESSAGE),
});

export type SignInFormData = z.infer<typeof signInFormSchema>;

export function validateSignInFormData(data: unknown) {
  const result = signInFormSchema.safeParse(data);

  if (!result.success) {
    const { error } = result;

    const issues = error.issues.map((issue) => toValidationIssue(issue));

    return Result.fail(new ValidationError('Data validation failed.', issues));
  }

  const { data: resultData } = result;

  return Result.ok(resultData);
}
