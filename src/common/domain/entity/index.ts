import type { Result } from '@/common/application/result';
import type { Id } from '@/common/domain/value-object/id';

type BaseEntityValue = { id: Id };

export abstract class Entity<TValue extends BaseEntityValue> {
  protected readonly _value: TValue;

  protected constructor(value: TValue) {
    this._value = Object.seal(value);
  }

  static create(..._: unknown[]): Result<unknown, unknown> {
    throw new Error('Create method of an Entity not implemented.');
  }

  public get value(): TValue {
    return this._value;
  }

  public get id(): Id {
    return this.value.id;
  }
}
