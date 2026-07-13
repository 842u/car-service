import type { ServiceCategoryValue } from '@/car/service-log/domain/service-log/value-object/service-categories/service-categories.schema';
import {
  serviceCategoriesSchema,
  serviceCategoriesValidator,
} from '@/car/service-log/domain/service-log/value-object/service-categories/service-categories.schema';
import { Result } from '@/common/application/result';
import { ValueObject } from '@/common/domain/value-object';

export class ServiceCategories extends ValueObject<ServiceCategoryValue[]> {
  private constructor(value: ServiceCategoryValue[]) {
    super(value);
  }

  static create(value: string[]) {
    const result = serviceCategoriesValidator.validate(
      value,
      serviceCategoriesSchema,
      'Service categories validation failed.',
    );

    if (!result.success) {
      return Result.fail(result.error);
    }

    return Result.ok(new ServiceCategories(result.data));
  }
}
