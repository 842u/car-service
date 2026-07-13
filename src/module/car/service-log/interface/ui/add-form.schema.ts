import { z } from 'zod';

import {
  serviceCategoriesSchema,
  serviceCategoryValues,
} from '@/car/service-log/domain/service-log/value-object/service-categories/service-categories.schema';
import { serviceCostSchema } from '@/car/service-log/domain/service-log/value-object/service-cost/service-cost.schema';
import { serviceDateSchema } from '@/car/service-log/domain/service-log/value-object/service-date/service-date.schema';
import { serviceMileageSchema } from '@/car/service-log/domain/service-log/value-object/service-mileage/service-mileage.schema';
import { serviceNoteSchema } from '@/car/service-log/domain/service-log/value-object/service-note/service-note.schema';
import {
  nullifyEmptyString,
  nullifyNaN,
} from '@/common/interface/schema/nullify.schema';
import { parseDateToYyyyMmDd } from '@/lib/utils';

z.config({
  jitless: true,
});

export const serviceCategoryLabelValueMapping: Record<string, string> =
  Object.fromEntries(
    serviceCategoryValues.map((category) => [category, category]),
  );

const SERVICE_DATE_REQUIRED_MESSAGE = 'Date is required.';
const SERVICE_DATE_TYPE_MESSAGE = 'Invalid date.';

// The date-picker submits a Date; the domain schema validates the persisted
// `yyyy-mm-dd` string shape (and its min/max bounds), so coerce then pipe.
const datePickerServiceDateSchema = z.coerce
  .date({
    error: (issue) =>
      issue.input === undefined
        ? SERVICE_DATE_REQUIRED_MESSAGE
        : SERVICE_DATE_TYPE_MESSAGE,
  })
  .transform((date) => parseDateToYyyyMmDd(date))
  .pipe(serviceDateSchema);

export const addServiceLogFormSchema = z.object({
  serviceDate: datePickerServiceDateSchema,
  categories: serviceCategoriesSchema,
  mileage: nullifyNaN(serviceMileageSchema),
  notes: nullifyEmptyString(serviceNoteSchema),
  serviceCost: nullifyNaN(serviceCostSchema),
});

export type AddServiceLogFormValues = z.infer<typeof addServiceLogFormSchema>;
