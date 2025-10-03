import { Result } from '@/common/application/result/result';
import type { SupabaseDatabaseClient } from '@/common/infrastructure/database/supabase-database-client';
import type { UserMapper } from '@/user/application/mappers/user-mapper';
import type { IUserRepository } from '@/user/application/repositories/user-repository.interface';
import type { User } from '@/user/domain/user/user';

export class UserRepository implements IUserRepository {
  private readonly _dbClient: SupabaseDatabaseClient;
  private readonly _userMapper: UserMapper;

  constructor(dbClient: SupabaseDatabaseClient, userMapper: UserMapper) {
    this._dbClient = dbClient;
    this._userMapper = userMapper;
  }

  async store(user: User) {
    const queryResult = await this._dbClient.query(async (from) =>
      from('users').insert({
        id: user.id.value,
        email: user.email.value,
        user_name: user.name.value,
        avatar_url: user.avatarUrl?.value,
      }),
    );

    if (!queryResult.success) {
      return Result.fail(queryResult.error);
    }

    return Result.ok(null);
  }

  async remove(user: User) {
    const queryResult = await this._dbClient.query(async (from) =>
      from('users').delete().eq('id', user.id.value),
    );

    if (!queryResult.success) {
      return Result.fail(queryResult.error);
    }

    return Result.ok(null);
  }

  async getByEmail(email: string) {
    const queryResult = await this._dbClient.query(async (from) =>
      from('users').select('*').eq('email', email).single(),
    );

    if (!queryResult.success) {
      return Result.fail(queryResult.error);
    }

    const userPersistence = queryResult.data;

    const userResult = this._userMapper.persistenceToDomain(userPersistence);

    if (!userResult.success) {
      return Result.fail(userResult.error);
    }

    return Result.ok(userResult.data);
  }

  async getById(id: string) {
    const queryResult = await this._dbClient.query(async (from) =>
      from('users').select('*').eq('id', id).single(),
    );

    if (!queryResult.success) {
      return Result.fail(queryResult.error);
    }

    const userPersistence = queryResult.data;

    const userResult = this._userMapper.persistenceToDomain(userPersistence);

    if (!userResult.success) {
      return Result.fail(userResult.error);
    }

    return Result.ok(userResult.data);
  }

  async changeName(user: User) {
    const queryResult = await this._dbClient.query(async (from) =>
      from('users')
        .update({ user_name: user.name.value })
        .eq('id', user.id.value)
        .select()
        .single(),
    );

    if (!queryResult.success) {
      return Result.fail(queryResult.error);
    }

    return Result.ok(null);
  }

  async changeAvatarUrl(user: User) {
    const queryResult = await this._dbClient.query(async (from) =>
      from('users')
        .update({ avatar_url: user.avatarUrl?.value })
        .eq('id', user.id.value)
        .select()
        .single(),
    );

    if (!queryResult.success) {
      return Result.fail(queryResult.error);
    }

    return Result.ok(null);
  }
}
