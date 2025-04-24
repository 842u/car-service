import { z } from 'zod';

import {
  DriveMapping,
  driveTypesMapping,
  FuelMapping,
  fuelTypesMapping,
  TransmissionMapping,
  transmissionTypesMapping,
} from '@/types';
import { EMAIL_REGEXP } from '@/utils/validation';

export const IMAGE_FILE_MAX_SIZE_BYTES = 1024 * 1024 * 3;
export const IMAGE_FILE_ACCEPTED_MIME_TYPES = ['image/png', 'image/jpeg'];

export const imageFileSchema = z
  .instanceof(File, { message: 'Input value is not a file.' })
  .refine(
    (file) => IMAGE_FILE_ACCEPTED_MIME_TYPES.includes(file.type),
    `File must be of type: ${IMAGE_FILE_ACCEPTED_MIME_TYPES.join(', ')}`,
  )
  .refine(
    (file) => file.size <= IMAGE_FILE_MAX_SIZE_BYTES,
    `File size must be less than ${
      IMAGE_FILE_MAX_SIZE_BYTES / (1024 * 1024)
    }MB`,
  );

export const MIN_CAR_NAME_LENGTH = 1;
export const MIN_CAR_NAME_LENGTH_MESSAGE = 'Name is required.';
export const MAX_CAR_NAME_LENGTH = 30;
export const MAX_CAR_NAME_LENGTH_MESSAGE = `Maximum name length is ${MAX_CAR_NAME_LENGTH}.`;

export const carNameSchema = z
  .string({
    required_error: 'Name is required.',
    invalid_type_error: 'Name must be a string.',
  })
  .trim()
  .min(MIN_CAR_NAME_LENGTH, MIN_CAR_NAME_LENGTH_MESSAGE)
  .max(MAX_CAR_NAME_LENGTH, MAX_CAR_NAME_LENGTH_MESSAGE);

export const MIN_CAR_BRAND_LENGTH = 2;
export const MIN_CAR_BRAND_LENGTH_MESSAGE = `Minimum brand length is ${MIN_CAR_BRAND_LENGTH}.`;
export const MAX_CAR_BRAND_LENGTH = 25;
export const MAX_CAR_BRAND_LENGTH_MESSAGE = `Maximum brand length is ${MAX_CAR_BRAND_LENGTH}.`;

export const carBrandSchema = z
  .string({
    required_error: 'Brand is required.',
    invalid_type_error: 'Brand must be a string.',
  })
  .trim()
  .min(MIN_CAR_BRAND_LENGTH, MIN_CAR_BRAND_LENGTH_MESSAGE)
  .max(MAX_CAR_BRAND_LENGTH, MAX_CAR_BRAND_LENGTH_MESSAGE);

export const MIN_CAR_MODEL_LENGTH = 1;
export const MIN_CAR_MODEL_LENGTH_MESSAGE = `Minimum model length is ${MIN_CAR_MODEL_LENGTH}.`;
export const MAX_CAR_MODEL_LENGTH = 25;
export const MAX_CAR_MODEL_LENGTH_MESSAGE = `Maximum model length is ${MAX_CAR_MODEL_LENGTH}.`;

export const carModelSchema = z
  .string({
    required_error: 'Model is required.',
    invalid_type_error: 'Model must be a string.',
  })
  .trim()
  .min(MIN_CAR_MODEL_LENGTH, MIN_CAR_MODEL_LENGTH_MESSAGE)
  .max(MAX_CAR_MODEL_LENGTH, MAX_CAR_MODEL_LENGTH_MESSAGE);

export const MIN_CAR_LICENSE_PLATES_LENGTH = 1;
export const MIN_CAR_LICENSE_PLATES_LENGTH_MESSAGE = `Minimum license plates length is ${MIN_CAR_LICENSE_PLATES_LENGTH}.`;
export const MAX_CAR_LICENSE_PLATES_LENGTH = 15;
export const MAX_CAR_LICENSE_PLATES_LENGTH_MESSAGE = `Maximum license plates length is ${MAX_CAR_LICENSE_PLATES_LENGTH}.`;

export const carLicensePlatesSchema = z
  .string({
    required_error: 'License plates is required.',
    invalid_type_error: 'License plates must be a string.',
  })
  .trim()
  .min(MIN_CAR_LICENSE_PLATES_LENGTH, MIN_CAR_LICENSE_PLATES_LENGTH_MESSAGE)
  .max(MAX_CAR_LICENSE_PLATES_LENGTH, MAX_CAR_LICENSE_PLATES_LENGTH_MESSAGE);

export const CAR_VIN_LENGTH = 17;
export const CAR_VIN_LENGTH_MESSAGE = `VIN must be ${CAR_VIN_LENGTH} characters long.`;

export const carVinSchema = z
  .string({
    required_error: 'VIN is required.',
    invalid_type_error: 'VIN must be a string.',
  })
  .trim()
  .length(CAR_VIN_LENGTH, CAR_VIN_LENGTH_MESSAGE);

export const MIN_CAR_ENGINE_CAPACITY_VALUE = 0;
export const MIN_CAR_ENGINE_CAPACITY_VALUE_MESSAGE = `Minimum engine capacity value is ${MIN_CAR_ENGINE_CAPACITY_VALUE}.`;
export const MAX_CAR_ENGINE_CAPACITY_VALUE = Number.MAX_SAFE_INTEGER;
export const MAX_CAR_ENGINE_CAPACITY_VALUE_MESSAGE = `Maximum engine capacity value is ${MAX_CAR_ENGINE_CAPACITY_VALUE}.`;

export const carEngineCapacitySchema = z
  .number({
    required_error: 'Engine capacity is required.',
    invalid_type_error: 'Engine capacity must be a number.',
  })
  .int()
  .nonnegative('Engine capacity must be positive number.')
  .safe(MAX_CAR_ENGINE_CAPACITY_VALUE_MESSAGE)
  .finite('Engine capacity must be finite number.');

export const MIN_CAR_MILEAGE_VALUE = 0;
export const MIN_CAR_MILEAGE_VALUE_MESSAGE = `Minimum mileage value is ${MIN_CAR_MILEAGE_VALUE}.`;
export const MAX_CAR_MILEAGE_VALUE = Number.MAX_SAFE_INTEGER;
export const MAX_CAR_MILEAGE_VALUE_MESSAGE = `Maximum mileage value is ${MAX_CAR_MILEAGE_VALUE}.`;

export const carMileageSchema = z
  .number({
    required_error: 'Mileage is required.',
    invalid_type_error: 'Mileage must be a number.',
  })
  .int()
  .nonnegative('Mileage must be positive number.')
  .safe(MAX_CAR_MILEAGE_VALUE_MESSAGE)
  .finite('Mileage must be finite number.');

export const MIN_CAR_INSURANCE_EXPIRATION_DATE = '1885-01-01';
export const MIN_CAR_INSURANCE_EXPIRATION_DATE_MESSAGE =
  'Hey! First car was made in 1885.';

export const carInsuranceExpirationSchema = z.coerce
  .date({
    required_error: 'Insurance expiration date is required.',
  })
  .min(
    new Date(MIN_CAR_INSURANCE_EXPIRATION_DATE),
    MIN_CAR_INSURANCE_EXPIRATION_DATE_MESSAGE,
  );

export const MIN_CAR_TECHNICAL_INSPECTION_EXPIRATION_DATE = '1885-01-01';
export const MIN_CAR_TECHNICAL_INSPECTION_EXPIRATION_DATE_MESSAGE =
  'Hey! First car was made in 1885.';

export const carTechnicalInspectionExpirationSchema = z.coerce
  .date({
    required_error: 'Technical inspection expiration date is required.',
  })
  .min(
    new Date(MIN_CAR_INSURANCE_EXPIRATION_DATE),
    MIN_CAR_INSURANCE_EXPIRATION_DATE_MESSAGE,
  );

export const MIN_CAR_PRODUCTION_YEAR_VALUE = 1885;
export const MIN_CAR_PRODUCTION_YEAR_VALUE_MESSAGE =
  'Hey! First car was made in 1885.';
export const MAX_CAR_PRODUCTION_YEAR_VALUE = new Date().getFullYear() + 5;
export const MAX_CAR_PRODUCTION_YEAR_VALUE_MESSAGE = `Maximum production year is ${MAX_CAR_PRODUCTION_YEAR_VALUE}.`;

export const carProductionYearSchema = z
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

export const carFuelTypeSchema = z.enum(
  Object.values(fuelTypesMapping) as [keyof FuelMapping],
  { message: 'Please choose a correct value.' },
);

export const carTransmissionTypeSchema = z.enum(
  Object.values(transmissionTypesMapping) as [keyof TransmissionMapping],
  { message: 'Please choose a correct value.' },
);

export const carDriveTypeSchema = z.enum(
  Object.values(driveTypesMapping) as [keyof DriveMapping],
  {
    message: 'Please choose a correct value.',
  },
);

export const USERNAME_REGEXP =
  /^(?!.*[ ]{2})[0-9\p{Letter}\p{Mark}\s]+(?<![ ])$/u;
export const USERNAME_REGEXP_MESSAGE =
  'Letters, numbers and single whitespaces allowed.';
export const MIN_USERNAME_LENGTH = 3;
export const MIN_USERNAME_LENGTH_MESSAGE = `Minimum username length is ${MIN_USERNAME_LENGTH}`;
export const MAX_USERNAME_LENGTH = 32;
export const MAX_USERNAME_LENGTH_MESSAGE = `Maximum username length is ${MAX_USERNAME_LENGTH}`;

export const usernameSchema = z
  .string({
    required_error: 'Username is required.',
    invalid_type_error: 'Username must be a string.',
  })
  .trim()
  .min(MIN_USERNAME_LENGTH, MIN_USERNAME_LENGTH_MESSAGE)
  .max(MAX_USERNAME_LENGTH, MAX_USERNAME_LENGTH_MESSAGE)
  .regex(USERNAME_REGEXP, USERNAME_REGEXP_MESSAGE);

export const userIdValidationSchema = z
  .string({
    required_error: 'User ID is required.',
    invalid_type_error: 'User ID must be a string.',
  })
  .uuid('Invalid ID format.');

export const EMAIL_REGEXP_MESSAGE = 'Enter valid e-mail address.';
export const MIN_EMAIL_LENGTH = 6;
export const MIN_EMAIL_LENGTH_MESSAGE = `Minimum email length is ${MIN_EMAIL_LENGTH}.`;
export const MAX_EMAIL_LENGTH = 254;
export const MAX_EMAIL_LENGTH_MESSAGE = `Maximum email length is ${MAX_EMAIL_LENGTH}.`;

export const emailSchema = z
  .string({
    required_error: 'Email is required.',
    invalid_type_error: 'Email must be a string.',
  })
  .trim()
  .min(MIN_EMAIL_LENGTH, MIN_EMAIL_LENGTH_MESSAGE)
  .max(MAX_EMAIL_LENGTH, MAX_EMAIL_LENGTH_MESSAGE)
  .regex(EMAIL_REGEXP, EMAIL_REGEXP_MESSAGE);

export const MIN_PASSWORD_LENGTH = 6;
export const MIN_PASSWORD_LENGTH_MESSAGE = `Minimum password length is ${MIN_PASSWORD_LENGTH}.`;
export const MAX_PASSWORD_LENGTH = 72;
export const MAX_PASSWORD_LENGTH_MESSAGE = `Maximum password length is ${MAX_PASSWORD_LENGTH}.`;

export const passwordSchema = z
  .string({
    required_error: 'Password is required.',
    invalid_type_error: 'Password must be a string.',
  })
  .trim()
  .min(MIN_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH_MESSAGE)
  .max(MAX_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH_MESSAGE);
