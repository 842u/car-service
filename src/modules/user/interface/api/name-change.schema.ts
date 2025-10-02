import { z } from 'zod';

import { issueSchema } from '@/common/application/validator/validator.interface';
import { createApiResponseSchema } from '@/common/interface/api/response.schema';
import { userDtoSchema } from '@/user/application/dtos/user-dto';
import { nameSchema } from '@/user/domain/user/value-objects/name/name.schema';

z.config({
  jitless: true,
});

const userNameChangeApiResponseErrorSchema = z.object({
  message: z.string(),
  issues: z.array(issueSchema).optional(),
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

export const userNameChangeApiContractSchema = z.object({
  name: nameSchema,
});

export type UserNameChangeApiContract = z.infer<
  typeof userNameChangeApiContractSchema
>;
