import { z } from 'zod';

z.config({
  jitless: true,
});

export const signInWithOtpApiRequestSchema = z.object({
  token_hash: z.string().min(1),
  type: z.string().min(1),
});

export type SignInWithOtpApiRequest = z.infer<
  typeof signInWithOtpApiRequestSchema
>;
