import { RegisterOptions } from 'react-hook-form';
import { z, ZodError } from 'zod';

import { AddCarFormValues } from '@/components/ui/AddCarForm/AddCarForm';

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
  minLength: {
    value: 1,
    message: 'Minimum length is 1.',
  },
  maxLength: {
    value: 30,
    message: 'Maximum length is 30.',
  },
} satisfies RegisterOptions<AddCarFormValues>;

export const carBrandValidationRules = {
  minLength: {
    value: 2,
    message: 'Minimum length is 2.',
  },
  maxLength: {
    value: 25,
    message: 'Maximum length is 25.',
  },
} satisfies RegisterOptions<AddCarFormValues>;

export const carModelValidationRules = {
  minLength: {
    value: 1,
    message: 'Minimum length is 1.',
  },
  maxLength: {
    value: 25,
    message: 'Maximum length is 25.',
  },
} satisfies RegisterOptions<AddCarFormValues>;

export const carLicensePlatesValidationRules = {
  minLength: {
    value: 1,
    message: 'Minimum length is 1.',
  },
  maxLength: {
    value: 15,
    message: 'Maximum length is 15.',
  },
} satisfies RegisterOptions<AddCarFormValues>;

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

export const carEngineCapacityValidationRules = {
  valueAsNumber: true,
  min: {
    value: 0,
    message: 'Value must be positive number.',
  },
} satisfies RegisterOptions<AddCarFormValues>;

export const carMileageValidationRules = {
  valueAsNumber: true,
  min: {
    value: 0,
    message: 'Value must be positive number.',
  },
} satisfies RegisterOptions<AddCarFormValues>;

export const carImageFileValidationRules = {
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

export function getCarProductionYearValidationRules() {
  const maxYear = new Date().getFullYear() + 5;
  return {
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

export function getCarDatabaseEnumTypeValidationRules<
  T extends { [key: string]: string | undefined },
>(databaseCarEnumTypeMapping: T): RegisterOptions<AddCarFormValues> {
  return {
    validate: (value: unknown) => {
      if (
        typeof value !== 'string' ||
        !Object.hasOwn(databaseCarEnumTypeMapping, value)
      ) {
        return 'Select proper value.';
      }
      return true;
    },
  } satisfies RegisterOptions<AddCarFormValues>;
}

export const emailSchema = z
  .string()
  .trim()
  .min(emailValidationRules.minLength.value)
  .max(emailValidationRules.maxLength.value)
  .email();

export const passwordSchema = z
  .string()
  .trim()
  .min(passwordValidationRules.minLength.value)
  .max(passwordValidationRules.maxLength.value);

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
