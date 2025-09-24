import type { Mapper } from '@/common/application/mapper/mapper.interface';
import { Result } from '@/common/application/result/result';
import type { UserDto } from '@/user/application/dtos/user-dto';
import type { UserPersistence } from '@/user/application/persistence-models/user-persistence';
import { User } from '@/user/domain/user/user';

export class UserMapper implements Mapper<User, UserDto, UserPersistence> {
  domainToDto(model: User): UserDto {
    return {
      id: model.id.value,
      email: model.email.value,
      name: model.name.value,
      avatarUrl: model.avatarUrl?.value,
    };
  }

  domainToPersistence(model: User): UserPersistence {
    return {
      id: model.id.value,
      email: model.email.value,
      user_name: model.name.value,
      avatar_url: model.avatarUrl?.value || null,
    };
  }

  dtoToDomain(model: UserDto) {
    const userResult = User.create({
      id: model.id,
      name: model.name,
      email: model.email,
      avatarUrl: model.avatarUrl,
    });

    if (!userResult.success) {
      return Result.fail(userResult.error);
    }

    return Result.ok(userResult.data);
  }

  dtoToPersistence(model: UserDto): UserPersistence {
    return {
      id: model.id,
      email: model.email,
      user_name: model.name,
      avatar_url: model.avatarUrl || null,
    };
  }

  persistenceToDomain(model: UserPersistence) {
    const userResult = User.create({
      id: model.id,
      email: model.email,
      name: model.user_name,
      avatarUrl: model.avatar_url,
    });

    if (!userResult.success) {
      return Result.fail(userResult.error);
    }

    return Result.ok(userResult.data);
  }

  persistenceToDto(model: UserPersistence): UserDto {
    return {
      id: model.id,
      email: model.email,
      name: model.user_name,
      avatarUrl: model.avatar_url,
    };
  }
}
