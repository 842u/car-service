import { z } from 'zod';

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
