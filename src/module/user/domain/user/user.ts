import { Result } from '@/common/application/result';
import type { ValidatorError } from '@/common/application/validator';
import { Entity } from '@/common/domain/entity';
import { optionalValueObject } from '@/common/domain/value-object';
import { AvatarUrl } from '@/user/domain/user/value-object/avatar-url/avatar-url';
import { Email } from '@/user/domain/user/value-object/email/email';
import { Name } from '@/user/domain/user/value-object/name/name';
import { UserId } from '@/user/domain/user/value-object/user-id/user-id';

type UserValue = {
  id: UserId;
  email: Email;
  name: Name;
  avatarUrl: AvatarUrl | null;
};

type UserCreateParams = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
};

export class User extends Entity<UserValue> {
  private constructor(value: UserValue) {
    super(value);
  }

  static create({ id, email, name, avatarUrl }: UserCreateParams) {
    const result: Result<UserValue, ValidatorError> = Result.combine({
      id: UserId.create(id),
      email: Email.create(email),
      name: Name.create(name),
      avatarUrl: optionalValueObject(AvatarUrl.create, avatarUrl),
    });

    if (!result.success) {
      return Result.fail(result.error);
    }

    return Result.ok(new User(result.data));
  }

  get email(): Email {
    return this._value.email;
  }

  get name(): Name {
    return this._value.name;
  }

  get avatarUrl(): AvatarUrl | null {
    return this._value.avatarUrl;
  }

  changeName(name: string) {
    const nameResult = Name.create(name);

    if (!nameResult.success) {
      return Result.fail(nameResult.error);
    }

    this._value.name = nameResult.data;

    return Result.ok(undefined);
  }

  changeAvatarUrl(avatarUrl: string | undefined | null) {
    if (!avatarUrl) {
      this._value.avatarUrl = null;

      return Result.ok(undefined);
    }

    const avatarUrlResult = AvatarUrl.create(avatarUrl);

    if (!avatarUrlResult.success) {
      return Result.fail(avatarUrlResult.error);
    }

    this._value.avatarUrl = avatarUrlResult.data;

    return Result.ok(undefined);
  }
}
