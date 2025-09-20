import { Result } from '@/common/application/result/result';
import type { SupabaseDatabaseClient } from '@/common/infrastructure/database/supabase-database-client';
import type { IUserRepository } from '@/user/application/repositories/user-repository.interface';
import type { User } from '@/user/domain/user/user';

export class UserRepository implements IUserRepository {
  private readonly _dbClient: SupabaseDatabaseClient;

  constructor(dbClient: SupabaseDatabaseClient) {
    this._dbClient = dbClient;
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

  async changeName(user: User) {
    const queryResult = await this._dbClient.query(async (from) =>
      from('users').update({ user_name: user.name.value }),
    );

    if (!queryResult.success) {
      return Result.fail(queryResult.error);
    }

    return Result.ok(null);
  }

  async changeAvatarUrl(user: User) {
    const queryResult = await this._dbClient.query(async (from) =>
      from('users').update({ avatar_url: user.avatarUrl?.value }),
    );

    if (!queryResult.success) {
      return Result.fail(queryResult.error);
    }

    return Result.ok(null);
  }
}
