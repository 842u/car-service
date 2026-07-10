import { z } from 'zod';

import { ZodValidator } from '@/common/infrastructure/validator/zod';

z.config({
  jitless: true,
});

const CUSTOM_NAME_REQUIRED_MESSAGE = 'Name is required.';
const CUSTOM_NAME_TYPE_MESSAGE = 'Name must be a string.';
export const MIN_CUSTOM_NAME_LENGTH = 1;
export const MAX_CUSTOM_NAME_LENGTH = 30;

export const customNameSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? CUSTOM_NAME_REQUIRED_MESSAGE
        : CUSTOM_NAME_TYPE_MESSAGE,
  })
  .trim()
  .min(MIN_CUSTOM_NAME_LENGTH, { error: CUSTOM_NAME_REQUIRED_MESSAGE })
  .max(MAX_CUSTOM_NAME_LENGTH, {
    error: `Maximum name length is ${MAX_CUSTOM_NAME_LENGTH}.`,
  });

export const customNameValidator = new ZodValidator();
