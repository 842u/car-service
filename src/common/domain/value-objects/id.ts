import { idValidator } from '@/common/domain/value-objects/id.schema';
import { ValueObject } from '@/common/domain/value-objects/value-object';
import { Result } from '@/common/interface/result/result';

export class Id extends ValueObject {
  private readonly _value: string;

  private constructor(value: string) {
    super();
    this._value = value;
  }

  static create(value: string) {
    const result = idValidator.validate(value);

    if (!result.success) {
      return Result.fail(result.error);
    }

    return Result.ok(new Id(value));
  }

  get value() {
    return this._value;
  }
}
