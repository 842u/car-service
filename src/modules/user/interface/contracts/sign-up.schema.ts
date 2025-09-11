import { z } from 'zod';

import { emailSchema } from '@/user/domain/user/value-objects/email/email.schema';
import { passwordSchema } from '@/user/domain/user/value-objects/password/password.schema';

z.config({
  jitless: true,
});

export const signUpContractSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type SignUpContract = z.infer<typeof signUpContractSchema>;
