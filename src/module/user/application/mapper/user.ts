import type { Mapper } from '@/common/application/mapper';
import type { AuthIdentityPersistence } from '@/common/application/persistence-model/auth-identity';
import { Result } from '@/common/application/result';
import { ValidatorError } from '@/common/application/validator';
import type { UserDto } from '@/user/application/dto/user';
import type { UserPersistence } from '@/user/application/persistence-model/user';
import { User } from '@/user/domain/user/user';
import { Name } from '@/user/domain/user/value-object/name/name';

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

  authIdentityToDomain(model: AuthIdentityPersistence) {
    const { email } = model;

    if (!email) {
      return Result.fail(
        new ValidatorError('Auth identity is missing an email.'),
      );
    }

    const nameResult = Name.fromCandidates(
      [
        model.user_metadata?.user_name,
        model.user_metadata?.full_name,
        model.user_metadata?.first_name,
        model.user_metadata?.second_name,
        email,
        `user-${model.id.slice(0, 8)}`,
      ].filter((candidate): candidate is string => Boolean(candidate)),
    );

    if (!nameResult.success) {
      return Result.fail(nameResult.error);
    }

    const userResult = User.create({
      id: model.id,
      name: nameResult.data.value,
      email,
      avatarUrl: model.user_metadata?.avatar_url,
    });

    if (!userResult.success) {
      return Result.fail(userResult.error);
    }

    return Result.ok(userResult.data);
  }
}
