import { adminDatabaseClient } from '@/dependencies/database-client/admin';
import { userMapper } from '@/user/dependency/mapper';
import { UserRepositoryImplementation } from '@/user/infrastructure/repository/user';

export const adminUserRepository = new UserRepositoryImplementation(
  adminDatabaseClient,
  userMapper,
);
