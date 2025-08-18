import { z } from 'zod';

import { emailSchema } from '@/user/domain/value-objects/email/email.schema';
import { passwordSchema } from '@/user/domain/value-objects/password/password.schema';

z.config({
  jitless: true,
});

export const signUpFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type SignUpFormData = z.infer<typeof signUpFormSchema>;
