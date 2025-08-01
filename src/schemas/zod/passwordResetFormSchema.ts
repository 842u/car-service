import { z } from 'zod';

import { emailSchema } from './common';

z.config({
  jitless: true,
});

export const passwordResetFormSchema = z.object({
  email: emailSchema,
});

export type PasswordResetFormValues = z.infer<typeof passwordResetFormSchema>;
