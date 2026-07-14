import { z } from 'zod';

import { ZodValidator } from '@/common/infrastructure/validator/zod';

z.config({
  jitless: true,
});

const SERVICE_NOTE_TYPE_MESSAGE = 'Note must be a string.';
export const MAX_SERVICE_NOTE_LENGTH = 1000;

export const serviceNoteSchema = z
  .string({
    error: SERVICE_NOTE_TYPE_MESSAGE,
  })
  .trim()
  .max(MAX_SERVICE_NOTE_LENGTH, {
    error: `Maximum note length is ${MAX_SERVICE_NOTE_LENGTH}.`,
  });

export const serviceNoteValidator = new ZodValidator();
