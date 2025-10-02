import { z } from 'zod';

import { ZodValidator } from '@/common/infrastructure/validator/zod-validator';

z.config({
  jitless: true,
});

const AVATAR_URL_REQUIRED_MESSAGE = 'Avatar URL is required.';
const AVATAR_URL_TYPE_MESSAGE = 'Avatar URL must be a URL.';

export const avatarUrlSchema = z.url({
  protocol: /^https?$/,
  hostname: z.regexes.domain,
  error: (issue) =>
    issue.input === undefined
      ? AVATAR_URL_REQUIRED_MESSAGE
      : AVATAR_URL_TYPE_MESSAGE,
});

export const avatarUrlValidator = new ZodValidator();
