import { RegisterOptions } from 'react-hook-form';
import { z } from 'zod';

import { AddCarFormValues } from '@/components/ui/AddCarForm/AddCarForm';
import { Database } from '@/types/supabase';

export const AVATAR_MAX_FILE_SIZE_BYTES = 1024 * 1024 * 3;
export const AVATAR_ACCEPTED_MIME_TYPES = ['image/png', 'image/jpeg'];
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
  'username@.com',
  'username@domain..com',
  'username@domain.c',
  'username@domain,com',
  'username@domain@domain.com',
  'username@-domain.com',
  'username@domain.com.',
  'username@domain.c#om',
  'username@domain..com',
  'username@.com',
  '@domain.com',
  'username@domain..com',
  'username@domain,com',
  'username@domain..com',
  'user name@domain.com',
  'username@domain.c@om',
  'username@domain..com',
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

export const carNameValidationRules: RegisterOptions<AddCarFormValues> = {
  minLength: {
    value: 1,
    message: 'Minimum length is 1.',
  },
  maxLength: {
    value: 30,
    message: 'Maximum length is 30.',
  },
};

export const carBrandValidationRules: RegisterOptions<AddCarFormValues> = {
  minLength: {
    value: 2,
    message: 'Minimum length is 2.',
  },
  maxLength: {
    value: 25,
    message: 'Maximum length is 25.',
  },
};

export const carModelValidationRules: RegisterOptions<AddCarFormValues> = {
  minLength: {
    value: 1,
    message: 'Minimum length is 1.',
  },
  maxLength: {
    value: 25,
    message: 'Maximum length is 25.',
  },
};

export const carLicensePlatesValidationRules: RegisterOptions<AddCarFormValues> =
  {
    minLength: {
      value: 1,
      message: 'Minimum length is 1.',
    },
    maxLength: {
      value: 15,
      message: 'Maximum length is 15.',
    },
  };

export const carVinValidationRules: RegisterOptions<AddCarFormValues> = {
  minLength: {
    value: 17,
    message: 'VIN must be 17 characters long.',
  },
  maxLength: {
    value: 17,
    message: 'VIN must be 17 characters long.',
  },
};

export const fuelTypesMapping = {
  '---': undefined,
  diesel: 'diesel',
  gasoline: 'gasoline',
  hybrid: 'hybrid',
  electric: 'electric',
  LPG: 'LPG',
  CNG: 'CNG',
  ethanol: 'ethanol',
  hydrogen: 'hydrogen',
} satisfies Record<
  Database['public']['Enums']['fuel'],
  Database['public']['Enums']['fuel']
> & { '---': undefined };

export const transmissionTypesMapping = {
  '---': undefined,
  manual: 'manual',
  automatic: 'automatic',
  CVT: 'CVT',
} satisfies Record<
  Database['public']['Enums']['transmission'],
  Database['public']['Enums']['transmission']
> & { '---': undefined };

export const driveTypesMapping = {
  '---': undefined,
  FWD: 'FWD',
  RWD: 'RWD',
  AWD: 'AWD',
  '4WD': '4WD',
} satisfies Record<
  Database['public']['Enums']['drive'],
  Database['public']['Enums']['drive']
> & { '---': undefined };

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
  };
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

export const avatarFileSchema = z
  .instanceof(File)
  .refine(
    (file) => AVATAR_ACCEPTED_MIME_TYPES.includes(file.type),
    `File must be of type: ${AVATAR_ACCEPTED_MIME_TYPES.join(', ')}`,
  )
  .refine(
    (file) => file.size <= AVATAR_MAX_FILE_SIZE_BYTES,
    `File size must be less than ${
      AVATAR_MAX_FILE_SIZE_BYTES / (1024 * 1024)
    }MB`,
  );
