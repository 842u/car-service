import { z } from 'zod';

import { nameSchema } from '@/user/domain/user/value-objects/name/name.schema';

z.config({
  jitless: true,
});

export const userNameChangeContractSchema = z.object({
  name: nameSchema,
});

export type UserNameChangeContract = z.infer<
  typeof userNameChangeContractSchema
>;
