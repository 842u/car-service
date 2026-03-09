export const CAR_IMAGE_UPLOAD_ERROR_CAUSE = 'image upload error';

export async function hashFile(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  return hashHex;
}

export function getMimeTypeExtensions(mimeTypes: string[]) {
  const typesExtensions = mimeTypes
    .map((mimeType) => mimeType.split('/')[1])
    .join(', ')
    .toUpperCase();

  return typesExtensions;
}

export function parseDateToYyyyMmDd(date: Date) {
  const [year, month, dayWithTimezone] = date.toISOString().split('-');
  const [day] = dayWithTimezone.split('T');
  return [year, month, day].join('-');
}

export function enqueueRevokeObjectUrl(url: string) {
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function toSafeNumber(value: unknown) {
  const number = Number(value);

  return isNaN(number) ? 0 : number;
}
