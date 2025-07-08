import { z, ZodType } from 'zod';

import {
  Car,
  DriveMapping,
  driveTypesMapping,
  FuelMapping,
  fuelTypesMapping,
  TransmissionMapping,
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

export const MIN_CAR_NAME_LENGTH = 1;
const MIN_CAR_NAME_LENGTH_MESSAGE = 'Name is required.';
export const MAX_CAR_NAME_LENGTH = 30;
const MAX_CAR_NAME_LENGTH_MESSAGE = `Maximum name length is ${MAX_CAR_NAME_LENGTH}.`;

const carNameSchema = z
  .string({
    required_error: 'Name is required.',
    invalid_type_error: 'Name must be a string.',
  })
  .trim()
  .min(MIN_CAR_NAME_LENGTH, MIN_CAR_NAME_LENGTH_MESSAGE)
  .max(MAX_CAR_NAME_LENGTH, MAX_CAR_NAME_LENGTH_MESSAGE);

export const MIN_CAR_BRAND_LENGTH = 2;
const MIN_CAR_BRAND_LENGTH_MESSAGE = `Minimum brand length is ${MIN_CAR_BRAND_LENGTH}.`;
export const MAX_CAR_BRAND_LENGTH = 25;
const MAX_CAR_BRAND_LENGTH_MESSAGE = `Maximum brand length is ${MAX_CAR_BRAND_LENGTH}.`;

const carBrandSchema = z
  .string({
    required_error: 'Brand is required.',
    invalid_type_error: 'Brand must be a string.',
  })
  .trim()
  .min(MIN_CAR_BRAND_LENGTH, MIN_CAR_BRAND_LENGTH_MESSAGE)
  .max(MAX_CAR_BRAND_LENGTH, MAX_CAR_BRAND_LENGTH_MESSAGE);

export const MIN_CAR_MODEL_LENGTH = 1;
const MIN_CAR_MODEL_LENGTH_MESSAGE = `Minimum model length is ${MIN_CAR_MODEL_LENGTH}.`;
export const MAX_CAR_MODEL_LENGTH = 25;
const MAX_CAR_MODEL_LENGTH_MESSAGE = `Maximum model length is ${MAX_CAR_MODEL_LENGTH}.`;

const carModelSchema = z
  .string({
    required_error: 'Model is required.',
    invalid_type_error: 'Model must be a string.',
  })
  .trim()
  .min(MIN_CAR_MODEL_LENGTH, MIN_CAR_MODEL_LENGTH_MESSAGE)
  .max(MAX_CAR_MODEL_LENGTH, MAX_CAR_MODEL_LENGTH_MESSAGE);

export const MIN_CAR_LICENSE_PLATES_LENGTH = 1;
const MIN_CAR_LICENSE_PLATES_LENGTH_MESSAGE = `Minimum license plates length is ${MIN_CAR_LICENSE_PLATES_LENGTH}.`;
export const MAX_CAR_LICENSE_PLATES_LENGTH = 15;
const MAX_CAR_LICENSE_PLATES_LENGTH_MESSAGE = `Maximum license plates length is ${MAX_CAR_LICENSE_PLATES_LENGTH}.`;

const carLicensePlatesSchema = z
  .string({
    required_error: 'License plates is required.',
    invalid_type_error: 'License plates must be a string.',
  })
  .trim()
  .min(MIN_CAR_LICENSE_PLATES_LENGTH, MIN_CAR_LICENSE_PLATES_LENGTH_MESSAGE)
  .max(MAX_CAR_LICENSE_PLATES_LENGTH, MAX_CAR_LICENSE_PLATES_LENGTH_MESSAGE);

export const CAR_VIN_LENGTH = 17;
const CAR_VIN_LENGTH_MESSAGE = `VIN must be ${CAR_VIN_LENGTH} characters long.`;

const carVinSchema = z
  .string({
    required_error: 'VIN is required.',
    invalid_type_error: 'VIN must be a string.',
  })
  .trim()
  .length(CAR_VIN_LENGTH, CAR_VIN_LENGTH_MESSAGE);

export const MIN_CAR_ENGINE_CAPACITY_VALUE = 0;
export const MAX_CAR_ENGINE_CAPACITY_VALUE = Number.MAX_SAFE_INTEGER;
const MAX_CAR_ENGINE_CAPACITY_VALUE_MESSAGE = `Maximum engine capacity value is ${MAX_CAR_ENGINE_CAPACITY_VALUE}.`;

const carEngineCapacitySchema = z
  .number({
    required_error: 'Engine capacity is required.',
    invalid_type_error: 'Engine capacity must be a number.',
  })
  .int()
  .nonnegative('Engine capacity must be positive number.')
  .safe(MAX_CAR_ENGINE_CAPACITY_VALUE_MESSAGE)
  .finite('Engine capacity must be finite number.');

export const MIN_CAR_MILEAGE_VALUE = 0;
export const MAX_CAR_MILEAGE_VALUE = Number.MAX_SAFE_INTEGER;
const MAX_CAR_MILEAGE_VALUE_MESSAGE = `Maximum mileage value is ${MAX_CAR_MILEAGE_VALUE}.`;

export const carMileageSchema = z
  .number({
    required_error: 'Mileage is required.',
    invalid_type_error: 'Mileage must be a number.',
  })
  .int()
  .nonnegative('Mileage must be positive number.')
  .safe(MAX_CAR_MILEAGE_VALUE_MESSAGE)
  .finite('Mileage must be finite number.');

export const MIN_CAR_PRODUCTION_YEAR_VALUE = 1885;
export const MIN_CAR_PRODUCTION_YEAR_VALUE_MESSAGE =
  'Hey! First car was made in 1885.';
export const MAX_CAR_PRODUCTION_YEAR_VALUE = new Date().getFullYear() + 5;
const MAX_CAR_PRODUCTION_YEAR_VALUE_MESSAGE = `Maximum production year is ${MAX_CAR_PRODUCTION_YEAR_VALUE}.`;

const carProductionYearSchema = z
  .number({
    required_error: 'Production year is required.',
    invalid_type_error: 'Production year must be a number.',
  })
  .int()
  .nonnegative('Production year must be positive number.')
  .safe()
  .finite('Production year must be finite number.')
  .min(MIN_CAR_PRODUCTION_YEAR_VALUE, MIN_CAR_PRODUCTION_YEAR_VALUE_MESSAGE)
  .max(MAX_CAR_PRODUCTION_YEAR_VALUE, MAX_CAR_PRODUCTION_YEAR_VALUE_MESSAGE);

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

export const MIN_CAR_INSURANCE_EXPIRATION_DATE = '1885-01-01';
const MIN_CAR_INSURANCE_EXPIRATION_DATE_MESSAGE =
  'Hey! First car was made in 1885.';

const carInsuranceExpirationSchema = z.coerce
  .date({
    required_error: 'Insurance expiration date is required.',
  })
  .min(
    new Date(MIN_CAR_INSURANCE_EXPIRATION_DATE),
    MIN_CAR_INSURANCE_EXPIRATION_DATE_MESSAGE,
  )
  .transform((date) => parseDateToYyyyMmDd(date));

export const MIN_CAR_TECHNICAL_INSPECTION_EXPIRATION_DATE = '1885-01-01';
const MIN_CAR_TECHNICAL_INSPECTION_EXPIRATION_DATE_MESSAGE =
  'Hey! First car was made in 1885.';

const carTechnicalInspectionExpirationSchema = z.coerce
  .date({
    required_error: 'Technical inspection expiration date is required.',
  })
  .min(
    new Date(MIN_CAR_TECHNICAL_INSPECTION_EXPIRATION_DATE),
    MIN_CAR_TECHNICAL_INSPECTION_EXPIRATION_DATE_MESSAGE,
  )
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
