import { z } from 'zod';

import { issueSchema } from '@/common/application/validator/validator.interface';
import { createApiResponseSchema } from '@/common/interface/api/response.schema';
import { userDtoSchema } from '@/user/application/dtos/user-dto';

z.config({
  jitless: true,
});

const signInApiResponseDataSchema = userDtoSchema;

const signInApiResponseErrorSchema = z.object({
  message: z.string(),
  issues: z.array(issueSchema).optional(),
});

export const signInApiResponseSchema = createApiResponseSchema(
  signInApiResponseDataSchema,
  signInApiResponseErrorSchema,
);

export type SignInApiResponseData = z.infer<typeof signInApiResponseDataSchema>;

export type SignInApiResponseError = z.infer<
  typeof signInApiResponseErrorSchema
>;
