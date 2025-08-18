import { z } from 'zod';

import { ZodValidator } from '@/common/infrastructure/validation/zod-validator';
import { createApiResponseSchema } from '@/common/interface/api/response.schema';

z.config({
  jitless: true,
});

const signOutApiResponseDataSchema = z.undefined();
const signOutApiResponseErrorSchema = z.object({ message: z.string() });

const signOutApiResponseSchema = createApiResponseSchema(
  signOutApiResponseDataSchema,
  signOutApiResponseErrorSchema,
);

export type SignOutApiResponseData = z.infer<
  typeof signOutApiResponseDataSchema
>;

export type SignOutApiResponseError = z.infer<
  typeof signOutApiResponseErrorSchema
>;

export const signInApiResponseValidator = new ZodValidator(
  signOutApiResponseSchema,
  'Invalid API response format.',
);
