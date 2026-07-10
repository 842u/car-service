import { z } from 'zod';

import { ZodValidator } from '@/common/infrastructure/validator/zod';

z.config({
  jitless: true,
});

const MODEL_REQUIRED_MESSAGE = 'Model is required.';
const MODEL_TYPE_MESSAGE = 'Model must be a string.';
export const MIN_MODEL_LENGTH = 1;
export const MAX_MODEL_LENGTH = 25;

export const modelSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined ? MODEL_REQUIRED_MESSAGE : MODEL_TYPE_MESSAGE,
  })
  .trim()
  .min(MIN_MODEL_LENGTH, { error: MODEL_REQUIRED_MESSAGE })
  .max(MAX_MODEL_LENGTH, {
    error: `Maximum model length is ${MAX_MODEL_LENGTH}.`,
  });

export const modelValidator = new ZodValidator();
