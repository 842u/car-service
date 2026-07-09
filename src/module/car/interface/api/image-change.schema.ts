import { z } from 'zod';

import { carDtoSchema } from '@/car/application/dto/car';
import {
  apiResponseErrorSchema,
  createApiResponseSchema,
} from '@/common/interface/api/response.schema';

z.config({
  jitless: true,
});

const carImageChangeApiResponseErrorSchema = apiResponseErrorSchema;

const carImageChangeApiResponseDataSchema = carDtoSchema;

export const carImageChangeApiResponseSchema = createApiResponseSchema(
  carImageChangeApiResponseDataSchema,
  carImageChangeApiResponseErrorSchema,
);

export type CarImageChangeApiResponseData = z.infer<
  typeof carImageChangeApiResponseDataSchema
>;

export type CarImageChangeApiResponseError = z.infer<
  typeof carImageChangeApiResponseErrorSchema
>;

export const carImageChangeApiRequestSchema = z.object({
  carId: z.string(),
  imageUrl: z.string(),
});

export type CarImageChangeApiRequest = z.infer<
  typeof carImageChangeApiRequestSchema
>;
