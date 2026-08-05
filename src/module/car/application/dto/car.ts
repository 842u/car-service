import { z } from 'zod';

import { driveTypeSchema } from '@/car/domain/car/value-object/drive-type/drive-type.schema';
import { fuelTypeSchema } from '@/car/domain/car/value-object/fuel-type/fuel-type.schema';
import { transmissionTypeSchema } from '@/car/domain/car/value-object/transmission-type/transmission-type.schema';

z.config({
  jitless: true,
});

export const carDtoSchema = z.object({
  id: z.string(),
  imageUrl: z.string().nullable(),
  customName: z.string(),
  brand: z.string().nullable(),
  model: z.string().nullable(),
  licensePlates: z.string().nullable(),
  vin: z.string().nullable(),
  fuelType: fuelTypeSchema.nullable(),
  additionalFuelType: fuelTypeSchema.nullable(),
  transmissionType: transmissionTypeSchema.nullable(),
  driveType: driveTypeSchema.nullable(),
  productionYear: z.number().nullable(),
  engineCapacity: z.number().nullable(),
  mileage: z.number().nullable(),
  insuranceExpiration: z.string().nullable(),
  technicalInspectionExpiration: z.string().nullable(),
  createdAt: z.string().nullable(),
});

export type CarDto = z.infer<typeof carDtoSchema>;
