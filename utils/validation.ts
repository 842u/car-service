import { z } from 'zod';

export const MAX_AVATAR_FILE_SIZE = 1024 * 1024 * 3;
export const ACCEPTED_AVATAR_FILE_TYPES = ['image/png', 'image/jpeg'];

export const emailValidationRules = {
  required: 'This field is required.',
  minLength: {
    value: 3,
    message: 'Minimum length is 3.',
  },
  maxLength: {
    value: 254,
    message: 'Maximum length is 254.',
  },
  pattern: {
    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i,
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
    (file) => ACCEPTED_AVATAR_FILE_TYPES.includes(file.type),
    `File must be of type: ${ACCEPTED_AVATAR_FILE_TYPES.join(', ')}`,
  )
  .refine(
    (file) => file.size <= MAX_AVATAR_FILE_SIZE,
    'File size must be less than 3MB',
  );
