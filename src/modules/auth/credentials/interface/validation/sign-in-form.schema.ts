import { z } from 'zod';

import { emailSchema } from '../../domain/value-objects/email/email.schema';
import {
  PASSWORD_REQUIRED_MESSAGE,
  PASSWORD_TYPE_MESSAGE,
} from '../../domain/value-objects/password/password.schema';

z.config({
  jitless: true,
});

export const signInFormSchema = z.object({
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

export type SignInFormData = z.infer<typeof signInFormSchema>;
