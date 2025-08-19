import { z } from 'zod';

import { usernameSchema } from '@/user/domain/value-objects/username/username.schema';

z.config({
  jitless: true,
});

export const usernameFormSchema = z.object({
  username: usernameSchema,
});

export type UsernameFormValues = z.infer<typeof usernameFormSchema>;
