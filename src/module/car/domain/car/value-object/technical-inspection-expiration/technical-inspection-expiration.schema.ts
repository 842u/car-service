import { z } from 'zod';

import { ZodValidator } from '@/common/infrastructure/validator/zod';

z.config({
  jitless: true,
});

const TECHNICAL_INSPECTION_EXPIRATION_REQUIRED_MESSAGE =
  'Technical inspection expiration date is required.';
const TECHNICAL_INSPECTION_EXPIRATION_TYPE_MESSAGE = 'Invalid date.';
export const MIN_TECHNICAL_INSPECTION_EXPIRATION_DATE = '1885-01-01';

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
    error: 'Hey! First car was made in 1885.',
  });

export const technicalInspectionExpirationValidator = new ZodValidator();
