import { z } from 'zod';

import { ZodValidator } from '@/common/infrastructure/validation/zod-validator';

z.config({
  jitless: true,
});

const NAME_REQUIRED_MESSAGE = 'Name is required.';
const NAME_TYPE_MESSAGE = 'Name must be a string.';
export const MIN_NAME_LENGTH = 3;
export const MIN_NAME_LENGTH_MESSAGE = `Minimum name length is ${MIN_NAME_LENGTH}`;
export const MAX_NAME_LENGTH = 32;
export const MAX_NAME_LENGTH_MESSAGE = `Maximum name length is ${MAX_NAME_LENGTH}`;

export const nameSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined ? NAME_REQUIRED_MESSAGE : NAME_TYPE_MESSAGE,
  })
  .trim()
  .min(MIN_NAME_LENGTH, { error: MIN_NAME_LENGTH_MESSAGE })
  .max(MAX_NAME_LENGTH, { error: MAX_NAME_LENGTH_MESSAGE });

export const nameValidator = new ZodValidator(
  nameSchema,
  'Name validation failed.',
);
