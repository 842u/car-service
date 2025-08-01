import { z } from 'zod';

import { IdSchema } from './common';

z.config({
  jitless: true,
});

export const carPrimaryOwnershipGrantFormSchema = z.object({
  userId: IdSchema,
});

export type CarPrimaryOwnershipGrantFormValues = z.infer<
  typeof carPrimaryOwnershipGrantFormSchema
>;
