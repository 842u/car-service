import { Entity } from '@/common/domain/entities/entity';
import { Result } from '@/common/interface/result/result';
import { AvatarUrl } from '@/user/domain/value-objects/avatar-url/avatar-url';
import { UserId } from '@/user/domain/value-objects/user-id/user-id';
import { Username } from '@/user/domain/value-objects/username/username';

type ProfileValue = {
  id: UserId;
  username: Username;
  avatarUrl: AvatarUrl;
};

export class Profile extends Entity<ProfileValue> {
  private constructor(value: ProfileValue) {
    super(value);
  }

  static create({
    id,
    username,
    avatarUrl,
  }: {
    id: string;
    username: string;
    avatarUrl: string;
  }) {
    const idResult = UserId.create(id);

    if (!idResult.success) {
      return Result.fail(idResult.error);
    }
    const usernameResult = Username.create(username);

    if (!usernameResult.success) {
      return Result.fail(usernameResult.error);
    }
    const avatarUrlResult = AvatarUrl.create(avatarUrl);

    if (!avatarUrlResult.success) {
      return Result.fail(avatarUrlResult.error);
    }

    return Result.ok(
      new Profile({
        id: idResult.data,
        username: usernameResult.data,
        avatarUrl: avatarUrlResult.data,
      }),
    );
  }

  get username(): Username {
    return this._value.username;
  }

  get avatarUrl(): AvatarUrl {
    return this._value.avatarUrl;
  }
}
