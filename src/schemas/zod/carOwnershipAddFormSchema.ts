import { z } from 'zod';

import { IdSchema } from './common';

export const carOwnershipAddFormSchema = z.object({
  userId: IdSchema,
});

export type CarOwnershipAddFormValues = z.infer<
  typeof carOwnershipAddFormSchema
>;
