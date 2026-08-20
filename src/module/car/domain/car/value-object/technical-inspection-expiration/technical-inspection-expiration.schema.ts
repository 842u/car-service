import { z } from 'zod';

import {
  BEFORE_FIRST_CAR_MESSAGE,
  FIRST_CAR_PRODUCTION_DATE,
} from '@/car/domain/car/constant/first-car';
import { ZodValidator } from '@/common/infrastructure/validator/zod';

z.config({
  jitless: true,
});

const TECHNICAL_INSPECTION_EXPIRATION_REQUIRED_MESSAGE =
  'Technical inspection expiration date is required.';
const TECHNICAL_INSPECTION_EXPIRATION_TYPE_MESSAGE = 'Invalid date.';
export const MIN_TECHNICAL_INSPECTION_EXPIRATION_DATE =
  FIRST_CAR_PRODUCTION_DATE;

// Models the `date` column shape (a `yyyy-mm-dd` string); the picker-to-string
// coercion is a UI concern for the form schema. Lexicographic compare is valid
// for zero-padded ISO dates.
export const technicalInspectionExpirationSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? TECHNICAL_INSPECTION_EXPIRATION_REQUIRED_MESSAGE
        : TECHNICAL_INSPECTION_EXPIRATION_TYPE_MESSAGE,
  })
  .regex(/^\d{4}-\d{2}-\d{2}$/, {
    error: TECHNICAL_INSPECTION_EXPIRATION_TYPE_MESSAGE,
  })
  .refine((value) => value >= MIN_TECHNICAL_INSPECTION_EXPIRATION_DATE, {
    error: BEFORE_FIRST_CAR_MESSAGE,
  });

export const technicalInspectionExpirationValidator = new ZodValidator();
