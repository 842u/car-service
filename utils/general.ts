// Default vercel serverless function will timeout after 10s so promise should reject in less than that time.

const DEFAULT_TIMEOUT = 9000;

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
