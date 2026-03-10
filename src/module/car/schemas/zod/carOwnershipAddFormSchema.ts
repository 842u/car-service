import { z } from 'zod';

import { idSchema } from '@/common/domain/value-object/id.schema';

z.config({
  jitless: true,
});

export const carOwnershipAddFormSchema = z.object({
  userId: idSchema,
});

export type CarOwnershipAddFormValues = z.infer<
  typeof carOwnershipAddFormSchema
>;
