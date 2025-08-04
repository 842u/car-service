import { z } from 'zod';

import { emailSchema } from '@/auth/credentials/application/validation/email.schema';
import {
  PASSWORD_REQUIRED_MESSAGE,
  PASSWORD_TYPE_MESSAGE,
  passwordSchema,
} from '@/auth/credentials/application/validation/password.schema';

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
          ? PASSWORD_REQUIRED_MESSAGE
          : PASSWORD_TYPE_MESSAGE,
    })
    .trim()
    .min(1, PASSWORD_REQUIRED_MESSAGE),
});

export type EmailAuthFormValues = z.infer<
  typeof signUpEmailAuthFormSchema | typeof signInEmailAuthFormSchema
>;
