import { z } from 'zod';

import {
  carBrandSchema,
  carDriveTypeSchema,
  carEngineCapacitySchema,
  carFuelTypeSchema,
  carInsuranceExpirationSchema,
  carLicensePlatesSchema,
  carMileageSchema,
  carModelSchema,
  carNameSchema,
  carProductionYearSchema,
  carTransmissionTypeSchema,
  carVinSchema,
  imageFileSchema,
} from './common';

export const carFormSchema = z.object({
  image: imageFileSchema.nullable().optional(),
  name: carNameSchema,
  brand: carBrandSchema.nullable().or(z.literal('')),
  model: carModelSchema.nullable().or(z.literal('')),
  licensePlates: carLicensePlatesSchema.nullable().or(z.literal('')),
  vin: carVinSchema.nullable().or(z.literal('')),
  engineCapacity: carEngineCapacitySchema.nullable().or(z.nan()),
  mileage: carMileageSchema.nullable().or(z.nan()),
  insuranceExpiration: carInsuranceExpirationSchema
    .nullable()
    .or(z.literal('')),
  productionYear: carProductionYearSchema.nullable().or(z.nan()),
  fuelType: carFuelTypeSchema.nullable().or(z.literal('')),
  additionalFuelType: carFuelTypeSchema.nullable().or(z.literal('')),
  transmissionType: carTransmissionTypeSchema.nullable().or(z.literal('')),
  driveType: carDriveTypeSchema.nullable().or(z.literal('')),
});

export type CarFormValues = z.infer<typeof carFormSchema>;
