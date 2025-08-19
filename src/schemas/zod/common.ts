import { z } from 'zod';

z.config({
  jitless: true,
});

const ID_REQUIRED_MESSAGE = 'ID is required.';
const ID_TYPE_MESSAGE = 'ID must be a uuid.';

export const IdSchema = z.uuid({
  error: (issue) =>
    issue.input === undefined ? ID_REQUIRED_MESSAGE : ID_TYPE_MESSAGE,
});
