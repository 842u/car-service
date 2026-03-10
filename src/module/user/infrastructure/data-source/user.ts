import type { AuthClient } from '@/common/application/auth-client';
import { Result } from '@/common/application/result';
import type { SupabaseDatabaseClient } from '@/common/infrastructure/database-client/supabase';
import type { UserMapper } from '@/user/application/mapper/user';
import type { UserDataSource } from '@/user/presentation/data-source/user';

export class UserDataSourceImplementation implements UserDataSource {
  private readonly _authClient: AuthClient;
  private readonly _dbClient: SupabaseDatabaseClient;
  private readonly _userMapper: UserMapper;

  constructor(
    authClient: AuthClient,
    dbClient: SupabaseDatabaseClient,
    userMapper: UserMapper,
  ) {
    this._authClient = authClient;
    this._dbClient = dbClient;
    this._userMapper = userMapper;
  }

  async getById(id: string) {
    const queryResult = await this._dbClient.query(async (from) =>
      from('users').select('*').eq('id', id).single(),
    );

    if (!queryResult.success) {
      const { message } = queryResult.error;
      return Result.fail({ message });
    }

    const userPersistence = queryResult.data;

    const userDto = this._userMapper.persistenceToDto(userPersistence);

    return Result.ok(userDto);
  }

  async getUsersByIds(ids: string[]) {
    const queryResult = await this._dbClient.query(async (from) =>
      from('users').select('*').in('id', ids),
    );

    if (!queryResult.success) {
      const { message } = queryResult.error;
      return Result.fail({ message });
    }

    const usersPersistence = queryResult.data;

    const usersDto = usersPersistence.map((userPersistence) =>
      this._userMapper.persistenceToDto(userPersistence),
    );

    return Result.ok(usersDto);
  }

  async getSessionUser() {
    const sessionResult = await this._authClient.authenticate();

    if (!sessionResult.success) {
      const { message } = sessionResult.error;
      return Result.fail({ message });
    }

    const authIdentity = sessionResult.data;

    const userDtoResult = await this.getById(authIdentity.id);

    if (!userDtoResult.success) {
      return Result.fail(userDtoResult.error);
    }

    return Result.ok(userDtoResult.data);
  }
}
