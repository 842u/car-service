import {
  fuelTypeSchema,
  fuelTypeValidator,
  type FuelValue,
} from '@/car/domain/car/value-object/fuel-type/fuel-type.schema';
import { Result } from '@/common/application/result';
import { ValueObject } from '@/common/domain/value-object';

export class FuelType extends ValueObject<FuelValue> {
  private constructor(value: FuelValue) {
    super(value);
  }

  static create(value: string) {
    const result = fuelTypeValidator.validate(
      value,
      fuelTypeSchema,
      'Fuel type validation failed.',
    );

    if (!result.success) {
      return Result.fail(result.error);
    }

    return Result.ok(new FuelType(result.data));
  }
}
