import { createServerDatabaseClient } from '@/dependencies/database-client/server';
import { userMapper } from '@/user/dependency/mapper';
import { UserRepositoryImplementation } from '@/user/infrastructure/repository/user';

export async function createUserRepository() {
  const dbClient = await createServerDatabaseClient();
  return new UserRepositoryImplementation(dbClient, userMapper);
}
