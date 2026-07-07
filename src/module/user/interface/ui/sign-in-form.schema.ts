import { z } from 'zod';

import { emailSchema } from '@/user/domain/user/value-object/email/email.schema';
import {
  PASSWORD_REQUIRED_MESSAGE,
  PASSWORD_TYPE_MESSAGE,
} from '@/user/domain/user/value-object/password/password.schema';

z.config({
  jitless: true,
});

export const signInFormDataSchema = z.object({
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

export type SignInFormData = z.infer<typeof signInFormDataSchema>;
