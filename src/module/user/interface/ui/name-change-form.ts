import { z } from 'zod';

import { userNameChangeApiRequestSchema } from '@/user/interface/api/name-change.schema';

z.config({
  jitless: true,
});

export const nameChangeFormDataSchema = userNameChangeApiRequestSchema;

export type NameChangeFormData = z.infer<typeof nameChangeFormDataSchema>;
