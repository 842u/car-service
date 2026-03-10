import { z } from 'zod';

import { signInApiRequestSchema } from '@/user/interface/api/sign-in.schema';

z.config({
  jitless: true,
});

export const signInFormDataSchema = signInApiRequestSchema;

export type SignInFormData = z.infer<typeof signInFormDataSchema>;
