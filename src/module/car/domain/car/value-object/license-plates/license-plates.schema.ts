import { z } from 'zod';

import { ZodValidator } from '@/common/infrastructure/validator/zod';

z.config({
  jitless: true,
});

const LICENSE_PLATES_REQUIRED_MESSAGE = 'License plates are required.';
const LICENSE_PLATES_TYPE_MESSAGE = 'License plates must be a string.';
export const MIN_LICENSE_PLATES_LENGTH = 1;
export const MAX_LICENSE_PLATES_LENGTH = 15;

export const licensePlatesSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? LICENSE_PLATES_REQUIRED_MESSAGE
        : LICENSE_PLATES_TYPE_MESSAGE,
  })
  .trim()
  .min(MIN_LICENSE_PLATES_LENGTH, { error: LICENSE_PLATES_REQUIRED_MESSAGE })
  .max(MAX_LICENSE_PLATES_LENGTH, {
    error: `Maximum license plates length is ${MAX_LICENSE_PLATES_LENGTH}.`,
  });

export const licensePlatesValidator = new ZodValidator();
