import { z } from 'zod';

import { userIdValidationSchema } from './common';

export const carOwnershipAddFormSchema = z.object({
  userId: userIdValidationSchema,
});

export type CarOwnershipAddFormValues = z.infer<
  typeof carOwnershipAddFormSchema
>;
