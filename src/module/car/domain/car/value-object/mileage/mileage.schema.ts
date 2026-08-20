import { z } from 'zod';

import { ZodValidator } from '@/common/infrastructure/validator/zod';

z.config({
  jitless: true,
});

const MILEAGE_REQUIRED_MESSAGE = 'Mileage is required.';
const MILEAGE_TYPE_MESSAGE = 'Mileage must be a number.';
export const MIN_MILEAGE_VALUE = 0;
// The highest recorded car mileage is around 5.5M km, so this ceiling fits
// any real odometer while still rejecting a mistyped order of magnitude.
export const MAX_MILEAGE_VALUE = 10_000_000;

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
