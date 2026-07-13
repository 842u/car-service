import { z } from 'zod';

import { ZodValidator } from '@/common/infrastructure/validator/zod';

z.config({
  jitless: true,
});

// Canonical category values owned by the domain (see fuel-type.schema.ts).
export const serviceCategoryValues = [
  'battery',
  'body',
  'brakes',
  'electrical',
  'engine',
  'interior',
  'other',
  'suspension',
  'tires',
] as const;

export type ServiceCategoryValue = (typeof serviceCategoryValues)[number];

const SERVICE_CATEGORY_TYPE_MESSAGE = 'Please choose a correct value.';
const SERVICE_CATEGORIES_REQUIRED_MESSAGE =
  'Please choose at least one category.';

const serviceCategorySchema = z.enum(serviceCategoryValues, {
  error: SERVICE_CATEGORY_TYPE_MESSAGE,
});

// Normalizes (dedupes + sorts) rather than rejecting duplicates, matching the
// database trigger this replaces. Order carries no domain meaning; sorting
// gives deterministic storage and cheap equality.
export const serviceCategoriesSchema = z
  .array(serviceCategorySchema, { error: SERVICE_CATEGORY_TYPE_MESSAGE })
  .min(1, { error: SERVICE_CATEGORIES_REQUIRED_MESSAGE })
  .transform((categories) => Array.from(new Set(categories)).sort());

export const serviceCategoriesValidator = new ZodValidator();
