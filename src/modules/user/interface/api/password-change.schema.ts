import { z } from 'zod';

import { validatorIssueSchema } from '@/common/application/validator/validator.interface';
import { createApiResponseSchema } from '@/common/interface/api/response.schema';
import { userDtoSchema } from '@/user/application/dtos/user-dto';
import { passwordSchema } from '@/user/domain/user/value-objects/password/password.schema';

z.config({
  jitless: true,
});

const passwordChangeApiResponseDataSchema = userDtoSchema;

const passwordChangeApiResponseErrorSchema = z.object({
  message: z.string(),
  issues: z.array(validatorIssueSchema).optional(),
});

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

export const passwordChangeApiContractSchema = z
  .object({
    password: passwordSchema,
    passwordConfirm: passwordSchema,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords must match.',
    path: ['passwordConfirm'],
  });

export type PasswordChangeApiContract = z.infer<
  typeof passwordChangeApiContractSchema
>;
