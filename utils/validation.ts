import { RegisterOptions } from 'react-hook-form';
import { z, ZodError } from 'zod';

import { AddCarFormValuesToValidate } from '@/app/api/auth/car/route';
import { AddCarFormValues } from '@/components/ui/AddCarForm/AddCarForm';
import {
  DriveMapping,
  driveTypesMapping,
  FuelMapping,
  fuelTypesMapping,
  TransmissionMapping,
  transmissionTypesMapping,
} from '@/types';

export const IMAGE_FILE_MAX_SIZE_BYTES = 1024 * 1024 * 3;
export const IMAGE_FILE_ACCEPTED_MIME_TYPES = ['image/png', 'image/jpeg'];
export const EMAIL_VALIDATION_REGEXP =
  /^(?!.*\.\.)(?!\.)(?!.*@.*\.{2,})(?!.*@-)(?!.*-@)[a-zA-Z0-9._%+-]+@([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,}$/i;
export const USERNAME_VALIDATION_REGEXP =
  /^(?!.*[ ]{2})[0-9\p{Letter}\p{Mark}\s]+(?<![ ])$/u;

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

export const imageFileValidationRules = {
  validate: (value: unknown) => {
    if (!(value instanceof File) && value) {
      return 'Input value is not a file.';
    }

    if (value instanceof File) {
      try {
        imageFileSchema.parse(value);
      } catch (error) {
        if (error instanceof ZodError) {
          return error.issues[0].message;
        } else if (error instanceof Error) {
          return error.message;
        }
      }
    }

    return true;
  },
} satisfies RegisterOptions<AddCarFormValues>;

export const imageFileSchema = z
  .instanceof(File)
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
    // Old simple regexp /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i,
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

export const usernameValidationRules = {
  required: 'This field is required.',
  minLength: {
    value: 3,
    message: 'Minimum length is 3.',
  },
  maxLength: {
    value: 32,
    message: 'Maximum length is 32.',
  },
  pattern: {
    value: USERNAME_VALIDATION_REGEXP,
    message: 'Enter a valid username.',
  },
};

export const carNameValidationRules = {
  required: 'This field is required.',
  minLength: {
    value: 1,
    message: 'Minimum name length is 1.',
  },
  maxLength: {
    value: 30,
    message: 'Maximum name length is 30.',
  },
} satisfies RegisterOptions<AddCarFormValues>;

export const carNameValidationSchema = z
  .string()
  .trim()
  .min(
    carNameValidationRules.minLength.value,
    carNameValidationRules.minLength.message,
  )
  .max(
    carNameValidationRules.maxLength.value,
    carNameValidationRules.maxLength.message,
  );

export const carBrandValidationRules = {
  minLength: {
    value: 2,
    message: 'Minimum brand length is 2.',
  },
  maxLength: {
    value: 25,
    message: 'Maximum brand length is 25.',
  },
} satisfies RegisterOptions<AddCarFormValues>;

export const carBrandValidationSchema = z
  .string()
  .trim()
  .min(
    carBrandValidationRules.minLength.value,
    carBrandValidationRules.minLength.message,
  )
  .max(
    carBrandValidationRules.maxLength.value,
    carBrandValidationRules.maxLength.message,
  )
  .nullable();

export const carModelValidationRules = {
  minLength: {
    value: 1,
    message: 'Minimum model length is 1.',
  },
  maxLength: {
    value: 25,
    message: 'Maximum model length is 25.',
  },
} satisfies RegisterOptions<AddCarFormValues>;

export const carModelValidationSchema = z
  .string()
  .trim()
  .min(carModelValidationRules.minLength.value)
  .max(carModelValidationRules.maxLength.value)
  .nullable();

export const carLicensePlatesValidationRules = {
  minLength: {
    value: 1,
    message: 'Minimum license plates length is 1.',
  },
  maxLength: {
    value: 15,
    message: 'Maximum license plates length is 15.',
  },
} satisfies RegisterOptions<AddCarFormValues>;

export const carLicensePlatesValidationSchema = z
  .string()
  .trim()
  .min(
    carLicensePlatesValidationRules.minLength.value,
    carLicensePlatesValidationRules.minLength.message,
  )
  .max(
    carLicensePlatesValidationRules.maxLength.value,
    carLicensePlatesValidationRules.maxLength.message,
  )
  .nullable();

export const carVinValidationRules = {
  minLength: {
    value: 17,
    message: 'VIN must be 17 characters long.',
  },
  maxLength: {
    value: 17,
    message: 'VIN must be 17 characters long.',
  },
} satisfies RegisterOptions<AddCarFormValues>;

export const carVinValidationSchema = z
  .string()
  .trim()
  .min(
    carVinValidationRules.minLength.value,
    carVinValidationRules.minLength.message,
  )
  .max(
    carVinValidationRules.maxLength.value,
    carVinValidationRules.maxLength.message,
  )
  .nullable();

export const carEngineCapacityValidationRules = {
  valueAsNumber: true,
  min: {
    value: 0,
    message: 'Engine capacity must be positive number.',
  },
} satisfies RegisterOptions<AddCarFormValues>;

export const carEngineCapacityValidationSchema = z
  .number()
  .int()
  .nonnegative(carEngineCapacityValidationRules.min.message)
  .safe()
  .nullable();

export const carMileageValidationRules = {
  valueAsNumber: true,
  min: {
    value: 0,
    message: 'Mileage must be positive number.',
  },
} satisfies RegisterOptions<AddCarFormValues>;

export const carMileageValidationSchema = z
  .number()
  .int()
  .nonnegative(carMileageValidationRules.min.message)
  .safe()
  .nullable();

export const carInsuranceExpirationValidationRules = {
  min: {
    value: '1885-01-01',
    message: 'Hey! First car was made in 1885.',
  },
} satisfies RegisterOptions<AddCarFormValues>;

export const carInsuranceExpirationValidationSchema = z.coerce
  .date()
  .min(
    new Date(carInsuranceExpirationValidationRules.min.value),
    carInsuranceExpirationValidationRules.min.message,
  )
  .nullable();

export function getCarProductionYearValidationRules() {
  const maxYear = new Date().getFullYear() + 5;
  return {
    valueAsNumber: true,
    min: {
      value: 1885,
      message: 'Hey! First car was made in 1885.',
    },
    max: {
      value: maxYear,
      message: `Maximum production year is ${maxYear}.`,
    },
  } satisfies RegisterOptions<AddCarFormValues>;
}

export function getCarProductionYearValidationSchema() {
  const maxYear = new Date().getFullYear() + 5;

  const schema = z
    .number()
    .int()
    .min(1885, 'Hey! First car was made in 1885.')
    .max(maxYear, `Maximum production year is ${maxYear}.`)
    .nullable();

  return schema;
}

export function getCarDatabaseEnumTypeValidationRules<
  T extends FuelMapping | TransmissionMapping | DriveMapping,
>(databaseEnumMapping: T): RegisterOptions<AddCarFormValues> {
  return {
    validate: (value: unknown) => {
      if (
        value === null ||
        value === '' ||
        (typeof value === 'string' && Object.hasOwn(databaseEnumMapping, value))
      ) {
        return true;
      }

      return 'Please choose a correct value.';
    },
  } satisfies RegisterOptions<AddCarFormValues>;
}

export function validateCarDatabaseEnumType(
  value: string | null,
  databaseEnumMapping: FuelMapping | TransmissionMapping | DriveMapping,
  errorMessage: string,
) {
  if (
    value === null ||
    (typeof value === 'string' && Object.hasOwn(databaseEnumMapping, value))
  ) {
    return;
  } else {
    throw new Error(errorMessage);
  }
}

export function validateAddCarFormData(data: AddCarFormValuesToValidate) {
  const {
    name,
    brand,
    model,
    licensePlates,
    vin,
    additionalFuelType,
    driveType,
    engineCapacity,
    fuelType,
    insuranceExpiration,
    mileage,
    productionYear,
    transmissionType,
  } = data;

  carNameValidationSchema.parse(name);
  carBrandValidationSchema.parse(brand);
  carModelValidationSchema.parse(model);
  carLicensePlatesValidationSchema.parse(licensePlates);
  carVinValidationSchema.parse(vin);
  carEngineCapacityValidationSchema.parse(engineCapacity);
  carMileageValidationSchema.parse(mileage);
  getCarProductionYearValidationSchema().parse(productionYear);
  carInsuranceExpirationValidationSchema.parse(insuranceExpiration);
  validateCarDatabaseEnumType(
    fuelType,
    fuelTypesMapping,
    'Incorrect fuel type value.',
  );
  validateCarDatabaseEnumType(
    additionalFuelType,
    fuelTypesMapping,
    'Incorrect additional fuel type value.',
  );
  validateCarDatabaseEnumType(
    driveType,
    driveTypesMapping,
    'Incorrect drive type value.',
  );
  validateCarDatabaseEnumType(
    transmissionType,
    transmissionTypesMapping,
    'Incorrect transmission type value.',
  );
}
