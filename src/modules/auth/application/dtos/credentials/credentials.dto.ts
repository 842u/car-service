import { z } from 'zod';

import { ZodValidator } from '@/common/infrastructure/validation/zod-validator';

z.config({
  jitless: true,
});

const credentialsDtoSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type CredentialsDto = z.infer<typeof credentialsDtoSchema>;

export const credentialsDtoValidator = new ZodValidator(
  credentialsDtoSchema,
  'Credentials DTO validation failed.',
);
