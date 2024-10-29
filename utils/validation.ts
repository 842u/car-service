import { z } from 'zod';

export const MAX_AVATAR_FILE_SIZE = 1024 * 1024 * 3;
export const ACCEPTED_AVATAR_MIME_TYPES = ['image/png', 'image/jpeg'];

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
    value:
      /^(?!.*\.\.)(?!\.)(?!.*@.*\.{2,})(?!.*@-)(?!.*-@)[a-zA-Z0-9._%+-]+@([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,}$/i,
    message: 'Enter valid e-mail adress.',
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
    message: 'Minimum length is 2.',
  },
  maxLength: {
    value: 32,
    message: 'Maximum length is 32.',
  },
  pattern: {
    value: /^(?!.*[ ]{2})[0-9\p{Letter}\p{Mark}\s]+(?<![ ])$/u,
    message: 'asd',
  },
};

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
    (file) => ACCEPTED_AVATAR_MIME_TYPES.includes(file.type),
    `File must be of type: ${ACCEPTED_AVATAR_MIME_TYPES.join(', ')}`,
  )
  .refine(
    (file) => file.size <= MAX_AVATAR_FILE_SIZE,
    `File size must be less than ${MAX_AVATAR_FILE_SIZE / (1024 * 1024)}MB`,
  );
