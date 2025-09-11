import { z } from 'zod';

import { usernameSchema } from '@/user/domain/user/value-objects/username/username.schema';

z.config({
  jitless: true,
});

export const usernameChangeContractSchema = z.object({
  username: usernameSchema,
});

export type UsernameChangeContract = z.infer<
  typeof usernameChangeContractSchema
>;
