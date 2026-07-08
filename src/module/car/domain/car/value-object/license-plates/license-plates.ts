import {
  licensePlatesSchema,
  licensePlatesValidator,
} from '@/car/domain/car/value-object/license-plates/license-plates.schema';
import { Result } from '@/common/application/result';
import { ValueObject } from '@/common/domain/value-object';

export class LicensePlates extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string) {
    const result = licensePlatesValidator.validate(
      value,
      licensePlatesSchema,
      'License plates validation failed.',
    );

    if (!result.success) {
      return Result.fail(result.error);
    }

    return Result.ok(new LicensePlates(value));
  }
}
