import { z } from 'zod';

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
