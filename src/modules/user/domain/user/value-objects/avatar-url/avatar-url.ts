import { Result } from '@/common/application/result/result';
import { ValueObject } from '@/common/domain/value-objects/value-object';
import {
  avatarUrlSchema,
  avatarUrlValidator,
} from '@/user/domain/user/value-objects/avatar-url/avatar-url.schema';

export class AvatarUrl extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string) {
    const result = avatarUrlValidator.validate(
      value,
      avatarUrlSchema,
      'Avatar URL validation failed.',
    );

    if (!result.success) {
      return Result.fail(result.error);
    }

    return Result.ok(new AvatarUrl(value));
  }
}
