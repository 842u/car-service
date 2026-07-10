import { z } from 'zod';

import { ZodValidator } from '@/common/infrastructure/validator/zod';

z.config({
  jitless: true,
});

// Postgres "integer" (int4) upper bound; the mileage column is int4.
export const POSTGRES_INT4_MAX_VALUE = 2147483647;

const MILEAGE_REQUIRED_MESSAGE = 'Mileage is required.';
const MILEAGE_TYPE_MESSAGE = 'Mileage must be a number.';
export const MIN_MILEAGE_VALUE = 0;
export const MAX_MILEAGE_VALUE = POSTGRES_INT4_MAX_VALUE;

export const mileageSchema = z
  .number({
    error: (issue) =>
      issue.input === undefined
        ? MILEAGE_REQUIRED_MESSAGE
        : MILEAGE_TYPE_MESSAGE,
  })
  .int({ error: 'Mileage must be a whole number.' })
  .min(MIN_MILEAGE_VALUE, { error: 'Mileage cannot be negative.' })
  .max(MAX_MILEAGE_VALUE, {
    error: `Maximum mileage is ${MAX_MILEAGE_VALUE}.`,
  });

export const mileageValidator = new ZodValidator();
