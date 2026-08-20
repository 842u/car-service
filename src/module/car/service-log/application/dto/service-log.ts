import type { Database } from 'supabase/types/supabase';
import { z } from 'zod';

z.config({
  jitless: true,
});

type ServiceCategory = Database['public']['Enums']['service_category'];

export const serviceLogDtoSchema = z.object({
  id: z.string(),
  carId: z.string(),
  authorId: z.string(),
  serviceDate: z.string(),
  categories: z.array(z.string()) as z.ZodType<ServiceCategory[]>,
  mileage: z.number().nullable(),
  notes: z.string().nullable(),
  serviceCost: z.number().nullable(),
  createdAt: z.string().nullable(),
});

export type ServiceLogDto = z.infer<typeof serviceLogDtoSchema>;
