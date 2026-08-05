import type { ZodType } from 'zod';
import { z } from 'zod';

z.config({
  jitless: true,
});

export function nullifyEmptyString<TSchema extends ZodType>(schema: TSchema) {
  return z.preprocess((val) => (val === '' ? null : val), schema.nullable());
}

export function nullifyNaN<TSchema extends ZodType>(schema: TSchema) {
  return z.preprocess(
    (val) => (typeof val === 'number' && Number.isNaN(val) ? null : val),
    schema.nullable(),
  );
}
