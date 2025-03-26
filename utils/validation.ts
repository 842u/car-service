import { z, ZodError } from 'zod';

import {
  DriveMapping,
  driveTypesMapping,
  FuelMapping,
  fuelTypesMapping,
  TransmissionMapping,
  transmissionTypesMapping,
} from '@/types';

export const EMAIL_VALIDATION_REGEXP =
  /^(?!.*\.\.)(?!\.)(?!.*@.*\.{2,})(?!.*@-)(?!.*-@)[a-zA-Z0-9._%+-]+@([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,}$/i;

export const correctEmails = [
  'john.doe@example.com',
  'jane_smith123@mail.org',
  'firstname.lastname@company.co',
  'contact@domain.co.uk',
  'username123@gmail.com',
  'name@domain123.com',
  'info@mywebsite.org',
  'support@service.com',
  'user.name@web-service.net',
  'admin@site.com',
  'user@company.email',
  'name.last@domain.com',
  'user.name@education.edu',
  'my.email@subdomain.domain.com',
  'example_user@domain.info',
  'hello.world@domain.travel',
  'user@my-domain.com',
];

export const wrongEmails = [
  'plainaddress',
  '@missingusername.com',
  'username@domain.c',
  'username@domain@domain.com',
  'username@-domain.com',
  'username@domain.com.',
  'username@.com',
  '@domain.com',
  'username@domain,com',
  'user name@domain.com',
  'username@domain.c@om',
  'username@domain.c#om',
  'username@domain..com',
];

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

export const MIN_CAR_PRODUCTION_YEAR_VALUE = 1885;
export const MIN_CAR_PRODUCTION_YEAR_VALUE_MESSAGE =
  'Hey! First car was made in 1885.';
export const MAX_CAR_PRODUCTION_YEAR_VALUE = new Date().getFullYear() + 5;
export const MAX_CAR_PRODUCTION_YEAR_VALUE_MESSAGE = `Maximum production year is ${MAX_CAR_PRODUCTION_YEAR_VALUE}.`;

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

const carFuelTypeSchema = z.enum(
  Object.values(fuelTypesMapping) as [keyof FuelMapping],
  { message: 'Please choose a correct value.' },
);

const carTransmissionTypeSchema = z.enum(
  Object.values(transmissionTypesMapping) as [keyof TransmissionMapping],
  { message: 'Please choose a correct value.' },
);

const carDriveTypeSchema = z.enum(
  Object.values(driveTypesMapping) as [keyof DriveMapping],
  {
    message: 'Please choose a correct value.',
  },
);

export const carFormSchema = z.object({
  image: imageFileSchema.nullable().optional(),
  name: carNameSchema,
  brand: carBrandSchema.nullable().or(z.literal('')),
  model: carModelSchema.nullable().or(z.literal('')),
  licensePlates: carLicensePlatesSchema.nullable().or(z.literal('')),
  vin: carVinSchema.nullable().or(z.literal('')),
  engineCapacity: carEngineCapacitySchema.nullable().or(z.nan()),
  mileage: carMileageSchema.nullable().or(z.nan()),
  insuranceExpiration: carInsuranceExpirationSchema
    .nullable()
    .or(z.literal('')),
  productionYear: carProductionYearSchema.nullable().or(z.nan()),
  fuelType: carFuelTypeSchema.nullable().or(z.literal('')),
  additionalFuelType: carFuelTypeSchema.nullable().or(z.literal('')),
  transmissionType: carTransmissionTypeSchema.nullable().or(z.literal('')),
  driveType: carDriveTypeSchema.nullable().or(z.literal('')),
});

export type CarFormValues = z.infer<typeof carFormSchema>;

export const avatarFormSchema = z.object({
  image: imageFileSchema.nullable().optional(),
});

export type AvatarFormValues = z.infer<typeof avatarFormSchema>;

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

export const usernameFormSchema = z.object({
  username: usernameSchema,
});

export type UsernameFormValues = z.infer<typeof usernameFormSchema>;

export const emailValidationRules = {
  required: 'This field is required.',
  minLength: {
    value: 6,
    message: 'Minimum length is 6.',
  },
  maxLength: {
    value: 254,
    message: 'Maximum length is 254.',
  },
  pattern: {
    value: EMAIL_VALIDATION_REGEXP,
    message: 'Enter valid e-mail address.',
  },
};

export const emailSchema = z
  .string()
  .trim()
  .min(emailValidationRules.minLength.value)
  .max(emailValidationRules.maxLength.value)
  .email();

export const passwordValidationRules = {
  required: 'This field is required.',
  minLength: {
    value: 6,
    message: 'Minimum length is 6.',
  },
  maxLength: {
    value: 72,
    message: 'Maximum length is 72.',
  },
};

export const passwordSchema = z
  .string()
  .trim()
  .min(passwordValidationRules.minLength.value)
  .max(passwordValidationRules.maxLength.value);

const userIdValidationSchema = z.string().uuid('Invalid ID format.');

export function validateUserId(userId: string | null) {
  try {
    userIdValidationSchema.parse(userId);
    return true;
  } catch (error) {
    if (error instanceof ZodError) return error.issues[0].message;
    if (error instanceof Error) return error.message;
  }
}
