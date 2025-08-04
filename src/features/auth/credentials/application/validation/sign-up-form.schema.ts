import { z } from 'zod';

import { emailSchema } from './email.schema';
import { passwordSchema } from './password.schema';

z.config({
  jitless: true,
});

export const signUpFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type SignUpFormValues = z.infer<typeof signUpFormSchema>;
