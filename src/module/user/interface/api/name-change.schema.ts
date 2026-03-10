import { z } from 'zod';

import {
  apiResponseErrorSchema,
  createApiResponseSchema,
} from '@/common/interface/api/response.schema';
import { userDtoSchema } from '@/user/application/dto/user';
import { nameSchema } from '@/user/domain/user/value-object/name/name.schema';

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
  name: nameSchema,
});

export type NameChangeApiRequest = z.infer<typeof nameChangeApiRequestSchema>;
