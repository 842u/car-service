import { Result } from '@/common/application/result/result';
import type { SupabaseAuthClient } from '@/common/infrastructure/auth/supabase-auth-client';
import type { SupabaseDatabaseClient } from '@/common/infrastructure/database/supabase-database-client';
import type { UserMapper } from '@/user/application/mappers/user-mapper';
import type { IUserStore } from '@/user/application/stores/user-store.interface';

export class UserStore implements IUserStore {
  private readonly _authClient: SupabaseAuthClient;
  private readonly _dbClient: SupabaseDatabaseClient;
  private readonly _userMapper: UserMapper;

  constructor(
    authClient: SupabaseAuthClient,
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
    const sessionResult = await this._authClient.getSession();

    if (!sessionResult.success) {
      const { message } = sessionResult.error;
      return Result.fail({ message });
    }

    const { user: authIdentity } = sessionResult.data;

    const userDtoResult = await this.getById(authIdentity.id);

    if (!userDtoResult.success) {
      return Result.fail(userDtoResult.error);
    }

    return Result.ok(userDtoResult.data);
  }
}
