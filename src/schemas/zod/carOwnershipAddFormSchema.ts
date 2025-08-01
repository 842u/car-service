import { z } from 'zod';

import { IdSchema } from './common';

z.config({
  jitless: true,
});

export const carOwnershipAddFormSchema = z.object({
  userId: IdSchema,
});

export type CarOwnershipAddFormValues = z.infer<
  typeof carOwnershipAddFormSchema
>;
