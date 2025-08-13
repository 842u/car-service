import { z } from 'zod';

import { ValidationError } from '@/common/application/errors/validation';
import { Result } from '@/common/interface/result/result';
import { toValidationIssue } from '@/common/utils/zod';

import { emailSchema } from './email.schema';
import { passwordSchema } from './password.schema';

z.config({
  jitless: true,
});

export const signUpFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type SignUpFormData = z.infer<typeof signUpFormSchema>;

export function validateSignUpFormData(data: unknown) {
  const result = signUpFormSchema.safeParse(data);

  if (!result.success) {
    const { error } = result;

    const issues = error.issues.map((issue) => toValidationIssue(issue));

    return Result.fail(new ValidationError('Data validation failed.', issues));
  }

  const { data: resultData } = result;

  return Result.ok(resultData);
}
