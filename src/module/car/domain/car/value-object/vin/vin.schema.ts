import { z } from 'zod';

import { ZodValidator } from '@/common/infrastructure/validator/zod';

z.config({
  jitless: true,
});

const VIN_REQUIRED_MESSAGE = 'VIN is required.';
const VIN_TYPE_MESSAGE = 'VIN must be a string.';
export const VIN_LENGTH = 17;

export const vinSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined ? VIN_REQUIRED_MESSAGE : VIN_TYPE_MESSAGE,
  })
  .trim()
  .length(VIN_LENGTH, { error: `VIN must be ${VIN_LENGTH} characters long.` });

export const vinValidator = new ZodValidator();
