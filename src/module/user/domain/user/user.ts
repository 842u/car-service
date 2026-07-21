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

export type UserEditParams = {
  name?: string;
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

  /**
   * Partial patch: a field absent from `params`, or explicitly `undefined`,
   * is left untouched, so independent forms can each submit only the field
   * they own. Every present field is validated before any mutation, so an
   * invalid field leaves the User untouched. A present `avatarUrl` of `null`
   * clears it; only `null` clears, an empty string is validated (and
   * rejected) like any other value.
   */
  edit(params: UserEditParams): Result<undefined, ValidatorError> {
    let nextName: Name | undefined;
    let nextAvatarUrl: AvatarUrl | null | undefined;

    if (Object.hasOwn(params, 'name') && params.name !== undefined) {
      const nameResult = Name.create(params.name);

      if (!nameResult.success) {
        return Result.fail(nameResult.error);
      }

      nextName = nameResult.data;
    }

    if (Object.hasOwn(params, 'avatarUrl') && params.avatarUrl !== undefined) {
      const avatarUrlResult = optionalValueObject(
        AvatarUrl.create,
        params.avatarUrl,
      );

      if (!avatarUrlResult.success) {
        return Result.fail(avatarUrlResult.error);
      }

      nextAvatarUrl = avatarUrlResult.data;
    }

    if (nextName !== undefined) {
      this._value.name = nextName;
    }

    if (nextAvatarUrl !== undefined) {
      this._value.avatarUrl = nextAvatarUrl;
    }

    return Result.ok(undefined);
  }
}
