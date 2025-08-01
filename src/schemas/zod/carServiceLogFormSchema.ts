import type { ZodType } from 'zod';
import { z } from 'zod';

import type { ServiceCategoryMapping, ServiceLog } from '@/types';
import { serviceCategoryMapping } from '@/types';
import { parseDateToYyyyMmDd } from '@/utils/general';

import { carMileageSchema } from './carFormSchema';

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

const SERVICE_DATE_REQUIRED_MESSAGE = 'Date is required.';
const SERVICE_DATE_TYPE_MESSAGE = 'Invalid date.';
const MIN_SERVICE_DATE = '1885-01-01';
const MIN_SERVICE_DATE_MESSAGE = 'Hey! First car was made in 1885.';

const serviceDateSchema = z.coerce
  .date({
    error: (issue) =>
      issue.input === undefined
        ? SERVICE_DATE_REQUIRED_MESSAGE
        : SERVICE_DATE_TYPE_MESSAGE,
  })
  .min(new Date(MIN_SERVICE_DATE), {
    error: MIN_SERVICE_DATE_MESSAGE,
  })
  .transform((date) => parseDateToYyyyMmDd(date));

export const carServiceLogFormSchema = z.object({
  service_date: serviceDateSchema,
  category: serviceCategorySchema,
  mileage: carMileageSchema.nullable().or(z.nan()),
  notes: serviceNoteSchema.nullable().or(z.literal('')),
  service_cost: serviceCostSchema.nullable().or(z.nan()),
} satisfies CarServiceLogFormSchemaShape);

export type CarServiceLogFormValues = z.infer<typeof carServiceLogFormSchema>;
