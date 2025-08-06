import { z } from 'zod';

import { createApiResponseSchema } from '@/common/application/validation/api-response.schema';

z.config({
  jitless: true,
});

const responseDataSchema = z.object({ id: z.string() }).catchall(z.unknown());

export type ResponseData = z.infer<typeof responseDataSchema>;

export const signInApiResponseSchema =
  createApiResponseSchema(responseDataSchema);
