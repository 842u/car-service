import { z } from 'zod';

import { ownershipDtoSchema } from '@/car/ownership/application/dto/ownership';
import {
  apiResponseErrorSchema,
  createApiResponseSchema,
} from '@/common/interface/api/response.schema';

z.config({
  jitless: true,
});

const promotePrimaryOwnerApiResponseErrorSchema = apiResponseErrorSchema;

const promotePrimaryOwnerApiResponseDataSchema = z.array(ownershipDtoSchema);

export const promotePrimaryOwnerApiResponseSchema = createApiResponseSchema(
  promotePrimaryOwnerApiResponseDataSchema,
  promotePrimaryOwnerApiResponseErrorSchema,
);

export type PromotePrimaryOwnerApiResponseData = z.infer<
  typeof promotePrimaryOwnerApiResponseDataSchema
>;

export type PromotePrimaryOwnerApiResponseError = z.infer<
  typeof promotePrimaryOwnerApiResponseErrorSchema
>;

export const promotePrimaryOwnerApiRequestSchema = z.object({
  carId: z.string(),
  ownerId: z.string(),
});

export type PromotePrimaryOwnerApiRequest = z.infer<
  typeof promotePrimaryOwnerApiRequestSchema
>;
