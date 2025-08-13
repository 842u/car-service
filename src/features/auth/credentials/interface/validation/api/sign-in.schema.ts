import { z } from 'zod';

import { ValidationError } from '@/common/application/errors/validation';
import { createApiResponseSchema } from '@/common/interface/api/response.schema';
import { Result } from '@/common/interface/result/result';
import { toValidationIssue } from '@/common/utils/zod';

z.config({
  jitless: true,
});

const signInApiResponseDataSchema = z.object({ id: z.string() });
const signInApiResponseErrorSchema = z.object({ message: z.string() });

const signInApiResponseSchema = createApiResponseSchema(
  signInApiResponseDataSchema,
  signInApiResponseErrorSchema,
);

export type SignInApiResponseData = z.infer<typeof signInApiResponseDataSchema>;

export type SignInApiResponseError = z.infer<
  typeof signInApiResponseErrorSchema
>;

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
