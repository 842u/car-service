import { z } from 'zod';

import { validatorIssueSchema } from '@/common/application/validator/validator.interface';
import { createApiResponseSchema } from '@/common/interface/api/response.schema';
import { userDtoSchema } from '@/user/application/dto/user-dto';
import { avatarUrlSchema } from '@/user/domain/user/value-objects/avatar-url/avatar-url.schema';

z.config({
  jitless: true,
});

const userAvatarUrlChangeApiResponseErrorSchema = z.object({
  message: z.string(),
  issues: z.array(validatorIssueSchema).optional(),
});

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

export const userAvatarUrlChangeApiContractSchema = z.object({
  avatarUrl: avatarUrlSchema,
});

export type UserAvatarUrlChangeApiContract = z.infer<
  typeof userAvatarUrlChangeApiContractSchema
>;
