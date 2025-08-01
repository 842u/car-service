import type { ZodType } from 'zod';
import { z } from 'zod';

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
import { parseDateToYyyyMmDd } from '@/utils/general';

import { imageFileSchema } from './common';

type CarFormSchemaShape = Omit<
  { [K in keyof Car]: ZodType },
  'image_url' | 'created_at' | 'created_by' | 'id'
> & {
  image: ZodType;
};

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
export const MAX_CAR_ENGINE_CAPACITY_VALUE = Number.MAX_SAFE_INTEGER;
const CAR_ENGINE_CAPACITY_VALUE_RANGE_MESSAGE = `Engine capacity value must be between ${Number.MIN_SAFE_INTEGER} and ${MAX_CAR_ENGINE_CAPACITY_VALUE}.`;

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
  .nonnegative({ error: MIN_CAR_ENGINE_CAPACITY_VALUE_MESSAGE })
  .int({ error: CAR_ENGINE_CAPACITY_VALUE_RANGE_MESSAGE });

const CAR_MILEAGE_REQUIRED_MESSAGE = 'Mileage is required.';
const CAR_MILEAGE_TYPE_MESSAGE = 'Mileage must be a number.';
export const MIN_CAR_MILEAGE_VALUE = 1;
const MIN_CAR_MILEAGE_VALUE_MESSAGE = 'Mileage must be positive number.';
export const MAX_CAR_MILEAGE_VALUE = Number.MAX_SAFE_INTEGER;
const CAR_MILEAGE_VALUE_RANGE_MESSAGE = `Mileage value must be between ${Number.MIN_SAFE_INTEGER} and ${MAX_CAR_MILEAGE_VALUE}.`;

export const carMileageSchema = z
  .number({
    error: (issue) =>
      issue.input === undefined
        ? CAR_MILEAGE_REQUIRED_MESSAGE
        : CAR_MILEAGE_TYPE_MESSAGE,
  })
  .min(MIN_CAR_MILEAGE_VALUE, { error: MIN_CAR_MILEAGE_VALUE_MESSAGE })
  .nonnegative({ error: MIN_CAR_MILEAGE_VALUE_MESSAGE })
  .int({ error: CAR_MILEAGE_VALUE_RANGE_MESSAGE });

const CAR_PRODUCTION_YEAR_REQUIRED_MESSAGE = 'Production year is required.';
const CAR_PRODUCTION_YEAR_TYPE_MESSAGE = 'Production year must be a number.';
const CAR_PRODUCTION_YEAR_NONNEGATIVE_MESSAGE =
  'Production year must be a positive number.';
export const MIN_CAR_PRODUCTION_YEAR_VALUE = 1885;
export const MIN_CAR_PRODUCTION_YEAR_VALUE_MESSAGE =
  'Hey! First car was made in 1885.';
export const MAX_CAR_PRODUCTION_YEAR_VALUE = new Date().getFullYear() + 5;
const MAX_CAR_PRODUCTION_YEAR_VALUE_MESSAGE = `Maximum production year is ${MAX_CAR_PRODUCTION_YEAR_VALUE}.`;
const CAR_PRODUCTION_YEAR_VALUE_RANGE_MESSAGE = `Production year value must be between ${Number.MIN_SAFE_INTEGER} and ${Number.MAX_SAFE_INTEGER}.`;

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
  .int({ error: CAR_PRODUCTION_YEAR_VALUE_RANGE_MESSAGE });

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

const carFuelTypeSchema = z
  .string()
  .transform((val) => (val === '' ? null : val))
  .pipe(carFuelEnumSchema.nullable());

const carTransmissionTypeSchema = z
  .string()
  .transform((val) => (val === '' ? null : val))
  .pipe(carTransmissionEnumSchema.nullable());

const carDriveTypeSchema = z
  .string()
  .transform((val) => (val === '' ? null : val))
  .pipe(carDriveEnumSchema.nullable());

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
  .transform((date) => (date ? parseDateToYyyyMmDd(date) : null));

export const carFormSchema = z.object({
  image: imageFileSchema.nullable().optional(),
  custom_name: carNameSchema,
  brand: carBrandSchema.nullable().or(z.literal('')),
  model: carModelSchema.nullable().or(z.literal('')),
  license_plates: carLicensePlatesSchema.nullable().or(z.literal('')),
  vin: carVinSchema.nullable().or(z.literal('')),
  engine_capacity: carEngineCapacitySchema.nullable().or(z.nan()),
  mileage: carMileageSchema.nullable().or(z.nan()),
  production_year: carProductionYearSchema.nullable().or(z.nan()),
  fuel_type: carFuelTypeSchema.nullable(),
  additional_fuel_type: carFuelTypeSchema.nullable(),
  transmission_type: carTransmissionTypeSchema.nullable(),
  drive_type: carDriveTypeSchema.nullable(),
  insurance_expiration: carInsuranceExpirationSchema
    .nullable()
    .or(z.literal('')),
  technical_inspection_expiration: carTechnicalInspectionExpirationSchema
    .nullable()
    .or(z.literal('')),
} satisfies CarFormSchemaShape);

export type CarFormValues = z.infer<typeof carFormSchema>;
