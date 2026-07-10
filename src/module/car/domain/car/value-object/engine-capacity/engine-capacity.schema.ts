import { z } from 'zod';

import { ZodValidator } from '@/common/infrastructure/validator/zod';

z.config({
  jitless: true,
});

// Postgres "integer" (int4) upper bound; the engine_capacity column is int4.
export const POSTGRES_INT4_MAX_VALUE = 2147483647;

const ENGINE_CAPACITY_REQUIRED_MESSAGE = 'Engine capacity is required.';
const ENGINE_CAPACITY_TYPE_MESSAGE = 'Engine capacity must be a number.';
export const MIN_ENGINE_CAPACITY_VALUE = 0;
export const MAX_ENGINE_CAPACITY_VALUE = POSTGRES_INT4_MAX_VALUE;

export const engineCapacitySchema = z
  .number({
    error: (issue) =>
      issue.input === undefined
        ? ENGINE_CAPACITY_REQUIRED_MESSAGE
        : ENGINE_CAPACITY_TYPE_MESSAGE,
  })
  .int({ error: 'Engine capacity must be a whole number.' })
  .min(MIN_ENGINE_CAPACITY_VALUE, {
    error: 'Engine capacity cannot be negative.',
  })
  .max(MAX_ENGINE_CAPACITY_VALUE, {
    error: `Maximum engine capacity is ${MAX_ENGINE_CAPACITY_VALUE}.`,
  });

export const engineCapacityValidator = new ZodValidator();
