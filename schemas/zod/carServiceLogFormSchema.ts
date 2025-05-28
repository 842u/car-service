import { z, ZodType } from 'zod';

import {
  ServiceCategoryMapping,
  serviceCategoryMapping,
  ServiceLog,
} from '@/types';

import {
  carMileageSchema,
  MIN_CAR_PRODUCTION_YEAR_VALUE,
  MIN_CAR_PRODUCTION_YEAR_VALUE_MESSAGE,
} from './common';

type CarServiceLogFormSchemaShape = Omit<
  { [K in keyof ServiceLog]: ZodType },
  'created_at' | 'created_by' | 'car_id' | 'id'
>;

const serviceCategorySchema = z
  .enum(
    Object.values(serviceCategoryMapping) as [keyof ServiceCategoryMapping],
    {
      message: 'Please choose a correct value.',
    },
  )
  .array()
  .nonempty();

export const MAX_SERVICE_NOTE_lENGTH = 1000;
const MAX_SERVICE_NOTE_LENGTH_MESSAGE = `Maximum notes length is ${MAX_SERVICE_NOTE_lENGTH}.`;

const serviceNotesSchema = z
  .string({
    required_error: 'Service notes are required.',
    invalid_type_error: 'Service notes must be a string.',
  })
  .trim()
  .max(MAX_SERVICE_NOTE_lENGTH, MAX_SERVICE_NOTE_LENGTH_MESSAGE);

const serviceCostSchema = z
  .number({
    required_error: 'Service cost is required.',
    invalid_type_error: 'Service cost must be a number.',
  })
  .nonnegative('Service cost must be a positive number.');

const serviceDateSchema = z.string().superRefine((value, context) => {
  const date = new Date(value);

  if (Number.isNaN(date.valueOf())) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Invalid date format.',
      fatal: true,
    });

    return z.NEVER;
  }

  const year = date.getUTCFullYear();

  if (year < MIN_CAR_PRODUCTION_YEAR_VALUE) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: MIN_CAR_PRODUCTION_YEAR_VALUE_MESSAGE,
    });
  }
});

export const carServiceLogFormSchema = z.object({
  service_date: serviceDateSchema,
  category: serviceCategorySchema,
  mileage: carMileageSchema.nullable().or(z.nan()),
  notes: serviceNotesSchema.nullable().or(z.literal('')),
  service_cost: serviceCostSchema.nullable().or(z.nan()),
} satisfies CarServiceLogFormSchemaShape);

export type CarServiceLogFormValues = z.infer<typeof carServiceLogFormSchema>;
