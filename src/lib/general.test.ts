import { promiseWithTimeout, unslugify } from './general';

describe('promiseWithTimeout()', () => {
  it('should resolve to original promise resolved value if it resolves within the timeout', async () => {
    const mockResolvedValue = 'Resolved';
    const timeout = 100;
    const promiseSettleTime = timeout - 10;
    const promise = new Promise((resolve) => {
      setTimeout(() => resolve(mockResolvedValue), promiseSettleTime);
    });

    const result = await promiseWithTimeout(promise, timeout);

    expect(result).toBe(mockResolvedValue);
  });

  it('should reject with error if original promise is not settled within the timeout', async () => {
    const mockResolvedValue = 'Resolved';
    const timeout = 100;
    const promiseSettleTime = timeout + 10;
    const promise = new Promise((resolve) => {
      setTimeout(() => resolve(mockResolvedValue), promiseSettleTime);
    });

    await expect(promiseWithTimeout(promise, timeout)).rejects.toThrow();
  });

  it('should reject with error if original promise rejects within the timeout', async () => {
    const timeout = 100;
    const promiseSettleTime = timeout - 10;
    const promise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error()), promiseSettleTime);
    });

    await expect(promiseWithTimeout(promise, timeout)).rejects.toThrow();
  });

  it('should reject with custom error if provided', async () => {
    const customError = new Error('Some Error');
    const timeout = 100;
    const promiseSettleTime = timeout - 10;
    const promise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error()), promiseSettleTime);
    });

    await expect(
      promiseWithTimeout(promise, timeout, customError),
    ).rejects.toThrow(customError);
  });
});

describe('unslugify()', () => {
  it('should return unslugified string', () => {
    const slug = 'some-test-slug';

    const result = unslugify(slug, false);

    expect(result).toBe(slug.replaceAll('-', ' '));
  });

  it('should return string with trimmed whitespaces', () => {
    const slug = '         some-test-slug           ';

    const result = unslugify(slug, false);

    expect(result).toBe(slug.replaceAll('-', ' ').trim());
  });

  it('should return string with capitalized chunks if capitalazie = true', () => {
    const slug = 'some-test-slug';

    const result = unslugify(slug, true);
    const resultChunks = result.split(' ');

    resultChunks.forEach((chunk) => {
      const firstCharacter = chunk.at(0);
      const isUpperCase = firstCharacter === firstCharacter?.toUpperCase();
      expect(isUpperCase).toBeTruthy();
    });
  });
});
