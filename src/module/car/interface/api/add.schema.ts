import { z } from 'zod';

import { carDtoSchema } from '@/car/application/dto/car';
import {
  apiResponseErrorSchema,
  createApiResponseSchema,
} from '@/common/interface/api/response.schema';

z.config({
  jitless: true,
});

const addCarApiResponseErrorSchema = apiResponseErrorSchema;

const addCarApiResponseDataSchema = carDtoSchema;

export const addCarApiResponseSchema = createApiResponseSchema(
  addCarApiResponseDataSchema,
  addCarApiResponseErrorSchema,
);

export type AddCarApiResponseData = z.infer<typeof addCarApiResponseDataSchema>;

export type AddCarApiResponseError = z.infer<
  typeof addCarApiResponseErrorSchema
>;

export const addCarApiRequestSchema = z.object({
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
});

export type AddCarApiRequest = z.infer<typeof addCarApiRequestSchema>;
