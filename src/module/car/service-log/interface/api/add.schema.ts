import { z } from 'zod';

import { serviceLogDtoSchema } from '@/car/service-log/application/dto/service-log';
import {
  apiResponseErrorSchema,
  createApiResponseSchema,
} from '@/common/interface/api/response.schema';

z.config({
  jitless: true,
});

const addServiceLogApiResponseErrorSchema = apiResponseErrorSchema;

const addServiceLogApiResponseDataSchema = serviceLogDtoSchema;

export const addServiceLogApiResponseSchema = createApiResponseSchema(
  addServiceLogApiResponseDataSchema,
  addServiceLogApiResponseErrorSchema,
);

export type AddServiceLogApiResponseData = z.infer<
  typeof addServiceLogApiResponseDataSchema
>;

export type AddServiceLogApiResponseError = z.infer<
  typeof addServiceLogApiResponseErrorSchema
>;

// Shape/presence only: the value objects are the validation authority, so
// this schema does not repeat their rules.
export const addServiceLogApiRequestSchema = z.object({
  carId: z.string(),
  serviceDate: z.string(),
  categories: z.array(z.string()),
  mileage: z.number().nullable().optional(),
  notes: z.string().nullable().optional(),
  serviceCost: z.number().nullable().optional(),
});

export type AddServiceLogApiRequest = z.infer<
  typeof addServiceLogApiRequestSchema
>;
