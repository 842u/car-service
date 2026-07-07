import { z } from 'zod';

z.config({
  jitless: true,
});

export const signInWithOAuthApiRequestSchema = z.object({
  code: z.string().min(1),
});

export type SignInWithOAuthApiRequest = z.infer<
  typeof signInWithOAuthApiRequestSchema
>;
