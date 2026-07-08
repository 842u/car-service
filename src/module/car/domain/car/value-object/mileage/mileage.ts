import {
  mileageSchema,
  mileageValidator,
} from '@/car/domain/car/value-object/mileage/mileage.schema';
import { Result } from '@/common/application/result';
import { ValueObject } from '@/common/domain/value-object';

export class Mileage extends ValueObject<number> {
  private constructor(value: number) {
    super(value);
  }

  static create(value: number) {
    const result = mileageValidator.validate(
      value,
      mileageSchema,
      'Mileage validation failed.',
    );

    if (!result.success) {
      return Result.fail(result.error);
    }

    return Result.ok(new Mileage(value));
  }
}
