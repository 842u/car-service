import { z } from 'zod';

import { MAX_MILEAGE_VALUE } from '@/car/domain/car/value-object/mileage/mileage.schema';
import { ZodValidator } from '@/common/infrastructure/validator/zod';

z.config({
  jitless: true,
});

const SERVICE_MILEAGE_TYPE_MESSAGE = 'Mileage must be a number.';
export const MIN_SERVICE_MILEAGE_VALUE = 0;
// A service record's odometer reading is the same quantity as the car's
// mileage, so it shares that ceiling.
export const MAX_SERVICE_MILEAGE_VALUE = MAX_MILEAGE_VALUE;

export const serviceMileageSchema = z
  .number({
    error: SERVICE_MILEAGE_TYPE_MESSAGE,
  })
  .int({ error: 'Mileage must be a whole number.' })
  .min(MIN_SERVICE_MILEAGE_VALUE, { error: 'Mileage cannot be negative.' })
  .max(MAX_SERVICE_MILEAGE_VALUE, {
    error: `Maximum mileage is ${MAX_SERVICE_MILEAGE_VALUE}.`,
  });

export const serviceMileageValidator = new ZodValidator();
