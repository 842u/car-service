import { Result } from '@/common/application/result';
import type { SupabaseDatabaseClient } from '@/common/infrastructure/database-client/supabase';
import type { UserMapper } from '@/user/application/mapper/user';
import type { UserRepository } from '@/user/application/repository/user';
import type { User } from '@/user/domain/user/user';

export class UserRepositoryImplementation implements UserRepository {
  private readonly _dbClient: SupabaseDatabaseClient;
  private readonly _userMapper: UserMapper;

  constructor(dbClient: SupabaseDatabaseClient, userMapper: UserMapper) {
    this._dbClient = dbClient;
    this._userMapper = userMapper;
  }

  async store(user: User) {
    const userPersistence = this._userMapper.domainToPersistence(user);

    const queryResult = await this._dbClient.query(async (from) =>
      from('users').insert(userPersistence),
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

  async update(user: User) {
    const userPersistence = this._userMapper.domainToPersistence(user);

    const queryResult = await this._dbClient.query(async (from) =>
      from('users').update(userPersistence).eq('id', user.id.value),
    );

    if (!queryResult.success) {
      return Result.fail(queryResult.error);
    }

    return Result.ok(null);
  }
}
