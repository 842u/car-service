import { z } from 'zod';

import {
  apiResponseErrorSchema,
  createApiResponseSchema,
} from '@/common/interface/api/response.schema';

z.config({
  jitless: true,
});

const removeCarApiResponseErrorSchema = apiResponseErrorSchema;

const removeCarApiResponseDataSchema = z.null();

export const removeCarApiResponseSchema = createApiResponseSchema(
  removeCarApiResponseDataSchema,
  removeCarApiResponseErrorSchema,
);

export type RemoveCarApiResponseData = z.infer<
  typeof removeCarApiResponseDataSchema
>;

export type RemoveCarApiResponseError = z.infer<
  typeof removeCarApiResponseErrorSchema
>;

export const removeCarApiRequestSchema = z.object({
  carId: z.string(),
});

export type RemoveCarApiRequest = z.infer<typeof removeCarApiRequestSchema>;
