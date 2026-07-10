import {
  vinSchema,
  vinValidator,
} from '@/car/domain/car/value-object/vin/vin.schema';
import { Result } from '@/common/application/result';
import { ValueObject } from '@/common/domain/value-object';

export class Vin extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string) {
    const result = vinValidator.validate(
      value,
      vinSchema,
      'VIN validation failed.',
    );

    if (!result.success) {
      return Result.fail(result.error);
    }

    return Result.ok(new Vin(value));
  }
}
