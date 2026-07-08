import {
  engineCapacitySchema,
  engineCapacityValidator,
} from '@/car/domain/car/value-object/engine-capacity/engine-capacity.schema';
import { Result } from '@/common/application/result';
import { ValueObject } from '@/common/domain/value-object';

export class EngineCapacity extends ValueObject<number> {
  private constructor(value: number) {
    super(value);
  }

  static create(value: number) {
    const result = engineCapacityValidator.validate(
      value,
      engineCapacitySchema,
      'Engine capacity validation failed.',
    );

    if (!result.success) {
      return Result.fail(result.error);
    }

    return Result.ok(new EngineCapacity(value));
  }
}
