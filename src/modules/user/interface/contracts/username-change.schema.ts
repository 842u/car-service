import { z } from 'zod';

import { ZodValidator } from '@/common/infrastructure/validation/zod-validator';
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

export const usernameChangeContractValidator = new ZodValidator(
  usernameChangeContractSchema,
  'Username change contract validation failed.',
);
