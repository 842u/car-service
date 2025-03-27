import { z } from 'zod';

import { userIdValidationSchema } from './common';

export const addCarOwnershipFormSchema = z.object({
  userId: userIdValidationSchema,
});

export type AddCarOwnershipFormValues = z.infer<
  typeof addCarOwnershipFormSchema
>;
