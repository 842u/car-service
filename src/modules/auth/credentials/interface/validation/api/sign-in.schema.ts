import { z } from 'zod';

import { ZodValidator } from '@/common/infrastructure/validation/zod-validator';
import { createApiResponseSchema } from '@/common/interface/api/response.schema';

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

export const signInApiResponseValidator = new ZodValidator(
  signInApiResponseSchema,
  'Invalid API response format.',
);
