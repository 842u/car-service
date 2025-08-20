import { Entity } from '@/common/domain/entities/entity';
import { Result } from '@/common/interface/result/result';
import { AvatarUrl } from '@/user/domain/user/value-objects/avatar-url/avatar-url';
import type { UserId } from '@/user/domain/user/value-objects/user-id/user-id';
import { Username } from '@/user/domain/user/value-objects/username/username';

type ProfileValue = {
  id: UserId;
  username: Username;
  avatarUrl: AvatarUrl;
};

export type ProfileCreateParams = {
  id: UserId;
  username: string;
  avatarUrl: string;
};

export class Profile extends Entity<ProfileValue> {
  private constructor(value: ProfileValue) {
    super(value);
  }

  static create({ id, username, avatarUrl }: ProfileCreateParams) {
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
        id,
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
