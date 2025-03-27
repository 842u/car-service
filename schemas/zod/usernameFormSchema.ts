import { z } from 'zod';

import { usernameSchema } from './common';

export const usernameFormSchema = z.object({
  username: usernameSchema,
});

export type UsernameFormValues = z.infer<typeof usernameFormSchema>;
