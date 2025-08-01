import { z } from 'zod';

import { IdSchema } from './common';

export const carPrimaryOwnershipGrantFormSchema = z.object({
  userId: IdSchema,
});

export type CarPrimaryOwnershipGrantFormValues = z.infer<
  typeof carPrimaryOwnershipGrantFormSchema
>;
