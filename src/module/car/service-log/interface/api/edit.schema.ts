import { z } from 'zod';

import { serviceLogDtoSchema } from '@/car/service-log/application/dto/service-log';
import {
  apiResponseErrorSchema,
  createApiResponseSchema,
} from '@/common/interface/api/response.schema';

z.config({
  jitless: true,
});

const editServiceLogApiResponseErrorSchema = apiResponseErrorSchema;

const editServiceLogApiResponseDataSchema = serviceLogDtoSchema;

export const editServiceLogApiResponseSchema = createApiResponseSchema(
  editServiceLogApiResponseDataSchema,
  editServiceLogApiResponseErrorSchema,
);

export type EditServiceLogApiResponseData = z.infer<
  typeof editServiceLogApiResponseDataSchema
>;

export type EditServiceLogApiResponseError = z.infer<
  typeof editServiceLogApiResponseErrorSchema
>;

// Shape/presence only: the value objects are the validation authority, so
// this schema does not repeat their rules. No `carId`: it is derived
// server-side from the loaded aggregate, not taken from the request.
export const editServiceLogApiRequestSchema = z.object({
  serviceLogId: z.string(),
  serviceDate: z.string(),
  categories: z.array(z.string()),
  mileage: z.number().nullable().optional(),
  notes: z.string().nullable().optional(),
  serviceCost: z.number().nullable().optional(),
});

export type EditServiceLogApiRequest = z.infer<
  typeof editServiceLogApiRequestSchema
>;
