import { z } from 'zod';

import {
  apiResponseErrorSchema,
  createApiResponseSchema,
} from '@/common/interface/api/response.schema';
import { userDtoSchema } from '@/user/application/dto/user';

z.config({
  jitless: true,
});

const avatarUrlChangeApiResponseErrorSchema = apiResponseErrorSchema;

const avatarUrlChangeApiResponseDataSchema = userDtoSchema;

export const avatarUrlChangeApiResponseSchema = createApiResponseSchema(
  avatarUrlChangeApiResponseDataSchema,
  avatarUrlChangeApiResponseErrorSchema,
);

export type AvatarUrlChangeApiResponseData = z.infer<
  typeof avatarUrlChangeApiResponseDataSchema
>;

export type AvatarUrlChangeApiResponseError = z.infer<
  typeof avatarUrlChangeApiResponseErrorSchema
>;

export const avatarUrlChangeApiRequestSchema = z.object({
  avatarUrl: z.string(),
});

export type AvatarUrlChangeApiRequest = z.infer<
  typeof avatarUrlChangeApiRequestSchema
>;
