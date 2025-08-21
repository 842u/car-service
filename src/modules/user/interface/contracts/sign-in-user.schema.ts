import { z } from 'zod';

import { ZodValidator } from '@/common/infrastructure/validation/zod-validator';
import { emailSchema } from '@/user/domain/user/value-objects/email/email.schema';
import {
  PASSWORD_REQUIRED_MESSAGE,
  PASSWORD_TYPE_MESSAGE,
} from '@/user/domain/user/value-objects/password/password.schema';

z.config({
  jitless: true,
});

export const signInUserContractSchema = z.object({
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

export type SignInUserContract = z.infer<typeof signInUserContractSchema>;

export const signInUserContractValidator = new ZodValidator(
  signInUserContractSchema,
  'Sign in user contract validation failed.',
);
