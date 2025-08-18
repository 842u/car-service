import { z } from 'zod';

import { passwordSchema } from '@/user/domain/value-objects/password/password.schema';

z.config({
  jitless: true,
});

export const passwordChangeFormSchema = z
  .object({
    password: passwordSchema,
    passwordConfirm: passwordSchema,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords must match.',
    path: ['passwordConfirm'],
  });

export type PasswordChangeFormValues = z.infer<typeof passwordChangeFormSchema>;
