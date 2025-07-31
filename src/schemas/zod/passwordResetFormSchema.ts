import { z } from 'zod';

import { emailSchema } from './common';

export const passwordResetFormSchema = z.object({
  email: emailSchema,
});

export type PasswordResetFormValues = z.infer<typeof passwordResetFormSchema>;
