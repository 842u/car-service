import { z } from 'zod';

import { issueSchema } from '@/common/application/validation/validator.interface';
import { createApiResponseSchema } from '@/common/interface/api/response.schema';
import type { UserDto } from '@/user/application/dtos/user-dto';

z.config({
  jitless: true,
});

const userNameChangeApiResponseErrorSchema = z.object({
  message: z.string(),
  issues: z.array(issueSchema).optional(),
});

const userNameChangeApiResponseDataSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  avatarUrl: z.string().optional().nullable(),
}) satisfies z.ZodType<UserDto>;

export const userNameChangeApiResponseSchema = createApiResponseSchema(
  userNameChangeApiResponseDataSchema,
  userNameChangeApiResponseErrorSchema,
);

export type UserNameChangeApiResponseData = z.infer<
  typeof userNameChangeApiResponseDataSchema
>;

export type UserNameChangeApiResponseError = z.infer<
  typeof userNameChangeApiResponseErrorSchema
>;
