import { z } from 'zod';

import { idSchema } from '@/common/domain/value-object/id.schema';

z.config({
  jitless: true,
});

export const carPrimaryOwnershipGrantFormSchema = z.object({
  userId: idSchema,
});

export type CarPrimaryOwnershipGrantFormValues = z.infer<
  typeof carPrimaryOwnershipGrantFormSchema
>;
