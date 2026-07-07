import { z } from 'zod';

import { passwordSchema } from '@/user/domain/user/value-object/password/password.schema';

z.config({
  jitless: true,
});

export const passwordChangeFormDataSchema = z
  .object({
    password: passwordSchema,
    passwordConfirm: passwordSchema,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords must match.',
    path: ['passwordConfirm'],
  });

export type PasswordChangeFormData = z.infer<
  typeof passwordChangeFormDataSchema
>;
