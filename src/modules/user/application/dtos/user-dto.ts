import { z } from 'zod';

z.config({
  jitless: true,
});

export const userDtoSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  avatarUrl: z.string().optional().nullable(),
});

export type UserDto = z.infer<typeof userDtoSchema>;
