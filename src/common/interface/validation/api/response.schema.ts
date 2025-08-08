import { z } from 'zod';

z.config({
  jitless: true,
});

export const apiResponseErrorSchema = z
  .object({
    message: z.string(),
  })
  .catchall(z.unknown());

export const errorApiResponseSchema = z.object({
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

export const createApiResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T,
) => {
  const successSchema = createSuccessApiResponseSchema(dataSchema);

  return z.union([successSchema, errorApiResponseSchema]);
};
