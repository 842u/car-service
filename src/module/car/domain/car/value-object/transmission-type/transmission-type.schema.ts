import { z } from 'zod';

import { ZodValidator } from '@/common/infrastructure/validator/zod';

z.config({
  jitless: true,
});

// Canonical transmission values owned by the domain (see fuel-type.schema.ts).
export const transmissionValues = ['manual', 'automatic', 'CVT'] as const;

export type TransmissionValue = (typeof transmissionValues)[number];

export const transmissionTypeSchema = z.enum(transmissionValues, {
  error: 'Please choose a correct value.',
});

export const transmissionTypeValidator = new ZodValidator();
