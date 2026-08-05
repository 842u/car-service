import { z } from 'zod';

import { validatorIssueSchema } from '@/common/application/validator';

import type { ApiResponseError } from './response';

z.config({
  jitless: true,
});

function createFailureApiResponseResultSchema<
  TErrorSchema extends z.ZodType<ApiResponseError>,
>(errorSchema: TErrorSchema) {
  return z.object({
    success: z.literal(false),
    status: z.number(),
    error: errorSchema,
  });
}

function createSuccessApiResponseResultSchema<TDataSchema extends z.ZodTypeAny>(
  dataSchema: TDataSchema,
) {
  return z.object({
    success: z.literal(true),
    status: z.number(),
    data: dataSchema,
  });
}

export function createApiResponseSchema<
  TDataSchema extends z.ZodTypeAny,
  TErrorSchema extends z.ZodType<ApiResponseError>,
>(dataSchema: TDataSchema, errorSchema: TErrorSchema) {
  const successSchema = createSuccessApiResponseResultSchema(dataSchema);
  const failureSchema = createFailureApiResponseResultSchema(errorSchema);

  return z.union([successSchema, failureSchema]);
}

export const apiResponseErrorSchema = z.object({
  message: z.string(),
  issues: z.array(validatorIssueSchema).optional(),
});
