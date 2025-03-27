import { z } from 'zod';

import { userIdValidationSchema } from './common';

export const grantCarPrimaryOwnershipFormSchema = z.object({
  userId: userIdValidationSchema,
});

export type GrantCarPrimaryOwnershipFormValues = z.infer<
  typeof grantCarPrimaryOwnershipFormSchema
>;
