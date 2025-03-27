import { z } from 'zod';

import { emailSchema, passwordSchema } from './common';

export const signUpEmailAuthFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signInEmailAuthFormSchema = z.object({
  email: emailSchema,
  password: z
    .string({
      required_error: 'Password is required.',
      invalid_type_error: 'Password must be a string.',
    })
    .trim()
    .min(1, 'Password is required.'),
});

export type EmailAuthFormValues = z.infer<
  typeof signUpEmailAuthFormSchema | typeof signInEmailAuthFormSchema
>;
