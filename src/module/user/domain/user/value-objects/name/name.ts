import { Result } from '@/common/application/result/result';
import { ValueObject } from '@/common/domain/value-object/value-object';
import {
  nameSchema,
  nameValidator,
} from '@/user/domain/user/value-objects/name/name.schema';

export class Name extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string) {
    const result = nameValidator.validate(
      value,
      nameSchema,
      'Name validation failed.',
    );

    if (!result.success) {
      return Result.fail(result.error);
    }

    return Result.ok(new Name(value));
  }
}
