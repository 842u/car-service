import { z } from 'zod';

import { ZodValidator } from '@/common/infrastructure/validator/zod';

z.config({
  jitless: true,
});

const SERVICE_DATE_REQUIRED_MESSAGE = 'Date is required.';
const SERVICE_DATE_TYPE_MESSAGE = 'Invalid date.';
export const MIN_SERVICE_DATE = '1885-01-01';
// Mirrors ProductionYear's ceiling: cars (and so their service records) are
// allowed to reference model years a few years out.
export const MAX_SERVICE_DATE = `${new Date().getFullYear() + 5}-12-31`;

// Models the `date` column shape (a `yyyy-mm-dd` string); the picker-to-string
// coercion is a UI concern for the form schema.
export const serviceDateSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? SERVICE_DATE_REQUIRED_MESSAGE
        : SERVICE_DATE_TYPE_MESSAGE,
  })
  // Enforces the zero-padded yyyy-mm-dd shape before the bounds below run.
  // The min/max checks compare strings directly rather than parsing into
  // `Date` objects, which only sorts correctly when every field is
  // zero-padded to a fixed width (unpadded, "2026-9-1" would sort after
  // "2026-10-1" since '9' > '1'). Also rejects non-date strings outright.
  .regex(/^\d{4}-\d{2}-\d{2}$/, { error: SERVICE_DATE_TYPE_MESSAGE })
  .refine((value) => value >= MIN_SERVICE_DATE, {
    error: 'Hey! First car was made in 1885.',
  })
  .refine((value) => value <= MAX_SERVICE_DATE, {
    error: `Maximum service date is ${MAX_SERVICE_DATE}.`,
  });

export const serviceDateValidator = new ZodValidator();
