import { z } from 'zod';

z.config({
  jitless: true,
});

const apiResponseErrorSchema = z
  .object({
    message: z.string(),
  })
  .catchall(z.unknown());

const errorApiResponseSchema = z.object({
  success: z.literal(false),
  status: z.number(),
  error: apiResponseErrorSchema,
});

const createSuccessApiResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T,
) =>
  z.object({
    success: z.literal(true),
    status: z.number(),
    data: dataSchema,
  });

export type ApiResponseError = z.infer<typeof apiResponseErrorSchema>;

export type ErrorApiResponse = z.infer<typeof errorApiResponseSchema>;

export type SuccessApiResponse<T> = {
  success: true;
  status: number;
  data: T;
};

export const createApiResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T,
) => {
  const successSchema = createSuccessApiResponseSchema(dataSchema);

  return z.union([successSchema, errorApiResponseSchema]);
};
