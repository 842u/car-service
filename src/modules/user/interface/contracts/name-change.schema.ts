import { z } from 'zod';

import { nameSchema } from '@/user/domain/user/value-objects/name/name.schema';

z.config({
  jitless: true,
});

export const nameChangeContractSchema = z.object({
  name: nameSchema,
});

export type NameChangeContract = z.infer<typeof nameChangeContractSchema>;
