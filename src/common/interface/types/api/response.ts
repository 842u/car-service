import type { z } from 'zod';

import type {
  apiResponseErrorSchema,
  errorApiResponseSchema,
} from '../../validation/api/response.schema';

export type ApiResponseError = z.infer<typeof apiResponseErrorSchema>;

export type ErrorApiResponse = z.infer<typeof errorApiResponseSchema>;

export type SuccessApiResponse<T> = {
  success: true;
  status: number;
  data: T;
};
