type BaseSuccessResult<T> = {
  success: true;
  data: T;
};

type BaseFailureResult<E> = {
  success: false;
  error: E;
};

export type SuccessResult<T, U = object> = BaseSuccessResult<T> & U;

export type FailureResult<E, U = object> = BaseFailureResult<E> & U;

export type Result<T, E, U = object> =
  | SuccessResult<T, U>
  | FailureResult<E, U>;

type ResultRecord = Record<string, Result<unknown, unknown>>;

/**
 * Success (`data`) type of a single Result. Keyed on the `success: true`
 * discriminant and distributed over unions, so a `Result<T, never> |
 * Result<never, E>` factory union yields `T`, not `T | unknown`.
 */
type SuccessData<T> = T extends { success: true; data: infer D } ? D : never;

/**
 * Failure (`error`) type of a single Result. Keyed on the `success: false`
 * discriminant and distributed over unions, so success-shaped members map to
 * `never` instead of widening the error to `unknown`.
 */
type FailureError<T> = T extends { success: false; error: infer E } ? E : never;

/** Maps each property to the success type of its Result. */
type CombinedData<R extends ResultRecord> = {
  [K in keyof R]: SuccessData<R[K]>;
};

/** Union of every property's error type. */
type CombinedError<R extends ResultRecord> = FailureError<R[keyof R]>;

export const Result = {
  ok<T, E = never, U = object>(data: T, extra?: U): Result<T, E, U> {
    return { success: true, data, ...extra };
  },

  fail<T = never, E = unknown, U = object>(
    error: E,
    extra?: U,
  ): Result<T, E, U> {
    return { success: false, error, ...extra };
  },

  /**
   * Merges a record of Results into a single Result whose data is the record
   * of unwrapped values. Returns the first failure in key order; otherwise the
   * combined success. The caller evaluates every result before combining.
   *
   * Annotate the receiver (e.g. a `Result<UserValue, ValidatorError>` variable
   * or an enclosing method return type) so `R` is inferred precisely. Without
   * an expected type, `R` widens to `Result<unknown, unknown>` and both the
   * data and error collapse to `unknown`.
   */
  combine<R extends ResultRecord>(
    results: R,
  ): Result<CombinedData<R>, CombinedError<R>> {
    const data = {} as CombinedData<R>;

    for (const key of Object.keys(results) as (keyof R)[]) {
      const result = results[key];

      if (!result.success) {
        return Result.fail(result.error as CombinedError<R>);
      }

      data[key] = result.data as CombinedData<R>[typeof key];
    }

    return Result.ok(data);
  },
};
