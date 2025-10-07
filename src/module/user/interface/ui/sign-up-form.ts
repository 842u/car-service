import { z } from 'zod';

import { signUpApiRequestSchema } from '@/user/interface/api/sign-up.schema';

z.config({
  jitless: true,
});

export const signUpFormDataSchema = signUpApiRequestSchema;

export type SignUpFormData = z.infer<typeof signUpFormDataSchema>;
