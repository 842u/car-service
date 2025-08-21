import { z } from 'zod';

import { ZodValidator } from '@/common/infrastructure/validation/zod-validator';
import { emailSchema } from '@/user/domain/user/value-objects/email/email.schema';
import { passwordSchema } from '@/user/domain/user/value-objects/password/password.schema';

z.config({
  jitless: true,
});

export const signUpUserContractSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type SignUpUserContract = z.infer<typeof signUpUserContractSchema>;

export const signUpUserContractValidator = new ZodValidator(
  signUpUserContractSchema,
  'Sign up user contract validation failed.',
);
