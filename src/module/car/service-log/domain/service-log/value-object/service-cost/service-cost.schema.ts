import { z } from 'zod';

import { ZodValidator } from '@/common/infrastructure/validator/zod';

z.config({
  jitless: true,
});

const SERVICE_COST_TYPE_MESSAGE = 'Cost must be a number.';
const SERVICE_COST_NONNEGATIVE_MESSAGE =
  'Service cost must be a positive number.';
const SERVICE_COST_SCALE_MESSAGE = 'Cost must have at most 2 decimal places.';

export const serviceCostSchema = z
  .number({
    error: SERVICE_COST_TYPE_MESSAGE,
  })
  .nonnegative({ error: SERVICE_COST_NONNEGATIVE_MESSAGE })
  .multipleOf(0.01, { error: SERVICE_COST_SCALE_MESSAGE });

export const serviceCostValidator = new ZodValidator();
