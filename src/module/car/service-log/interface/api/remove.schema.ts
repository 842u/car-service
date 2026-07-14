import { z } from 'zod';

import {
  apiResponseErrorSchema,
  createApiResponseSchema,
} from '@/common/interface/api/response.schema';

z.config({
  jitless: true,
});

const removeServiceLogApiResponseErrorSchema = apiResponseErrorSchema;

const removeServiceLogApiResponseDataSchema = z.null();

export const removeServiceLogApiResponseSchema = createApiResponseSchema(
  removeServiceLogApiResponseDataSchema,
  removeServiceLogApiResponseErrorSchema,
);

export type RemoveServiceLogApiResponseData = z.infer<
  typeof removeServiceLogApiResponseDataSchema
>;

export type RemoveServiceLogApiResponseError = z.infer<
  typeof removeServiceLogApiResponseErrorSchema
>;

export const removeServiceLogApiRequestSchema = z.object({
  serviceLogId: z.string(),
});

export type RemoveServiceLogApiRequest = z.infer<
  typeof removeServiceLogApiRequestSchema
>;
