import { z } from 'zod';

z.config({
  jitless: true,
});

const apiErrorSchema = z
  .object({
    message: z.string(),
  })
  .catchall(z.unknown());

export const createApiResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T,
) =>
  z.union([
    z.object({
      data: dataSchema,
      error: z.undefined(),
    }),
    z.object({
      data: z.undefined(),
      error: apiErrorSchema,
    }),
  ]);
