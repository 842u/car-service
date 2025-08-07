import { z } from 'zod';

import { ValidationError } from '@/common/application/errors/validation';
import { Result } from '@/common/application/result';
import { createApiResponseSchema } from '@/common/application/validation/api-response.schema';
import { toValidationIssue } from '@/common/utils/zod';

z.config({
  jitless: true,
});

const signInApiResponseDataSchema = z
  .object({ id: z.string() })
  .catchall(z.unknown());

const signInApiResponseSchema = createApiResponseSchema(
  signInApiResponseDataSchema,
);

export type SignInApiResponseData = z.infer<typeof signInApiResponseDataSchema>;

export type SignInApiResponse = z.infer<typeof signInApiResponseSchema>;

export function validateSignInApiResponse(data: unknown) {
  const result = signInApiResponseSchema.safeParse(data);

  if (!result.success) {
    const { error } = result;

    const issues = error.issues.map((issue) => toValidationIssue(issue));

    return Result.fail(
      new ValidationError('Invalid API response format.', issues),
    );
  }

  const { data: resultData } = result;

  return Result.ok(resultData);
}
