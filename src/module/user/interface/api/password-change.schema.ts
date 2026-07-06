import { z } from 'zod';

import {
  apiResponseErrorSchema,
  createApiResponseSchema,
} from '@/common/interface/api/response.schema';
import { userDtoSchema } from '@/user/application/dto/user';

z.config({
  jitless: true,
});

const passwordChangeApiResponseDataSchema = userDtoSchema;

const passwordChangeApiResponseErrorSchema = apiResponseErrorSchema;

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

export const passwordChangeApiRequestSchema = z.object({
  password: z.string(),
  passwordConfirm: z.string(),
});

export type PasswordChangeApiRequest = z.infer<
  typeof passwordChangeApiRequestSchema
>;
