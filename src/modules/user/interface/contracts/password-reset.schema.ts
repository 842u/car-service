import { z } from 'zod';

import { emailSchema } from '@/user/domain/user/value-objects/email/email.schema';

z.config({
  jitless: true,
});

export const passwordResetContractSchema = z.object({
  email: emailSchema,
});

export type PasswordResetContract = z.infer<typeof passwordResetContractSchema>;
