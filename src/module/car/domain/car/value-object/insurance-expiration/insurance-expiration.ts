import {
  insuranceExpirationSchema,
  insuranceExpirationValidator,
} from '@/car/domain/car/value-object/insurance-expiration/insurance-expiration.schema';
import { Result } from '@/common/application/result';
import { ValueObject } from '@/common/domain/value-object';

export class InsuranceExpiration extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string) {
    const result = insuranceExpirationValidator.validate(
      value,
      insuranceExpirationSchema,
      'Insurance expiration validation failed.',
    );

    if (!result.success) {
      return Result.fail(result.error);
    }

    return Result.ok(new InsuranceExpiration(value));
  }
}
