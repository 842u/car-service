import { z } from 'zod';

z.config({
  jitless: true,
});

const IMAGE_FILE_REQUIRED_MESSAGE = 'Image is required.';
const IMAGE_FILE_TYPE_MESSAGE = 'Image must be a file.';
export const MAX_IMAGE_FILE_SIZE_BYTES = 1024 * 1024 * 3;
const MAX_IMAGE_FILE_SIZE_MESSAGE = `Maximum image size is ${
  MAX_IMAGE_FILE_SIZE_BYTES / (1024 * 1024)
}MB.`;
export const IMAGE_FILE_ACCEPTED_MIME_TYPES = ['image/png', 'image/jpeg'];
const IMAGE_FILE_ACCEPTED_MIME_TYPES_MESSAGE = `File must be of type: ${IMAGE_FILE_ACCEPTED_MIME_TYPES.join(', ')}`;

export const imageFileSchema = z
  .file({
    error: (issue) =>
      issue.input === undefined
        ? IMAGE_FILE_REQUIRED_MESSAGE
        : IMAGE_FILE_TYPE_MESSAGE,
  })
  .max(MAX_IMAGE_FILE_SIZE_BYTES, { error: MAX_IMAGE_FILE_SIZE_MESSAGE })
  .mime(IMAGE_FILE_ACCEPTED_MIME_TYPES, {
    error: IMAGE_FILE_ACCEPTED_MIME_TYPES_MESSAGE,
  });
