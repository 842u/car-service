import { z } from 'zod';

import { issueSchema } from '@/common/application/validator/validator.interface';
import { createApiResponseSchema } from '@/common/interface/api/response.schema';
import { userDtoSchema } from '@/user/application/dtos/user-dto';

z.config({
  jitless: true,
});

const signUpApiResponseErrorSchema = z.object({
  message: z.string(),
  issues: z.array(issueSchema).optional(),
});

const signUpApiResponseDataSchema = userDtoSchema;

export const signUpApiResponseSchema = createApiResponseSchema(
  signUpApiResponseDataSchema,
  signUpApiResponseErrorSchema,
);

export type SignUpApiResponseData = z.infer<typeof signUpApiResponseDataSchema>;

export type SignUpApiResponseError = z.infer<
  typeof signUpApiResponseErrorSchema
>;
