import { createDatabaseClientServer } from '@/dependencies/database-client/server';
import { userMapper } from '@/dependencies/mapper/user';
import { UserRepositoryImplementation } from '@/user/infrastructure/repository/user';

export async function createUserRepository() {
  const databaseClientServer = await createDatabaseClientServer();
  return new UserRepositoryImplementation(databaseClientServer, userMapper);
}
