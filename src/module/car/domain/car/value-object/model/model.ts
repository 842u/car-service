import {
  modelSchema,
  modelValidator,
} from '@/car/domain/car/value-object/model/model.schema';
import { Result } from '@/common/application/result';
import { ValueObject } from '@/common/domain/value-object';

export class Model extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string) {
    const result = modelValidator.validate(
      value,
      modelSchema,
      'Model validation failed.',
    );

    if (!result.success) {
      return Result.fail(result.error);
    }

    return Result.ok(new Model(value));
  }
}
