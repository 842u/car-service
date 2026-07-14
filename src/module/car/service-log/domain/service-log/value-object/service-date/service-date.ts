import {
  serviceDateSchema,
  serviceDateValidator,
} from '@/car/service-log/domain/service-log/value-object/service-date/service-date.schema';
import { Result } from '@/common/application/result';
import { ValueObject } from '@/common/domain/value-object';

export class ServiceDate extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string) {
    const result = serviceDateValidator.validate(
      value,
      serviceDateSchema,
      'Service date validation failed.',
    );

    if (!result.success) {
      return Result.fail(result.error);
    }

    return Result.ok(new ServiceDate(value));
  }
}
