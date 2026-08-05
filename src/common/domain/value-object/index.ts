import { Result } from '@/common/application/result';
import type { ValidatorError } from '@/common/application/validator';

export abstract class ValueObject<TValue> {
  protected readonly _value: TValue;

  protected constructor(value: TValue) {
    this._value = value;
  }

  static create(..._: unknown[]): Result<unknown, unknown> {
    throw new Error('Create method of a Value Object not implemented.');
  }

  public get value(): TValue {
    return this._value;
  }
}

/**
 * Runs a value object factory only when a value is present; absent (null /
 * undefined) nullable fields resolve to `null` without validation.
 *
 * Returning a concrete `Result<Vo | null, ValidatorError>` keeps the factory
 * usable inside `Result.combine`, where an inline `Result.ok(null)` would
 * otherwise infer its error type as `unknown` and widen the combined error.
 */
export function optionalValueObject<TRaw, TValueObject>(
  create: (value: TRaw) => Result<TValueObject, ValidatorError>,
  value: TRaw | null | undefined,
): Result<TValueObject | null, ValidatorError> {
  if (value === null || value === undefined) {
    return Result.ok(null);
  }

  return create(value);
}
