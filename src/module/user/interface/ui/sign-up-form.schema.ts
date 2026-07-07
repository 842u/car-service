import { z } from 'zod';

import { emailSchema } from '@/user/domain/user/value-object/email/email.schema';
import { passwordSchema } from '@/user/domain/user/value-object/password/password.schema';

z.config({
  jitless: true,
});

export const signUpFormDataSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type SignUpFormData = z.infer<typeof signUpFormDataSchema>;
