import { databaseClientAdmin } from '@/dependencies/database-client/admin';
import { userMapper } from '@/dependencies/mapper/user';
import { UserRepositoryImplementation } from '@/user/infrastructure/repository/user';

export const userRepositoryAdmin = new UserRepositoryImplementation(
  databaseClientAdmin,
  userMapper,
);
