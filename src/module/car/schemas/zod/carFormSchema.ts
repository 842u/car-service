import type { ZodType } from 'zod';
import { z } from 'zod';

import { imageFileSchema } from '@/common/interface/schema/image-file.schema';
import {
  nullifyEmptyString,
  nullifyNaN,
} from '@/common/interface/schema/nullify.schema';
import { parseDateToYyyyMmDd } from '@/lib/utils';
import type {
  Car,
  DriveMapping,
  FuelMapping,
  TransmissionMapping,
} from '@/types';
import {
  driveTypesMapping,
  fuelTypesMapping,
  transmissionTypesMapping,
} from '@/types';

type CarFormSchemaShape = Omit<
  { [K in keyof Car]: ZodType },
  'image_url' | 'created_at' | 'created_by' | 'id'
> & {
  image: ZodType;
};

z.config({
  jitless: true,
});

// Postgres "integer" (int4) upper bound; engine_capacity and mileage columns are int4.
export const POSTGRES_INT4_MAX_VALUE = 2147483647;

const CAR_NAME_REQUIRED_MESSAGE = 'Name is required.';
const CAR_NAME_TYPE_MESSAGE = 'Name must be a string.';
export const MIN_CAR_NAME_LENGTH = 1;
const MIN_CAR_NAME_LENGTH_MESSAGE = CAR_NAME_REQUIRED_MESSAGE;
export const MAX_CAR_NAME_LENGTH = 30;
const MAX_CAR_NAME_LENGTH_MESSAGE = `Maximum name length is ${MAX_CAR_NAME_LENGTH}.`;

const carNameSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? CAR_NAME_REQUIRED_MESSAGE
        : CAR_NAME_TYPE_MESSAGE,
  })
  .trim()
  .min(MIN_CAR_NAME_LENGTH, { error: MIN_CAR_NAME_LENGTH_MESSAGE })
  .max(MAX_CAR_NAME_LENGTH, { error: MAX_CAR_NAME_LENGTH_MESSAGE });

const CAR_BRAND_REQUIRED_MESSAGE = 'Brand is required.';
const CAR_BRAND_TYPE_MESSAGE = 'Brand must be a string.';
export const MIN_CAR_BRAND_LENGTH = 2;
const MIN_CAR_BRAND_LENGTH_MESSAGE = `Minimum brand length is ${MIN_CAR_BRAND_LENGTH}.`;
export const MAX_CAR_BRAND_LENGTH = 25;
const MAX_CAR_BRAND_LENGTH_MESSAGE = `Maximum brand length is ${MAX_CAR_BRAND_LENGTH}.`;

const carBrandSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? CAR_BRAND_REQUIRED_MESSAGE
        : CAR_BRAND_TYPE_MESSAGE,
  })
  .trim()
  .min(MIN_CAR_BRAND_LENGTH, { error: MIN_CAR_BRAND_LENGTH_MESSAGE })
  .max(MAX_CAR_BRAND_LENGTH, { error: MAX_CAR_BRAND_LENGTH_MESSAGE });

const CAR_MODEL_REQUIRED_MESSAGE = 'Model is required.';
const CAR_MODEL_TYPE_MESSAGE = 'Model must be a string.';
export const MIN_CAR_MODEL_LENGTH = 1;
const MIN_CAR_MODEL_LENGTH_MESSAGE = CAR_MODEL_REQUIRED_MESSAGE;
export const MAX_CAR_MODEL_LENGTH = 25;
const MAX_CAR_MODEL_LENGTH_MESSAGE = `Maximum model length is ${MAX_CAR_MODEL_LENGTH}.`;

const carModelSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? CAR_MODEL_REQUIRED_MESSAGE
        : CAR_MODEL_TYPE_MESSAGE,
  })
  .trim()
  .min(MIN_CAR_MODEL_LENGTH, { error: MIN_CAR_MODEL_LENGTH_MESSAGE })
  .max(MAX_CAR_MODEL_LENGTH, { error: MAX_CAR_MODEL_LENGTH_MESSAGE });

const CAR_LICENSE_PLATES_REQUIRED_MESSAGE = 'License plates are required.';
const CAR_LICENSE_PLATES_TYPE_MESSAGE = 'License plates must be a string.';
export const MIN_CAR_LICENSE_PLATES_LENGTH = 1;
const MIN_CAR_LICENSE_PLATES_LENGTH_MESSAGE =
  CAR_LICENSE_PLATES_REQUIRED_MESSAGE;
export const MAX_CAR_LICENSE_PLATES_LENGTH = 15;
const MAX_CAR_LICENSE_PLATES_LENGTH_MESSAGE = `Maximum license plates length is ${MAX_CAR_LICENSE_PLATES_LENGTH}.`;

const carLicensePlatesSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? CAR_LICENSE_PLATES_REQUIRED_MESSAGE
        : CAR_LICENSE_PLATES_TYPE_MESSAGE,
  })
  .trim()
  .min(MIN_CAR_LICENSE_PLATES_LENGTH, {
    error: MIN_CAR_LICENSE_PLATES_LENGTH_MESSAGE,
  })
  .max(MAX_CAR_LICENSE_PLATES_LENGTH, {
    error: MAX_CAR_LICENSE_PLATES_LENGTH_MESSAGE,
  });

const CAR_VIN_REQUIRED_MESSAGE = 'VIN is required.';
const CAR_VIN_TYPE_MESSAGE = 'VIN must be a string.';
export const CAR_VIN_LENGTH = 17;
const CAR_VIN_LENGTH_MESSAGE = `VIN must be ${CAR_VIN_LENGTH} characters long.`;

const carVinSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? CAR_VIN_REQUIRED_MESSAGE
        : CAR_VIN_TYPE_MESSAGE,
  })
  .trim()
  .length(CAR_VIN_LENGTH, { error: CAR_VIN_LENGTH_MESSAGE });

const CAR_ENGINE_CAPACITY_REQUIRED_MESSAGE = 'Engine capacity is required.';
const CAR_ENGINE_CAPACITY_TYPE_MESSAGE = 'Engine capacity must be a number.';
export const MIN_CAR_ENGINE_CAPACITY_VALUE = 1;
const MIN_CAR_ENGINE_CAPACITY_VALUE_MESSAGE =
  'Engine capacity must be a positive number.';
export const MAX_CAR_ENGINE_CAPACITY_VALUE = POSTGRES_INT4_MAX_VALUE;
const MAX_CAR_ENGINE_CAPACITY_VALUE_MESSAGE = `Maximum engine capacity is ${MAX_CAR_ENGINE_CAPACITY_VALUE}.`;
const CAR_ENGINE_CAPACITY_NOT_INTEGER_MESSAGE =
  'Engine capacity must be a whole number.';

const carEngineCapacitySchema = z
  .number({
    error: (issue) =>
      issue.input === undefined
        ? CAR_ENGINE_CAPACITY_REQUIRED_MESSAGE
        : CAR_ENGINE_CAPACITY_TYPE_MESSAGE,
  })
  .min(MIN_CAR_ENGINE_CAPACITY_VALUE, {
    error: MIN_CAR_ENGINE_CAPACITY_VALUE_MESSAGE,
  })
  .max(MAX_CAR_ENGINE_CAPACITY_VALUE, {
    error: MAX_CAR_ENGINE_CAPACITY_VALUE_MESSAGE,
  })
  .nonnegative({ error: MIN_CAR_ENGINE_CAPACITY_VALUE_MESSAGE })
  .int({ error: CAR_ENGINE_CAPACITY_NOT_INTEGER_MESSAGE });

const CAR_MILEAGE_REQUIRED_MESSAGE = 'Mileage is required.';
const CAR_MILEAGE_TYPE_MESSAGE = 'Mileage must be a number.';
export const MIN_CAR_MILEAGE_VALUE = 1;
const MIN_CAR_MILEAGE_VALUE_MESSAGE = 'Mileage must be positive number.';
export const MAX_CAR_MILEAGE_VALUE = POSTGRES_INT4_MAX_VALUE;
const MAX_CAR_MILEAGE_VALUE_MESSAGE = `Maximum mileage is ${MAX_CAR_MILEAGE_VALUE}.`;
const CAR_MILEAGE_NOT_INTEGER_MESSAGE = 'Mileage must be a whole number.';

export const carMileageSchema = z
  .number({
    error: (issue) =>
      issue.input === undefined
        ? CAR_MILEAGE_REQUIRED_MESSAGE
        : CAR_MILEAGE_TYPE_MESSAGE,
  })
  .min(MIN_CAR_MILEAGE_VALUE, { error: MIN_CAR_MILEAGE_VALUE_MESSAGE })
  .max(MAX_CAR_MILEAGE_VALUE, { error: MAX_CAR_MILEAGE_VALUE_MESSAGE })
  .nonnegative({ error: MIN_CAR_MILEAGE_VALUE_MESSAGE })
  .int({ error: CAR_MILEAGE_NOT_INTEGER_MESSAGE });

const CAR_PRODUCTION_YEAR_REQUIRED_MESSAGE = 'Production year is required.';
const CAR_PRODUCTION_YEAR_TYPE_MESSAGE = 'Production year must be a number.';
const CAR_PRODUCTION_YEAR_NONNEGATIVE_MESSAGE =
  'Production year must be a positive number.';
export const MIN_CAR_PRODUCTION_YEAR_VALUE = 1885;
export const MIN_CAR_PRODUCTION_YEAR_VALUE_MESSAGE =
  'Hey! First car was made in 1885.';
export const MAX_CAR_PRODUCTION_YEAR_VALUE = new Date().getFullYear() + 5;
const MAX_CAR_PRODUCTION_YEAR_VALUE_MESSAGE = `Maximum production year is ${MAX_CAR_PRODUCTION_YEAR_VALUE}.`;
const CAR_PRODUCTION_YEAR_NOT_INTEGER_MESSAGE =
  'Production year must be a whole number.';

const carProductionYearSchema = z
  .number({
    error: (issue) =>
      issue.input === undefined
        ? CAR_PRODUCTION_YEAR_REQUIRED_MESSAGE
        : CAR_PRODUCTION_YEAR_TYPE_MESSAGE,
  })
  .min(MIN_CAR_PRODUCTION_YEAR_VALUE, {
    error: MIN_CAR_PRODUCTION_YEAR_VALUE_MESSAGE,
  })
  .max(MAX_CAR_PRODUCTION_YEAR_VALUE, {
    error: MAX_CAR_PRODUCTION_YEAR_VALUE_MESSAGE,
  })
  .nonnegative({ error: CAR_PRODUCTION_YEAR_NONNEGATIVE_MESSAGE })
  .int({ error: CAR_PRODUCTION_YEAR_NOT_INTEGER_MESSAGE });

const carFuelEnumSchema = z.enum(
  Object.values(fuelTypesMapping) as [keyof FuelMapping],
  { message: 'Please choose a correct value.' },
);

const carTransmissionEnumSchema = z.enum(
  Object.values(transmissionTypesMapping) as [keyof TransmissionMapping],
  { message: 'Please choose a correct value.' },
);

const carDriveEnumSchema = z.enum(
  Object.values(driveTypesMapping) as [keyof DriveMapping],
  {
    message: 'Please choose a correct value.',
  },
);

const carFuelTypeSchema = nullifyEmptyString(carFuelEnumSchema);

const carTransmissionTypeSchema = nullifyEmptyString(carTransmissionEnumSchema);

const carDriveTypeSchema = nullifyEmptyString(carDriveEnumSchema);

const CAR_INSURANCE_EXPIRATION_DATE_REQUIRED_MESSAGE =
  'Insurance expiration date is required.';
const CAR_INSURANCE_EXPIRATION_DATE_TYPE_MESSAGE = 'Invalid date.';
export const MIN_CAR_INSURANCE_EXPIRATION_DATE = '1885-01-01';
const MIN_CAR_INSURANCE_EXPIRATION_DATE_MESSAGE =
  'Hey! First car was made in 1885.';

const carInsuranceExpirationSchema = z.coerce
  .date({
    error: (issue) =>
      issue.input === undefined
        ? CAR_INSURANCE_EXPIRATION_DATE_REQUIRED_MESSAGE
        : CAR_INSURANCE_EXPIRATION_DATE_TYPE_MESSAGE,
  })
  .min(new Date(MIN_CAR_INSURANCE_EXPIRATION_DATE), {
    error: MIN_CAR_INSURANCE_EXPIRATION_DATE_MESSAGE,
  })
  .transform((date) => parseDateToYyyyMmDd(date));

const CAR_TECHNICAL_INSPECTION_EXPIRATION_DATE_REQUIRED_MESSAGE =
  'Technical inspection expiration date is required.';
const CAR_TECHNICAL_INSPECTION_EXPIRATION_DATE_TYPE_MESSAGE = 'Invalid date.';
export const MIN_CAR_TECHNICAL_INSPECTION_EXPIRATION_DATE = '1885-01-01';
const MIN_CAR_TECHNICAL_INSPECTION_EXPIRATION_DATE_MESSAGE =
  'Hey! First car was made in 1885.';

const carTechnicalInspectionExpirationSchema = z.coerce
  .date({
    error: (issue) =>
      issue.input === undefined
        ? CAR_TECHNICAL_INSPECTION_EXPIRATION_DATE_REQUIRED_MESSAGE
        : CAR_TECHNICAL_INSPECTION_EXPIRATION_DATE_TYPE_MESSAGE,
  })
  .min(new Date(MIN_CAR_TECHNICAL_INSPECTION_EXPIRATION_DATE), {
    error: MIN_CAR_TECHNICAL_INSPECTION_EXPIRATION_DATE_MESSAGE,
  })
  .transform((date) => parseDateToYyyyMmDd(date));

export const carFormSchema = z.object({
  image: imageFileSchema.nullable().optional(),
  custom_name: carNameSchema,
  brand: nullifyEmptyString(carBrandSchema),
  model: nullifyEmptyString(carModelSchema),
  license_plates: nullifyEmptyString(carLicensePlatesSchema),
  vin: nullifyEmptyString(carVinSchema),
  engine_capacity: nullifyNaN(carEngineCapacitySchema),
  mileage: nullifyNaN(carMileageSchema),
  production_year: nullifyNaN(carProductionYearSchema),
  fuel_type: carFuelTypeSchema,
  additional_fuel_type: carFuelTypeSchema,
  transmission_type: carTransmissionTypeSchema,
  drive_type: carDriveTypeSchema,
  insurance_expiration: nullifyEmptyString(carInsuranceExpirationSchema),
  technical_inspection_expiration: nullifyEmptyString(
    carTechnicalInspectionExpirationSchema,
  ),
} satisfies CarFormSchemaShape);

export type CarFormValues = z.infer<typeof carFormSchema>;
