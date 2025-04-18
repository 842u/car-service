import { z } from 'zod';

import { userIdValidationSchema } from './common';

export const carPrimaryOwnershipGrantFormSchema = z.object({
  userId: userIdValidationSchema,
});

export type CarPrimaryOwnershipGrantFormValues = z.infer<
  typeof carPrimaryOwnershipGrantFormSchema
>;
