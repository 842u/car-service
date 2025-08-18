import { z } from 'zod';

import { emailSchema } from '@/user/domain/value-objects/email/email.schema';

z.config({
  jitless: true,
});

export const passwordResetFormSchema = z.object({
  email: emailSchema,
});

export type PasswordResetFormValues = z.infer<typeof passwordResetFormSchema>;
