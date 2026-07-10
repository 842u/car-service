import { z } from 'zod';

import { ZodValidator } from '@/common/infrastructure/validator/zod';

z.config({
  jitless: true,
});

// Canonical fuel values owned by the domain. The UI selects import them from
// here rather than the Supabase-derived `@/types` mapping.
export const fuelValues = [
  'diesel',
  'gasoline',
  'LPG',
  'hybrid',
  'electric',
  'CNG',
  'ethanol',
  'hydrogen',
] as const;

export type FuelValue = (typeof fuelValues)[number];

export const fuelTypeSchema = z.enum(fuelValues, {
  error: 'Please choose a correct value.',
});

export const fuelTypeValidator = new ZodValidator();
