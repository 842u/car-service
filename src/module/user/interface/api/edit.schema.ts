import { z } from 'zod';

import {
  apiResponseErrorSchema,
  createApiResponseSchema,
} from '@/common/interface/api/response.schema';
import { userDtoSchema } from '@/user/application/dto/user';

z.config({
  jitless: true,
});

const editUserApiResponseErrorSchema = apiResponseErrorSchema;

const editUserApiResponseDataSchema = userDtoSchema;

export const editUserApiResponseSchema = createApiResponseSchema(
  editUserApiResponseDataSchema,
  editUserApiResponseErrorSchema,
);

export type EditUserApiResponseData = z.infer<
  typeof editUserApiResponseDataSchema
>;

export type EditUserApiResponseError = z.infer<
  typeof editUserApiResponseErrorSchema
>;

export const editUserApiRequestSchema = z.object({
  name: z.string().optional(),
  avatarUrl: z.string().nullable().optional(),
});

export type EditUserApiRequest = z.infer<typeof editUserApiRequestSchema>;
