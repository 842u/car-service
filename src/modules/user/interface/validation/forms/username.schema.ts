import { z } from 'zod';

import { usernameSchema } from '@/user/domain/user/value-objects/username/username.schema';

z.config({
  jitless: true,
});

export const usernameFormSchema = z.object({
  username: usernameSchema,
});

export type UsernameFormData = z.infer<typeof usernameFormSchema>;
