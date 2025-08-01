import { z } from 'zod';

import { imageFileSchema } from './common';

z.config({
  jitless: true,
});

export const avatarFormSchema = z.object({
  image: imageFileSchema.nullable().optional(),
});

export type AvatarFormValues = z.infer<typeof avatarFormSchema>;
