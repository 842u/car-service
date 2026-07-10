import { z } from 'zod';

import { ownerIdSchema } from '@/car/ownership/domain/ownership/value-object/owner-id/owner-id.schema';

z.config({
  jitless: true,
});

export const addOwnerFormSchema = z.object({
  ownerId: ownerIdSchema,
});

export type AddOwnerFormValues = z.infer<typeof addOwnerFormSchema>;
