import { z } from 'zod';

import { ZodValidator } from '@/common/infrastructure/validator/zod';

z.config({
  jitless: true,
});

const PRODUCTION_YEAR_REQUIRED_MESSAGE = 'Production year is required.';
const PRODUCTION_YEAR_TYPE_MESSAGE = 'Production year must be a number.';
export const MIN_PRODUCTION_YEAR_VALUE = 1885;
export const MAX_PRODUCTION_YEAR_VALUE = new Date().getFullYear() + 5;

export const productionYearSchema = z
  .number({
    error: (issue) =>
      issue.input === undefined
        ? PRODUCTION_YEAR_REQUIRED_MESSAGE
        : PRODUCTION_YEAR_TYPE_MESSAGE,
  })
  .int({ error: 'Production year must be a whole number.' })
  .min(MIN_PRODUCTION_YEAR_VALUE, { error: 'Hey! First car was made in 1885.' })
  .max(MAX_PRODUCTION_YEAR_VALUE, {
    error: `Maximum production year is ${MAX_PRODUCTION_YEAR_VALUE}.`,
  });

export const productionYearValidator = new ZodValidator();
