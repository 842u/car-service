type SuccessResult<T> = {
  success: true;
  data: T;
};

type FailureResult<E> = {
  success: false;
  error: E;
};

export type Result<T, E> = SuccessResult<T> | FailureResult<E>;

export const Result = {
  ok<U, E = never>(data: U): Result<U, E> {
    return { success: true, data };
  },

  fail<U = never, E = string>(error: E): Result<U, E> {
    return { success: false, error };
  },
};
