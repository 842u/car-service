import { z } from 'zod';

z.config({
  jitless: true,
});

export const carDtoSchema = z.object({
  id: z.string(),
  imageUrl: z.string().optional().nullable(),
  customName: z.string(),
  brand: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  licensePlates: z.string().optional().nullable(),
  vin: z.string().optional().nullable(),
  fuelType: z.string().optional().nullable(),
  additionalFuelType: z.string().optional().nullable(),
  transmissionType: z.string().optional().nullable(),
  driveType: z.string().optional().nullable(),
  productionYear: z.number().optional().nullable(),
  engineCapacity: z.number().optional().nullable(),
  mileage: z.number().optional().nullable(),
  insuranceExpiration: z.string().optional().nullable(),
  technicalInspectionExpiration: z.string().optional().nullable(),
  createdAt: z.string().optional().nullable(),
});

export type CarDto = z.infer<typeof carDtoSchema>;
