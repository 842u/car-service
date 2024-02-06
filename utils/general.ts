export async function promiseWithTimeout<T>(
  promise: Promise<T>,
  time = 8000,
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

export function getEnvironmentUrl() {
  let envUrl =
    process?.env?.NEXT_PUBLIC_SITE_URL ??
    process?.env?.NEXT_PUBLIC_VERCEL_URL ??
    'http://localhost:3000/';

  envUrl = envUrl.includes('http') ? envUrl : `https://${envUrl}`;
  envUrl = envUrl.at(-1) === '/' ? envUrl : `${envUrl}/`;

  const url = new URL(envUrl);

  return url;
}
