import type { ZodType } from 'zod';
import { z } from 'zod';

import type { ServiceCategoryMapping, ServiceLog } from '@/types';
import { serviceCategoryMapping } from '@/types';

import {
  carMileageSchema,
  MIN_CAR_PRODUCTION_YEAR_VALUE,
  MIN_CAR_PRODUCTION_YEAR_VALUE_MESSAGE,
} from './carFormSchema';

type CarServiceLogFormSchemaShape = Omit<
  { [K in keyof ServiceLog]: ZodType },
  'created_at' | 'created_by' | 'car_id' | 'id'
>;

const serviceCategorySchema = z
  .enum(
    Object.values(serviceCategoryMapping) as [keyof ServiceCategoryMapping],
    {
      error: 'Please choose a correct value.',
    },
  )
  .array()
  .nonempty({ error: 'Please choose at least one value.' });

const SERVICE_NOTE_REQUIRED_MESSAGE = 'Note is required.';
const SERVICE_NOTE_TYPE_MESSAGE = 'Note must be a string.';
export const MAX_SERVICE_NOTE_lENGTH = 1000;
const MAX_SERVICE_NOTE_LENGTH_MESSAGE = `Maximum note length is ${MAX_SERVICE_NOTE_lENGTH}.`;

const serviceNoteSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? SERVICE_NOTE_REQUIRED_MESSAGE
        : SERVICE_NOTE_TYPE_MESSAGE,
  })
  .trim()
  .max(MAX_SERVICE_NOTE_lENGTH, { error: MAX_SERVICE_NOTE_LENGTH_MESSAGE });

const SERVICE_COST_REQUIRED_MESSAGE = 'Cost is required.';
const SERVICE_COST_TYPE_MESSAGE = 'Cost must be a number.';
const SERVICE_COST_NONNEGATIVE_MESSAGE =
  'Service cost must be a positive number.';

const serviceCostSchema = z
  .number({
    error: (issue) =>
      issue.input === undefined
        ? SERVICE_COST_REQUIRED_MESSAGE
        : SERVICE_COST_TYPE_MESSAGE,
  })
  .nonnegative({ error: SERVICE_COST_NONNEGATIVE_MESSAGE });

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
  notes: serviceNoteSchema.nullable().or(z.literal('')),
  service_cost: serviceCostSchema.nullable().or(z.nan()),
} satisfies CarServiceLogFormSchemaShape);

export type CarServiceLogFormValues = z.infer<typeof carServiceLogFormSchema>;
