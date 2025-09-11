import { z } from 'zod';

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
