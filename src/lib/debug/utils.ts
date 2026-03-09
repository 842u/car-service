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
