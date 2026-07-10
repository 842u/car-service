import {
  technicalInspectionExpirationSchema,
  technicalInspectionExpirationValidator,
} from '@/car/domain/car/value-object/technical-inspection-expiration/technical-inspection-expiration.schema';
import { Result } from '@/common/application/result';
import { ValueObject } from '@/common/domain/value-object';

export class TechnicalInspectionExpiration extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string) {
    const result = technicalInspectionExpirationValidator.validate(
      value,
      technicalInspectionExpirationSchema,
      'Technical inspection expiration validation failed.',
    );

    if (!result.success) {
      return Result.fail(result.error);
    }

    return Result.ok(new TechnicalInspectionExpiration(value));
  }
}
