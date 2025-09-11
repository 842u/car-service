import { z } from 'zod';

import { createApiResponseSchema } from '@/common/interface/api/response.schema';

z.config({
  jitless: true,
});

const signUpApiResponseErrorSchema = z.object({
  message: z.string(),
});

const signUpApiResponseDataSchema = z.object({
  id: z.string(),
});

export const signUpApiResponseSchema = createApiResponseSchema(
  signUpApiResponseDataSchema,
  signUpApiResponseErrorSchema,
);

export type SignUpApiResponseData = z.infer<typeof signUpApiResponseDataSchema>;

export type SignUpApiResponseError = z.infer<
  typeof signUpApiResponseErrorSchema
>;
