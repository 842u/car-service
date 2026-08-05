type BaseSuccessResult<TData> = {
  success: true;
  data: TData;
};

type BaseFailureResult<TError> = {
  success: false;
  error: TError;
};

export type SuccessResult<TData, TMeta = object> = BaseSuccessResult<TData> &
  TMeta;

export type FailureResult<TError, TMeta = object> = BaseFailureResult<TError> &
  TMeta;

export type Result<TData, TError, TMeta = object> =
  | SuccessResult<TData, TMeta>
  | FailureResult<TError, TMeta>;

type ResultRecord = Record<string, Result<unknown, unknown>>;

/**
 * Success (`data`) type of a single Result. Keyed on the `success: true`
 * discriminant and distributed over unions, so a `Result<TData, never> |
 * Result<never, TError>` factory union yields `TData`, not `TData | unknown`.
 */
type SuccessData<TResult> = TResult extends {
  success: true;
  data: infer TData;
}
  ? TData
  : never;

/**
 * Failure (`error`) type of a single Result. Keyed on the `success: false`
 * discriminant and distributed over unions, so success-shaped members map to
 * `never` instead of widening the error to `unknown`.
 */
type FailureError<TResult> = TResult extends {
  success: false;
  error: infer TError;
}
  ? TError
  : never;

/** Maps each property to the success type of its Result. */
type CombinedData<TResults extends ResultRecord> = {
  [TKey in keyof TResults]: SuccessData<TResults[TKey]>;
};

/** Union of every property's error type. */
type CombinedError<TResults extends ResultRecord> = FailureError<
  TResults[keyof TResults]
>;

export const Result = {
  ok<TData, TError = never, TMeta = object>(
    data: TData,
    extra?: TMeta,
  ): Result<TData, TError, TMeta> {
    return { success: true, data, ...extra };
  },

  fail<TData = never, TError = unknown, TMeta = object>(
    error: TError,
    extra?: TMeta,
  ): Result<TData, TError, TMeta> {
    return { success: false, error, ...extra };
  },

  /**
   * Merges a record of Results into a single Result whose data is the record
   * of unwrapped values. Returns the first failure in key order; otherwise the
   * combined success. The caller evaluates every result before combining.
   *
   * Annotate the receiver (e.g. a `Result<UserValue, ValidatorError>` variable
   * or an enclosing method return type) so `TResults` is inferred precisely.
   * Without an expected type, `TResults` widens to `Result<unknown, unknown>`
   * and both the data and error collapse to `unknown`.
   */
  combine<TResults extends ResultRecord>(
    results: TResults,
  ): Result<CombinedData<TResults>, CombinedError<TResults>> {
    const data = {} as CombinedData<TResults>;

    for (const key of Object.keys(results) as (keyof TResults)[]) {
      const result = results[key];

      if (!result.success) {
        return Result.fail(result.error as CombinedError<TResults>);
      }

      data[key] = result.data as CombinedData<TResults>[typeof key];
    }

    return Result.ok(data);
  },
};
