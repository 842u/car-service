import type { Id } from '@/common/domain/value-objects/id';
import type { Result } from '@/common/interface/result/result';

type BaseEntityValue = { id: Id };

export abstract class Entity<T extends BaseEntityValue> {
  protected readonly _value: T;

  protected constructor(value: T) {
    this._value = Object.freeze(value);
  }

  static create(..._: unknown[]): Result<unknown, unknown> {
    throw new Error('Create method of an Entity not implemented.');
  }

  public get value(): T {
    return this._value;
  }

  public get id(): string {
    return this.value.id.value;
  }
}
