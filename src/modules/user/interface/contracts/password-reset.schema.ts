import { z } from 'zod';

import { ZodValidator } from '@/common/infrastructure/validation/zod-validator';
import { emailSchema } from '@/user/domain/user/value-objects/email/email.schema';

z.config({
  jitless: true,
});

export const passwordResetContractSchema = z.object({
  email: emailSchema,
});

export type PasswordResetContract = z.infer<typeof passwordResetContractSchema>;

export const passwordResetContractValidator = new ZodValidator(
  passwordResetContractSchema,
  'Password reset contract validation failed.',
);
