import { z } from 'zod';

import { ZodValidator } from '@/common/infrastructure/validation/zod-validator';
import { passwordSchema } from '@/user/domain/user/value-objects/password/password.schema';

z.config({
  jitless: true,
});

export const changeUserPasswordContractSchema = z
  .object({
    password: passwordSchema,
    passwordConfirm: passwordSchema,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords must match.',
    path: ['passwordConfirm'],
  });

export type ChangeUserPasswordContract = z.infer<
  typeof changeUserPasswordContractSchema
>;

export const changeUserPasswordContractValidator = new ZodValidator(
  changeUserPasswordContractSchema,
  'Change user password contract validation failed.',
);
