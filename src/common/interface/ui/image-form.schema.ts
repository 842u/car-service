import { z } from 'zod';

import { imageFileSchema } from '@/common/interface/validation/image-file.schema';

z.config({
  jitless: true,
});

export const imageFormSchema = z.object({
  image: imageFileSchema.nullable().optional(),
});

export type ImageFormData = z.infer<typeof imageFormSchema>;
