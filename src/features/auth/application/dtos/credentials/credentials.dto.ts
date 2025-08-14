import { z } from 'zod';

import { ValidationError } from '@/common/application/errors/validation';
import { Result } from '@/common/interface/result/result';
import { toValidationIssue } from '@/common/utils/zod';

z.config({
  jitless: true,
});

const credentialsDtoSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type CredentialsDto = z.infer<typeof credentialsDtoSchema>;

export function validateCredentialsDto(data: unknown) {
  const result = credentialsDtoSchema.safeParse(data);

  if (!result.success) {
    const { error } = result;

    const issues = error.issues.map((issue) => toValidationIssue(issue));

    return Result.fail(new ValidationError('Data validation failed.', issues));
  }

  const { data: resultData } = result;

  return Result.ok(resultData);
}
