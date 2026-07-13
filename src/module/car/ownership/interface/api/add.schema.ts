import { z } from 'zod';

import { ownershipDtoSchema } from '@/car/ownership/application/dto/ownership';
import {
  apiResponseErrorSchema,
  createApiResponseSchema,
} from '@/common/interface/api/response.schema';

z.config({
  jitless: true,
});

const addOwnerApiResponseErrorSchema = apiResponseErrorSchema;

const addOwnerApiResponseDataSchema = z.array(ownershipDtoSchema);

export const addOwnerApiResponseSchema = createApiResponseSchema(
  addOwnerApiResponseDataSchema,
  addOwnerApiResponseErrorSchema,
);

export type AddOwnerApiResponseData = z.infer<
  typeof addOwnerApiResponseDataSchema
>;

export type AddOwnerApiResponseError = z.infer<
  typeof addOwnerApiResponseErrorSchema
>;

export const addOwnerApiRequestSchema = z.object({
  carId: z.string(),
  ownerId: z.string(),
});

export type AddOwnerApiRequest = z.infer<typeof addOwnerApiRequestSchema>;
