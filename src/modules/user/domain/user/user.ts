import { Result } from '@/common/application/result/result';
import { Entity } from '@/common/domain/entities/entity';
import { AvatarUrl } from '@/user/domain/user/value-objects/avatar-url/avatar-url';
import { Email } from '@/user/domain/user/value-objects/email/email';
import { Name } from '@/user/domain/user/value-objects/name/name';
import { UserId } from '@/user/domain/user/value-objects/user-id/user-id';

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
  avatarUrl?: string;
};

export class User extends Entity<UserValue> {
  private constructor(value: UserValue) {
    super(value);
  }

  static create({ id, email, name, avatarUrl }: UserCreateParams) {
    const idResult = UserId.create(id);
    if (!idResult.success) {
      return Result.fail(idResult.error);
    }
    const emailResult = Email.create(email);
    if (!emailResult.success) {
      return Result.fail(emailResult.error);
    }
    const nameResult = Name.create(name);
    if (!nameResult.success) {
      return Result.fail(nameResult.error);
    }
    let avatarUrlResult;
    if (avatarUrl) {
      avatarUrlResult = AvatarUrl.create(name);
      if (!avatarUrlResult.success) {
        return Result.fail(avatarUrlResult.error);
      }
    }

    return Result.ok(
      new User({
        id: idResult.data,
        email: emailResult.data,
        name: nameResult.data,
        avatarUrl: avatarUrlResult?.data || null,
      }),
    );
  }

  get email(): Email {
    return this.value.email;
  }
}
