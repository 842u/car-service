import { z } from 'zod';

z.config({
  jitless: true,
});

export const credentialsDtoSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type CredentialsDto = z.infer<typeof credentialsDtoSchema>;
