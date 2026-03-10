import { z } from 'zod';

import { nameChangeApiRequestSchema } from '@/user/interface/api/name-change.schema';

z.config({
  jitless: true,
});

export const nameChangeFormDataSchema = nameChangeApiRequestSchema;

export type NameChangeFormData = z.infer<typeof nameChangeFormDataSchema>;
