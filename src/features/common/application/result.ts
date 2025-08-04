export class Result<T, E = string> {
  private readonly _isSuccess: boolean;
  private readonly _error?: E;
  private readonly _value?: T;

  private constructor(isSuccess: boolean, error?: E, value?: T) {
    if (isSuccess && error) {
      throw new Error(`Successful result cannot contain an error`);
    }
    if (!isSuccess && !error) {
      throw new Error(`Failed result must contain an error`);
    }

    this._isSuccess = isSuccess;
    this._error = error;
    this._value = value;

    Object.freeze(this);
  }

  get isSuccess(): boolean {
    return this._isSuccess;
  }

  get error(): E {
    if (this._isSuccess) {
      throw new Error(`Cannot get error from a successful result.`);
    }
    return this._error!;
  }

  getValue(): T {
    if (!this._isSuccess) {
      throw new Error(`Cannot get value from a failed result.`);
    }
    return this._value as T;
  }

  static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, undefined, value);
  }

  static fail<U, E = string>(error: E): Result<U, E> {
    return new Result<U, E>(false, error);
  }
}
