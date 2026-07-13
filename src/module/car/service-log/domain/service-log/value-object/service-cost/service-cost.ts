import {
  serviceCostSchema,
  serviceCostValidator,
} from '@/car/service-log/domain/service-log/value-object/service-cost/service-cost.schema';
import { Result } from '@/common/application/result';
import { ValueObject } from '@/common/domain/value-object';

export class ServiceCost extends ValueObject<number> {
  private constructor(value: number) {
    super(value);
  }

  static create(value: number) {
    const result = serviceCostValidator.validate(
      value,
      serviceCostSchema,
      'Service cost validation failed.',
    );

    if (!result.success) {
      return Result.fail(result.error);
    }

    return Result.ok(new ServiceCost(value));
  }
}
