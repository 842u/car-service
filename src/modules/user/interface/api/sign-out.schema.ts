import { z } from 'zod';

import { createApiResponseSchema } from '@/common/interface/api/response.schema';

z.config({
  jitless: true,
});

const signOutApiResponseDataSchema = z.undefined();
const signOutApiResponseErrorSchema = z.object({ message: z.string() });

export const signOutApiResponseSchema = createApiResponseSchema(
  signOutApiResponseDataSchema,
  signOutApiResponseErrorSchema,
);

export type SignOutApiResponseData = z.infer<
  typeof signOutApiResponseDataSchema
>;

export type SignOutApiResponseError = z.infer<
  typeof signOutApiResponseErrorSchema
>;
