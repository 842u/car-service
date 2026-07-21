import { z } from 'zod';

import { carDtoSchema } from '@/car/application/dto/car';
import {
  apiResponseErrorSchema,
  createApiResponseSchema,
} from '@/common/interface/api/response.schema';

z.config({
  jitless: true,
});

const editCarApiResponseErrorSchema = apiResponseErrorSchema;

const editCarApiResponseDataSchema = carDtoSchema;

export const editCarApiResponseSchema = createApiResponseSchema(
  editCarApiResponseDataSchema,
  editCarApiResponseErrorSchema,
);

export type EditCarApiResponseData = z.infer<
  typeof editCarApiResponseDataSchema
>;

export type EditCarApiResponseError = z.infer<
  typeof editCarApiResponseErrorSchema
>;

export const editCarApiRequestSchema = z.object({
  carId: z.string(),
  customName: z.string(),
  brand: z.string().nullable().optional(),
  model: z.string().nullable().optional(),
  licensePlates: z.string().nullable().optional(),
  vin: z.string().nullable().optional(),
  fuelType: z.string().nullable().optional(),
  additionalFuelType: z.string().nullable().optional(),
  transmissionType: z.string().nullable().optional(),
  driveType: z.string().nullable().optional(),
  productionYear: z.number().nullable().optional(),
  engineCapacity: z.number().nullable().optional(),
  mileage: z.number().nullable().optional(),
  insuranceExpiration: z.string().nullable().optional(),
  technicalInspectionExpiration: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
});

export type EditCarApiRequest = z.infer<typeof editCarApiRequestSchema>;
