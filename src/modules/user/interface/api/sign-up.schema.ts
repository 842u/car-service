import { z } from 'zod';

import { issueSchema } from '@/common/application/validation/validator.interface';
import { createApiResponseSchema } from '@/common/interface/api/response.schema';
import type { UserDto } from '@/user/application/dtos/user-dto';

z.config({
  jitless: true,
});

const signUpApiResponseErrorSchema = z.object({
  message: z.string(),
  issues: z.array(issueSchema).optional(),
});

const signUpApiResponseDataSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  avatarUrl: z.string().optional().nullable(),
}) satisfies z.ZodType<UserDto>;

export const signUpApiResponseSchema = createApiResponseSchema(
  signUpApiResponseDataSchema,
  signUpApiResponseErrorSchema,
);

export type SignUpApiResponseData = z.infer<typeof signUpApiResponseDataSchema>;

export type SignUpApiResponseError = z.infer<
  typeof signUpApiResponseErrorSchema
>;
