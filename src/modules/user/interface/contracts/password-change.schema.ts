import { z } from 'zod';

import { ZodValidator } from '@/common/infrastructure/validation/zod-validator';
import { passwordSchema } from '@/user/domain/user/value-objects/password/password.schema';

z.config({
  jitless: true,
});

export const passwordChangeContractSchema = z
  .object({
    password: passwordSchema,
    passwordConfirm: passwordSchema,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords must match.',
    path: ['passwordConfirm'],
  });

export type PasswordChangeContract = z.infer<
  typeof passwordChangeContractSchema
>;

export const passwordChangeContractValidator = new ZodValidator(
  passwordChangeContractSchema,
  'Password change contract validation failed.',
);
