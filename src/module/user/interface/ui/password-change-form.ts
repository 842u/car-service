import { z } from 'zod';

import { passwordChangeApiRequestSchema } from '@/user/interface/api/password-change.schema';

z.config({
  jitless: true,
});

export const passwordChangeFormDataSchema = passwordChangeApiRequestSchema;

export type PasswordChangeFormData = z.infer<
  typeof passwordChangeFormDataSchema
>;
