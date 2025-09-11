import { z } from 'zod';

import { createApiResponseSchema } from '@/common/interface/api/response.schema';

z.config({
  jitless: true,
});

const passwordChangeApiResponseDataSchema = z.object({ id: z.string() });
const passwordChangeApiResponseErrorSchema = z.object({ message: z.string() });

export const passwordChangeApiResponseSchema = createApiResponseSchema(
  passwordChangeApiResponseDataSchema,
  passwordChangeApiResponseErrorSchema,
);

export type PasswordChangeApiResponseData = z.infer<
  typeof passwordChangeApiResponseDataSchema
>;

export type PasswordChangeApiResponseError = z.infer<
  typeof passwordChangeApiResponseErrorSchema
>;
