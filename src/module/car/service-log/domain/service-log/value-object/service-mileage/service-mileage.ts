import {
  serviceMileageSchema,
  serviceMileageValidator,
} from '@/car/service-log/domain/service-log/value-object/service-mileage/service-mileage.schema';
import { Result } from '@/common/application/result';
import { ValueObject } from '@/common/domain/value-object';

export class ServiceMileage extends ValueObject<number> {
  private constructor(value: number) {
    super(value);
  }

  static create(value: number) {
    const result = serviceMileageValidator.validate(
      value,
      serviceMileageSchema,
      'Mileage validation failed.',
    );

    if (!result.success) {
      return Result.fail(result.error);
    }

    return Result.ok(new ServiceMileage(value));
  }
}
