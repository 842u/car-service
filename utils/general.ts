export const CAR_IMAGE_UPLOAD_ERROR_CAUSE = 'image upload error';
const DEFAULT_TIMEOUT = 9000;

// Default vercel serverless function will timeout after 10s so promise should reject in less than that time.
export async function promiseWithTimeout<T>(
  promise: Promise<T>,
  time = DEFAULT_TIMEOUT,
  timeoutError = new Error(
    'There was an error with the upstream service. Try again.',
  ),
) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error()), time);
  });

  return Promise.race([promise, timeoutPromise])
    .then((result) => result as T)
    .catch(() => {
      throw timeoutError;
    });
}

export function unslugify(slug: string, capitalize: boolean) {
  let chunks = slug.trim().split('-');

  if (capitalize) {
    chunks = chunks.map((chunk) => {
      const firstCharacter = chunk.at(0)?.toUpperCase();

      return firstCharacter + chunk.slice(1);
    });
  }

  return chunks.join(' ');
}

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

export async function debugDelayResolveResponse(delayMilliseconds: number) {
  await new Promise((resolve) =>
    setTimeout(() => resolve(true), delayMilliseconds),
  );
}

export async function debugDelayRandomResponse(delayMilliseconds: number) {
  await new Promise((resolve, reject) => {
    if (Math.random() > 0.5) {
      setTimeout(() => resolve(true), delayMilliseconds);
    } else {
      setTimeout(() => reject(new Error('debug error')), delayMilliseconds);
    }
  });
}

export async function debugDelayRejectResponse(delayMilliseconds: number) {
  await new Promise((_, reject) =>
    setTimeout(() => reject(new Error('debug error')), delayMilliseconds),
  );
}

export function toSafeNumber(value: unknown) {
  const number = Number(value);

  return isNaN(number) ? 0 : number;
}
