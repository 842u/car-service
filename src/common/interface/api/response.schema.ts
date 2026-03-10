import { z } from 'zod';

import { validatorIssueSchema } from '@/common/application/validator';

import type { ApiResponseError } from './response';

z.config({
  jitless: true,
});

function createFailureApiResponseResultSchema<
  E extends z.ZodType<ApiResponseError>,
>(errorSchema: E) {
  return z.object({
    success: z.literal(false),
    status: z.number(),
    error: errorSchema,
  });
}

function createSuccessApiResponseResultSchema<T extends z.ZodTypeAny>(
  dataSchema: T,
) {
  return z.object({
    success: z.literal(true),
    status: z.number(),
    data: dataSchema,
  });
}

export function createApiResponseSchema<
  T extends z.ZodTypeAny,
  E extends z.ZodType<ApiResponseError>,
>(dataSchema: T, errorSchema: E) {
  const successSchema = createSuccessApiResponseResultSchema(dataSchema);
  const failureSchema = createFailureApiResponseResultSchema(errorSchema);

  return z.union([successSchema, failureSchema]);
}

export const apiResponseErrorSchema = z.object({
  message: z.string(),
  issues: z.array(validatorIssueSchema).optional(),
});
