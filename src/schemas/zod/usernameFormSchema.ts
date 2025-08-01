import { z } from 'zod';

import { usernameSchema } from './common';

z.config({
  jitless: true,
});

export const usernameFormSchema = z.object({
  username: usernameSchema,
});

export type UsernameFormValues = z.infer<typeof usernameFormSchema>;
