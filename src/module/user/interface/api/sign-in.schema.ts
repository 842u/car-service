import { z } from 'zod';

import {
  apiResponseErrorSchema,
  createApiResponseSchema,
} from '@/common/interface/api/response.schema';
import { userDtoSchema } from '@/user/application/dto/user';

z.config({
  jitless: true,
});

const signInApiResponseDataSchema = userDtoSchema;

const signInApiResponseErrorSchema = apiResponseErrorSchema;

export const signInApiResponseSchema = createApiResponseSchema(
  signInApiResponseDataSchema,
  signInApiResponseErrorSchema,
);

export type SignInApiResponseData = z.infer<typeof signInApiResponseDataSchema>;

export type SignInApiResponseError = z.infer<
  typeof signInApiResponseErrorSchema
>;

export const signInApiRequestSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type SignInApiRequest = z.infer<typeof signInApiRequestSchema>;
