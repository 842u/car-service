import { z } from 'zod';

import { EMAIL_REGEXP } from '@/utils/validation';

z.config({
  jitless: true,
});

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

const USERNAME_REQUIRED_MESSAGE = 'Username is required.';
const USERNAME_TYPE_MESSAGE = 'Username must be a string.';
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
    error: (issue) =>
      issue.input === undefined
        ? USERNAME_REQUIRED_MESSAGE
        : USERNAME_TYPE_MESSAGE,
  })
  .trim()
  .min(MIN_USERNAME_LENGTH, { error: MIN_USERNAME_LENGTH_MESSAGE })
  .max(MAX_USERNAME_LENGTH, { error: MAX_USERNAME_LENGTH_MESSAGE })
  .regex(USERNAME_REGEXP, { error: USERNAME_REGEXP_MESSAGE });

const ID_REQUIRED_MESSAGE = 'ID is required.';
const ID_TYPE_MESSAGE = 'ID must be a uuid.';

export const IdSchema = z.uuid({
  error: (issue) =>
    issue.input === undefined ? ID_REQUIRED_MESSAGE : ID_TYPE_MESSAGE,
});

const EMAIL_REQUIRED_MESSAGE = 'Email is required.';
const EMAIL_TYPE_MESSAGE = 'Email must be a string.';
export const EMAIL_REGEXP_MESSAGE = 'Enter a valid e-mail address.';
export const MIN_EMAIL_LENGTH = 6;
export const MIN_EMAIL_LENGTH_MESSAGE = `Minimum email length is ${MIN_EMAIL_LENGTH}.`;
export const MAX_EMAIL_LENGTH = 254;
export const MAX_EMAIL_LENGTH_MESSAGE = `Maximum email length is ${MAX_EMAIL_LENGTH}.`;

export const emailSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined ? EMAIL_REQUIRED_MESSAGE : EMAIL_TYPE_MESSAGE,
  })
  .trim()
  .min(MIN_EMAIL_LENGTH, { error: MIN_EMAIL_LENGTH_MESSAGE })
  .max(MAX_EMAIL_LENGTH, { error: MAX_EMAIL_LENGTH_MESSAGE })
  .regex(EMAIL_REGEXP, { error: EMAIL_REGEXP_MESSAGE });

const PASSWORD_REQUIRED_MESSAGE = 'Password is required.';
const PASSWORD_TYPE_MESSAGE = 'Password must be a string.';
export const MIN_PASSWORD_LENGTH = 6;
export const MIN_PASSWORD_LENGTH_MESSAGE = `Minimum password length is ${MIN_PASSWORD_LENGTH}.`;
export const MAX_PASSWORD_LENGTH = 72;
export const MAX_PASSWORD_LENGTH_MESSAGE = `Maximum password length is ${MAX_PASSWORD_LENGTH}.`;

export const passwordSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? PASSWORD_REQUIRED_MESSAGE
        : PASSWORD_TYPE_MESSAGE,
  })
  .trim()
  .min(MIN_PASSWORD_LENGTH, { error: MIN_PASSWORD_LENGTH_MESSAGE })
  .max(MAX_PASSWORD_LENGTH, { error: MAX_PASSWORD_LENGTH_MESSAGE });
