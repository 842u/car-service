import { Result } from '@/common/application/result/result';
import { Id } from '@/common/domain/value-objects/id';
import { ValueObject } from '@/common/domain/value-objects/value-object';

export class UserId extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string) {
    const idResult = Id.create(value);

    if (!idResult.success) {
      return Result.fail(idResult.error);
    }

    return Result.ok(new UserId(idResult.data.value));
  }
}
