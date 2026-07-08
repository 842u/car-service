import { z } from 'zod';

import { ZodValidator } from '@/common/infrastructure/validator/zod';

z.config({
  jitless: true,
});

// Canonical drive values owned by the domain (see fuel-type.schema.ts).
export const driveValues = ['FWD', 'RWD', 'AWD', '4WD'] as const;

export type DriveValue = (typeof driveValues)[number];

export const driveTypeSchema = z.enum(driveValues, {
  error: 'Please choose a correct value.',
});

export const driveTypeValidator = new ZodValidator();
