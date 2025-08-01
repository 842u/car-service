import { z } from 'zod';

import { emailSchema, passwordSchema } from './common';

z.config({
  jitless: true,
});

export const signUpEmailAuthFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signInEmailAuthFormSchema = z.object({
  email: emailSchema,
  password: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'Password is required.'
          : 'Password must be a string.',
    })
    .trim()
    .min(1, 'Password is required.'),
});

export type EmailAuthFormValues = z.infer<
  typeof signUpEmailAuthFormSchema | typeof signInEmailAuthFormSchema
>;
