import { z } from 'zod';

import {
  apiResponseErrorSchema,
  createApiResponseSchema,
} from '@/common/interface/api/response.schema';

z.config({
  jitless: true,
});

const removeOwnerApiResponseErrorSchema = apiResponseErrorSchema;

const removeOwnerApiResponseDataSchema = z.null();

export const removeOwnerApiResponseSchema = createApiResponseSchema(
  removeOwnerApiResponseDataSchema,
  removeOwnerApiResponseErrorSchema,
);

export type RemoveOwnerApiResponseData = z.infer<
  typeof removeOwnerApiResponseDataSchema
>;

export type RemoveOwnerApiResponseError = z.infer<
  typeof removeOwnerApiResponseErrorSchema
>;

export const removeOwnerApiRequestSchema = z.object({
  carId: z.string(),
  ownerId: z.string(),
});

export type RemoveOwnerApiRequest = z.infer<typeof removeOwnerApiRequestSchema>;
