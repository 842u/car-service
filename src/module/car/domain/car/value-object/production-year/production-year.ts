import {
  productionYearSchema,
  productionYearValidator,
} from '@/car/domain/car/value-object/production-year/production-year.schema';
import { Result } from '@/common/application/result';
import { ValueObject } from '@/common/domain/value-object';

export class ProductionYear extends ValueObject<number> {
  private constructor(value: number) {
    super(value);
  }

  static create(value: number) {
    const result = productionYearValidator.validate(
      value,
      productionYearSchema,
      'Production year validation failed.',
    );

    if (!result.success) {
      return Result.fail(result.error);
    }

    return Result.ok(new ProductionYear(value));
  }
}
