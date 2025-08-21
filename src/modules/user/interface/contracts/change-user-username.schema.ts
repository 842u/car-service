import { z } from 'zod';

import { ZodValidator } from '@/common/infrastructure/validation/zod-validator';
import { usernameSchema } from '@/user/domain/user/value-objects/username/username.schema';

z.config({
  jitless: true,
});

export const changeUserUsernameContractSchema = z.object({
  username: usernameSchema,
});

export type ChangeUserUsernameContract = z.infer<
  typeof changeUserUsernameContractSchema
>;

export const changeUserUsernameContractValidator = new ZodValidator(
  changeUserUsernameContractSchema,
  'Change user username contract validation failed.',
);
