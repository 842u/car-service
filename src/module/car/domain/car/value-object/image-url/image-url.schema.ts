import { z } from 'zod';

import { ZodValidator } from '@/common/infrastructure/validator/zod';

z.config({
  jitless: true,
});

const IMAGE_URL_REQUIRED_MESSAGE = 'Image URL is required.';
const IMAGE_URL_TYPE_MESSAGE = 'Image URL must be a URL.';

export const imageUrlSchema = z.url({
  protocol: /^https?$/,
  error: (issue) =>
    issue.input === undefined
      ? IMAGE_URL_REQUIRED_MESSAGE
      : IMAGE_URL_TYPE_MESSAGE,
});

export const imageUrlValidator = new ZodValidator();
