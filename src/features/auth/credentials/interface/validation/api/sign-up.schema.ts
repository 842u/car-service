import { z } from 'zod';

import { ValidationError } from '@/common/application/errors/validation';
import { Result } from '@/common/application/result';
import { createApiResponseSchema } from '@/common/application/validation/api-response.schema';
import { toValidationIssue } from '@/common/utils/zod';

z.config({
  jitless: true,
});

const signUpApiResponseDataSchema = z.object({ id: z.string().optional() });

const signUpApiResponseSchema = createApiResponseSchema(
  signUpApiResponseDataSchema,
);

export type SignUpApiResponseData = z.infer<typeof signUpApiResponseDataSchema>;

export type SignUpApiResponse = z.infer<typeof signUpApiResponseSchema>;

export function validateSignUpApiResponse(data: unknown) {
  const result = signUpApiResponseSchema.safeParse(data);

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
