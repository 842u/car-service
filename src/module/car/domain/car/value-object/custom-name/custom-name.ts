import {
  customNameSchema,
  customNameValidator,
} from '@/car/domain/car/value-object/custom-name/custom-name.schema';
import { Result } from '@/common/application/result';
import { ValueObject } from '@/common/domain/value-object';

export class CustomName extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string) {
    const result = customNameValidator.validate(
      value,
      customNameSchema,
      'Custom name validation failed.',
    );

    if (!result.success) {
      return Result.fail(result.error);
    }

    return Result.ok(new CustomName(value));
  }
}
