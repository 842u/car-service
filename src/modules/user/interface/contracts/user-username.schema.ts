import { z } from 'zod';

import { ZodValidator } from '@/common/infrastructure/validation/zod-validator';
import { usernameSchema } from '@/user/domain/user/value-objects/username/username.schema';

z.config({
  jitless: true,
});

export const userUsernameContractSchema = z.object({
  username: usernameSchema,
});

export type UserUsernameContract = z.infer<typeof userUsernameContractSchema>;

export const userUsernameContractValidator = new ZodValidator(
  userUsernameContractSchema,
  'Change user username contract validation failed.',
);
