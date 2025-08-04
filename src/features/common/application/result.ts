export class Result<T, E> {
  private readonly _success: boolean;
  private readonly _error?: E;
  private readonly _value?: T;

  private constructor(isSuccess: boolean, error?: E, value?: T) {
    if (isSuccess && error) {
      throw new Error(`Successful result cannot contain an error.`);
    }

    if (!isSuccess && !error) {
      throw new Error(`Failed result must contain an error.`);
    }

    this._success = isSuccess;
    this._error = error;
    this._value = value;

    Object.freeze(this);
  }

  get success(): boolean {
    return this._success;
  }

  get error() {
    if (this._success) {
      throw new Error(`Cannot get error from a successful result.`);
    }

    return this._error!;
  }

  get value() {
    if (!this._success) {
      throw new Error(`Cannot get value from a failed result.`);
    }

    return this._value!;
  }

  static ok<U, E = undefined>(value: U): Result<U, E> {
    return new Result<U, E>(true, undefined, value);
  }

  static fail<U = undefined, E = string>(error: E): Result<U, E> {
    return new Result<U, E>(false, error);
  }
}
