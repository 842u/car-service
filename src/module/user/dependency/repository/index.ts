import { adminDatabaseClient } from '@/dependency/database-client/admin';
import { userMapper } from '@/user/dependency/mapper';
import { UserRepositoryImplementation } from '@/user/infrastructure/repository/user';

export const userRepository = new UserRepositoryImplementation(
  adminDatabaseClient,
  userMapper,
);
