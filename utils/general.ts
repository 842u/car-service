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
