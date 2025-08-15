import { z } from 'zod';

import { ValidationError } from '@/common/application/errors/validation';
import { createApiResponseSchema } from '@/common/interface/api/response.schema';
import { Result } from '@/common/interface/result/result';
import { toValidationIssue } from '@/common/utils/zod';

z.config({
  jitless: true,
});

const signUpApiResponseErrorSchema = z.object({
  message: z.string(),
});

const signUpApiResponseDataSchema = z.object({
  id: z.string(),
});

const signUpApiResponseSchema = createApiResponseSchema(
  signUpApiResponseDataSchema,
  signUpApiResponseErrorSchema,
);

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

export type SignUpApiResponseData = z.infer<typeof signUpApiResponseDataSchema>;

export type SignUpApiResponseError = z.infer<
  typeof signUpApiResponseErrorSchema
>;
