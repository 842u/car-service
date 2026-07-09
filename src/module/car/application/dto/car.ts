import { z } from 'zod';

import { driveTypeSchema } from '@/car/domain/car/value-object/drive-type/drive-type.schema';
import { fuelTypeSchema } from '@/car/domain/car/value-object/fuel-type/fuel-type.schema';
import { transmissionTypeSchema } from '@/car/domain/car/value-object/transmission-type/transmission-type.schema';

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
  fuelType: fuelTypeSchema.optional().nullable(),
  additionalFuelType: fuelTypeSchema.optional().nullable(),
  transmissionType: transmissionTypeSchema.optional().nullable(),
  driveType: driveTypeSchema.optional().nullable(),
  productionYear: z.number().optional().nullable(),
  engineCapacity: z.number().optional().nullable(),
  mileage: z.number().optional().nullable(),
  insuranceExpiration: z.string().optional().nullable(),
  technicalInspectionExpiration: z.string().optional().nullable(),
  createdAt: z.string().optional().nullable(),
});

export type CarDto = z.infer<typeof carDtoSchema>;
