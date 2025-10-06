import { Result } from '@/common/application/result/result';
import { idSchema, idValidator } from '@/common/domain/value-object/id.schema';
import { ValueObject } from '@/common/domain/value-object/value-object';

export class Id extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string) {
    const result = idValidator.validate(
      value,
      idSchema,
      'ID validation failed.',
    );

    if (!result.success) {
      return Result.fail(result.error);
    }

    return Result.ok(new Id(value));
  }
}
