import {
  fuelTypeSchema,
  fuelTypeValidator,
  type FuelValue,
} from '@/car/domain/car/value-object/fuel-type/fuel-type.schema';
import { Result } from '@/common/application/result';
import { ValueObject } from '@/common/domain/value-object';

// Shares the Fuel enum with FuelType, so it reuses the same schema.
export class AdditionalFuelType extends ValueObject<FuelValue> {
  private constructor(value: FuelValue) {
    super(value);
  }

  static create(value: string) {
    const result = fuelTypeValidator.validate(
      value,
      fuelTypeSchema,
      'Additional fuel type validation failed.',
    );

    if (!result.success) {
      return Result.fail(result.error);
    }

    return Result.ok(new AdditionalFuelType(result.data));
  }
}
