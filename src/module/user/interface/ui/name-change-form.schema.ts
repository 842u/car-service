import { z } from 'zod';

import { nameSchema } from '@/user/domain/user/value-object/name/name.schema';

z.config({
  jitless: true,
});

export const nameChangeFormDataSchema = z.object({
  name: nameSchema,
});

export type NameChangeFormData = z.infer<typeof nameChangeFormDataSchema>;
