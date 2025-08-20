import { z } from 'zod';

import { ZodValidator } from '@/common/infrastructure/validation/zod-validator';
import { passwordSchema } from '@/user/domain/user/value-objects/password/password.schema';

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

export type PasswordChangeFormData = z.infer<typeof passwordChangeFormSchema>;

export const passwordChangeFormDataValidator = new ZodValidator(
  passwordChangeFormSchema,
  'Password change form data validation failed.',
);
