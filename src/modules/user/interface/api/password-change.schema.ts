import { z } from 'zod';

import { issueSchema } from '@/common/application/validation/validator.interface';
import { createApiResponseSchema } from '@/common/interface/api/response.schema';

z.config({
  jitless: true,
});

const passwordChangeApiResponseDataSchema = z.object({ id: z.string() });

const passwordChangeApiResponseErrorSchema = z.object({
  message: z.string(),
  issues: z.array(issueSchema).optional(),
});

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
