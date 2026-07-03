import type { ZodType } from 'zod';
import { z } from 'zod';

z.config({
  jitless: true,
});

export function nullifyEmptyString<T extends ZodType>(schema: T) {
  return z.preprocess((val) => (val === '' ? null : val), schema.nullable());
}

export function nullifyNaN<T extends ZodType>(schema: T) {
  return z.preprocess(
    (val) => (typeof val === 'number' && Number.isNaN(val) ? null : val),
    schema.nullable(),
  );
}
