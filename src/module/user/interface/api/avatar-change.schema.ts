import { z } from 'zod';

import {
  apiResponseErrorSchema,
  createApiResponseSchema,
} from '@/common/interface/api/response.schema';
import { userDtoSchema } from '@/user/application/dto/user-dto';
import { avatarUrlSchema } from '@/user/domain/user/value-object/avatar-url/avatar-url.schema';

z.config({
  jitless: true,
});

const userAvatarUrlChangeApiResponseErrorSchema = apiResponseErrorSchema;

const userAvatarUrlChangeApiResponseDataSchema = userDtoSchema;

export const userAvatarUrlChangeApiResponseSchema = createApiResponseSchema(
  userAvatarUrlChangeApiResponseDataSchema,
  userAvatarUrlChangeApiResponseErrorSchema,
);

export type UserAvatarUrlChangeApiResponseData = z.infer<
  typeof userAvatarUrlChangeApiResponseDataSchema
>;

export type UserAvatarUrlChangeApiResponseError = z.infer<
  typeof userAvatarUrlChangeApiResponseErrorSchema
>;

export const userAvatarUrlChangeApiRequestSchema = z.object({
  avatarUrl: avatarUrlSchema,
});

export type UserAvatarUrlChangeApiRequest = z.infer<
  typeof userAvatarUrlChangeApiRequestSchema
>;
