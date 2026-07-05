import { z } from 'zod';

import {
  apiResponseErrorSchema,
  createApiResponseSchema,
} from '@/common/interface/api/response.schema';
import { userDtoSchema } from '@/user/application/dto/user';

z.config({
  jitless: true,
});

const nameChangeApiResponseErrorSchema = apiResponseErrorSchema;

const nameChangeApiResponseDataSchema = userDtoSchema;

export const nameChangeApiResponseSchema = createApiResponseSchema(
  nameChangeApiResponseDataSchema,
  nameChangeApiResponseErrorSchema,
);

export type NameChangeApiResponseData = z.infer<
  typeof nameChangeApiResponseDataSchema
>;

export type NameChangeApiResponseError = z.infer<
  typeof nameChangeApiResponseErrorSchema
>;

export const nameChangeApiRequestSchema = z.object({
  name: z.string(),
});

export type NameChangeApiRequest = z.infer<typeof nameChangeApiRequestSchema>;
