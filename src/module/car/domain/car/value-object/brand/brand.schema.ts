import { z } from 'zod';

import { ZodValidator } from '@/common/infrastructure/validator/zod';

z.config({
  jitless: true,
});

const BRAND_REQUIRED_MESSAGE = 'Brand is required.';
const BRAND_TYPE_MESSAGE = 'Brand must be a string.';
export const MIN_BRAND_LENGTH = 2;
export const MAX_BRAND_LENGTH = 25;

export const brandSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined ? BRAND_REQUIRED_MESSAGE : BRAND_TYPE_MESSAGE,
  })
  .trim()
  .min(MIN_BRAND_LENGTH, {
    error: `Minimum brand length is ${MIN_BRAND_LENGTH}.`,
  })
  .max(MAX_BRAND_LENGTH, {
    error: `Maximum brand length is ${MAX_BRAND_LENGTH}.`,
  });

export const brandValidator = new ZodValidator();
