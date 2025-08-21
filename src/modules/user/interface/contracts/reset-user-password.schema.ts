import { z } from 'zod';

import { ZodValidator } from '@/common/infrastructure/validation/zod-validator';
import { emailSchema } from '@/user/domain/user/value-objects/email/email.schema';

z.config({
  jitless: true,
});

export const resetUserPasswordContractSchema = z.object({
  email: emailSchema,
});

export type ResetUserPasswordContract = z.infer<
  typeof resetUserPasswordContractSchema
>;

export const resetUserPasswordContractValidator = new ZodValidator(
  resetUserPasswordContractSchema,
  'Reset password contract validation failed.',
);
