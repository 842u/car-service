import { z } from 'zod';

import { imageFileSchema } from './common';

export const avatarFormSchema = z.object({
  image: imageFileSchema.nullable().optional(),
});

export type AvatarFormValues = z.infer<typeof avatarFormSchema>;
