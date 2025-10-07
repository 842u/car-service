import { z } from 'zod';

import { validatorIssueSchema } from '@/common/application/validator/validator.interface';
import { createApiResponseSchema } from '@/common/interface/api/response.schema';
import { userDtoSchema } from '@/user/application/dto/user-dto';
import { emailSchema } from '@/user/domain/user/value-object/email/email.schema';
import { passwordSchema } from '@/user/domain/user/value-object/password/password.schema';

z.config({
  jitless: true,
});

const signUpApiResponseErrorSchema = z.object({
  message: z.string(),
  issues: z.array(validatorIssueSchema).optional(),
});

const signUpApiResponseDataSchema = userDtoSchema;

export const signUpApiResponseSchema = createApiResponseSchema(
  signUpApiResponseDataSchema,
  signUpApiResponseErrorSchema,
);

export type SignUpApiResponseData = z.infer<typeof signUpApiResponseDataSchema>;

export type SignUpApiResponseError = z.infer<
  typeof signUpApiResponseErrorSchema
>;

export const signUpApiRequestSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type SignUpApiRequest = z.infer<typeof signUpApiRequestSchema>;
