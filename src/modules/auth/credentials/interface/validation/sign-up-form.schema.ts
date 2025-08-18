import { z } from 'zod';

import { emailSchema } from '../../domain/value-objects/email/email.schema';
import { passwordSchema } from '../../domain/value-objects/password/password.schema';

z.config({
  jitless: true,
});

export const signUpFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type SignUpFormData = z.infer<typeof signUpFormSchema>;
