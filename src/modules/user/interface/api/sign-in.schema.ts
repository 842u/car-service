import { z } from 'zod';

import { createApiResponseSchema } from '@/common/interface/api/response.schema';

z.config({
  jitless: true,
});

const signInApiResponseDataSchema = z.object({ id: z.string() });
const signInApiResponseErrorSchema = z.object({ message: z.string() });

export const signInApiResponseSchema = createApiResponseSchema(
  signInApiResponseDataSchema,
  signInApiResponseErrorSchema,
);

export type SignInApiResponseData = z.infer<typeof signInApiResponseDataSchema>;

export type SignInApiResponseError = z.infer<
  typeof signInApiResponseErrorSchema
>;
