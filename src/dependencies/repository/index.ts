import { createServerDatabaseClient } from '@/dependencies/database-client/server';
import { userMapper } from '@/dependencies/mapper/user';
import { UserRepositoryImplementation } from '@/user/infrastructure/repository/user';

export async function createUserRepository() {
  const dbClient = await createServerDatabaseClient();
  return new UserRepositoryImplementation(dbClient, userMapper);
}
