import { z } from 'zod';

import {
  apiResponseErrorSchema,
  createApiResponseSchema,
} from '@/common/interface/api/response.schema';
import { userDtoSchema } from '@/user/application/dto/user';

z.config({
  jitless: true,
});

const signUpApiResponseErrorSchema = apiResponseErrorSchema;

const signUpApiResponseDataSchema = userDtoSchema;

export const signUpApiResponseSchema = createApiResponseSchema(
  signUpApiResponseDataSchema,
  signUpApiResponseErrorSchema,
);

export type SignUpApiResponseData = z.infer<typeof signUpApiResponseDataSchema>;

export type SignUpApiResponseError = z.infer<
  typeof signUpApiResponseErrorSchema
>;

export const signUpApiRequestSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type SignUpApiRequest = z.infer<typeof signUpApiRequestSchema>;
