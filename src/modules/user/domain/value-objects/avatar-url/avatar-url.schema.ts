import { z } from 'zod';

import { ZodValidator } from '@/common/infrastructure/validation/zod-validator';

z.config({
  jitless: true,
});

const AVATAR_URL_REQUIRED_MESSAGE = 'Avatar URL is required.';
const AVATAR_URL_TYPE_MESSAGE = 'Avatar URL must be a URL.';

export const avatarUrlSchema = z.url({
  error: (issue) =>
    issue.input === undefined
      ? AVATAR_URL_REQUIRED_MESSAGE
      : AVATAR_URL_TYPE_MESSAGE,
});

export const avatarUrlValidator = new ZodValidator(
  avatarUrlSchema,
  'Avatar URL validation failed.',
);
