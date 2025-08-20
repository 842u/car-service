import { Entity } from '@/common/domain/entities/entity';
import { Result } from '@/common/interface/result/result';
import type { ProfileCreateParams } from '@/user/domain/user/entities/profile';
import { Profile } from '@/user/domain/user/entities/profile';
import { Email } from '@/user/domain/user/value-objects/email/email';
import { UserId } from '@/user/domain/user/value-objects/user-id/user-id';

type UserValue = {
  id: UserId;
  email: Email;
  profile: Profile;
};

type UserCreateParams = {
  id: string;
  email: string;
} & Omit<ProfileCreateParams, 'id'>;

export class User extends Entity<UserValue> {
  private constructor(value: UserValue) {
    super(value);
  }

  static create({ id, email, username, avatarUrl }: UserCreateParams) {
    const idResult = UserId.create(id);

    if (!idResult.success) {
      return Result.fail(idResult.error);
    }

    const emailResult = Email.create(email);

    if (!emailResult.success) {
      return Result.fail(emailResult.error);
    }

    const profileResult = Profile.create({
      id: idResult.data,
      username,
      avatarUrl,
    });

    if (!profileResult.success) {
      return Result.fail(profileResult.error);
    }

    return Result.ok(
      new User({
        id: idResult.data,
        email: emailResult.data,
        profile: profileResult.data,
      }),
    );
  }

  get email(): Email {
    return this.value.email;
  }

  get profile(): Profile {
    return this.value.profile;
  }
}
