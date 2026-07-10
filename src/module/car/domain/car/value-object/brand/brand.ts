import {
  brandSchema,
  brandValidator,
} from '@/car/domain/car/value-object/brand/brand.schema';
import { Result } from '@/common/application/result';
import { ValueObject } from '@/common/domain/value-object';

export class Brand extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string) {
    const result = brandValidator.validate(
      value,
      brandSchema,
      'Brand validation failed.',
    );

    if (!result.success) {
      return Result.fail(result.error);
    }

    return Result.ok(new Brand(value));
  }
}
