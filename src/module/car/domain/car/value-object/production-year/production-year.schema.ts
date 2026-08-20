import { z } from 'zod';

import {
  BEFORE_FIRST_CAR_MESSAGE,
  FIRST_CAR_PRODUCTION_YEAR,
} from '@/car/domain/car/constant/first-car';
import { ZodValidator } from '@/common/infrastructure/validator/zod';

z.config({
  jitless: true,
});

const PRODUCTION_YEAR_REQUIRED_MESSAGE = 'Production year is required.';
const PRODUCTION_YEAR_TYPE_MESSAGE = 'Production year must be a number.';
export const MIN_PRODUCTION_YEAR_VALUE = FIRST_CAR_PRODUCTION_YEAR;
export const MAX_PRODUCTION_YEAR_VALUE = new Date().getFullYear() + 5;

export const productionYearSchema = z
  .number({
    error: (issue) =>
      issue.input === undefined
        ? PRODUCTION_YEAR_REQUIRED_MESSAGE
        : PRODUCTION_YEAR_TYPE_MESSAGE,
  })
  .int({ error: 'Production year must be a whole number.' })
  .min(MIN_PRODUCTION_YEAR_VALUE, { error: BEFORE_FIRST_CAR_MESSAGE })
  .max(MAX_PRODUCTION_YEAR_VALUE, {
    error: `Maximum production year is ${MAX_PRODUCTION_YEAR_VALUE}.`,
  });

export const productionYearValidator = new ZodValidator();
