import { z, ZodType } from 'zod';

import {
  ServiceCategoryMapping,
  serviceCategoryMapping,
  ServiceLog,
} from '@/types';

import {
  carMileageSchema,
  MIN_CAR_INSURANCE_EXPIRATION_DATE,
  MIN_CAR_INSURANCE_EXPIRATION_DATE_MESSAGE,
} from './common';

type CarServiceLogAddFormSchemaShape = Omit<
  { [K in keyof ServiceLog]: ZodType },
  'created_at' | 'created_by' | 'car_id' | 'id'
>;

const serviceCategorySchema = z.enum(
  Object.values(serviceCategoryMapping) as [keyof ServiceCategoryMapping],
  {
    message: 'Please choose a correct value.',
  },
);

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

const serviceDateSchema = z.coerce
  .date({
    required_error: 'Service date is required.',
    invalid_type_error: 'Service date must be a date.',
  })
  .min(
    new Date(MIN_CAR_INSURANCE_EXPIRATION_DATE),
    MIN_CAR_INSURANCE_EXPIRATION_DATE_MESSAGE,
  );

export const carServiceLogAddFormSchema = z.object({
  service_date: serviceDateSchema,
  mileage: carMileageSchema,
  category: serviceCategorySchema,
  notes: serviceNotesSchema.optional().or(z.literal('')),
  service_cost: serviceCostSchema.nullable().optional().or(z.nan()),
} satisfies CarServiceLogAddFormSchemaShape);

export type CarServiceLogAddFormValues = z.infer<
  typeof carServiceLogAddFormSchema
>;
