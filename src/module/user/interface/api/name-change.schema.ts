import { z } from 'zod';

import { validatorIssueSchema } from '@/common/application/validator/validator';
import { createApiResponseSchema } from '@/common/interface/api/response.schema';
import { userDtoSchema } from '@/user/application/dto/user-dto';
import { nameSchema } from '@/user/domain/user/value-object/name/name.schema';

z.config({
  jitless: true,
});

const userNameChangeApiResponseErrorSchema = z.object({
  message: z.string(),
  issues: z.array(validatorIssueSchema).optional(),
});

const userNameChangeApiResponseDataSchema = userDtoSchema;

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

export const userNameChangeApiRequestSchema = z.object({
  name: nameSchema,
});

export type UserNameChangeApiRequest = z.infer<
  typeof userNameChangeApiRequestSchema
>;
