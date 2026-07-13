import { z } from 'zod';

import { ZodValidator } from '@/common/infrastructure/validator/zod';

z.config({
  jitless: true,
});

// Postgres "integer" (int4) upper bound; the mileage column is int4.
export const POSTGRES_INT4_MAX_VALUE = 2147483647;

const SERVICE_MILEAGE_TYPE_MESSAGE = 'Mileage must be a number.';
export const MIN_SERVICE_MILEAGE_VALUE = 0;
export const MAX_SERVICE_MILEAGE_VALUE = POSTGRES_INT4_MAX_VALUE;

export const serviceMileageSchema = z
  .number({
    error: SERVICE_MILEAGE_TYPE_MESSAGE,
  })
  .int({ error: 'Mileage must be a whole number.' })
  .min(MIN_SERVICE_MILEAGE_VALUE, { error: 'Mileage cannot be negative.' })
  .max(MAX_SERVICE_MILEAGE_VALUE, {
    error: `Maximum mileage is ${MAX_SERVICE_MILEAGE_VALUE}.`,
  });

export const serviceMileageValidator = new ZodValidator();
