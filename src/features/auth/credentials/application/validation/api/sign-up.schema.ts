import { z } from 'zod';

import { createApiResponseSchema } from '@/common/application/validation/api-response.schema';

z.config({
  jitless: true,
});

const responseDataSchema = z.object({ id: z.string().optional() });

export const signUpApiResponseSchema =
  createApiResponseSchema(responseDataSchema);
