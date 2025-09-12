import { z } from 'zod';

import { issueSchema } from '@/common/application/validation/validator.interface';
import { createApiResponseSchema } from '@/common/interface/api/response.schema';

z.config({
  jitless: true,
});

const signUpApiResponseErrorSchema = z.object({
  message: z.string(),
  issues: z.array(issueSchema).optional(),
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
