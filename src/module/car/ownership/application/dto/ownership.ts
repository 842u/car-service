import { z } from 'zod';

z.config({
  jitless: true,
});

export const ownershipDtoSchema = z.object({
  carId: z.string(),
  ownerId: z.string(),
  isPrimary: z.boolean(),
  createdAt: z.string().optional().nullable(),
});

export type OwnershipDto = z.infer<typeof ownershipDtoSchema>;
